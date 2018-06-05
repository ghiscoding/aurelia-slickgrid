import { arrayToCsvFormatter } from './arrayToCsvFormatter';
import { findOrDefault } from '../services/index';
/**
 * A formatter to show the label property value of a internalColumnEditor collection
 */
export const collectionEditorFormatter = (row, cell, value, columnDef, dataContext) => {
    if (!value || !columnDef || !columnDef.internalColumnEditor || !columnDef.internalColumnEditor.collection
        || !columnDef.internalColumnEditor.collection.length) {
        return '';
    }
    const { internalColumnEditor, internalColumnEditor: { collection } } = columnDef;
    const labelName = (internalColumnEditor.customStructure) ? internalColumnEditor.customStructure.label : 'label';
    const valueName = (internalColumnEditor.customStructure) ? internalColumnEditor.customStructure.value : 'value';
    if (Array.isArray(value)) {
        return arrayToCsvFormatter(row, cell, value.map((v) => findOrDefault(collection, (c) => c[valueName] === v)[labelName]), columnDef, dataContext);
    }
    return findOrDefault(collection, (c) => c[valueName] === value)[labelName] || '';
};
//# sourceMappingURL=collectionEditorFormatter.js.map