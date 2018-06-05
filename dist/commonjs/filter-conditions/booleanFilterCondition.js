"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseBoolean(input) {
    return /(true|1)/i.test(input + '');
}
exports.booleanFilterCondition = function (options) {
    var searchTerm = Array.isArray(options.searchTerms) && options.searchTerms[0] || '';
    return parseBoolean(options.cellValue) === parseBoolean(searchTerm);
};
//# sourceMappingURL=booleanFilterCondition.js.map