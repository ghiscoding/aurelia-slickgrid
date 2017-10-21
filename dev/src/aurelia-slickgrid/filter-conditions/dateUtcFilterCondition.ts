import * as moment from 'moment';

import { FilterCondition } from './../models/filterCondition.interface';
import { FilterConditionOption } from './../models/filterConditionOption.interface';
import { mapDateFormatByFieldType, testFilterCondition } from './filterUtilities';


export const dateUtcFilterCondition: FilterCondition = (options: FilterConditionOption) => {
  if (!options.filterSearchType) {
    throw new Error('Date UTC filter is a special case and requires a filterSearchType to be provided in the column option, for example: { filterable: true, type: FieldType.dateUtc, filterSearchType: FieldType.dateIso }');
  }

  const searchDateFormat = mapDateFormatByFieldType(options.filterSearchType);
  if (!moment(options.cellValue, moment.ISO_8601).isValid() || !moment(options.searchTerm, searchDateFormat, true).isValid()) {
    return true;
  }
  const dateCell = moment(options.cellValue, moment.ISO_8601, true);
  const dateSearch = moment(options.searchTerm, searchDateFormat, true);

  // run the filter condition with date in Unix Timestamp format
  return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
