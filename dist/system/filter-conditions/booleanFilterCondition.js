System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function parseBoolean(input) {
        return /(true|1)/i.test(input + '');
    }
    var booleanFilterCondition;
    return {
        setters: [],
        execute: function () {
            exports_1("booleanFilterCondition", booleanFilterCondition = function (options) {
                var searchTerm = Array.isArray(options.searchTerms) && options.searchTerms[0] || '';
                return parseBoolean(options.cellValue) === parseBoolean(searchTerm);
            });
        }
    };
});
//# sourceMappingURL=booleanFilterCondition.js.map