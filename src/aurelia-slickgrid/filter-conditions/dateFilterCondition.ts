import { FilterCondition, FilterConditionOption, FieldType, OperatorType } from '../models/index';
import { mapMomentDateFormatWithFieldType } from './../services/utilities';
import { testFilterCondition } from './filterUtilities';
import * as moment from 'moment-mini';

export const dateFilterCondition: FilterCondition = (options: FilterConditionOption) => {
  const searchTerm = (Array.isArray(options.searchTerms) && options.searchTerms[0] || '') as string;
  const filterSearchType = options.filterSearchType || FieldType.dateIso;
  const searchDateFormat = mapMomentDateFormatWithFieldType(filterSearchType);

  let isRangeSearch = false;
  let dateSearch1;
  let dateSearch2;

  // return when cell value is not a valid date
  if (searchTerm === null || searchTerm === '' || !moment(options.cellValue, moment.ISO_8601).isValid()) {
    return false;
  }

  // cell value in moment format
  const dateCell = moment(options.cellValue);

  if (searchTerm.indexOf('..') >= 0) {
    isRangeSearch = true;
    const searchValues = searchTerm.split('..');
    const searchTerm1 = moment(Array.isArray(searchValues) && searchValues[0]);
    const searchTerm2 = moment(Array.isArray(searchValues) && searchValues[1]);

    // return if any of the 2 values are invalid dates
    if (!moment(searchTerm1, searchDateFormat, true).isValid() || !moment(searchTerm2, searchDateFormat, true).isValid()) {
      return false;
    }
    dateSearch1 = moment(searchTerm1);
    dateSearch2 = moment(searchTerm2);
  } else {
    // return if the search term is an invalid date
    if (!moment(searchTerm, searchDateFormat, true).isValid()) {
      return false;
    }
    dateSearch1 = moment(searchTerm);
  }

  // run the filter condition with date in Unix Timestamp format
  if (isRangeSearch) {
    const isInclusive = options.operator && options.operator === OperatorType.rangeInclusive;
    const resultCondition1 = testFilterCondition((isInclusive ? '>=' : '>'), parseInt(dateCell.format('X'), 10), parseInt(dateSearch1.format('X'), 10));
    const resultCondition2 = testFilterCondition((isInclusive ? '<=' : '<'), parseInt(dateCell.format('X'), 10), parseInt(dateSearch2.format('X'), 10));
    return (resultCondition1 && resultCondition2);
  }
  return testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch1.format('X'), 10));
};
