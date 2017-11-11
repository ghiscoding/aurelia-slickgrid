import { Formatter } from './../models/formatter.interface';

export const checkboxFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any) =>
  value ? '&#x2611;' : '';
