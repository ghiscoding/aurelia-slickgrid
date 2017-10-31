define(["require", "exports", "./../models/index", "./../services/utilities", "moment"], function (require, exports, index_1, utilities_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateUs);
    exports.dateUsFormatter = function (row, cell, value, columnDef, dataContext) {
        return value ? moment(value).format(FORMAT) : '';
    };
});
//# sourceMappingURL=dateUsFormatter.js.map