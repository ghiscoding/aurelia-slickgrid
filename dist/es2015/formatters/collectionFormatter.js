import { arrayToCsvFormatter } from './arrayToCsvFormatter';
import { findOrDefault } from '../services/index';
/**
 * A formatter to show the label property value of a params collection
 */
export const collectionFormatter = (row, cell, value, columnDef, dataContext) => {
    if (!value || !columnDef || !columnDef.params || !columnDef.params.collection
        || !columnDef.params.collection.length) {
        return '';
    }
    const { params, params: { collection } } = columnDef;
    const labelName = (params.customStructure) ? params.customStructure.label : 'label';
    const valueName = (params.customStructure) ? params.customStructure.value : 'value';
    if (Array.isArray(value)) {
        return arrayToCsvFormatter(row, cell, value.map((v) => findOrDefault(collection, (c) => c[valueName] === v)[labelName]), columnDef, dataContext);
    }
    return findOrDefault(collection, (c) => c[valueName] === value)[labelName] || '';
};
//# sourceMappingURL=collectionFormatter.js.map