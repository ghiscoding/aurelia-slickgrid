export const maxTotalsFormatter = (totals, columnDef, grid) => {
    const field = columnDef.field || '';
    const val = totals.max && totals.max[field];
    const prefix = (columnDef.params && columnDef.params.groupFormatterPrefix) ? columnDef.params.groupFormatterPrefix : '';
    const suffix = (columnDef.params && columnDef.params.groupFormatterSuffix) ? columnDef.params.groupFormatterSuffix : '';
    if (val != null) {
        return prefix + ((Math.round(parseFloat(val) * 1000000) / 1000000)) + suffix;
    }
    return '';
};
//# sourceMappingURL=maxTotalsFormatter.js.map