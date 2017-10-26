define(["require", "exports", "./dateUtcFilterCondition", "./booleanFilterCondition", "./dateIsoFilterCondition", "./dateUsShortFilterCondition", "./dateUsFilterCondition", "./dateFilterCondition", "./numberFilterCondition", "./stringFilterCondition", "../models"], function (require, exports, dateUtcFilterCondition_1, booleanFilterCondition_1, dateIsoFilterCondition_1, dateUsShortFilterCondition_1, dateUsFilterCondition_1, dateFilterCondition_1, numberFilterCondition_1, stringFilterCondition_1, models_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executeMappedCondition = function (options) {
        // execute the mapped type, or default to String condition check
        switch (options.fieldType) {
            case models_1.FieldType.boolean:
                return booleanFilterCondition_1.booleanFilterCondition(options);
            case models_1.FieldType.date:
                return dateFilterCondition_1.dateFilterCondition(options);
            case models_1.FieldType.dateUtc:
                return dateUtcFilterCondition_1.dateUtcFilterCondition(options);
            case models_1.FieldType.dateIso:
                return dateIsoFilterCondition_1.dateIsoFilterCondition(options);
            case models_1.FieldType.dateUs:
            case models_1.FieldType.dateTimeUs:
                return dateUsFilterCondition_1.dateUsFilterCondition(options);
            case models_1.FieldType.dateUsShort:
            case models_1.FieldType.dateTimeUsShort:
                return dateUsShortFilterCondition_1.dateUsShortFilterCondition(options);
            case models_1.FieldType.number:
                return numberFilterCondition_1.numberFilterCondition(options);
            case models_1.FieldType.string:
            default:
                return stringFilterCondition_1.stringFilterCondition(options);
        }
    };
});
//# sourceMappingURL=executeMappedCondition.js.map