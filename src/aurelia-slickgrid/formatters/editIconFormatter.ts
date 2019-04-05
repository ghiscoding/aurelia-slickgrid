import { Column, Formatter } from './../models/index';

export const editIconFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) =>
  `<i class="fa fa-pencil pointer edit-icon" aria-hidden="true"></i>`;
