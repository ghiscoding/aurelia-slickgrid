import { Formatter } from './../models/formatter.interface';
import * as moment from 'moment';

export const dateIsoFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any) =>
  value ? moment(value).format('YYYY-MM-DD') : '';
