System.register(["./../services/utilities"], function (exports_1, context_1) {
    "use strict";
    var utilities_1, sumTotalsDollarBoldFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }
        ],
        execute: function () {
            exports_1("sumTotalsDollarBoldFormatter", sumTotalsDollarBoldFormatter = function (totals, columnDef, grid) {
                var field = columnDef.field || '';
                var val = totals.sum && totals.sum[field];
                var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
                var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
                if (val != null) {
                    return "<span style=\"font-weight: bold;\">" + (prefix + '$' + utilities_1.decimalFormatted(val, 2, 4) + suffix) + "</span>";
                }
                return '';
            });
        }
    };
});
//# sourceMappingURL=sumTotalsDollarBoldFormatter.js.map