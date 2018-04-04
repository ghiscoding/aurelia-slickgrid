define(["require", "exports", "./../services/utilities"], function (require, exports, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dollarFormatter = function (row, cell, value, columnDef, dataContext) {
        return isNaN(+value) ? '' : "$" + utilities_1.decimalFormatted(value, 2, 4);
    };
});
//# sourceMappingURL=dollarFormatter.js.map