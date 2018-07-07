import { decimalFormatted } from './../services/utilities';
export var decimalFormatter = function (row, cell, value, columnDef, dataContext) {
    var params = columnDef.params || {};
    var minDecimalPlaces = params.minDecimalPlaces || params.decimalPlaces || 2;
    var maxDecimalPlaces = params.maxDecimalPlaces || 2;
    return isNaN(+value) ? value : "" + decimalFormatted(value, minDecimalPlaces, maxDecimalPlaces);
};
//# sourceMappingURL=decimalFormatter.js.map