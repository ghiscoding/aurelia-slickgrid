"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arrayToCsvFormatter_1 = require("./arrayToCsvFormatter");
var index_1 = require("../services/index");
/**
 * A formatter to show the label property value of a internalColumnEditor collection
 */
exports.collectionEditorFormatter = function (row, cell, value, columnDef, dataContext) {
    if (!value || !columnDef || !columnDef.internalColumnEditor || !columnDef.internalColumnEditor.collection
        || !columnDef.internalColumnEditor.collection.length) {
        return '';
    }
    var internalColumnEditor = columnDef.internalColumnEditor, collection = columnDef.internalColumnEditor.collection;
    var labelName = (internalColumnEditor.customStructure) ? internalColumnEditor.customStructure.label : 'label';
    var valueName = (internalColumnEditor.customStructure) ? internalColumnEditor.customStructure.value : 'value';
    if (Array.isArray(value)) {
        if (collection.every(function (x) { return typeof x === 'string'; })) {
            return arrayToCsvFormatter_1.arrayToCsvFormatter(row, cell, value.map(function (v) { return index_1.findOrDefault(collection, function (c) { return c === v; }); }), columnDef, dataContext);
        }
        else {
            return arrayToCsvFormatter_1.arrayToCsvFormatter(row, cell, value.map(function (v) { return index_1.findOrDefault(collection, function (c) { return c[valueName] === v; })[labelName]; }), columnDef, dataContext);
        }
    }
    return index_1.findOrDefault(collection, function (c) { return c[valueName] === value; })[labelName] || '';
};
//# sourceMappingURL=collectionEditorFormatter.js.map