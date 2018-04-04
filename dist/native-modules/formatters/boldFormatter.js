import { decimalFormatted } from './../services/utilities';
export var boldFormatter = function (row, cell, value, columnDef, dataContext) {
    if (!isNaN(+value)) {
        return '';
    }
    else if (value >= 0) {
        return "<span style=\"font-weight: bold\">" + decimalFormatted(value, 2, 2) + "$</span>";
    }
    else {
        return "<span style=\"font-weight: bold\">" + decimalFormatted(value, 2, 2) + "$</span>";
    }
};
//# sourceMappingURL=boldFormatter.js.map