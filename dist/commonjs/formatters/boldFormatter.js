"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./../services/utilities");
exports.boldFormatter = function (row, cell, value, columnDef, dataContext) {
    var isNumber = (value === null || value === undefined) ? false : !isNaN(+value);
    if (!isNumber) {
        return '';
    }
    else if (value >= 0) {
        return "<span style=\"font-weight: bold\">" + utilities_1.decimalFormatted(value, 2, 2) + "$</span>";
    }
    else {
        return "<span style=\"font-weight: bold\">" + utilities_1.decimalFormatted(value, 2, 2) + "$</span>";
    }
};
//# sourceMappingURL=boldFormatter.js.map