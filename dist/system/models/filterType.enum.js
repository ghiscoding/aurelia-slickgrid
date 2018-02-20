System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FilterType;
    return {
        setters: [],
        execute: function () {
            (function (FilterType) {
                /** Input Filter type */
                FilterType[FilterType["input"] = 0] = "input";
                /** Select Filter type, just a regular select dropdown. You might want to try "singleSelect" which has a nicer look and feel. */
                FilterType[FilterType["select"] = 1] = "select";
                /** Multiple-Select Filter type */
                FilterType[FilterType["multipleSelect"] = 2] = "multipleSelect";
                /** Single Filter type */
                FilterType[FilterType["singleSelect"] = 3] = "singleSelect";
                /** Custom Filter type */
                FilterType[FilterType["custom"] = 4] = "custom";
            })(FilterType || (FilterType = {}));
            exports_1("FilterType", FilterType);
        }
    };
});
//# sourceMappingURL=filterType.enum.js.map