"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var compareDateUtility_1 = require("./compareDateUtility");
exports.dateSorter = function (value1, value2, sortDirection) {
    return compareDateUtility_1.compareDates(value1, value2, sortDirection, moment.ISO_8601);
};
//# sourceMappingURL=dateSorter.js.map