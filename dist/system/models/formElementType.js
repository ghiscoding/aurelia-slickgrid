System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var FormElementType;
    return {
        setters: [],
        execute: function () {
            (function (FormElementType) {
                FormElementType[FormElementType["input"] = 0] = "input";
                FormElementType[FormElementType["multiSelect"] = 1] = "multiSelect";
                FormElementType[FormElementType["select"] = 2] = "select";
                FormElementType[FormElementType["textarea"] = 3] = "textarea";
            })(FormElementType || (FormElementType = {}));
            exports_1("FormElementType", FormElementType);
        }
    };
});
//# sourceMappingURL=formElementType.js.map