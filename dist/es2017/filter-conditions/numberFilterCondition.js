import { testFilterCondition } from './filterUtilities';
export const numberFilterCondition = (options) => {
    const cellValue = parseFloat(options.cellValue);
    const searchTerm = (typeof options.searchTerm === 'string') ? parseFloat(options.searchTerm) : options.searchTerm;
    return testFilterCondition(options.operator || '==', cellValue, searchTerm);
};
//# sourceMappingURL=numberFilterCondition.js.map