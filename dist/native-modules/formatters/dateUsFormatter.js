import * as moment from 'moment';
export var dateUsFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format('MM/DD/YYYY') : '';
};
//# sourceMappingURL=dateUsFormatter.js.map