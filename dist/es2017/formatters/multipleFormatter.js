export const multipleFormatter = (row, cell, value, columnDef, dataContext) => {
    const params = columnDef.params || {};
    if (!params.formatters || !Array.isArray(params.formatters)) {
        throw new Error(`The multiple formatter requires the "formatters" to be provided as a column params.
    For example: this.columnDefinitions = [{ id: title, field: title, formatter: Formatters.multiple, params: { formatters: [Formatters.lowercase, Formatters.uppercase] }`);
    }
    const formatters = params.formatters;
    let formattedValue = '';
    for (const formatter of formatters) {
        formattedValue = formatter(row, cell, value, columnDef, dataContext);
    }
    return formattedValue;
};
//# sourceMappingURL=multipleFormatter.js.map