import * as moment from 'moment';
export const dateTimeUsFormatter = (row, cell, value, columnDef, dataContext) => value ? moment(value).format('MM/DD/YYYY hh:mm:ss') : '';
//# sourceMappingURL=dateTimeUsFormatter.js.map