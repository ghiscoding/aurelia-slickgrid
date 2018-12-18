System.register(["moment", "./compareDateUtility"], function (exports_1, context_1) {
    "use strict";
    var moment, compareDateUtility_1, dateSorter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (moment_1) {
                moment = moment_1;
            },
            function (compareDateUtility_1_1) {
                compareDateUtility_1 = compareDateUtility_1_1;
            }
        ],
        execute: function () {
            exports_1("dateSorter", dateSorter = function (value1, value2, sortDirection) {
                return compareDateUtility_1.compareDates(value1, value2, sortDirection, moment.ISO_8601);
            });
        }
    };
});
//# sourceMappingURL=dateSorter.js.map