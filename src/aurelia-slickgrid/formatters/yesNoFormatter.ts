import { Column, Formatter } from './../models/index';

export const yesNoFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any): string =>
  value ? 'Yes' : 'No';
