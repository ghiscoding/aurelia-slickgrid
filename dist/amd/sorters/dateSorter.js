define(["require", "exports", "moment", "./compareDateUtility"], function (require, exports, moment, compareDateUtility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dateSorter = function (value1, value2, sortDirection) {
        return compareDateUtility_1.compareDates(value1, value2, sortDirection, moment.ISO_8601);
    };
});
//# sourceMappingURL=dateSorter.js.map