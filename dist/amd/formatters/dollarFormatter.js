define(["require", "exports", "./../services/utilities"], function (require, exports, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dollarFormatter = function (row, cell, value, columnDef, dataContext) {
        var isNumber = (value === null || value === undefined) ? false : !isNaN(+value);
        var params = columnDef && columnDef.params || {};
        var minDecimal = params.minDecimal || 2;
        var maxDecimal = params.minDecimal || 4;
        var outputValue = (isNumber && (params.minDecimal || params.maxDecimal)) ? utilities_1.decimalFormatted(value, minDecimal, maxDecimal) : value;
        return !isNumber ? '' : "$" + outputValue;
    };
});
//# sourceMappingURL=dollarFormatter.js.map