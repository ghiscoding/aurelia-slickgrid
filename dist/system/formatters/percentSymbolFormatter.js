System.register([], function (exports_1, context_1) {
    "use strict";
    var percentSymbolFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("percentSymbolFormatter", percentSymbolFormatter = function (row, cell, value, columnDef, dataContext) {
                return value ? "<span>" + value + "%</span>" : '';
            });
        }
    };
});
//# sourceMappingURL=percentSymbolFormatter.js.map