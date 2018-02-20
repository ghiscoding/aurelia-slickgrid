System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FormElementType;
    return {
        setters: [],
        execute: function () {
            (function (FormElementType) {
                FormElementType[FormElementType["input"] = 0] = "input";
                FormElementType[FormElementType["select"] = 1] = "select";
                FormElementType[FormElementType["multipleSelect"] = 2] = "multipleSelect";
                FormElementType[FormElementType["singleSelect"] = 3] = "singleSelect";
                FormElementType[FormElementType["custom"] = 4] = "custom";
                FormElementType[FormElementType["textarea"] = 5] = "textarea";
            })(FormElementType || (FormElementType = {}));
            exports_1("FormElementType", FormElementType);
        }
    };
});
//# sourceMappingURL=formElementType.js.map