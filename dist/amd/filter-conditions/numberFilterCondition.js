define(["require", "exports", "./filterUtilities"], function (require, exports, filterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.numberFilterCondition = function (options) {
        var cellValue = parseFloat(options.cellValue);
        var searchTerm = (typeof options.searchTerm === 'string') ? parseFloat(options.searchTerm) : options.searchTerm;
        return filterUtilities_1.testFilterCondition(options.operator || '==', cellValue, searchTerm);
    };
});
//# sourceMappingURL=numberFilterCondition.js.map