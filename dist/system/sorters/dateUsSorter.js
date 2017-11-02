System.register(["./../services/utilities", "./../models/index", "moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utilities_1, index_1, moment, FORMAT, dateUsSorter;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (moment_1) {
                moment = moment_1;
            }
        ],
        execute: function () {
            FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUs);
            exports_1("dateUsSorter", dateUsSorter = function (value1, value2, sortDirection) {
                if (!moment(value1, FORMAT, true).isValid() || !moment(value2, FORMAT, true).isValid()) {
                    return 0;
                }
                var date1 = moment(value1, FORMAT, true);
                var date2 = moment(value2, FORMAT, true);
                var diff = parseInt(date1.format('X'), 10) - parseInt(date2.format('X'), 10);
                return sortDirection * (diff === 0 ? 0 : (diff > 0 ? 1 : -1));
            });
        }
    };
});
//# sourceMappingURL=dateUsSorter.js.map