"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multipleFormatter = function (row, cell, value, columnDef, dataContext, grid) {
    var params = columnDef.params || {};
    if (!params.formatters || !Array.isArray(params.formatters)) {
        throw new Error("The multiple formatter requires the \"formatters\" to be provided as a column params.\n    For example: this.columnDefinitions = [{ id: title, field: title, formatter: Formatters.multiple, params: { formatters: [Formatters.lowercase, Formatters.uppercase] }");
    }
    var formatters = params.formatters;
    // loop through all Formatters, the value of 1st formatter will be used by 2nd formatter and so on.
    // they are piped and executed in sequences
    var currentValue = value;
    for (var _i = 0, formatters_1 = formatters; _i < formatters_1.length; _i++) {
        var formatter = formatters_1[_i];
        currentValue = formatter(row, cell, currentValue, columnDef, dataContext, grid);
    }
    return currentValue;
};
//# sourceMappingURL=multipleFormatter.js.map