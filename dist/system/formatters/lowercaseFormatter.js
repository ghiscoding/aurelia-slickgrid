System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var lowercaseFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("lowercaseFormatter", lowercaseFormatter = function (row, cell, value, columnDef, dataContext) {
                return (value && typeof value === 'string') ? value.toLowerCase() : value;
            });
        }
    };
});
//# sourceMappingURL=lowercaseFormatter.js.map