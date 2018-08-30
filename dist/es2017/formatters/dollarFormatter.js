import { decimalFormatted } from './../services/utilities';
export const dollarFormatter = (row, cell, value, columnDef, dataContext) => {
    const isNumber = (value === null || value === undefined) ? false : !isNaN(+value);
    const params = columnDef && columnDef.params || {};
    const minDecimal = params.minDecimal || 2;
    const maxDecimal = params.minDecimal || 4;
    const outputValue = (isNumber && (params.minDecimal || params.maxDecimal)) ? decimalFormatted(value, minDecimal, maxDecimal) : value;
    return !isNumber ? '' : `$${outputValue}`;
};
//# sourceMappingURL=dollarFormatter.js.map