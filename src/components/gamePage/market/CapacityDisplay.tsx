import { FormattedMessage } from 'react-intl';
import { useGameSliceSelector } from 'store/reduxHooks';

const CapacityDisplay = () => {
  const {
    gameState: {
      capacity: { used, max },
    },
  } = useGameSliceSelector((state) => state.game);
  const isOverCapacity = used.volume >= max.volume || used.weight >= max.weight;

  return (
    <span
      data-testid="market-capacity"
      className={`text-lg ${
        isOverCapacity ? 'text-red-500 font-bold animate-pulse' : 'text-gray-300 font-normal'
      } bg-gray-800 px-4 py-2 rounded-lg shadow-md`}
    >
      <FormattedMessage
        id="market__capacity"
        values={{
          inventoryWeight: used.weight,
          capacityWeight: max.weight,
          inventoryVolume: used.volume,
          capacityVolume: max.volume,
        }}
      />
    </span>
  );
};

export default CapacityDisplay;