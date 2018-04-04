import { decimalFormatted } from './../services/utilities';
export const dollarFormatter = (row, cell, value, columnDef, dataContext) => isNaN(+value) ? '' : `$${decimalFormatted(value, 2, 4)}`;
//# sourceMappingURL=dollarFormatter.js.map