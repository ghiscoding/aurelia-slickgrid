System.register(["../models/index", "./filterUtilities", "./../services/utilities", "moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, filterUtilities_1, utilities_1, moment, FORMAT, dateIsoFilterCondition;
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (filterUtilities_1_1) {
                filterUtilities_1 = filterUtilities_1_1;
            },
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            },
            function (moment_1) {
                moment = moment_1;
            }
        ],
        execute: function () {
            FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateIso);
            exports_1("dateIsoFilterCondition", dateIsoFilterCondition = function (options) {
                var searchTerm = (Array.isArray(options.searchTerms) && options.searchTerms[0] || '');
                if (searchTerm === null || searchTerm === '' || !moment(options.cellValue, FORMAT, true).isValid() || !moment(searchTerm, FORMAT, true).isValid()) {
                    return false;
                }
                var dateCell = moment(options.cellValue, FORMAT, true);
                var dateSearch = moment(searchTerm, FORMAT, true);
                // run the filter condition with date in Unix Timestamp format
                return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
            });
        }
    };
});
//# sourceMappingURL=dateIsoFilterCondition.js.map