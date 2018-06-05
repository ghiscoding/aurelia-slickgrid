import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { FieldType } from './../models/index';
import { compareDates } from './compareDateUtility';
var FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateIso);
export var dateIsoSorter = function (value1, value2, sortDirection) {
    return compareDates(value1, value2, sortDirection, FORMAT, true);
};
//# sourceMappingURL=dateIsoSorter.js.map