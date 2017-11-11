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
            });
        }
    };
});
//# sourceMappingURL=stringFilterCondition.js.map