import { testFilterCondition } from './filterUtilities';
export var collectionSearchFilterCondition = function (options) {
    // multiple-select will always return text, so we should make our cell values text as well
    var cellValue = options.cellValue + '';
    return testFilterCondition(options.operator || 'IN', cellValue, options.searchTerms || []);
};
//# sourceMappingURL=collectionSearchFilterCondition.js.map