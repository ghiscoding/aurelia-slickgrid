import { FieldType } from './../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
var FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateUs);
export var dateUsFormatter = function (row, cell, value, columnDef, dataContext) {
    var isDateValid = moment(value, FORMAT, false).isValid();
    return (value && isDateValid) ? moment(value).format(FORMAT) : value;
};
//# sourceMappingURL=dateUsFormatter.js.map