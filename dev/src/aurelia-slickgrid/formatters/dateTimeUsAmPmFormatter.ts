import { Formatter } from './../models/formatter.interface';
import * as moment from 'moment';

export const dateTimeUsAmPmFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any) =>
  value ? moment(value).format('MM/DD/YYYY h:mm:ss a') : '';
