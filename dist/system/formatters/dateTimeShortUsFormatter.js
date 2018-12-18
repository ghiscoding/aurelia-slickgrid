System.register(["./../models/index", "./../services/utilities", "moment"], function (exports_1, context_1) {
    "use strict";
    var index_1, utilities_1, moment, FORMAT, dateTimeShortUsFormatter;
    var __moduleName = context_1 && context_1.id;
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
            FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateTimeShortUs);
            exports_1("dateTimeShortUsFormatter", dateTimeShortUsFormatter = function (row, cell, value, columnDef, dataContext) {
                var isDateValid = moment(value, FORMAT, false).isValid();
                return (value && isDateValid) ? moment(value).format(FORMAT) : value;
            });
        }
    };
});
//# sourceMappingURL=dateTimeShortUsFormatter.js.map