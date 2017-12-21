import { Column, Formatter } from './../models/index';

export const uppercaseFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) =>
  (value && typeof value === 'string') ? value.toUpperCase() : value;
