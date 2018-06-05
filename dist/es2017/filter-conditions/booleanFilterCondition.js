function parseBoolean(input) {
    return /(true|1)/i.test(input + '');
}
export const booleanFilterCondition = (options) => {
    const searchTerm = Array.isArray(options.searchTerms) && options.searchTerms[0] || '';
    return parseBoolean(options.cellValue) === parseBoolean(searchTerm);
};
//# sourceMappingURL=booleanFilterCondition.js.map