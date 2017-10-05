import * as moment from 'moment';
export var dateTimeIsoAmPmFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format('YYYY-MM-DD h:mm:ss a') : '';
};
