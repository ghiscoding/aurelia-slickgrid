import { decimalFormatted } from './../services/utilities';
export var sumTotalsDollarFormatter = function (totals, columnDef, grid) {
    var field = columnDef.field || '';
    var val = totals.sum && totals.sum[field];
    var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
    var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
    if (val != null) {
        return prefix + '$' + decimalFormatted(val, 2, 2) + suffix;
    }
    return '';
};
//# sourceMappingURL=sumTotalsDollarFormatter.js.map