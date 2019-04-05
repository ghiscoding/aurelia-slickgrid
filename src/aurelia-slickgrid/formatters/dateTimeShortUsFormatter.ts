import { Column, FieldType, Formatter } from './../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';

const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateTimeShortUs);

export const dateTimeShortUsFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  const isDateValid = moment(value, FORMAT, false).isValid();
  return (value && isDateValid) ? moment(value).format(FORMAT) : value;
};
