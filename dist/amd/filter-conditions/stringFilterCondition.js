define(["require", "exports", "./filterUtilities"], function (require, exports, filterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stringFilterCondition = function (options) {
        // make sure the cell value is a string by casting it when possible
        options.cellValue = (options.cellValue === undefined || options.cellValue === null) ? '' : options.cellValue.toString();
        if (options.operator === '*') {
            return options.cellValue.startsWith(options.searchTerm);
        }
        else if (options.operator === '' && options.cellValueLastChar === '*') {
            return options.cellValue.endsWith(options.searchTerm);
        }
        else if (options.operator === '') {
            return options.cellValue.includes(options.searchTerm);
        }
        return filterUtilities_1.testFilterCondition(options.operator || '==', options.cellValue.toLowerCase(), options.searchTerm.toLowerCase());
    };
});
//# sourceMappingURL=stringFilterCondition.js.map