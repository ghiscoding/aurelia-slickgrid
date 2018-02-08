define(["require", "exports", "./filterUtilities"], function (require, exports, filterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringFilterCondition = function (options) {
        // make sure the cell value is a string by casting it when possible
        options.cellValue = (options.cellValue === undefined || options.cellValue === null) ? '' : options.cellValue.toString();
        // make both the cell value and search value lower for case insensitive comparison
        var cellValue = options.cellValue.toLowerCase();
        var searchTerm = options.searchTerm.toLowerCase();
        if (options.operator === '*') {
            return cellValue.endsWith(searchTerm);
        }
        else if (options.operator === '' && options.cellValueLastChar === '*') {
            return cellValue.startsWith(searchTerm);
        }
        else if (options.operator === '') {
            return cellValue.includes(searchTerm);
        }
        return filterUtilities_1.testFilterCondition(options.operator || '==', cellValue, searchTerm);
    };
});
//# sourceMappingURL=stringFilterCondition.js.map