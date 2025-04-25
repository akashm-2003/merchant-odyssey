import { FormattedMessage } from 'react-intl';
import Modal from 'components/common/Modal';
import Button from 'components/common/Button';
import IconItem from 'components/icons/items/IconItem';
import itemsData from 'data/itemsData';

type Props = {
  itemId: string;
  closeInfoModal: React.MouseEventHandler<HTMLButtonElement>;
};

const ItemInfoModal: React.FC<Props> = ({ itemId, closeInfoModal }) => {
  return (
    <Modal titleKey={`items__${itemId}__title`}>
      <div className="text-gray-100 max-w-[90vw] md:max-w-[40vw] bg-gray-800 rounded-xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-6 pb-4">
          <div className="w-40 h-40 bg-gray-600 rounded-xl p-2 mx-auto">
            <IconItem type={itemId}/>
          </div>
          <div className="flex-1">
            <div className="pb-4 text-lg">
              <FormattedMessage id={`items__${itemId}__description`} />
            </div>
            <div className="italic text-gray-400">
              <FormattedMessage
                id="market__buy__info_modal__capacity"
                values={{ weight: itemsData[itemId].weight, volume: itemsData[itemId].volume }}
              />
            </div>
          </div>
        </div>
        <div className="text-center">
          <Button
            variant="primary"
            labelKey="ok"
            onClick={closeInfoModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-transform transform hover:scale-105"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ItemInfoModal;