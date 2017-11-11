System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var checkmarkFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("checkmarkFormatter", checkmarkFormatter = function (row, cell, value, columnDef, dataContext) {
                return value ? "<i class=\"fa fa-check\" aria-hidden=\"true\"></i>" : '';
            });
        }
    };
});
//# sourceMappingURL=checkmarkFormatter.js.map