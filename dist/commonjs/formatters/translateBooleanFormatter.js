"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Takes a boolean value, cast it to upperCase string and finally translates (i18n) it */
exports.translateBooleanFormatter = function (row, cell, value, columnDef, dataContext, grid) {
    var gridOptions = (grid && typeof grid.getOptions === 'function') ? grid.getOptions() : {};
    var columnParams = columnDef.params || {};
    var gridParams = gridOptions.params || {};
    var i18n = gridParams.i18n || columnParams.i18n;
    if (!i18n || typeof i18n.tr !== 'function') {
        throw new Error("The translate formatter requires the \"I18N\" Service to be provided as a Grid Options or Column Definition \"params\".\n    For example: this.gridOptions = { enableTranslate: true, params: { i18n: this.i18n }}");
    }
    // make sure the value is a string (for example a boolean value would throw an error)
    if (value !== undefined && typeof value !== 'string') {
        value = value + '';
    }
    return value ? i18n.tr(value.toUpperCase()) : '';
};
//# sourceMappingURL=translateBooleanFormatter.js.map