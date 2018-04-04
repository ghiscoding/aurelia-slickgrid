export var maxTotalsFormatter = function (totals, columnDef, grid) {
    var field = columnDef.field || '';
    var val = totals.max && totals.max[field];
    var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
    var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
    if (val != null) {
        return prefix + ((Math.round(parseFloat(val) * 1000000) / 1000000)) + suffix;
    }
    return '';
};
//# sourceMappingURL=maxTotalsFormatter.js.map