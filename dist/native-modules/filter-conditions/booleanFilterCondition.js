function parseBoolean(input) {
    return /(true|1)/i.test(input + '');
}
export var booleanFilterCondition = function (options) {
    var searchTerm = Array.isArray(options.searchTerms) && options.searchTerms[0] || '';
    return parseBoolean(options.cellValue) === parseBoolean(searchTerm);
};
//# sourceMappingURL=booleanFilterCondition.js.map