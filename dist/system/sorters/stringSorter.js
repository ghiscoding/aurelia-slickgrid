System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var stringSorter;
    return {
        setters: [],
        execute: function () {
            exports_1("stringSorter", stringSorter = function (value1, value2, sortDirection) {
                return sortDirection * (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1));
            });
        }
    };
});
