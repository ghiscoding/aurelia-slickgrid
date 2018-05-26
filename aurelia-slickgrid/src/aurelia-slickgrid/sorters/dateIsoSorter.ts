import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { FieldType, Sorter } from './../models/index';
import { compareDates } from './sorterUtilities';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateIso);

export const dateIsoSorter: Sorter = (value1, value2, sortDirection) => {
  return compareDates(sortDirection, value1, value2, FORMAT, true);
};
