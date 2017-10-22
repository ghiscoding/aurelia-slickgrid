define(["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dateIsoFormatter = function (row, cell, value, columnDef, dataContext) {
        return value ? moment(value).format('YYYY-MM-DD') : '';
    };
});
//# sourceMappingURL=dateIsoFormatter.js.map