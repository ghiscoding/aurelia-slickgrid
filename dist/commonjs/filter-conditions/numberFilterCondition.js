"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filterUtilities_1 = require("./filterUtilities");
exports.numberFilterCondition = function (options) {
    return filterUtilities_1.testFilterCondition(options.operator || '==', parseFloat(options.cellValue), parseFloat(options.searchTerm));
};
