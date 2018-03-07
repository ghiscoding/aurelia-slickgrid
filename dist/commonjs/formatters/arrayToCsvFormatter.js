"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayToCsvFormatter = function (row, cell, value, columnDef, dataContext) {
    if (value && Array.isArray(value)) {
        var values = value.join(', ');
        return "<span title=\"" + values + "\">" + values + "</span>";
    }
    return '';
};
//# sourceMappingURL=arrayToCsvFormatter.js.map