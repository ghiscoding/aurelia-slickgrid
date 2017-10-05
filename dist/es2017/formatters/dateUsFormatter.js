import * as moment from 'moment';
export const dateUsFormatter = (row, cell, value, columnDef, dataContext) => value ? moment(value).format('MM/DD/YYYY') : '';
