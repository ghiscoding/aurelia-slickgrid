define(["require", "exports", "../models/index", "./../services/utilities", "./filterUtilities", "moment"], function (require, exports, index_1, utilities_1, filterUtilities_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dateFilterCondition = function (options) {
        var filterSearchType = options.filterSearchType || index_1.FieldType.dateIso;
        var searchDateFormat = utilities_1.mapMomentDateFormatWithFieldType(filterSearchType);
        if (!moment(options.cellValue, moment.ISO_8601).isValid() || !moment(options.searchTerm, searchDateFormat, true).isValid()) {
            return false;
        }
        var dateCell = moment(options.cellValue);
        var dateSearch = moment(options.searchTerm);
        // run the filter condition with date in Unix Timestamp format
        return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
    };
});
//# sourceMappingURL=dateFilterCondition.js.map