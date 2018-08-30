"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./../services/utilities");
exports.dollarColoredFormatter = function (row, cell, value, columnDef, dataContext) {
    var isNumber = (value === null || value === undefined) ? false : !isNaN(+value);
    var params = columnDef && columnDef.params || {};
    var minDecimal = params.minDecimal || 2;
    var maxDecimal = params.minDecimal || 4;
    var outputValue = (isNumber && (params.minDecimal || params.maxDecimal)) ? utilities_1.decimalFormatted(value, minDecimal, maxDecimal) : value;
    if (!isNumber) {
        return '';
    }
    else if (value >= 0) {
        return "<span style=\"color:green;\">$" + outputValue + "</span>";
    }
    else {
        return "<span style=\"color:red;\">$" + outputValue + "</span>";
    }
};
//# sourceMappingURL=dollarColoredFormatter.js.map