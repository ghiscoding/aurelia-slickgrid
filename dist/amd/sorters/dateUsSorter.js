define(["require", "exports", "./../services/utilities", "./../models/index", "moment"], function (require, exports, utilities_1, index_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUs);
    exports.dateUsSorter = function (value1, value2, sortDirection) {
        if (!moment(value1, FORMAT, true).isValid() || !moment(value2, FORMAT, true).isValid()) {
            return 0;
        }
        var date1 = moment(value1, FORMAT, true);
        var date2 = moment(value2, FORMAT, true);
        var diff = parseInt(date1.format('X'), 10) - parseInt(date2.format('X'), 10);
        return sortDirection * (diff === 0 ? 0 : (diff > 0 ? 1 : -1));
    };
});
//# sourceMappingURL=dateUsSorter.js.map