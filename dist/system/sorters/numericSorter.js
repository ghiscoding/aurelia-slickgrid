System.register([], function (exports_1, context_1) {
    "use strict";
    var numericSorter;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [],
        execute: function () {
            exports_1("numericSorter", numericSorter = function (value1, value2, sortDirection) {
                var x = (isNaN(value1) || value1 === '' || value1 === null) ? -99e+10 : parseFloat(value1);
                var y = (isNaN(value2) || value2 === '' || value2 === null) ? -99e+10 : parseFloat(value2);
                return sortDirection * (x === y ? 0 : (x > y ? 1 : -1));
            });
        }
    };
});
//# sourceMappingURL=numericSorter.js.map