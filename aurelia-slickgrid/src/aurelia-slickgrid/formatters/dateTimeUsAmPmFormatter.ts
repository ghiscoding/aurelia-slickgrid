import { Column, FieldType, Formatter } from './../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateTimeUsAmPm);

export const dateTimeUsAmPmFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) =>
  value ? moment(value).format(FORMAT) : '';
