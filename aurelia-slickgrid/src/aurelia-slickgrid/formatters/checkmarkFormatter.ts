import { Column, Formatter } from './../models/index';

export const checkmarkFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) =>
  value ? `<i class="fa fa-check" aria-hidden="true"></i>` : '';
