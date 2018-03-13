"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arrayToCsvFormatter_1 = require("./arrayToCsvFormatter");
var index_1 = require("../services/index");
/**
 * A formatter to show the label property value of a params collection
 */
exports.collectionFormatter = function (row, cell, value, columnDef, dataContext) {
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
};
//# sourceMappingURL=collectionFormatter.js.map