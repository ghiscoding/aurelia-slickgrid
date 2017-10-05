import { testFilterCondition } from './filterUtilities';
export const numberFilterCondition = (options) => {
    return testFilterCondition(options.operator || '==', parseFloat(options.cellValue), parseFloat(options.searchTerm));
};
