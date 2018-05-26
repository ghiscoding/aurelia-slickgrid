import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { FieldType } from './../models/index';
import { compareDates } from './sorterUtilities';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateIso);
export const dateIsoSorter = (value1, value2, sortDirection) => {
    return compareDates(sortDirection, value1, value2, FORMAT, true);
};
//# sourceMappingURL=dateIsoSorter.js.map