define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uppercaseFormatter = function (row, cell, value, columnDef, dataContext) {
        return (value && typeof value === 'string') ? value.toUpperCase() : value;
    };
});
//# sourceMappingURL=uppercaseFormatter.js.map