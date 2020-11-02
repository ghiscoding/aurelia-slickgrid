import { Formatter } from './../models/index';

export const checkboxFormatter: Formatter = (_row: number, _cell: number, value: any) =>
  value ? '&#x2611;' : '';
