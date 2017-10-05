import { testFilterCondition } from './filterUtilities';
export var numberFilterCondition = function (options) {
    return testFilterCondition(options.operator || '==', parseFloat(options.cellValue), parseFloat(options.searchTerm));
};
