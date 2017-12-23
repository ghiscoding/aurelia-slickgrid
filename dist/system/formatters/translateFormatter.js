System.register(["aurelia-i18n"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var aurelia_i18n_1, translateFormatter;
    return {
        setters: [
            function (aurelia_i18n_1_1) {
                aurelia_i18n_1 = aurelia_i18n_1_1;
            }
        ],
        execute: function () {
            exports_1("translateFormatter", translateFormatter = function (row, cell, value, columnDef, dataContext) {
                var params = columnDef.params || {};
                if (!params.i18n || !(params.i18n instanceof aurelia_i18n_1.I18N)) {
                    throw new Error("The translate formatter requires the \"i18n\" to be provided as a column params.\n    For example: this.columnDefinitions = [{ id: title, field: title, formatter: Formatters.translate, params: { i18n: this.i18n }");
                }
                return params.i18n.tr(value);
            });
        }
    };
});
//# sourceMappingURL=translateFormatter.js.map