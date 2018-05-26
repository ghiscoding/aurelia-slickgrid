"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var sorterUtilities_1 = require("./sorterUtilities");
exports.dateSorter = function (value1, value2, sortDirection) {
    return sorterUtilities_1.compareDates(sortDirection, value1, value2, moment.ISO_8601);
};
//# sourceMappingURL=dateSorter.js.map