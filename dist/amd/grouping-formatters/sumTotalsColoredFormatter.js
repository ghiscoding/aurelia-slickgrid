define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sumTotalsColoredFormatter = function (totals, columnDef, grid) {
        var field = columnDef.field || '';
        var val = totals.sum && totals.sum[field];
        var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
        var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
        if (isNaN(+val)) {
            return '';
        }
        else if (val >= 0) {
            return "<span style=\"color:green;\">" + (prefix + ((Math.round(parseFloat(val) * 1000000) / 1000000)) + suffix) + "</span>";
        }
        else {
            return "<span style=\"color:red;\">" + (prefix + ((Math.round(parseFloat(val) * 1000000) / 1000000)) + suffix) + "</span>";
        }
    };
});
//# sourceMappingURL=sumTotalsColoredFormatter.js.map