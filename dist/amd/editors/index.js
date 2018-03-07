define(["require", "exports", "./checkboxEditor", "./dateEditor", "./floatEditor", "./integerEditor", "./longTextEditor", "./multipleSelectEditor", "./singleSelectEditor", "./textEditor"], function (require, exports, checkboxEditor_1, dateEditor_1, floatEditor_1, integerEditor_1, longTextEditor_1, multipleSelectEditor_1, singleSelectEditor_1, textEditor_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Editors = {
        checkbox: checkboxEditor_1.CheckboxEditor,
        date: dateEditor_1.DateEditor,
        float: floatEditor_1.FloatEditor,
        integer: integerEditor_1.IntegerEditor,
        longText: longTextEditor_1.LongTextEditor,
        multipleSelect: multipleSelectEditor_1.MultipleSelectEditor,
        singleSelect: singleSelectEditor_1.SingleSelectEditor,
        text: textEditor_1.TextEditor
    };
});
//# sourceMappingURL=index.js.map