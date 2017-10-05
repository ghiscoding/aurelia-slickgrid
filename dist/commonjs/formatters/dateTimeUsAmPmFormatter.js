"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
exports.dateTimeUsAmPmFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format('MM/DD/YYYY h:mm:ss a') : '';
};
