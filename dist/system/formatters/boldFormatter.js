System.register(["./../services/utilities"], function (exports_1, context_1) {
    "use strict";
    var utilities_1, boldFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }
        ],
        execute: function () {
            exports_1("boldFormatter", boldFormatter = function (row, cell, value, columnDef, dataContext) {
                var isNumber = (value === null || value === undefined) ? false : !isNaN(+value);
                if (!isNumber) {
                    return '';
                }
                else if (value >= 0) {
                    return "<span style=\"font-weight: bold\">" + utilities_1.decimalFormatted(value, 2, 2) + "$</span>";
                }
                else {
                    return "<span style=\"font-weight: bold\">" + utilities_1.decimalFormatted(value, 2, 2) + "$</span>";
                }
            });
        }
    };
});
//# sourceMappingURL=boldFormatter.js.map