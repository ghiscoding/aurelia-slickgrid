"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./../models/index");
var utilities_1 = require("./../services/utilities");
var moment = require("moment");
var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUs);
exports.dateUsFormatter = function (row, cell, value, columnDef, dataContext) {
    return value ? moment(value).format(FORMAT) : '';
};
//# sourceMappingURL=dateUsFormatter.js.map