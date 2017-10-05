System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var percentCompleteFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("percentCompleteFormatter", percentCompleteFormatter = function (row, cell, value, columnDef, dataContext) {
                if (value === null || value === '') {
                    return '-';
                }
                else if (value < 50) {
                    return "<span style='color:red;font-weight:bold;'>" + value + "%</span>";
                }
                else {
                    return "<span style='color:green'>" + value + "%</span>";
                }
            });
        }
    };
});
