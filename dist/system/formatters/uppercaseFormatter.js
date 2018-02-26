System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var uppercaseFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("uppercaseFormatter", uppercaseFormatter = function (row, cell, value, columnDef, dataContext) {
                // make sure the value is a string
                if (value !== undefined && typeof value !== 'string') {
                    value = value + '';
                }
                return value ? value.toUpperCase() : '';
            });
        }
    };
});
//# sourceMappingURL=uppercaseFormatter.js.map