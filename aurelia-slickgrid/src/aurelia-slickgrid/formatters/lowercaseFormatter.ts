import { Column, Formatter } from './../models/index';

export const lowercaseFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) =>
  (value && typeof value === 'string') ? value.toLowerCase() : value;
