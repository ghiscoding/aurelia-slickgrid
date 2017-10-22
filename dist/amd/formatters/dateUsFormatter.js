define(["require", "exports", "moment"], function (require, exports, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dateUsFormatter = function (row, cell, value, columnDef, dataContext) {
        return value ? moment(value).format('MM/DD/YYYY') : '';
    };
});
//# sourceMappingURL=dateUsFormatter.js.map