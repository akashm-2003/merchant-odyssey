import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { TableFieldLabel } from 'types';
import IconGuild from 'components/icons/IconGuild';

type Props = {
  data: any[];
  fieldLabels: TableFieldLabel[];
  actions?: (id: string) => JSX.Element;
  sortField: string;
  sortDir: string;
};

const Table: React.FC<Props> = ({ data, fieldLabels, actions, sortField, sortDir }) => {
  const dataSorted = data.sort((a: any, b: any) => {
    if (a[sortField] > b[sortField]) {
      return sortDir === 'asc' ? 1 : -1;
    }
    if (a[sortField] < b[sortField]) {
      return sortDir === 'asc' ? -1 : 1;
    }
    return 0;
  });
  const { formatMessage } = useIntl();

  const getProcessedFieldValue = (item: any, field: TableFieldLabel) => {
    const val = item[field.slug];
    if (['price', 'priceValue', 'principal', 'netWealth'].includes(field.slug)) {
      return `⌾${val.toLocaleString('en-US')}`;
    }
    if (field.slug === 'guildDependentTitle') {
      return (
        <span className="flex items-center justify-center">
          <span>{val}</span>
          {(item.guildDiscount > 0 || item.guildOnly) && (
            <span className="inline-block w-6 h-6 ml-2">
              <IconGuild isActive={item.hasGuildMembership} aria-label="Has Guild Discount" />
            </span>
          )}
        </span>
      );
    }
    if (field.slug === 'discountablePrice') {
      return (
        <span className="flex items-center justify-center">
          <span>⌾{val}</span>
          {item.hasGuildMembership && item.guildDiscount > 0 && (
            <span className="ml-2 text-green-400">(-{item.guildDiscount})</span>
          )}
        </span>
      );
    }
    if (typeof val === 'boolean') {
      return formatMessage({ id: val ? 'yes' : 'no' });
    }
    return val;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dataSorted.map((item: any) => (
        <div
          key={item.id}
          className="bg-gray-700 rounded-xl shadow-lg p-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
        >
          {fieldLabels.map((field: TableFieldLabel) => (
            <div key={field.slug} className="mb-2 text-center">
              <span className="font-bold text-yellow-400">
                <FormattedMessage id={field.titleKey} />:
              </span>{' '}
              <span className="text-white">{getProcessedFieldValue(item, field)}</span>
            </div>
          ))}
          {!!actions && (
            <div className="mt-4 flex justify-center">{actions(item.id)}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Table;