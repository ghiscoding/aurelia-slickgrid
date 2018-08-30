define(["require", "exports", "./../models/index", "./../services/utilities", "moment"], function (require, exports, index_1, utilities_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(index_1.FieldType.dateTimeShortIso);
    exports.dateTimeShortIsoFormatter = function (row, cell, value, columnDef, dataContext) {
        var isDateValid = moment(value, FORMAT, false).isValid();
        return (value && isDateValid) ? moment(value).format(FORMAT) : value;
    };
});
//# sourceMappingURL=dateTimeShortIsoFormatter.js.map