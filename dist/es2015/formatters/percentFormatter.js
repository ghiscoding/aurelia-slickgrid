export const percentFormatter = (row, cell, value, columnDef, dataContext) => {
    if (value === null || value === '') {
        return '';
    }
    const outputValue = value > 0 ? value / 100 : 0;
    return `<span>${outputValue}%</span>`;
};
//# sourceMappingURL=percentFormatter.js.map