"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
exports.dateTimeIsoAmPmFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format('YYYY-MM-DD h:mm:ss a') : '';
};
//# sourceMappingURL=dateTimeIsoAmPmFormatter.js.map