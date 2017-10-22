import * as moment from 'moment';
export var dateTimeUsFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format('MM/DD/YYYY hh:mm:ss') : '';
};
//# sourceMappingURL=dateTimeUsFormatter.js.map