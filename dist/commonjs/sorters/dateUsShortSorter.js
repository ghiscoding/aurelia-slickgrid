"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utilities_1 = require("./../services/utilities");
var index_1 = require("./../models/index");
var moment = require("moment");
var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUsShort);
exports.dateUsShortSorter = function (value1, value2, sortDirection) {
    if (!moment(value1, FORMAT, true).isValid() || !moment(value2, FORMAT, true).isValid()) {
        return 0;
    }
    var date1 = moment(value1, FORMAT, true);
    var date2 = moment(value2, FORMAT, true);
    var diff = parseInt(date1.format('X'), 10) - parseInt(date2.format('X'), 10);
    return sortDirection * (diff === 0 ? 0 : (diff > 0 ? 1 : -1));
};
//# sourceMappingURL=dateUsShortSorter.js.map