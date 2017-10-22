System.register(["moment", "../models/fieldType", "./filterUtilities"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment, fieldType_1, filterUtilities_1, dateFilterCondition;
    return {
        setters: [
            function (moment_1) {
                moment = moment_1;
            },
            function (fieldType_1_1) {
                fieldType_1 = fieldType_1_1;
            },
            function (filterUtilities_1_1) {
                filterUtilities_1 = filterUtilities_1_1;
            }
        ],
        execute: function () {
            exports_1("dateFilterCondition", dateFilterCondition = function (options) {
                var filterSearchType = options.filterSearchType || fieldType_1.FieldType.dateIso;
                var searchDateFormat = filterUtilities_1.mapDateFormatByFieldType(filterSearchType);
                if (!moment(options.cellValue, moment.ISO_8601).isValid() || !moment(options.searchTerm, searchDateFormat, true).isValid()) {
                    return true;
                }
                var dateCell = moment(options.cellValue);
                var dateSearch = moment(options.searchTerm);
                // run the filter condition with date in Unix Timestamp format
                return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
            });
        }
    };
});
//# sourceMappingURL=dateFilterCondition.js.map