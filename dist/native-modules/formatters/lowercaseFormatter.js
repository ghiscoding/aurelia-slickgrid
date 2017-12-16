export var lowercaseFormatter = function (row, cell, value, columnDef, dataContext) {
    return (value && typeof value === 'string') ? value.toLowerCase() : value;
};
//# sourceMappingURL=lowercaseFormatter.js.map