import { arrayToCsvFormatter } from './arrayToCsvFormatter';
/**
 * A formatter to show the label property value of a filter.collection
 */
export var collectionFormatter = function (row, cell, value, columnDef, dataContext) {
    if (!value || !columnDef || !columnDef.filter || !columnDef.filter.collection
        || !columnDef.filter.collection.length) {
        return '';
    }
    var filter = columnDef.filter, collection = columnDef.filter.collection;
    var labelName = (filter.customStructure) ? filter.customStructure.label : 'label';
    var valueName = (filter.customStructure) ? filter.customStructure.value : 'value';
    if (Array.isArray(value)) {
        return arrayToCsvFormatter(row, cell, value.map(function (v) { return collection.findOrDefault(function (c) { return c[valueName] === v; })[labelName]; }), columnDef, dataContext);
    }
    return collection.findOrDefault(function (c) { return c[valueName] === value; })[labelName] || '';
};
//# sourceMappingURL=collectionFormatter.js.map