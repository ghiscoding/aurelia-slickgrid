System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var inputFilterTemplate;
    return {
        setters: [],
        execute: function () {
            exports_1("inputFilterTemplate", inputFilterTemplate = function (searchTerm, columnDef) {
                return "<input type=\"text\" class=\"form-control search-filter\" style=\"font-family: Segoe UI Symbol;\" placeholder=\"&#128269;\">";
            });
        }
    };
});
