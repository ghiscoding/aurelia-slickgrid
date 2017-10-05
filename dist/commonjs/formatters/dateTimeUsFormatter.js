"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
exports.dateTimeUsFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format('MM/DD/YYYY hh:mm:ss') : '';
};
