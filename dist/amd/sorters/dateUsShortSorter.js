define(["require", "exports", "./../services/utilities", "./../models/index", "./sorterUtilities"], function (require, exports, utilities_1, index_1, sorterUtilities_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUsShort);
    exports.dateUsShortSorter = function (value1, value2, sortDirection) {
        return sorterUtilities_1.compareDates(sortDirection, value1, value2, FORMAT, true);
    };
});
//# sourceMappingURL=dateUsShortSorter.js.map