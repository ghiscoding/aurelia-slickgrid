define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.percentSymbolFormatter = function (row, cell, value, columnDef, dataContext) {
        return value ? "<span>" + value + "%</span>" : '';
    };
});
//# sourceMappingURL=percentSymbolFormatter.js.map