import { arrayToCsvFormatter } from './arrayToCsvFormatter';
/**
 * A formatter to show the label property value of a filter.collection
 */
export const collectionFormatter = (row, cell, value, columnDef, dataContext) => {
    if (!value || !columnDef || !columnDef.filter || !columnDef.filter.collection
        || !columnDef.filter.collection.length) {
        return '';
    }
    const { filter, filter: { collection } } = columnDef;
    const labelName = (filter.customStructure) ? filter.customStructure.label : 'label';
    const valueName = (filter.customStructure) ? filter.customStructure.value : 'value';
    if (Array.isArray(value)) {
        return arrayToCsvFormatter(row, cell, value.map((v) => collection.findOrDefault((c) => c[valueName] === v)[labelName]), columnDef, dataContext);
    }
    return collection.findOrDefault((c) => c[valueName] === value)[labelName] || '';
};
//# sourceMappingURL=collectionFormatter.js.map