export const stringSorter = (value1, value2, sortDirection) => {
    return sortDirection * (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1));
};
//# sourceMappingURL=stringSorter.js.map