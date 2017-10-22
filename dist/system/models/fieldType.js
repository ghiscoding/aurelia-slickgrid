System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FieldType;
    return {
        setters: [],
        execute: function () {
            (function (FieldType) {
                FieldType[FieldType["unknown"] = 0] = "unknown";
                FieldType[FieldType["string"] = 1] = "string";
                FieldType[FieldType["boolean"] = 2] = "boolean";
                FieldType[FieldType["number"] = 3] = "number";
                FieldType[FieldType["date"] = 4] = "date";
                FieldType[FieldType["dateIso"] = 5] = "dateIso";
                FieldType[FieldType["dateUtc"] = 6] = "dateUtc";
                FieldType[FieldType["dateTime"] = 7] = "dateTime";
                FieldType[FieldType["dateTimeIso"] = 8] = "dateTimeIso";
                FieldType[FieldType["dateUs"] = 9] = "dateUs";
                FieldType[FieldType["dateUsShort"] = 10] = "dateUsShort";
                FieldType[FieldType["dateTimeUs"] = 11] = "dateTimeUs";
                FieldType[FieldType["dateTimeUsShort"] = 12] = "dateTimeUsShort"; // 2/2/14 11:00:00
            })(FieldType || (FieldType = {}));
            exports_1("FieldType", FieldType);
        }
    };
});
//# sourceMappingURL=fieldType.js.map