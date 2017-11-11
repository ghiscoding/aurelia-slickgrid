System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var OperatorType;
    return {
        setters: [],
        execute: function () {
            (function (OperatorType) {
                OperatorType["contains"] = "Contains";
                OperatorType["lessThan"] = "LT";
                OperatorType["lessThanOrEqual"] = "LE";
                OperatorType["greaterThan"] = "GT";
                OperatorType["greaterThanOrEqual"] = "GE";
                OperatorType["notEqual"] = "NE";
                OperatorType["equal"] = "EQ";
                OperatorType["endsWith"] = "EndsWith";
                OperatorType["startsWith"] = "StartsWith";
                OperatorType["in"] = "IN";
                OperatorType["notIn"] = "NIN";
            })(OperatorType || (OperatorType = {}));
            exports_1("OperatorType", OperatorType);
        }
    };
});
//# sourceMappingURL=operatorType.js.map