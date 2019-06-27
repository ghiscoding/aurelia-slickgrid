import * as moment from 'moment-mini';
import { Sorter } from './../models/sorter.interface';
import { compareDates } from './compareDateUtility';

export const dateSorter: Sorter = (value1: any, value2: any, sortDirection: number) => {
  return compareDates(value1, value2, sortDirection, moment.ISO_8601);
};
