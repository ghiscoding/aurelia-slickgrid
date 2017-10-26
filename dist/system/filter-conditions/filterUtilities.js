System.register(["../models"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var models_1, mapDateFormatByFieldType, testFilterCondition;
    return {
        setters: [
            function (models_1_1) {
                models_1 = models_1_1;
            }
        ],
        execute: function () {
            exports_1("mapDateFormatByFieldType", mapDateFormatByFieldType = function (fieldType) {
                switch (fieldType) {
                    case models_1.FieldType.dateUs:
                        return 'M/D/YYYY';
                    case models_1.FieldType.dateTimeUs:
                        return 'M/D/YYYY h:m:s';
                    case models_1.FieldType.dateUsShort:
                        return 'M/D/YY';
                    case models_1.FieldType.dateTimeUsShort:
                        return 'M/D/YY h:m:s';
                    case models_1.FieldType.dateTimeIso:
                        return 'YYYY-MM-DD h:m:s';
                    case models_1.FieldType.dateIso:
                    default:
                        return 'YYYY-MM-DD';
                }
            });
            exports_1("testFilterCondition", testFilterCondition = function (operator, value1, value2) {
                switch (operator) {
                    case '<': return (value1 < value2);
                    case '<=': return (value1 <= value2);
                    case '>': return (value1 > value2);
                    case '>=': return (value1 >= value2);
                    case '!=':
                    case '<>': return (value1 !== value2);
                    case '=':
                    case '==': return (value1 === value2);
                }
                return true;
            });
        }
    };
});
//# sourceMappingURL=filterUtilities.js.map