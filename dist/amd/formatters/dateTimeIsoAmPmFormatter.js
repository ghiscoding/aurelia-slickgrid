define(["require", "exports", "./../models", "./../services/utilities", "moment"], function (require, exports, models_1, utilities_1, moment) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FORMAT = utilities_1.mapMomentDateFormatWithFieldType(models_1.FieldType.dateTimeIsoAmPm);
    exports.dateTimeIsoAmPmFormatter = function (row, cell, value, columnDef, dataContext) {
        return value ? moment(value).format(FORMAT) : '';
    };
});
//# sourceMappingURL=dateTimeIsoAmPmFormatter.js.map