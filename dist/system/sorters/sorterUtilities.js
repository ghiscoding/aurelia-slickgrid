System.register(["./../models/fieldType.enum", "./index", "moment"], function (exports_1, context_1) {
    "use strict";
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
    exports_1("compareDates", compareDates);
    var fieldType_enum_1, index_1, moment;
    return {
        setters: [
            function (fieldType_enum_1_1) {
                fieldType_enum_1 = fieldType_enum_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (moment_1) {
                moment = moment_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=sorterUtilities.js.map