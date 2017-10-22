define(["require", "exports", "moment", "./filterUtilities"], function (require, exports, moment, filterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DATE_FORMAT = 'M/D/YY';
    exports.dateUsShortFilterCondition = function (options) {
        if (!moment(options.cellValue, DATE_FORMAT, true).isValid() || !moment(options.searchTerm, DATE_FORMAT, true).isValid()) {
            return true;
        }
        var dateCell = moment(options.cellValue, DATE_FORMAT, true);
        var dateSearch = moment(options.searchTerm, DATE_FORMAT, true);
        // run the filter condition with date in Unix Timestamp format
        return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
    };
});
//# sourceMappingURL=dateUsShortFilterCondition.js.map