"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filterUtilities_1 = require("./filterUtilities");
exports.numberFilterCondition = function (options) {
    var cellValue = parseFloat(options.cellValue);
    var searchTerm = (typeof options.searchTerm === 'string') ? parseFloat(options.searchTerm) : options.searchTerm;
    return filterUtilities_1.testFilterCondition(options.operator || '==', cellValue, searchTerm);
};
//# sourceMappingURL=numberFilterCondition.js.map