"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./../services/utilities");
exports.decimalFormatter = function (row, cell, value, columnDef, dataContext) {
    var params = columnDef.params || {};
    var minDecimalPlaces = params.minDecimalPlaces || params.decimalPlaces || 2;
    var maxDecimalPlaces = params.maxDecimalPlaces || 2;
    return isNaN(+value) ? value : "" + utilities_1.decimalFormatted(value, minDecimalPlaces, maxDecimalPlaces);
};
//# sourceMappingURL=decimalFormatter.js.map