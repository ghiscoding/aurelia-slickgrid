import { testFilterCondition } from './filterUtilities';
export var numberFilterCondition = function (options) {
    var cellValue = parseFloat(options.cellValue);
    var searchTerm = (typeof options.searchTerm === 'string') ? parseFloat(options.searchTerm) : options.searchTerm;
    return testFilterCondition(options.operator || '==', cellValue, searchTerm);
};
//# sourceMappingURL=numberFilterCondition.js.map