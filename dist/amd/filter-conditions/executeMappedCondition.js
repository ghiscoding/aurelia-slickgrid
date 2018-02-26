define(["require", "exports", "./booleanFilterCondition", "./dateFilterCondition", "./dateIsoFilterCondition", "./dateUsShortFilterCondition", "./dateUsFilterCondition", "./dateUtcFilterCondition", "./collectionSearchFilterCondition", "./numberFilterCondition", "./stringFilterCondition", "../models/index"], function (require, exports, booleanFilterCondition_1, dateFilterCondition_1, dateIsoFilterCondition_1, dateUsShortFilterCondition_1, dateUsFilterCondition_1, dateUtcFilterCondition_1, collectionSearchFilterCondition_1, numberFilterCondition_1, stringFilterCondition_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.executeMappedCondition = function (options) {
        // when using a multi-select ('IN' operator) we will not use the field type but instead go directly with a collection search
        if (options && options.operator && options.operator.toUpperCase() === 'IN') {
            return collectionSearchFilterCondition_1.collectionSearchFilterCondition(options);
        }
        // execute the mapped type, or default to String condition check
        switch (options.fieldType) {
            case index_1.FieldType.boolean:
                return booleanFilterCondition_1.booleanFilterCondition(options);
            case index_1.FieldType.date:
                return dateFilterCondition_1.dateFilterCondition(options);
            case index_1.FieldType.dateUtc:
                return dateUtcFilterCondition_1.dateUtcFilterCondition(options);
            case index_1.FieldType.dateIso:
                return dateIsoFilterCondition_1.dateIsoFilterCondition(options);
            case index_1.FieldType.dateUs:
            case index_1.FieldType.dateTimeUs:
                return dateUsFilterCondition_1.dateUsFilterCondition(options);
            case index_1.FieldType.dateUsShort:
            case index_1.FieldType.dateTimeUsShort:
                return dateUsShortFilterCondition_1.dateUsShortFilterCondition(options);
            case index_1.FieldType.number:
                return numberFilterCondition_1.numberFilterCondition(options);
            case index_1.FieldType.string:
            default:
                return stringFilterCondition_1.stringFilterCondition(options);
        }
    };
});
//# sourceMappingURL=executeMappedCondition.js.map