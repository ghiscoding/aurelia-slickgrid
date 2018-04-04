define(["require", "exports", "./../services/utilities"], function (require, exports, utilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sumTotalsDollarColoredFormatter = function (totals, columnDef, grid) {
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
    };
});
//# sourceMappingURL=sumTotalsDollarColoredFormatter.js.map