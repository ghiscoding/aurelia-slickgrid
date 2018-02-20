"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var booleanFilterCondition_1 = require("./booleanFilterCondition");
var dateFilterCondition_1 = require("./dateFilterCondition");
var dateIsoFilterCondition_1 = require("./dateIsoFilterCondition");
var dateUsShortFilterCondition_1 = require("./dateUsShortFilterCondition");
var dateUsFilterCondition_1 = require("./dateUsFilterCondition");
var dateUtcFilterCondition_1 = require("./dateUtcFilterCondition");
var collectionSearchFilterCondition_1 = require("./collectionSearchFilterCondition");
var numberFilterCondition_1 = require("./numberFilterCondition");
var stringFilterCondition_1 = require("./stringFilterCondition");
var fieldType_enum_1 = require("../models/fieldType.enum");
exports.executeMappedCondition = function (options) {
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
};
//# sourceMappingURL=executeMappedCondition.js.map