System.register([], function (exports_1, context_1) {
    "use strict";
    var deleteIconFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("deleteIconFormatter", deleteIconFormatter = function (row, cell, value, columnDef, dataContext) {
                return "<i class=\"fa fa-trash pointer delete-icon\" aria-hidden=\"true\"></i>";
            });
        }
    };
});
//# sourceMappingURL=deleteIconFormatter.js.map