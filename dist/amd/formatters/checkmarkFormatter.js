define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkmarkFormatter = function (row, cell, value, columnDef, dataContext) {
        return value ? "<i class=\"fa fa-check\" aria-hidden=\"true\"></i>" : '';
    };
});
//# sourceMappingURL=checkmarkFormatter.js.map