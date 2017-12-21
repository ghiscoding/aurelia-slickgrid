"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lowercaseFormatter = function (row, cell, value, columnDef, dataContext) {
    return (value && typeof value === 'string') ? value.toLowerCase() : value;
};
//# sourceMappingURL=lowercaseFormatter.js.map