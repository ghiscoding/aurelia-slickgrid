"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./../services/utilities");
var index_1 = require("./../models/index");
var compareDateUtility_1 = require("./compareDateUtility");
var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUs);
exports.dateUsSorter = function (value1, value2, sortDirection) {
    return compareDateUtility_1.compareDates(value1, value2, sortDirection, FORMAT, true);
};
//# sourceMappingURL=dateUsSorter.js.map