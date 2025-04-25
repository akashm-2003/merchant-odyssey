import { useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { useGameSliceSelector } from 'store/reduxHooks';
import Modal from 'components/common/Modal';
import Button from 'components/common/Button';
import itemsData from 'data/itemsData';
import { getMaxQty } from 'utils/utils';

type Props = {
  action: string;
  selectedItem: any;
  handleConfirm: (buyQty: number) => void;
  handleQtyClose: React.MouseEventHandler<HTMLButtonElement>;
};

const QtyModal: React.FC<Props> = ({ action, selectedItem, handleConfirm, handleQtyClose }) => {
  const { gameState } = useGameSliceSelector((state) => state.game);
  const [qty, setQty] = useState<number>(0);
  const maxQty = useMemo(
    () =>
      !!selectedItem.id
        ? action === 'buy'
          ? getMaxQty(gameState, selectedItem, itemsData)
          : selectedItem.qty
        : 0,
    [action, gameState, selectedItem],
  );

  if (!selectedItem.id) {
    console.log('selected item is missing an id wtf:', selectedItem);
    return null;
  }

  const handleQtyChange = (e: React.ChangeEvent<HTMLInputElement>, max: number) => {
    const val = parseInt(e.target.value);
    setQty(Math.max(Math.min(val, max), 0));
  };

  return (
    <Modal titleKey="market__buy__qty_modal__title">
      <div className="text-gray-100 bg-gray-800 rounded-xl p-6 shadow-2xl">
        <div className="pb-4">
          <input
            data-testid="qty-input"
            type="number"
            value={qty}
            onChange={(e) => handleQtyChange(e, maxQty)}
            min={1}
            max={selectedItem.qty}
            className="p-4 text-xl w-full bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-400"
          />
        </div>
        <div className="text-base italic text-gray-400 pb-4" data-testid={`explainer-${action}`}>
          {action === 'buy' ? (
            <FormattedMessage id="market__buy__qty_modal__explainer" values={{ maxQty }} />
          ) : (
            <FormattedMessage id="market__sell__qty_modal__explainer" values={{ maxQty }} />
          )}
        </div>
        <div className="text-center space-x-4">
          <Button
            variant="secondary"
            labelKey="cancel"
            onClick={handleQtyClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
          />
          {maxQty > 0 && (
            <Button
              variant="primary"
              labelKey="max"
              labelValue={maxQty}
              testId="qty-btn-max"
              onClick={() => handleConfirm(maxQty)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
            />
          )}
          {maxQty > 0 && qty > 0 && (
            <Button
              variant="primary"
              testId="qty-modal-btn-ok"
              labelKey="ok"
              onClick={() => handleConfirm(qty)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105"
            />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default QtyModal;