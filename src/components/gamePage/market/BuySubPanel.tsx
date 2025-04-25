import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Button from 'components/common/Button';
import { TableFieldLabel } from 'types';
import { useGameSliceSelector, useGameSliceDispatch } from 'store/reduxHooks';
import { setModalStatus, buyItem, setCurrentModal } from 'store/gameSlice';
import CapacityDisplay from './CapacityDisplay';
import Table from 'components/common/Table';
import QtyModal from './QtyModal';
import ItemInfoModal from './ItemInfoModal';
import { getHasOverdueLoanForLocation } from 'utils/utils';
import IconItem from 'components/icons/items/IconItem';

const BuySubPanel = () => {
  const dispatch = useGameSliceDispatch();
  const [selectedItem, setSelectedItem] = useState<any>({});
  const { formatMessage } = useIntl();
  const { gameState, modalStatus, currentModal } = useGameSliceSelector((state) => state.game);
  const hasOverdueLoan = getHasOverdueLoanForLocation(gameState, gameState.location);
  const isModalOpen = modalStatus !== 'closed';
  const prices = gameState.prices;
  const hasGuildMembership = gameState.flags[`guild__${gameState.location.toLowerCase()}`];
  const itemsForSale = Object.keys(gameState.prices)
    .filter((key) => prices[key].actions.includes('buy'))
    .map((key) => ({
      ...prices[key],
      guildDependentTitle: formatMessage({ id: `items__${prices[key].id}__title` }),
      discountablePrice: prices[key].value,
      hasGuildMembership: hasGuildMembership,
    }));

  const openModal = (modalSlug: string) => {
    dispatch(setCurrentModal(modalSlug));
    dispatch(setModalStatus('opening'));
    setTimeout(() => {
      dispatch(setModalStatus('open'));
    }, 510);
  };
  const closeModal = () => {
    dispatch(setModalStatus('closing'));
    setTimeout(() => {
      dispatch(setModalStatus('closed'));
      setCurrentModal('');
    }, 510);
  };
  const handleItemClick = (id: string, modalSlug: string) => {
    const foundItem = itemsForSale.find((item: any) => item.id === id);
    setSelectedItem({ ...foundItem });
    openModal(modalSlug);
  };
  const handleQtyClose = () => {
    closeModal();
  };
  const handleBuyConfirm = (buyQty: number) => {
    const price = hasGuildMembership
      ? selectedItem.value - selectedItem.guildDiscount
      : selectedItem.value;
    dispatch(
      buyItem({
        qty: buyQty,
        itemId: selectedItem.id,
        price,
        action: 'buy',
      }),
    );
    handleQtyClose();
  };

  const buyTableActions = (id: string) => (
    <div className="flex space-x-2">
      <Button
        onClick={() => handleItemClick(id, 'info')}
        labelKey="market__buy__table___btn_info"
        variant="secondary"
        testId={`btn-info-${id}`}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
      />
      {gameState.prices[id].qty > 0 && (
        <Button
          onClick={() => handleItemClick(id, 'qty')}
          labelKey="market__buy__table___btn_buy"
          variant="primary"
          testId={`btn-buy-${id}`}
          disabled={hasOverdueLoan}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
        />
      )}
    </div>
  );

  const fieldLabels: TableFieldLabel[] = [
    { slug: 'guildDependentTitle', titleKey: 'market__buy__table_field__itemName' },
    { slug: 'discountablePrice', titleKey: 'market__buy__table_field__price' },
    { slug: 'qty', titleKey: 'market__buy__table_field__qty' },
  ];

  return (
    <div className="px-6 py-8 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen" data-testid="buy-subpanel">
      <h2 className="text-3xl font-extrabold text-yellow-400 uppercase mb-6 text-center animate-pulse">
        <FormattedMessage id="market__buy_title" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {itemsForSale.map((item) => (
          <div
            key={item.id}
            className="bg-gray-700 rounded-xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 bg-gray-600 rounded-lg p-2">
                <IconItem type={item.id}  />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white text-center">
              {item.guildDependentTitle}
            </h3>
            <p className="text-gray-300 text-center mt-2">
              <FormattedMessage id="market__buy__table_field__price" />: ⌾{item.discountablePrice}
              {item.hasGuildMembership && item.guildDiscount > 0 && (
                <span className="text-green-400"> (-{item.guildDiscount})</span>
              )}
            </p>
            <p className="text-gray-300 text-center">
              <FormattedMessage id="market__buy__table_field__qty" />: {item.qty}
            </p>
            <div className="mt-4 flex justify-center">
              {buyTableActions(item.id)}
            </div>
          </div>
        ))}
      </div>
      <div className="text-right py-4">
        <CapacityDisplay />
      </div>
      {isModalOpen && currentModal === 'info' && (
        <ItemInfoModal itemId={selectedItem.id} closeInfoModal={closeModal} />
      )}
      {isModalOpen && currentModal === 'qty' && (
        <QtyModal
          action="buy"
          selectedItem={selectedItem}
          handleConfirm={handleBuyConfirm}
          handleQtyClose={handleQtyClose}
        />
      )}
    </div>
  );
};

export default BuySubPanel;