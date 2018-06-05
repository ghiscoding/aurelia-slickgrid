define(["require", "exports", "./../services/utilities", "./../models/index", "./compareDateUtility"], function (require, exports, utilities_1, index_1, compareDateUtility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateIso);
    exports.dateIsoSorter = function (value1, value2, sortDirection) {
        return compareDateUtility_1.compareDates(value1, value2, sortDirection, FORMAT, true);
    };
});
//# sourceMappingURL=dateIsoSorter.js.map