System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var translateFormatter;
    return {
        setters: [],
        execute: function () {
            /** Takes a cell value and translates it (i18n). Requires an instance of the I18N Service:: `params: { i18n: this.i18n } */
            exports_1("translateFormatter", translateFormatter = function (row, cell, value, columnDef, dataContext, grid) {
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
                return value ? i18n.tr(value) : '';
            });
        }
    };
});
//# sourceMappingURL=translateFormatter.js.map