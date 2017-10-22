System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var selectFilterTemplate;
    return {
        setters: [],
        execute: function () {
            exports_1("selectFilterTemplate", selectFilterTemplate = function (searchTerm, columnDef) {
                if (!columnDef.filter.selectOptions) {
                    throw new Error("SelectOptions with value/label is required to populate the Select list, for example:: { filter: type: FormElementType.select, selectOptions: [ { value: '1', label: 'One' } ]')");
                }
                var options = '';
                columnDef.filter.selectOptions.forEach(function (option) {
                    options += "<option value=\"" + option.value + "\">" + option.label + "</option>";
                });
                return "<select id=\"search-" + columnDef.id + "\" class=\"form-control\">" + options + "</select>";
            });
        }
    };
});
//# sourceMappingURL=selectFilterTemplate.js.map