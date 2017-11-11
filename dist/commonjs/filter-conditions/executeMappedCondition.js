"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dateUtcFilterCondition_1 = require("./dateUtcFilterCondition");
var booleanFilterCondition_1 = require("./booleanFilterCondition");
var dateIsoFilterCondition_1 = require("./dateIsoFilterCondition");
var dateUsShortFilterCondition_1 = require("./dateUsShortFilterCondition");
var dateUsFilterCondition_1 = require("./dateUsFilterCondition");
var dateFilterCondition_1 = require("./dateFilterCondition");
var numberFilterCondition_1 = require("./numberFilterCondition");
var stringFilterCondition_1 = require("./stringFilterCondition");
var index_1 = require("../models/index");
exports.executeMappedCondition = function (options) {
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
//# sourceMappingURL=executeMappedCondition.js.map