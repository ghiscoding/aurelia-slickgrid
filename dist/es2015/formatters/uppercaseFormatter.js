export const uppercaseFormatter = (row, cell, value, columnDef, dataContext) => {
    // make sure the value is a string
    if (value !== undefined && typeof value !== 'string') {
        value = value + '';
    }
    return value ? value.toUpperCase() : '';
};
//# sourceMappingURL=uppercaseFormatter.js.map