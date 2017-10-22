import * as moment from 'moment';
export var dateTimeIsoFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format('YYYY-MM-DD hh:mm:ss') : '';
};
//# sourceMappingURL=dateTimeIsoFormatter.js.map