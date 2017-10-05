define(["require", "exports", "moment", "../models/fieldType", "./filterUtilities"], function (require, exports, moment, fieldType_1, filterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dateFilterCondition = function (options) {
        var filterSearchType = options.filterSearchType || fieldType_1.FieldType.dateIso;
        var searchDateFormat = filterUtilities_1.mapDateFormatByFieldType(filterSearchType);
        if (!moment(options.cellValue, moment.ISO_8601).isValid() || !moment(options.searchTerm, searchDateFormat, true).isValid()) {
            return true;
        }
        var dateCell = moment(options.cellValue);
        var dateSearch = moment(options.searchTerm);
        // run the filter condition with date in Unix Timestamp format
        return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
    };
});
