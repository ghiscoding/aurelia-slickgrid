"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./../models/index");
var utilities_1 = require("./../services/utilities");
var moment = require("moment");
var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateTimeUs);
exports.dateTimeUsFormatter = function (row, cell, value, columnDef, dataContext) {
    var isDateValid = moment(value, FORMAT, true).isValid();
    return (value && isDateValid) ? moment(value).format(FORMAT) : value;
};
//# sourceMappingURL=dateTimeUsFormatter.js.map