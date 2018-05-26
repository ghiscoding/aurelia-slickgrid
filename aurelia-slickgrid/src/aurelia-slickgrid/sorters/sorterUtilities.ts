import { FieldType } from './../models/fieldType.enum';
import { Sorters } from './index';
import * as moment from 'moment';

export function sortByFieldType(value1: any, value2: any, fieldType: FieldType, sortDirection: number) {
  let sortResult = 0;

  switch (fieldType) {
    case FieldType.number:
      sortResult = Sorters.numeric(value1, value2, sortDirection);
      break;
    case FieldType.date:
      sortResult = Sorters.date(value1, value2, sortDirection);
      break;
    case FieldType.dateIso:
      sortResult = Sorters.dateIso(value1, value2, sortDirection);
      break;
    case FieldType.dateUs:
      sortResult = Sorters.dateUs(value1, value2, sortDirection);
      break;
    case FieldType.dateUsShort:
      sortResult = Sorters.dateUsShort(value1, value2, sortDirection);
      break;
    default:
      sortResult = Sorters.string(value1, value2, sortDirection);
      break;
  }

  return sortResult;
}

export function compareDates(sortDirection: number, value1: any, value2: any, format: string | moment.MomentBuiltinFormat, strict?: boolean) {
  let diff = 0;

  if (value1 === null || value1 === '' || !moment(value1, format, strict).isValid()) {
    diff = -1;
  } else if (value2 === null || value2 === '' || !moment(value2, format, strict).isValid()) {
    diff = 1;
  } else {
    const date1 = moment(value1, format, strict);
    const date2 = moment(value2, format, strict);
    diff = parseInt(date1.format('X'), 10) - parseInt(date2.format('X'), 10);
  }

  return sortDirection * (diff === 0 ? 0 : (diff > 0 ? 1 : -1));
}
