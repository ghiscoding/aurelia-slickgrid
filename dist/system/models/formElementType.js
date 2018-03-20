System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FormElementType;
    return {
        setters: [],
        execute: function () {
            (function (FormElementType) {
                /** Input Filter type */
                FormElementType[FormElementType["input"] = 0] = "input";
                /** Select Filter type, just a regular select dropdown. You might want to try "singleSelect" which has a nicer look and feel. */
                FormElementType[FormElementType["select"] = 1] = "select";
                /** Multiple-Select Filter type */
                FormElementType[FormElementType["multipleSelect"] = 2] = "multipleSelect";
                /** Single Filter type */
                FormElementType[FormElementType["singleSelect"] = 3] = "singleSelect";
                /** Custom Filter type */
                FormElementType[FormElementType["custom"] = 4] = "custom";
                /** TextArea element type */
                FormElementType[FormElementType["textarea"] = 5] = "textarea";
            })(FormElementType || (FormElementType = {}));
            exports_1("FormElementType", FormElementType);
        }
    };
});
//# sourceMappingURL=formElementType.js.map