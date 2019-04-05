import { Column, Formatter } from './../models/index';

export const arrayToCsvFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  if (value && Array.isArray(value)) {
    const values = value.join(', ');
    return `<span title="${values}">${values}</span>`;
  }
  return '';
};
