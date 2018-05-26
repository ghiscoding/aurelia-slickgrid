"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./../services/utilities");
var index_1 = require("./../models/index");
var sorterUtilities_1 = require("./sorterUtilities");
var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateIso);
exports.dateIsoSorter = function (value1, value2, sortDirection) {
    return sorterUtilities_1.compareDates(sortDirection, value1, value2, FORMAT, true);
};
//# sourceMappingURL=dateIsoSorter.js.map