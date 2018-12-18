System.register(["./../services/utilities"], function (exports_1, context_1) {
    "use strict";
    var utilities_1, avgTotalsDollarFormatter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            }
        ],
        execute: function () {
            exports_1("avgTotalsDollarFormatter", avgTotalsDollarFormatter = function (totals, columnDef, grid) {
                var field = columnDef.field || '';
                var val = totals.avg && totals.avg[field];
                var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
                var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
                if (val != null) {
                    return prefix + '$' + utilities_1.decimalFormatted(val, 2, 4) + suffix;
                }
                return '';
            });
        }
    };
});
//# sourceMappingURL=avgTotalsDollarFormatter.js.map