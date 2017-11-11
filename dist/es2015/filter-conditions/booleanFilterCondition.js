function parseBoolean(str) {
    return /(true|1)/i.test(str);
}
export const booleanFilterCondition = (options) => {
    return parseBoolean(options.cellValue) === parseBoolean(options.searchTerm);
};
//# sourceMappingURL=booleanFilterCondition.js.map