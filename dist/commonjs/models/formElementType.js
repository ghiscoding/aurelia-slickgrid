"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FormElementType;
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
    /** Input Filter type */
    FormElementType[FormElementType["inputNoPlaceholder"] = 5] = "inputNoPlaceholder";
    /** TextArea element type */
    FormElementType[FormElementType["textarea"] = 6] = "textarea";
})(FormElementType = exports.FormElementType || (exports.FormElementType = {}));
//# sourceMappingURL=formElementType.js.map