import * as moment from 'moment';
export const dateTimeIsoFormatter = (row, cell, value, columnDef, dataContext) => value ? moment(value).format('YYYY-MM-DD hh:mm:ss') : '';
//# sourceMappingURL=dateTimeIsoFormatter.js.map