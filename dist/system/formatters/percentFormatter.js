System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var percentFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("percentFormatter", percentFormatter = function (row, cell, value, columnDef, dataContext) {
                if (value === null || value === '') {
                    return '';
                }
                var outputValue = value > 0 ? value / 100 : 0;
                return "<span>" + outputValue + "%</span>";
            });
        }
    };
});
//# sourceMappingURL=percentFormatter.js.map