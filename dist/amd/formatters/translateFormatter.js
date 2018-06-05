define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /** Takes a cell value and translates it (i18n). Requires an instance of the I18N Service:: `i18n: this.i18n` */
    exports.translateFormatter = function (row, cell, value, columnDef, dataContext, grid) {
        var gridOptions = (grid && typeof grid.getOptions === 'function') ? grid.getOptions() : {};
        var i18n = gridOptions.i18n || (columnDef.params && columnDef.params.i18n);
        if (!i18n || typeof i18n.tr !== 'function') {
            throw new Error("The translate formatter requires the \"I18N\" Service to be provided as a Grid Options or Column Definition \"i18n\".\n    For example: this.gridOptions = { enableTranslate: true, i18n: this.i18n }");
        }
        // make sure the value is a string (for example a boolean value would throw an error)
        if (value !== undefined && typeof value !== 'string') {
            value = value + '';
        }
        return value ? i18n.tr(value) : '';
    };
});
//# sourceMappingURL=translateFormatter.js.map