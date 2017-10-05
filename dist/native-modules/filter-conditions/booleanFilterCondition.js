function parseBoolean(str) {
    return /(true|1)/i.test(str);
}
export var booleanFilterCondition = function (options) {
    return parseBoolean(options.cellValue) === parseBoolean(options.searchTerm);
};
