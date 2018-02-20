"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseBoolean(input) {
    return /(true|1)/i.test(input + '');
}
exports.booleanFilterCondition = function (options) {
    return parseBoolean(options.cellValue) === parseBoolean(options.searchTerm || false);
};
//# sourceMappingURL=booleanFilterCondition.js.map