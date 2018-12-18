System.register([], function (exports_1, context_1) {
    "use strict";
    var lowercaseFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("lowercaseFormatter", lowercaseFormatter = function (row, cell, value, columnDef, dataContext) {
                // make sure the value is a string
                if (value !== undefined && typeof value !== 'string') {
                    value = value + '';
                }
                return value ? value.toLowerCase() : '';
            });
        }
    };
});
//# sourceMappingURL=lowercaseFormatter.js.map