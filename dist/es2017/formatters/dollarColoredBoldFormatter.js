import { decimalFormatted } from './../services/utilities';
export const dollarColoredBoldFormatter = (row, cell, value, columnDef, dataContext) => {
    if (isNaN(+value)) {
        return '';
    }
    else if (value >= 0) {
        return `<span style="color:green; font-weight: bold;">$${decimalFormatted(value, 2, 2)}</span>`;
    }
    else {
        return `<span style="color:red; font-weight: bold;">$${decimalFormatted(value, 2, 2)}</span>`;
    }
};
//# sourceMappingURL=dollarColoredBoldFormatter.js.map