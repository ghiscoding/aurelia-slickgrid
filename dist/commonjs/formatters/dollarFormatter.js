"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./../services/utilities");
exports.dollarFormatter = function (row, cell, value, columnDef, dataContext) {
    return isNaN(+value) ? '' : "$" + utilities_1.decimalFormatted(value, 2, 4);
};
//# sourceMappingURL=dollarFormatter.js.map