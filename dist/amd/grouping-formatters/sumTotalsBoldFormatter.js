define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sumTotalsBoldFormatter = function (totals, columnDef, grid) {
        var field = columnDef.field || '';
        var val = totals.sum && totals.sum[field];
        var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
        var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
        if (val != null) {
            return "<span style=\"font-weight: bold;\">" + (prefix + ((Math.round(parseFloat(val) * 1000000) / 1000000)) + suffix);
        }
        return '';
    };
});
//# sourceMappingURL=sumTotalsBoldFormatter.js.map