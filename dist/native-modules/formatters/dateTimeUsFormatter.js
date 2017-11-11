import { FieldType } from './../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
var FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateTimeUs);
export var dateTimeUsFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format(FORMAT) : '';
};
//# sourceMappingURL=dateTimeUsFormatter.js.map