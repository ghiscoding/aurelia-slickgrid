define(["require", "exports", "moment", "./filterUtilities"], function (require, exports, moment, filterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dateUtcFilterCondition = function (options) {
        if (!options.filterSearchType) {
            throw new Error('Date UTC filter is a special case and requires a filterSearchType to be provided in the column option, for example: { filterable: true, type: FieldType.dateUtc, filterSearchType: FieldType.dateIso }');
        }
        var searchDateFormat = filterUtilities_1.mapDateFormatByFieldType(options.filterSearchType);
        if (!moment(options.cellValue, moment.ISO_8601).isValid() || !moment(options.searchTerm, searchDateFormat, true).isValid()) {
            return true;
        }
        var dateCell = moment(options.cellValue, moment.ISO_8601, true);
        var dateSearch = moment(options.searchTerm, searchDateFormat, true);
        // run the filter condition with date in Unix Timestamp format
        return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
    };
});
//# sourceMappingURL=dateUtcFilterCondition.js.map