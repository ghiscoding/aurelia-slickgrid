"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complexObjectFormatter = function (row, cell, value, columnDef, dataContext) {
    if (!columnDef) {
        return '';
    }
    var complexField = columnDef.field || '';
    return complexField.split('.').reduce(function (obj, i) { return obj[i]; }, dataContext);
};
//# sourceMappingURL=complexObjectFormatter.js.map