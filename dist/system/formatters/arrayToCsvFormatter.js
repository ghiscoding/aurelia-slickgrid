System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var arrayToCsvFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("arrayToCsvFormatter", arrayToCsvFormatter = function (row, cell, value, columnDef, dataContext) {
                if (value && Array.isArray(value)) {
                    var values = value.join(', ');
                    return "<span title=\"" + values + "\">" + values + "</span>";
                }
                return '';
            });
        }
    };
});
//# sourceMappingURL=arrayToCsvFormatter.js.map