define(["require", "exports", "./../services/utilities"], function (require, exports, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.avgTotalsDollarFormatter = function (totals, columnDef, grid) {
        var field = columnDef.field || '';
        var val = totals.avg && totals.avg[field];
        var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
        var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
        if (val != null) {
            return prefix + '$' + utilities_1.decimalFormatted(val, 2, 4) + suffix;
        }
        return '';
    };
});
//# sourceMappingURL=avgTotalsDollarFormatter.js.map