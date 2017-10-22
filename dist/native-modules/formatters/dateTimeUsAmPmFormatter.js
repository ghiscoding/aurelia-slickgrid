import * as moment from 'moment';
export var dateTimeUsAmPmFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format('MM/DD/YYYY h:mm:ss a') : '';
};
//# sourceMappingURL=dateTimeUsAmPmFormatter.js.map