define(["require", "exports", "../models/index", "./filterUtilities", "moment", "./../services/utilities"], function (require, exports, index_1, filterUtilities_1, moment, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUsShort);
    exports.dateUsShortFilterCondition = function (options) {
        if (!moment(options.cellValue, FORMAT, true).isValid() || !moment(options.searchTerm, FORMAT, true).isValid()) {
            return true;
        }
        var dateCell = moment(options.cellValue, FORMAT, true);
        var dateSearch = moment(options.searchTerm, FORMAT, true);
        // run the filter condition with date in Unix Timestamp format
        return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
    };
});
//# sourceMappingURL=dateUsShortFilterCondition.js.map