define(["require", "exports", "./../services/utilities"], function (require, exports, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sumTotalsDollarBoldFormatter = function (totals, columnDef, grid) {
        var field = columnDef.field || '';
        var val = totals.sum && totals.sum[field];
        var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
        var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
        if (val != null) {
            return "<span style=\"font-weight: bold;\">" + (prefix + '$' + utilities_1.decimalFormatted(val, 2, 4) + suffix) + "</span>";
        }
        return '';
    };
});
//# sourceMappingURL=sumTotalsDollarBoldFormatter.js.map