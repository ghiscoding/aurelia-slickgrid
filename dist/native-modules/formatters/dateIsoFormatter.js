import * as moment from 'moment';
export var dateIsoFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format('YYYY-MM-DD') : '';
};
