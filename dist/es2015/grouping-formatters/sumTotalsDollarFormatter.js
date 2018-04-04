import { decimalFormatted } from './../services/utilities';
export const sumTotalsDollarFormatter = (totals, columnDef, grid) => {
    const field = columnDef.field || '';
    const val = totals.sum && totals.sum[field];
    const prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
    const suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
    if (val != null) {
        return prefix + '$' + decimalFormatted(val, 2, 2) + suffix;
    }
    return '';
};
//# sourceMappingURL=sumTotalsDollarFormatter.js.map