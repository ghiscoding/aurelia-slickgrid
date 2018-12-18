System.register(["../models/index", "./../services/utilities", "./filterUtilities", "moment"], function (exports_1, context_1) {
    "use strict";
    var index_1, utilities_1, filterUtilities_1, moment, dateFilterCondition;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            },
            function (filterUtilities_1_1) {
                filterUtilities_1 = filterUtilities_1_1;
            },
            function (moment_1) {
                moment = moment_1;
            }
        ],
        execute: function () {
            exports_1("dateFilterCondition", dateFilterCondition = function (options) {
                var searchTerm = (Array.isArray(options.searchTerms) && options.searchTerms[0] || '');
                var filterSearchType = options.filterSearchType || index_1.FieldType.dateIso;
                var searchDateFormat = utilities_1.mapMomentDateFormatWithFieldType(filterSearchType);
                if (searchTerm === null || searchTerm === '' || !moment(options.cellValue, moment.ISO_8601).isValid() || !moment(searchTerm, searchDateFormat, true).isValid()) {
                    return false;
                }
                var dateCell = moment(options.cellValue);
                var dateSearch = moment(searchTerm);
                // run the filter condition with date in Unix Timestamp format
                return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
            });
        }
    };
});
//# sourceMappingURL=dateFilterCondition.js.map