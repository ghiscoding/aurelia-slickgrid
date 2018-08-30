import { decimalFormatted } from './../services/utilities';
export const boldFormatter = (row, cell, value, columnDef, dataContext) => {
    const isNumber = (value === null || value === undefined) ? false : !isNaN(+value);
    if (!isNumber) {
        return '';
    }
    else if (value >= 0) {
        return `<span style="font-weight: bold">${decimalFormatted(value, 2, 2)}$</span>`;
    }
    else {
        return `<span style="font-weight: bold">${decimalFormatted(value, 2, 2)}$</span>`;
    }
};
//# sourceMappingURL=boldFormatter.js.map