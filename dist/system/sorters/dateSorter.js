System.register(["moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment, dateSorter;
    return {
        setters: [
            function (moment_1) {
                moment = moment_1;
            }
        ],
        execute: function () {
            exports_1("dateSorter", dateSorter = function (value1, value2, sortDirection) {
                if (!moment(value1, moment.ISO_8601).isValid() || !moment(value2, moment.ISO_8601, true).isValid()) {
                    return 0;
                }
                var date1 = moment(value1);
                var date2 = moment(value2);
                var diff = parseInt(date1.format('X'), 10) - parseInt(date2.format('X'), 10);
                return sortDirection * (diff === 0 ? 0 : (diff > 0 ? 1 : -1));
            });
        }
    };
});
//# sourceMappingURL=dateSorter.js.map