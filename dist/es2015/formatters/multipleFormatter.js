export const multipleFormatter = (row, cell, value, columnDef, dataContext, grid) => {
    const params = columnDef.params || {};
    if (!params.formatters || !Array.isArray(params.formatters)) {
        throw new Error(`The multiple formatter requires the "formatters" to be provided as a column params.
    For example: this.columnDefinitions = [{ id: title, field: title, formatter: Formatters.multiple, params: { formatters: [Formatters.lowercase, Formatters.uppercase] }`);
    }
    const formatters = params.formatters;
    // loop through all Formatters, the value of 1st formatter will be used by 2nd formatter and so on.
    // they are piped and executed in sequences
    let currentValue = value;
    for (const formatter of formatters) {
        currentValue = formatter(row, cell, currentValue, columnDef, dataContext, grid);
    }
    return currentValue;
};
//# sourceMappingURL=multipleFormatter.js.map