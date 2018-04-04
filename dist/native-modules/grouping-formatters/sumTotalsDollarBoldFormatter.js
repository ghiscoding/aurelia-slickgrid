import { decimalFormatted } from './../services/utilities';
export var sumTotalsDollarBoldFormatter = function (totals, columnDef, grid) {
    var field = columnDef.field || '';
    var val = totals.sum && totals.sum[field];
    var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
    var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
    if (val != null) {
        return "<span style=\"font-weight: bold;\">" + (prefix + '$' + decimalFormatted(val, 2, 4) + suffix) + "</span>";
    }
    return '';
};
//# sourceMappingURL=sumTotalsDollarBoldFormatter.js.map