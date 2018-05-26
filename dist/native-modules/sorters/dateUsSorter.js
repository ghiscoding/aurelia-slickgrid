import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { FieldType } from './../models/index';
import { compareDates } from './sorterUtilities';
var FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateUs);
export var dateUsSorter = function (value1, value2, sortDirection) {
    return compareDates(sortDirection, value1, value2, FORMAT, true);
};
//# sourceMappingURL=dateUsSorter.js.map