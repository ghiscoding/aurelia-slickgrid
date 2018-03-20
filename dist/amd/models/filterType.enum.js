define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FilterType;
    (function (FilterType) {
        /** Input Filter type, with a magnifying glass as placeholder */
        FilterType[FilterType["input"] = 0] = "input";
        /** Select Filter type, just a regular select dropdown. You might want to try "singleSelect" which has a nicer look and feel. */
        FilterType[FilterType["select"] = 1] = "select";
        /** Multiple-Select Filter type */
        FilterType[FilterType["multipleSelect"] = 2] = "multipleSelect";
        /** Single Filter type */
        FilterType[FilterType["singleSelect"] = 3] = "singleSelect";
        /** Custom Filter type */
        FilterType[FilterType["custom"] = 4] = "custom";
        /** Compound Date Filter (compound of Operator + Date picker) */
        FilterType[FilterType["compoundDate"] = 5] = "compoundDate";
        /** Compound Input Filter (compound of Operator + Input) */
        FilterType[FilterType["compoundInput"] = 6] = "compoundInput";
    })(FilterType = exports.FilterType || (exports.FilterType = {}));
});
//# sourceMappingURL=filterType.enum.js.map