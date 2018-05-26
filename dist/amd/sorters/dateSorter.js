define(["require", "exports", "moment", "./sorterUtilities"], function (require, exports, moment, sorterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dateSorter = function (value1, value2, sortDirection) {
        return sorterUtilities_1.compareDates(sortDirection, value1, value2, moment.ISO_8601);
    };
});
//# sourceMappingURL=dateSorter.js.map