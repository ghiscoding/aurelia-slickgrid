System.register(["moment", "./sorterUtilities"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment, sorterUtilities_1, dateSorter;
    return {
        setters: [
            function (moment_1) {
                moment = moment_1;
            },
            function (sorterUtilities_1_1) {
                sorterUtilities_1 = sorterUtilities_1_1;
            }
        ],
        execute: function () {
            exports_1("dateSorter", dateSorter = function (value1, value2, sortDirection) {
                return sorterUtilities_1.compareDates(sortDirection, value1, value2, moment.ISO_8601);
            });
        }
    };
});
//# sourceMappingURL=dateSorter.js.map