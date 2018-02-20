System.register(["./filterUtilities"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var filterUtilities_1, numberFilterCondition;
    return {
        setters: [
            function (filterUtilities_1_1) {
                filterUtilities_1 = filterUtilities_1_1;
            }
        ],
        execute: function () {
            exports_1("numberFilterCondition", numberFilterCondition = function (options) {
                var cellValue = parseFloat(options.cellValue);
                var searchTerm = (typeof options.searchTerm === 'string') ? parseFloat(options.searchTerm) : options.searchTerm;
                return filterUtilities_1.testFilterCondition(options.operator || '==', cellValue, searchTerm);
            });
        }
    };
});
//# sourceMappingURL=numberFilterCondition.js.map