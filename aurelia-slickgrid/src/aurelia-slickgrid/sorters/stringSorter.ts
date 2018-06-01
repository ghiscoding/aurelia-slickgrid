import { Sorter } from './../models/sorter.interface';

export const stringSorter: Sorter = (value1: any, value2: any, sortDirection: number) => {
  let position = 0;
  if (value1 === null) {
    position = -1;
  } else if (value2 === null) {
    position = 1;
  } else if (value1 === value2) {
    position = 0;
  } else if (sortDirection) {
    position = value1 < value2 ? -1 : 1;
  } else if (!sortDirection) {
    position = value1 < value2 ? 1 : -1;
  }
  return sortDirection * position;
};
