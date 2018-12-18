System.register(["./../services/utilities"], function (exports_1, context_1) {
    "use strict";
    var utilities_1, sumTotalsDollarColoredFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }
        ],
        execute: function () {
            exports_1("sumTotalsDollarColoredFormatter", sumTotalsDollarColoredFormatter = function (totals, columnDef, grid) {
                var field = columnDef.field || '';
                var val = totals.sum && totals.sum[field];
                var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
                var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
                if (isNaN(+val)) {
                    return '';
                }
                else if (val >= 0) {
                    return "<span style=\"color:green;\">" + (prefix + '$' + utilities_1.decimalFormatted(val, 2, 2) + suffix) + "</span>";
                }
                else {
                    return "<span style=\"color:red;\">" + (prefix + '$' + utilities_1.decimalFormatted(val, 2, 2) + suffix) + "</span>";
                }
            });
        }
    };
});
//# sourceMappingURL=sumTotalsDollarColoredFormatter.js.map