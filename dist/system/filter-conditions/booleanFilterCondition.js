System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function parseBoolean(str) {
        return /(true|1)/i.test(str);
    }
    var booleanFilterCondition;
    return {
        setters: [],
        execute: function () {
            exports_1("booleanFilterCondition", booleanFilterCondition = function (options) {
                return parseBoolean(options.cellValue) === parseBoolean(options.searchTerm);
            });
        }
    };
});
