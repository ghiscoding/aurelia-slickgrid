System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var percentCompleteBarFormatter;
    return {
        setters: [],
        execute: function () {
            exports_1("percentCompleteBarFormatter", percentCompleteBarFormatter = function (row, cell, value, columnDef, dataContext) {
                if (value === null || value === '') {
                    return '';
                }
                var color;
                if (value < 30) {
                    color = 'red';
                }
                else if (value < 70) {
                    color = 'silver';
                }
                else {
                    color = 'green';
                }
                return "<span class=\"percent-complete-bar\" style=\"background:" + color + "; width:" + value + "%\"></span>";
            });
        }
    };
});
//# sourceMappingURL=percentCompleteBarFormatter.js.map