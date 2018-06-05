System.register(["./../services/utilities", "./../models/index", "./compareDateUtility"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utilities_1, index_1, compareDateUtility_1, FORMAT, dateUsShortSorter;
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
            FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUsShort);
            exports_1("dateUsShortSorter", dateUsShortSorter = function (value1, value2, sortDirection) {
                return compareDateUtility_1.compareDates(value1, value2, sortDirection, FORMAT, true);
            });
        }
    };
});
//# sourceMappingURL=dateUsShortSorter.js.map