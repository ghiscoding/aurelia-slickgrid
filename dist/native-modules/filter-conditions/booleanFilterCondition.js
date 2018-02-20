function parseBoolean(input) {
    return /(true|1)/i.test(input + '');
}
export var booleanFilterCondition = function (options) {
    return parseBoolean(options.cellValue) === parseBoolean(options.searchTerm || false);
};
//# sourceMappingURL=booleanFilterCondition.js.map