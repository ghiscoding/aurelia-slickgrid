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
                var isNumber = (value === null || value === undefined) ? false : !isNaN(+value);
                var params = columnDef && columnDef.params || {};
                var minDecimal = params.minDecimal || 2;
                var maxDecimal = params.minDecimal || 4;
                var outputValue = (isNumber && (params.minDecimal || params.maxDecimal)) ? utilities_1.decimalFormatted(value, minDecimal, maxDecimal) : value;
                return !isNumber ? '' : "$" + outputValue;
            });
        }
    };
});
//# sourceMappingURL=dollarFormatter.js.map