"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filterUtilities_1 = require("./filterUtilities");
exports.collectionSearchFilterCondition = function (options) {
    // multiple-select will always return text, so we should make our cell values text as well
    var cellValue = options.cellValue + '';
    return filterUtilities_1.testFilterCondition(options.operator || 'IN', cellValue, options.searchTerms || []);
};
//# sourceMappingURL=collectionSearchFilterCondition.js.map