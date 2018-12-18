System.register(["./../services/utilities", "./../models/index", "./compareDateUtility"], function (exports_1, context_1) {
    "use strict";
    var utilities_1, index_1, compareDateUtility_1, FORMAT, dateUsSorter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (compareDateUtility_1_1) {
                compareDateUtility_1 = compareDateUtility_1_1;
            }
        ],
        execute: function () {
            FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUs);
            exports_1("dateUsSorter", dateUsSorter = function (value1, value2, sortDirection) {
                return compareDateUtility_1.compareDates(value1, value2, sortDirection, FORMAT, true);
            });
        }
    };
});
//# sourceMappingURL=dateUsSorter.js.map