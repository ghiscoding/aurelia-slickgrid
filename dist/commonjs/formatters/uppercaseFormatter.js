"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uppercaseFormatter = function (row, cell, value, columnDef, dataContext) {
    // make sure the value is a string
    if (value !== undefined && typeof value !== 'string') {
        value = value + '';
    }
    return value ? value.toUpperCase() : '';
};
//# sourceMappingURL=uppercaseFormatter.js.map