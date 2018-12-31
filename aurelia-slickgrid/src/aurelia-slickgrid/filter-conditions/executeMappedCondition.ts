import { booleanFilterCondition } from './booleanFilterCondition';
import { dateFilterCondition } from './dateFilterCondition';
import { dateIsoFilterCondition } from './dateIsoFilterCondition';
import { dateUsShortFilterCondition } from './dateUsShortFilterCondition';
import { dateUsFilterCondition } from './dateUsFilterCondition';
import { dateUtcFilterCondition } from './dateUtcFilterCondition';
import { collectionSearchFilterCondition } from './collectionSearchFilterCondition';
import { numberFilterCondition } from './numberFilterCondition';
import { objectFilterCondition } from './objectFilterCondition';
import { stringFilterCondition } from './stringFilterCondition';
import { FieldType, FilterCondition, FilterConditionOption } from '../models/index';

export const executeMappedCondition: FilterCondition = (options: FilterConditionOption) => {
  // when using a multi-select ('IN' operator) we will not use the field type but instead go directly with a collection search
  const operator = options && options.operator && options.operator.toUpperCase();
  if (operator === 'IN' || operator === 'NIN' || operator === 'IN_CONTAINS' || operator === 'NIN_CONTAINS') {
    return collectionSearchFilterCondition(options);
  }

  // execute the mapped type, or default to String condition check
  switch (options.fieldType) {
    case FieldType.boolean:
      return booleanFilterCondition(options);
    case FieldType.date:
      return dateFilterCondition(options);
    case FieldType.dateUtc:
      return dateUtcFilterCondition(options);
    case FieldType.dateIso:
      return dateIsoFilterCondition(options);
    case FieldType.dateUs:
    case FieldType.dateTimeUs:
      return dateUsFilterCondition(options);
    case FieldType.dateUsShort:
    case FieldType.dateTimeUsShort:
      return dateUsShortFilterCondition(options);
    case FieldType.number:
      return numberFilterCondition(options);
    case FieldType.object:
      return objectFilterCondition(options);
    case FieldType.string:
    default:
      return stringFilterCondition(options);
  }
};
