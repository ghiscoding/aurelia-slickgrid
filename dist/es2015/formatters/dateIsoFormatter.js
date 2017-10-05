import * as moment from 'moment';
export const dateIsoFormatter = (row, cell, value, columnDef, dataContext) => value ? moment(value).format('YYYY-MM-DD') : '';
