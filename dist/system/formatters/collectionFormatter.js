System.register(["./arrayToCsvFormatter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var arrayToCsvFormatter_1, collectionFormatter;
    return {
        setters: [
            function (arrayToCsvFormatter_1_1) {
                arrayToCsvFormatter_1 = arrayToCsvFormatter_1_1;
            }
        ],
        execute: function () {
            /**
             * A formatter to show the label property value of a filter.collection
             */
            exports_1("collectionFormatter", collectionFormatter = function (row, cell, value, columnDef, dataContext) {
                if (!value || !columnDef || !columnDef.filter || !columnDef.filter.collection
                    || !columnDef.filter.collection.length) {
                    return '';
                }
                var filter = columnDef.filter, collection = columnDef.filter.collection;
                var labelName = (filter.customStructure) ? filter.customStructure.label : 'label';
                var valueName = (filter.customStructure) ? filter.customStructure.value : 'value';
                if (Array.isArray(value)) {
                    return arrayToCsvFormatter_1.arrayToCsvFormatter(row, cell, value.map(function (v) { return collection.findOrDefault(function (c) { return c[valueName] === v; })[labelName]; }), columnDef, dataContext);
                }
                return collection.findOrDefault(function (c) { return c[valueName] === value; })[labelName] || '';
            });
        }
    };
});
//# sourceMappingURL=collectionFormatter.js.map