System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var checkboxFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("checkboxFormatter", checkboxFormatter = function (row, cell, value, columnDef, dataContext) {
                return value ? '&#x2611;' : '';
            });
        }
    };
});
//# sourceMappingURL=checkboxFormatter.js.map