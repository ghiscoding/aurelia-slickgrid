System.register(["./../services/utilities"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utilities_1, dollarColoredFormatter;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }
        ],
        execute: function () {
            exports_1("dollarColoredFormatter", dollarColoredFormatter = function (row, cell, value, columnDef, dataContext) {
                if (isNaN(+value)) {
                    return '';
                }
                else if (value >= 0) {
                    return "<span style=\"color:green;\">$" + utilities_1.decimalFormatted(value, 2, 2) + "</span>";
                }
                else {
                    return "<span style=\"color:red;\">$" + utilities_1.decimalFormatted(value, 2, 2) + "</span>";
                }
            });
        }
    };
});
//# sourceMappingURL=dollarColoredFormatter.js.map