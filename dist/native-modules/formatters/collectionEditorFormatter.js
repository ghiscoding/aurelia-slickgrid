import { arrayToCsvFormatter } from './arrayToCsvFormatter';
import { findOrDefault } from '../services/index';
/**
 * A formatter to show the label property value of a internalColumnEditor collection
 */
export var collectionEditorFormatter = function (row, cell, value, columnDef, dataContext) {
    if (!value || !columnDef || !columnDef.internalColumnEditor || !columnDef.internalColumnEditor.collection
        || !columnDef.internalColumnEditor.collection.length) {
        return '';
    }
    var internalColumnEditor = columnDef.internalColumnEditor, collection = columnDef.internalColumnEditor.collection;
    var labelName = (internalColumnEditor.customStructure) ? internalColumnEditor.customStructure.label : 'label';
    var valueName = (internalColumnEditor.customStructure) ? internalColumnEditor.customStructure.value : 'value';
    if (Array.isArray(value)) {
        return arrayToCsvFormatter(row, cell, value.map(function (v) { return findOrDefault(collection, function (c) { return c[valueName] === v; })[labelName]; }), columnDef, dataContext);
    }
    return findOrDefault(collection, function (c) { return c[valueName] === value; })[labelName] || '';
};
//# sourceMappingURL=collectionEditorFormatter.js.map