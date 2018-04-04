define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.minTotalsFormatter = function (totals, columnDef, grid) {
        var field = columnDef.field || '';
        var val = totals.min && totals.min[field];
        var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
        var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
        if (val != null) {
            return prefix + ((Math.round(parseFloat(val) * 1000000) / 1000000)) + suffix;
        }
        return '';
    };
});
//# sourceMappingURL=minTotalsFormatter.js.map