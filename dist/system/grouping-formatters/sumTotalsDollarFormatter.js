System.register(["./../services/utilities"], function (exports_1, context_1) {
    "use strict";
    var utilities_1, sumTotalsDollarFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }
        ],
        execute: function () {
            exports_1("sumTotalsDollarFormatter", sumTotalsDollarFormatter = function (totals, columnDef, grid) {
                var field = columnDef.field || '';
                var val = totals.sum && totals.sum[field];
                var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
                var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
                if (val != null) {
                    return prefix + '$' + utilities_1.decimalFormatted(val, 2, 2) + suffix;
                }
                return '';
            });
        }
    };
});
//# sourceMappingURL=sumTotalsDollarFormatter.js.map