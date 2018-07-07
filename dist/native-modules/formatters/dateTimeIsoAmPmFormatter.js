import { FieldType } from './../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
var FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateTimeIsoAmPm);
export var dateTimeIsoAmPmFormatter = function (row, cell, value, columnDef, dataContext) {
    var isDateValid = moment(value, FORMAT, true).isValid();
    return (value && isDateValid) ? moment(value).format(FORMAT) : value;
};
//# sourceMappingURL=dateTimeIsoAmPmFormatter.js.map