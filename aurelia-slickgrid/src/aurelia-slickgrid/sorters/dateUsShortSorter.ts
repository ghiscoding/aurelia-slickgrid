import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { FieldType, Sorter } from './../models/index';
import { compareDates } from './compareDateUtility';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateUsShort);

export const dateUsShortSorter: Sorter = (value1: any, value2: any, sortDirection: number) => {
  return compareDates(value1, value2, sortDirection, FORMAT, true);
};
