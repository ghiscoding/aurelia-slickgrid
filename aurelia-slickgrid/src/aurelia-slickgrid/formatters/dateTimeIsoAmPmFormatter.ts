import { Column, FieldType, Formatter } from './../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateTimeIsoAmPm);

export const dateTimeIsoAmPmFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any) => {
  const isDateValid = moment(value, FORMAT, true).isValid();
  return (value && isDateValid) ? moment(value).format(FORMAT) : value;
};
