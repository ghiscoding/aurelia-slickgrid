import { FilterCondition, FilterConditionOption } from './../models/index';

function parseBoolean(input: boolean | number | string) {
  return /(true|1)/i.test(input + '');
}

export const booleanFilterCondition: FilterCondition = (options: FilterConditionOption) => {
  const searchTerm = Array.isArray(options.searchTerms) && options.searchTerms[0] || '';
  return parseBoolean(options.cellValue) === parseBoolean(searchTerm);
};
