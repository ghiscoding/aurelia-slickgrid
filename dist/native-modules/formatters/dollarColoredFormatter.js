import { decimalFormatted } from './../services/utilities';
export var dollarColoredFormatter = function (row, cell, value, columnDef, dataContext) {
    if (isNaN(+value)) {
        return '';
    }
    else if (value >= 0) {
        return "<span style=\"color:green;\">$" + decimalFormatted(value, 2, 2) + "</span>";
    }
    else {
        return "<span style=\"color:red;\">$" + decimalFormatted(value, 2, 2) + "</span>";
    }
};
//# sourceMappingURL=dollarColoredFormatter.js.map