"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fieldType_enum_1 = require("./../models/fieldType.enum");
var index_1 = require("./index");
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
//# sourceMappingURL=sorterUtilities.js.map