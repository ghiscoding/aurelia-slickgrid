System.register(["moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment, dateTimeUsFormatter;
    return {
        setters: [
            function (moment_1) {
                moment = moment_1;
            }
        ],
        execute: function () {
            exports_1("dateTimeUsFormatter", dateTimeUsFormatter = function (row, cell, value, columnDef, dataContext) {
                return value ? moment(value).format('MM/DD/YYYY hh:mm:ss') : '';
            });
        }
    };
});
