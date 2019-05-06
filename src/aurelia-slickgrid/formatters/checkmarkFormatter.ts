import { Column, Formatter } from './../models/index';
import { parseBoolean } from '../services/utilities';

export const checkmarkFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  return parseBoolean(value) ? `<i class="fa fa-check checkmark-icon" aria-hidden="true"></i>` : '';
}
