import * as moment from 'moment';

import { Sorter } from './../models/sorter.interface';

export const dateSorter: Sorter = (value1, value2, sortDirection) => {
  if (!moment(value1, moment.ISO_8601).isValid() || !moment(value2, moment.ISO_8601, true).isValid()) {
    return 0;
  }
  const date1 = moment(value1);
  const date2 = moment(value2);
  const diff = parseInt(date1.format('X'), 10) - parseInt(date2.format('X'), 10);

  return sortDirection * (diff === 0 ? 0 : (diff > 0 ? 1 : -1));
};
