System.register(["./booleanFilterCondition", "./dateFilterCondition", "./dateIsoFilterCondition", "./dateUsShortFilterCondition", "./dateUsFilterCondition", "./dateUtcFilterCondition", "./collectionSearchFilterCondition", "./numberFilterCondition", "./stringFilterCondition", "../models/fieldType.enum"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var booleanFilterCondition_1, dateFilterCondition_1, dateIsoFilterCondition_1, dateUsShortFilterCondition_1, dateUsFilterCondition_1, dateUtcFilterCondition_1, collectionSearchFilterCondition_1, numberFilterCondition_1, stringFilterCondition_1, fieldType_enum_1, executeMappedCondition;
    return {
        setters: [
            function (booleanFilterCondition_1_1) {
                booleanFilterCondition_1 = booleanFilterCondition_1_1;
            },
            function (dateFilterCondition_1_1) {
                dateFilterCondition_1 = dateFilterCondition_1_1;
            },
            function (dateIsoFilterCondition_1_1) {
                dateIsoFilterCondition_1 = dateIsoFilterCondition_1_1;
            },
            function (dateUsShortFilterCondition_1_1) {
                dateUsShortFilterCondition_1 = dateUsShortFilterCondition_1_1;
            },
            function (dateUsFilterCondition_1_1) {
                dateUsFilterCondition_1 = dateUsFilterCondition_1_1;
            },
            function (dateUtcFilterCondition_1_1) {
                dateUtcFilterCondition_1 = dateUtcFilterCondition_1_1;
            },
            function (collectionSearchFilterCondition_1_1) {
                collectionSearchFilterCondition_1 = collectionSearchFilterCondition_1_1;
            },
            function (numberFilterCondition_1_1) {
                numberFilterCondition_1 = numberFilterCondition_1_1;
            },
            function (stringFilterCondition_1_1) {
                stringFilterCondition_1 = stringFilterCondition_1_1;
            },
            function (fieldType_enum_1_1) {
                fieldType_enum_1 = fieldType_enum_1_1;
            }
        ],
        execute: function () {
            exports_1("executeMappedCondition", executeMappedCondition = function (options) {
                // when using a multi-select ('IN' operator) we will not use the field type but instead go directly with a collection search
                if (options && options.operator && options.operator.toUpperCase() === 'IN') {
                    return collectionSearchFilterCondition_1.collectionSearchFilterCondition(options);
                }
                // execute the mapped type, or default to String condition check
                switch (options.fieldType) {
                    case fieldType_enum_1.FieldType.boolean:
                        return booleanFilterCondition_1.booleanFilterCondition(options);
                    case fieldType_enum_1.FieldType.date:
                        return dateFilterCondition_1.dateFilterCondition(options);
                    case fieldType_enum_1.FieldType.dateUtc:
                        return dateUtcFilterCondition_1.dateUtcFilterCondition(options);
                    case fieldType_enum_1.FieldType.dateIso:
                        return dateIsoFilterCondition_1.dateIsoFilterCondition(options);
                    case fieldType_enum_1.FieldType.dateUs:
                    case fieldType_enum_1.FieldType.dateTimeUs:
                        return dateUsFilterCondition_1.dateUsFilterCondition(options);
                    case fieldType_enum_1.FieldType.dateUsShort:
                    case fieldType_enum_1.FieldType.dateTimeUsShort:
                        return dateUsShortFilterCondition_1.dateUsShortFilterCondition(options);
                    case fieldType_enum_1.FieldType.number:
                        return numberFilterCondition_1.numberFilterCondition(options);
                    case fieldType_enum_1.FieldType.string:
                    default:
                        return stringFilterCondition_1.stringFilterCondition(options);
                }
            });
        }
    };
});
//# sourceMappingURL=executeMappedCondition.js.map