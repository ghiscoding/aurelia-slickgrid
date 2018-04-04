"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./../services/utilities");
exports.dollarColoredFormatter = function (row, cell, value, columnDef, dataContext) {
    if (isNaN(+value)) {
        return '';
    }
    else if (value >= 0) {
        return "<span style=\"color:green;\">$" + utilities_1.decimalFormatted(value, 2, 2) + "</span>";
    }
    else {
        return "<span style=\"color:red;\">$" + utilities_1.decimalFormatted(value, 2, 2) + "</span>";
    }
};
//# sourceMappingURL=dollarColoredFormatter.js.map