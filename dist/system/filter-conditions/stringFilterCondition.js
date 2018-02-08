System.register(["./filterUtilities"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var filterUtilities_1, stringFilterCondition;
    return {
        setters: [
            function (filterUtilities_1_1) {
                filterUtilities_1 = filterUtilities_1_1;
            }
        ],
        execute: function () {
            exports_1("stringFilterCondition", stringFilterCondition = function (options) {
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
            });
        }
    };
});
//# sourceMappingURL=stringFilterCondition.js.map