define(["require", "exports", "../models/index", "./filterUtilities", "./../services/utilities", "moment"], function (require, exports, index_1, filterUtilities_1, utilities_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateIso);
    exports.dateIsoFilterCondition = function (options) {
        var searchTerm = Array.isArray(options.searchTerms) && options.searchTerms[0] || '';
        if (searchTerm === null || searchTerm === '' || !moment(options.cellValue, FORMAT, true).isValid() || !moment(searchTerm, FORMAT, true).isValid()) {
            return false;
        }
        var dateCell = moment(options.cellValue, FORMAT, true);
        var dateSearch = moment(searchTerm, FORMAT, true);
        // run the filter condition with date in Unix Timestamp format
        return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
    };
});
//# sourceMappingURL=dateIsoFilterCondition.js.map