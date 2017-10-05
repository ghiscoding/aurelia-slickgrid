System.register(["./dateUtcFilterCondition", "./booleanFilterCondition", "./dateIsoFilterCondition", "./dateUsShortFilterCondition", "./dateUsFilterCondition", "./dateFilterCondition", "./numberFilterCondition", "./stringFilterCondition", "../models/fieldType"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var dateUtcFilterCondition_1, booleanFilterCondition_1, dateIsoFilterCondition_1, dateUsShortFilterCondition_1, dateUsFilterCondition_1, dateFilterCondition_1, numberFilterCondition_1, stringFilterCondition_1, fieldType_1, executeMappedCondition;
    return {
        setters: [
            function (dateUtcFilterCondition_1_1) {
                dateUtcFilterCondition_1 = dateUtcFilterCondition_1_1;
            },
            function (booleanFilterCondition_1_1) {
                booleanFilterCondition_1 = booleanFilterCondition_1_1;
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
            function (dateFilterCondition_1_1) {
                dateFilterCondition_1 = dateFilterCondition_1_1;
            },
            function (numberFilterCondition_1_1) {
                numberFilterCondition_1 = numberFilterCondition_1_1;
            },
            function (stringFilterCondition_1_1) {
                stringFilterCondition_1 = stringFilterCondition_1_1;
            },
            function (fieldType_1_1) {
                fieldType_1 = fieldType_1_1;
            }
        ],
        execute: function () {
            exports_1("executeMappedCondition", executeMappedCondition = function (options) {
                // execute the mapped type, or default to String condition check
                switch (options.fieldType) {
                    case fieldType_1.FieldType.boolean:
                        return booleanFilterCondition_1.booleanFilterCondition(options);
                    case fieldType_1.FieldType.date:
                        return dateFilterCondition_1.dateFilterCondition(options);
                    case fieldType_1.FieldType.dateUtc:
                        return dateUtcFilterCondition_1.dateUtcFilterCondition(options);
                    case fieldType_1.FieldType.dateIso:
                        return dateIsoFilterCondition_1.dateIsoFilterCondition(options);
                    case fieldType_1.FieldType.dateUs:
                    case fieldType_1.FieldType.dateTimeUs:
                        return dateUsFilterCondition_1.dateUsFilterCondition(options);
                    case fieldType_1.FieldType.dateUsShort:
                    case fieldType_1.FieldType.dateTimeUsShort:
                        return dateUsShortFilterCondition_1.dateUsShortFilterCondition(options);
                    case fieldType_1.FieldType.number:
                        return numberFilterCondition_1.numberFilterCondition(options);
                    case fieldType_1.FieldType.string:
                    default:
                        return stringFilterCondition_1.stringFilterCondition(options);
                }
            });
        }
    };
});
