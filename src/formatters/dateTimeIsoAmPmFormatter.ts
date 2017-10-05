import * as moment from 'moment';

import { Formatter } from './../models/formatter.interface';

export const dateTimeIsoAmPmFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any) =>
  value ? moment(value).format('YYYY-MM-DD h:mm:ss a') : '';
