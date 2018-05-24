import * as moment from 'moment';
import { Sorter } from './../models/sorter.interface';
import { compareDates } from './sorterUtilities';

export const dateSorter: Sorter = (value1, value2, sortDirection) => {
  return compareDates(sortDirection, value1, value2, moment.ISO_8601);
};
