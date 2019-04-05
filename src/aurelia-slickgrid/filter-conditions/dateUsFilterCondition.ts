import { FieldType, FilterCondition, FilterConditionOption } from '../models/index';
import { testFilterCondition } from './filterUtilities';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import * as moment from 'moment';
const FORMAT = mapMomentDateFormatWithFieldType(FieldType.dateUs);

export const dateUsFilterCondition: FilterCondition = (options: FilterConditionOption) => {
  const searchTerm = (Array.isArray(options.searchTerms) && options.searchTerms[0] || '') as string;
  if (searchTerm === null || searchTerm === '' || !moment(options.cellValue, FORMAT, true).isValid() || !moment(searchTerm, FORMAT, true).isValid()) {
    return false;
  }
  const dateCell = moment(options.cellValue, FORMAT, true);
  const dateSearch = moment(searchTerm, FORMAT, true);

  // run the filter condition with date in Unix Timestamp format
  return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
};
