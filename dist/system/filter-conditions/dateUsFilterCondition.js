System.register(["../models", "./filterUtilities", "./../services/utilities", "moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var models_1, filterUtilities_1, utilities_1, moment, FORMAT, dateUsFilterCondition;
    return {
        setters: [
            function (models_1_1) {
                models_1 = models_1_1;
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
            FORMAT = utilities_1.mapMomentDateFormatWithFieldType(models_1.FieldType.dateUs);
            exports_1("dateUsFilterCondition", dateUsFilterCondition = function (options) {
                if (!moment(options.cellValue, FORMAT, true).isValid() || !moment(options.searchTerm, FORMAT, true).isValid()) {
                    return true;
                }
                var dateCell = moment(options.cellValue, FORMAT, true);
                var dateSearch = moment(options.searchTerm, FORMAT, true);
                // run the filter condition with date in Unix Timestamp format
                return filterUtilities_1.testFilterCondition(options.operator || '==', parseInt(dateCell.format('X'), 10), parseInt(dateSearch.format('X'), 10));
            });
        }
    };
});
//# sourceMappingURL=dateUsFilterCondition.js.map