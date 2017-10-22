"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
exports.dateIsoFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format('YYYY-MM-DD') : '';
};
//# sourceMappingURL=dateIsoFormatter.js.map