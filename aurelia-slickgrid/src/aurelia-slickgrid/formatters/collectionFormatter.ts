import { arrayToCsvFormatter } from './arrayToCsvFormatter';
import { Column, Formatter } from './../models/index';

/**
 * A formatter to show the label property value of a filter.collection
 */
export const collectionFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  if (!value || !columnDef || !columnDef.filter || !columnDef.filter.collection
    || !columnDef.filter.collection.length) {
    return '';
  }

  const { filter, filter: { collection } } = columnDef;
  const labelName = (filter.customStructure) ? filter.customStructure.label : 'label';
  const valueName = (filter.customStructure) ? filter.customStructure.value : 'value';

  if (Array.isArray(value)) {
    return arrayToCsvFormatter(row,
      cell,
      value.map((v: any) => collection.findOrDefault((c: any) => c[valueName] === v)[labelName]),
      columnDef,
      dataContext);
  }

  return collection.findOrDefault((c: any) => c[valueName] === value)[labelName] || '';
};
