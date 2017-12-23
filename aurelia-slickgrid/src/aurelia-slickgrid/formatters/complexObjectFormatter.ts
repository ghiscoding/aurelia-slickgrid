import { Column, Formatter } from './../models/index';

export const complexObjectFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  if (!columnDef) {
    return '';
  }
  const complexField = columnDef.field || '';
  return complexField.split('.').reduce((obj, i) => obj[i], dataContext);
};
