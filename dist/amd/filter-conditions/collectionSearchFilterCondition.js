define(["require", "exports", "./filterUtilities"], function (require, exports, filterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.collectionSearchFilterCondition = function (options) {
        // multiple-select will always return text, so we should make our cell values text as well
        var cellValue = options.cellValue + '';
        return filterUtilities_1.testFilterCondition(options.operator || 'IN', cellValue, options.searchTerms || []);
    };
});
//# sourceMappingURL=collectionSearchFilterCondition.js.map