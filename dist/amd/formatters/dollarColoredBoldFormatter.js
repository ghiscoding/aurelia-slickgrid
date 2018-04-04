define(["require", "exports", "./../services/utilities"], function (require, exports, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dollarColoredBoldFormatter = function (row, cell, value, columnDef, dataContext) {
        if (isNaN(+value)) {
            return '';
        }
        else if (value >= 0) {
            return "<span style=\"color:green; font-weight: bold;\">$" + utilities_1.decimalFormatted(value, 2, 2) + "</span>";
        }
        else {
            return "<span style=\"color:red; font-weight: bold;\">$" + utilities_1.decimalFormatted(value, 2, 2) + "</span>";
        }
    };
});
//# sourceMappingURL=dollarColoredBoldFormatter.js.map