System.register(["./filterUtilities"], function (exports_1, context_1) {
    "use strict";
    var filterUtilities_1, numberFilterCondition;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (filterUtilities_1_1) {
                filterUtilities_1 = filterUtilities_1_1;
            }
        ],
        execute: function () {
            exports_1("numberFilterCondition", numberFilterCondition = function (options) {
                var cellValue = parseFloat(options.cellValue);
                var searchTerm = (Array.isArray(options.searchTerms) && options.searchTerms[0]) || 0;
                if (typeof searchTerm === 'string') {
                    searchTerm = parseFloat(searchTerm);
                }
                if (!searchTerm && (!options.operator || options.operator === '')) {
                    return true;
                }
                return filterUtilities_1.testFilterCondition(options.operator || '==', cellValue, searchTerm);
            });
        }
    };
});
//# sourceMappingURL=numberFilterCondition.js.map