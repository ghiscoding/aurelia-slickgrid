define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var OperatorType;
    (function (OperatorType) {
        /** value is empty */
        OperatorType["empty"] = "";
        /** value contains x */
        OperatorType["contains"] = "Contains";
        /** value not contains x (inversed of contains) */
        OperatorType["notContains"] = "Not_Contains";
        /** value less than x */
        OperatorType["lessThan"] = "LT";
        /** value less than or equal to x */
        OperatorType["lessThanOrEqual"] = "LE";
        /** value greater than x */
        OperatorType["greaterThan"] = "GT";
        /** value great than or equal to x */
        OperatorType["greaterThanOrEqual"] = "GE";
        /** value not equal to x */
        OperatorType["notEqual"] = "NE";
        /** value equal to x */
        OperatorType["equal"] = "EQ";
        /** String ends with value */
        OperatorType["endsWith"] = "EndsWith";
        /** String starts with value */
        OperatorType["startsWith"] = "StartsWith";
        /** Find an equal match inside a collection */
        OperatorType["in"] = "IN";
        /** Inverse (Not In) of an equal match inside a collection */
        OperatorType["notIn"] = "NOT_IN";
        /**
         * Find a substring contained inside a collection
         * For example, this condition would return True with "IN_CONTAINS":: value='Task2,Task3', collection=['Task2','Task3']
         * This would have returned False with "IN" because 'Task2' does not equal 'Task2,Task3'. However 'Task2' is contained in 'Task2,Task3'
         */
        OperatorType["inContains"] = "IN_CONTAINS";
        /** Inversed (Not In) of substring contained inside a collection */
        OperatorType["notInContains"] = "NOT_IN_CONTAINS";
    })(OperatorType = exports.OperatorType || (exports.OperatorType = {}));
});
//# sourceMappingURL=operatorType.enum.js.map