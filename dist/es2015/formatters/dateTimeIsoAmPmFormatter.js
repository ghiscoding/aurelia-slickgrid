import * as moment from 'moment';
export const dateTimeIsoAmPmFormatter = (row, cell, value, columnDef, dataContext) => value ? moment(value).format('YYYY-MM-DD h:mm:ss a') : '';
//# sourceMappingURL=dateTimeIsoAmPmFormatter.js.map