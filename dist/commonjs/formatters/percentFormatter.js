"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.percentFormatter = function (row, cell, value, columnDef, dataContext) {
    if (value === null || value === '') {
        return '';
    }
    var outputValue = value > 0 ? value / 100 : 0;
    return "<span>" + outputValue + "%</span>";
};
//# sourceMappingURL=percentFormatter.js.map