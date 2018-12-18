System.register([], function (exports_1, context_1) {
    "use strict";
    var yesNoFormatter;
    var __moduleName = context_1 && context_1.id;
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