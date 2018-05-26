import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { FieldType } from './../models/index';
import { compareDates } from './sorterUtilities';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateUs);
export const dateUsSorter = (value1, value2, sortDirection) => {
    return compareDates(sortDirection, value1, value2, FORMAT, true);
};
//# sourceMappingURL=dateUsSorter.js.map