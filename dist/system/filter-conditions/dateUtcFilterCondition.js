System.register(["moment", "./filterUtilities"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment, filterUtilities_1, dateUtcFilterCondition;
    return {
        setters: [
            function (moment_1) {
                moment = moment_1;
            },
            function (filterUtilities_1_1) {
                filterUtilities_1 = filterUtilities_1_1;
            }
        ],
        execute: function () {
            exports_1("dateUtcFilterCondition", dateUtcFilterCondition = function (options) {
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
            });
        }
    };
});
