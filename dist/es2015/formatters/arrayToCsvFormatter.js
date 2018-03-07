export const arrayToCsvFormatter = (row, cell, value, columnDef, dataContext) => {
    if (value && Array.isArray(value)) {
        const values = value.join(', ');
        return `<span title="${values}">${values}</span>`;
    }
    return '';
};
//# sourceMappingURL=arrayToCsvFormatter.js.map