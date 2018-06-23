"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var checkboxEditor_1 = require("./checkboxEditor");
var dateEditor_1 = require("./dateEditor");
var floatEditor_1 = require("./floatEditor");
var integerEditor_1 = require("./integerEditor");
var longTextEditor_1 = require("./longTextEditor");
var multipleSelectEditor_1 = require("./multipleSelectEditor");
var singleSelectEditor_1 = require("./singleSelectEditor");
var sliderEditor_1 = require("./sliderEditor");
var textEditor_1 = require("./textEditor");
exports.Editors = {
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
};
//# sourceMappingURL=index.js.map