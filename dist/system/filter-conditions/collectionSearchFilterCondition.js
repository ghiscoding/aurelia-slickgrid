System.register(["./filterUtilities"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var filterUtilities_1, collectionSearchFilterCondition;
    return {
        setters: [
            function (filterUtilities_1_1) {
                filterUtilities_1 = filterUtilities_1_1;
            }
        ],
        execute: function () {
            exports_1("collectionSearchFilterCondition", collectionSearchFilterCondition = function (options) {
                // multiple-select will always return text, so we should make our cell values text as well
                var cellValue = options.cellValue + '';
                return filterUtilities_1.testFilterCondition(options.operator || 'IN', cellValue, options.searchTerms || []);
            });
        }
    };
});
//# sourceMappingURL=collectionSearchFilterCondition.js.map