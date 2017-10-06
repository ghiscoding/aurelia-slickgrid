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
                // make sure the both search & cell value are string
                // and make them lower case for case insensitive filtering
                var cellValue = options.cellValue.toString().toLowerCase();
                var searchTerm = options.searchTerm.toString().toLowerCase();
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
