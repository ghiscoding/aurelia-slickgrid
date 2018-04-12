System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var complexObjectFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("complexObjectFormatter", complexObjectFormatter = function (row, cell, value, columnDef, dataContext) {
                if (!columnDef) {
                    return '';
                }
                var complexField = columnDef.field || '';
                return complexField.split('.').reduce(function (obj, i) { return (obj ? obj[i] : ''); }, dataContext);
            });
        }
    };
});
//# sourceMappingURL=complexObjectFormatter.js.map