import { Formatter } from './../models/index';

export const italicFormatter: Formatter = (_row: number, _cell: number, value: any) => {
  return value ? `<i>${value}</i>` : '';
};
