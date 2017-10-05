System.register(["moment"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var moment, dateUsFormatter;
    return {
        setters: [
            function (moment_1) {
                moment = moment_1;
            }
        ],
        execute: function () {
            exports_1("dateUsFormatter", dateUsFormatter = function (row, cell, value, columnDef, dataContext) {
                return value ? moment(value).format('MM/DD/YYYY') : '';
            });
        }
    };
});
