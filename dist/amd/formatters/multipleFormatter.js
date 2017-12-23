define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.multipleFormatter = function (row, cell, value, columnDef, dataContext) {
        var params = columnDef.params || {};
        if (!params.formatters || !Array.isArray(params.formatters)) {
            throw new Error("The multiple formatter requires the \"formatters\" to be provided as a column params.\n    For example: this.columnDefinitions = [{ id: title, field: title, formatter: Formatters.multiple, params: { formatters: [Formatters.lowercase, Formatters.uppercase] }");
        }
        var formatters = params.formatters;
        var formattedValue = '';
        for (var _i = 0, formatters_1 = formatters; _i < formatters_1.length; _i++) {
            var formatter = formatters_1[_i];
            formattedValue = formatter(row, cell, value, columnDef, dataContext);
        }
        return formattedValue;
    };
});
//# sourceMappingURL=multipleFormatter.js.map