import { decimalFormatted } from './../services/utilities';
export var sumTotalsDollarColoredFormatter = function (totals, columnDef, grid) {
    var field = columnDef.field || '';
    var val = totals.sum && totals.sum[field];
    var prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
    var suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
    if (isNaN(+val)) {
        return '';
    }
    else if (val >= 0) {
        return "<span style=\"color:green;\">" + (prefix + '$' + decimalFormatted(val, 2, 2) + suffix) + "</span>";
    }
    else {
        return "<span style=\"color:red;\">" + (prefix + '$' + decimalFormatted(val, 2, 2) + suffix) + "</span>";
    }
};
//# sourceMappingURL=sumTotalsDollarColoredFormatter.js.map