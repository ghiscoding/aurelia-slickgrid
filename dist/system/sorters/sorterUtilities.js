System.register(["./../models/fieldType.enum", "./index"], function (exports_1, context_1) {
    "use strict";
    var fieldType_enum_1, index_1;
    var __moduleName = context_1 && context_1.id;
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
    exports_1("sortByFieldType", sortByFieldType);
    return {
        setters: [
            function (fieldType_enum_1_1) {
                fieldType_enum_1 = fieldType_enum_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=sorterUtilities.js.map