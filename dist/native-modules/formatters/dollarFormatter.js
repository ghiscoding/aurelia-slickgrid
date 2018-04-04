import { decimalFormatted } from './../services/utilities';
export var dollarFormatter = function (row, cell, value, columnDef, dataContext) {
    return isNaN(+value) ? '' : "$" + decimalFormatted(value, 2, 4);
};
//# sourceMappingURL=dollarFormatter.js.map