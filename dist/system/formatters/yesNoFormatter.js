System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var yesNoFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("yesNoFormatter", yesNoFormatter = function (row, cell, value, columnDef, dataContext) {
                return value ? 'Yes' : 'No';
            });
        }
    };
});
//# sourceMappingURL=yesNoFormatter.js.map