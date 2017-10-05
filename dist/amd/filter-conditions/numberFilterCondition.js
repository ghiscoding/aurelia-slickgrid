define(["require", "exports", "./filterUtilities"], function (require, exports, filterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.numberFilterCondition = function (options) {
        return filterUtilities_1.testFilterCondition(options.operator || '==', parseFloat(options.cellValue), parseFloat(options.searchTerm));
    };
});
