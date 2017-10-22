import * as moment from 'moment';
export const dateTimeUsAmPmFormatter = (row, cell, value, columnDef, dataContext) => value ? moment(value).format('MM/DD/YYYY h:mm:ss a') : '';
//# sourceMappingURL=dateTimeUsAmPmFormatter.js.map