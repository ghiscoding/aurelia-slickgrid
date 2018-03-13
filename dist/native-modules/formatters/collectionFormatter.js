import { arrayToCsvFormatter } from './arrayToCsvFormatter';
import { findOrDefault } from '../services/index';
/**
 * A formatter to show the label property value of a params collection
 */
export var collectionFormatter = function (row, cell, value, columnDef, dataContext) {
    if (!value || !columnDef || !columnDef.params || !columnDef.params.collection
        || !columnDef.params.collection.length) {
        return '';
    }
    var params = columnDef.params, collection = columnDef.params.collection;
    var labelName = (params.customStructure) ? params.customStructure.label : 'label';
    var valueName = (params.customStructure) ? params.customStructure.value : 'value';
    if (Array.isArray(value)) {
        return arrayToCsvFormatter(row, cell, value.map(function (v) { return findOrDefault(collection, function (c) { return c[valueName] === v; })[labelName]; }), columnDef, dataContext);
    }
    return findOrDefault(collection, function (c) { return c[valueName] === value; })[labelName] || '';
};
//# sourceMappingURL=collectionFormatter.js.map