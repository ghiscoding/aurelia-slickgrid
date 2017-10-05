"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseBoolean(str) {
    return /(true|1)/i.test(str);
}
exports.booleanFilterCondition = function (options) {
    return parseBoolean(options.cellValue) === parseBoolean(options.searchTerm);
};
