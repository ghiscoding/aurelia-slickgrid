import { FilterCondition, FilterConditionOption } from '../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { testFilterCondition } from './filterUtilities';
import * as moment from 'moment';

export const dateUtcFilterCondition: FilterCondition = (options: FilterConditionOption) => {
  const searchDateFormat = mapMomentDateFormatWithFieldType(options.filterSearchType || options.fieldType);
  if (!moment(options.cellValue, moment.ISO_8601).isValid() || !moment(options.searchTerm, searchDateFormat, true).isValid()) {
    return true;
  }
  const dateCell = moment(options.cellValue, moment.ISO_8601, true);
  const dateSearch = moment(options.searchTerm, searchDateFormat, true);

  // run the filter condition with date in Unix Timestamp format
  return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
