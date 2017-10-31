System.register(["./../models/index", "./../services/utilities", "moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var index_1, utilities_1, moment, FORMAT, dateUsFormatter;
    return {
        setters: [
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            },
            function (moment_1) {
                moment = moment_1;
            }
        ],
        execute: function () {
            FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUs);
            exports_1("dateUsFormatter", dateUsFormatter = function (row, cell, value, columnDef, dataContext) {
                return value ? moment(value).format(FORMAT) : '';
            });
        }
    };
});
//# sourceMappingURL=dateUsFormatter.js.map