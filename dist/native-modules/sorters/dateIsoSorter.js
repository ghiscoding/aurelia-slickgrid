import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { FieldType } from './../models/index';
import { compareDates } from './sorterUtilities';
var FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateIso);
export var dateIsoSorter = function (value1, value2, sortDirection) {
    return compareDates(sortDirection, value1, value2, FORMAT, true);
};
//# sourceMappingURL=dateIsoSorter.js.map