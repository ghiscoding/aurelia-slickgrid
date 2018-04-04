define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.avgTotalsFormatter = function (totals, columnDef, grid) {
        var field = columnDef.field || '';
        var val = totals.avg && totals.avg[field];
        var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
        var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
        if (val != null) {
            return prefix + Math.round(val) + suffix;
        }
        return '';
    };
});
//# sourceMappingURL=avgTotalsFormatter.js.map