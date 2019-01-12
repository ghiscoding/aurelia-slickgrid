import { Column } from '../models/column.interface';
import { FieldType } from './../models/fieldType.enum';
import { Sorters } from './index';

export function sortByFieldType(value1: any, value2: any, fieldType: FieldType, sortDirection: number, sortColumn: Column) {
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
    case FieldType.object:
      sortResult = Sorters.objectString(value1, value2, sortDirection, sortColumn);
      break;
    default:
      sortResult = Sorters.string(value1, value2, sortDirection);
      break;
  }

  return sortResult;
}
