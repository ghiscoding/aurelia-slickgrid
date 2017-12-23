System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var uppercaseFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("uppercaseFormatter", uppercaseFormatter = function (row, cell, value, columnDef, dataContext) {
                return (value && typeof value === 'string') ? value.toUpperCase() : value;
            });
        }
    };
});
//# sourceMappingURL=uppercaseFormatter.js.map