System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var sumTotalsFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("sumTotalsFormatter", sumTotalsFormatter = function (totals, columnDef, grid) {
                var field = columnDef.field || '';
                var val = totals.sum && totals.sum[field];
                var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
                var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
                if (val != null) {
                    return prefix + ((Math.round(parseFloat(val) * 1000000) / 1000000)) + suffix;
                }
                return '';
            });
        }
    };
});
//# sourceMappingURL=sumTotalsFormatter.js.map