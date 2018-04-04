System.register(["./../services/utilities"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utilities_1, dollarFormatter;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }
        ],
        execute: function () {
            exports_1("dollarFormatter", dollarFormatter = function (row, cell, value, columnDef, dataContext) {
                return isNaN(+value) ? '' : "$" + utilities_1.decimalFormatted(value, 2, 4);
            });
        }
    };
});
//# sourceMappingURL=dollarFormatter.js.map