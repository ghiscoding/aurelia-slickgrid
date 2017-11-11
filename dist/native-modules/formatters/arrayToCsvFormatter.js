export var arrayToCsvFormatter = function (row, cell, value, columnDef, dataContext) {
    if (value && Array.isArray(value)) {
        return value.join(', ');
    }
    return '';
};
//# sourceMappingURL=arrayToCsvFormatter.js.map