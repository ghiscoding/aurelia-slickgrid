export var complexObjectFormatter = function (row, cell, value, columnDef, dataContext) {
    if (!columnDef) {
        return '';
    }
    var complexField = columnDef.field || '';
    return complexField.split('.').reduce(function (obj, i) { return (obj ? obj[i] : ''); }, dataContext);
};
//# sourceMappingURL=complexObjectFormatter.js.map