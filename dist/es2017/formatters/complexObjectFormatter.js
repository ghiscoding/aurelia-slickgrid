export const complexObjectFormatter = (row, cell, value, columnDef, dataContext) => {
    if (!columnDef) {
        return '';
    }
    const complexField = columnDef.field || '';
    return complexField.split('.').reduce((obj, i) => (obj ? obj[i] : ''), dataContext);
};
//# sourceMappingURL=complexObjectFormatter.js.map