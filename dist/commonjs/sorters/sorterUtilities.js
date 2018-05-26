"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fieldType_enum_1 = require("./../models/fieldType.enum");
var index_1 = require("./index");
var moment = require("moment");
function sortByFieldType(value1, value2, fieldType, sortDirection) {
    var sortResult = 0;
    switch (fieldType) {
        case fieldType_enum_1.FieldType.number:
            sortResult = index_1.Sorters.numeric(value1, value2, sortDirection);
            break;
        case fieldType_enum_1.FieldType.date:
            sortResult = index_1.Sorters.date(value1, value2, sortDirection);
            break;
        case fieldType_enum_1.FieldType.dateIso:
            sortResult = index_1.Sorters.dateIso(value1, value2, sortDirection);
            break;
        case fieldType_enum_1.FieldType.dateUs:
            sortResult = index_1.Sorters.dateUs(value1, value2, sortDirection);
            break;
        case fieldType_enum_1.FieldType.dateUsShort:
            sortResult = index_1.Sorters.dateUsShort(value1, value2, sortDirection);
            break;
        default:
            sortResult = index_1.Sorters.string(value1, value2, sortDirection);
            break;
    }
    return sortResult;
}
exports.sortByFieldType = sortByFieldType;
function compareDates(sortDirection, value1, value2, format, strict) {
    var diff = 0;
    if (value1 === null || value1 === '' || !moment(value1, format, strict).isValid()) {
        diff = -1;
    }
    else if (value2 === null || value2 === '' || !moment(value2, format, strict).isValid()) {
        diff = 1;
    }
    else {
        var date1 = moment(value1, format, strict);
        var date2 = moment(value2, format, strict);
        diff = parseInt(date1.format('X'), 10) - parseInt(date2.format('X'), 10);
    }
    return sortDirection * (diff === 0 ? 0 : (diff > 0 ? 1 : -1));
}
exports.compareDates = compareDates;
//# sourceMappingURL=sorterUtilities.js.map