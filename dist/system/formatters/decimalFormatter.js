System.register(["./../services/utilities"], function (exports_1, context_1) {
    "use strict";
    var utilities_1, decimalFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }
        ],
        execute: function () {
            exports_1("decimalFormatter", decimalFormatter = function (row, cell, value, columnDef, dataContext) {
                var params = columnDef.params || {};
                var minDecimalPlaces = params.minDecimalPlaces || params.decimalPlaces || 2;
                var maxDecimalPlaces = params.maxDecimalPlaces || 2;
                var isNumber = (value === null || value === undefined) ? false : !isNaN(+value);
                return !isNumber ? value : "" + utilities_1.decimalFormatted(value, minDecimalPlaces, maxDecimalPlaces);
            });
        }
    };
});
//# sourceMappingURL=decimalFormatter.js.map