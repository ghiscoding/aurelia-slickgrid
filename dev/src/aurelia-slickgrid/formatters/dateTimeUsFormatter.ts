import * as moment from 'moment';

import { Formatter } from './../models/formatter.interface';

export const dateTimeUsFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any) =>
  value ? moment(value).format('MM/DD/YYYY hh:mm:ss') : '';
