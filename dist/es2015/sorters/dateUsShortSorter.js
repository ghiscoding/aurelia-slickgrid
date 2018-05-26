import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { FieldType } from './../models/index';
import { compareDates } from './sorterUtilities';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateUsShort);
export const dateUsShortSorter = (value1, value2, sortDirection) => {
    return compareDates(sortDirection, value1, value2, FORMAT, true);
};
//# sourceMappingURL=dateUsShortSorter.js.map