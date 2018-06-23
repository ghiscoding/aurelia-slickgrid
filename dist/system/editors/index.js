System.register(["./checkboxEditor", "./dateEditor", "./floatEditor", "./integerEditor", "./longTextEditor", "./multipleSelectEditor", "./singleSelectEditor", "./sliderEditor", "./textEditor"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var checkboxEditor_1, dateEditor_1, floatEditor_1, integerEditor_1, longTextEditor_1, multipleSelectEditor_1, singleSelectEditor_1, sliderEditor_1, textEditor_1, Editors;
    return {
        setters: [
            function (checkboxEditor_1_1) {
                checkboxEditor_1 = checkboxEditor_1_1;
            },
            function (dateEditor_1_1) {
                dateEditor_1 = dateEditor_1_1;
            },
            function (floatEditor_1_1) {
                floatEditor_1 = floatEditor_1_1;
            },
            function (integerEditor_1_1) {
                integerEditor_1 = integerEditor_1_1;
            },
            function (longTextEditor_1_1) {
                longTextEditor_1 = longTextEditor_1_1;
            },
            function (multipleSelectEditor_1_1) {
                multipleSelectEditor_1 = multipleSelectEditor_1_1;
            },
            function (singleSelectEditor_1_1) {
                singleSelectEditor_1 = singleSelectEditor_1_1;
            },
            function (sliderEditor_1_1) {
                sliderEditor_1 = sliderEditor_1_1;
            },
            function (textEditor_1_1) {
                textEditor_1 = textEditor_1_1;
            }
        ],
        execute: function () {
            exports_1("Editors", Editors = {
                /** Checkbox Editor (uses native checkbox DOM element) */
                checkbox: checkboxEditor_1.CheckboxEditor,
                /** Date Picker Editor (which uses 3rd party lib "flatpickr") */
                date: dateEditor_1.DateEditor,
                /** Float Number Editor */
                float: floatEditor_1.FloatEditor,
                /** Integer Editor */
                integer: integerEditor_1.IntegerEditor,
                /** Long Text Editor (uses a textarea) */
                longText: longTextEditor_1.LongTextEditor,
                /** Multiple Select editor (which uses 3rd party lib "multiple-select.js") */
                multipleSelect: multipleSelectEditor_1.MultipleSelectEditor,
                /** Single Select editor (which uses 3rd party lib "multiple-select.js") */
                singleSelect: singleSelectEditor_1.SingleSelectEditor,
                /** Slider Editor */
                slider: sliderEditor_1.SliderEditor,
                /** Text Editor */
                text: textEditor_1.TextEditor
            });
        }
    };
});
//# sourceMappingURL=index.js.map