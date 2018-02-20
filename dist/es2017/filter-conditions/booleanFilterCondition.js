function parseBoolean(input) {
    return /(true|1)/i.test(input + '');
}
export const booleanFilterCondition = (options) => {
    return parseBoolean(options.cellValue) === parseBoolean(options.searchTerm || false);
};
//# sourceMappingURL=booleanFilterCondition.js.map