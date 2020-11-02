import { Formatter } from './../models/index';

export const yesNoFormatter: Formatter = (_row: number, _cell: number, value: any): string =>
  value ? 'Yes' : 'No';
