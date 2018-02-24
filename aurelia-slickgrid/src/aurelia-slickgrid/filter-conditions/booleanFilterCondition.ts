import { FilterCondition, FilterConditionOption } from './../models/index';
import { testFilterCondition } from './filterUtilities';

function parseBoolean(input: boolean | number | string) {
  return /(true|1)/i.test(input + '');
}

export const booleanFilterCondition: FilterCondition = (options: FilterConditionOption) => {
  return parseBoolean(options.cellValue) === parseBoolean(options.searchTerm || false);
};
