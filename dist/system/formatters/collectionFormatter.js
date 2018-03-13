System.register(["./arrayToCsvFormatter", "../services/index"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var arrayToCsvFormatter_1, index_1, collectionFormatter;
    return {
        setters: [
            function (arrayToCsvFormatter_1_1) {
                arrayToCsvFormatter_1 = arrayToCsvFormatter_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }
        ],
        execute: function () {
            /**
             * A formatter to show the label property value of a params collection
             */
            exports_1("collectionFormatter", collectionFormatter = function (row, cell, value, columnDef, dataContext) {
                if (!value || !columnDef || !columnDef.params || !columnDef.params.collection
                    || !columnDef.params.collection.length) {
                    return '';
                }
                var params = columnDef.params, collection = columnDef.params.collection;
                var labelName = (params.customStructure) ? params.customStructure.label : 'label';
                var valueName = (params.customStructure) ? params.customStructure.value : 'value';
                if (Array.isArray(value)) {
                    return arrayToCsvFormatter_1.arrayToCsvFormatter(row, cell, value.map(function (v) { return index_1.findOrDefault(collection, function (c) { return c[valueName] === v; })[labelName]; }), columnDef, dataContext);
                }
                return index_1.findOrDefault(collection, function (c) { return c[valueName] === value; })[labelName] || '';
            });
        }
    };
});
//# sourceMappingURL=collectionFormatter.js.map