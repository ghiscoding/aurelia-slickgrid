System.register([], function (exports_1, context_1) {
    "use strict";
    var editIconFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("editIconFormatter", editIconFormatter = function (row, cell, value, columnDef, dataContext) {
                return "<i class=\"fa fa-pencil pointer edit-icon\" aria-hidden=\"true\"></i>";
            });
        }
    };
});
//# sourceMappingURL=editIconFormatter.js.map