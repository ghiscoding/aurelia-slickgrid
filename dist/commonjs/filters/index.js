"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compoundDateFilter_1 = require("./compoundDateFilter");
var compoundInputFilter_1 = require("./compoundInputFilter");
var compoundInputNumberFilter_1 = require("./compoundInputNumberFilter");
var compoundInputPasswordFilter_1 = require("./compoundInputPasswordFilter");
var compoundSliderFilter_1 = require("./compoundSliderFilter");
var inputFilter_1 = require("./inputFilter");
var inputNumberFilter_1 = require("./inputNumberFilter");
var inputPasswordFilter_1 = require("./inputPasswordFilter");
var multipleSelectFilter_1 = require("./multipleSelectFilter");
var nativeSelectFilter_1 = require("./nativeSelectFilter");
var singleSelectFilter_1 = require("./singleSelectFilter");
var sliderFilter_1 = require("./sliderFilter");
exports.Filters = {
    /** Compound Date Filter (compound of Operator + Date picker) */
    compoundDate: compoundDateFilter_1.CompoundDateFilter,
    /** Alias to compoundInputText to Compound Input Filter (compound of Operator + Input Text) */
    compoundInput: compoundInputFilter_1.CompoundInputFilter,
    /** Compound Input Number Filter (compound of Operator + Input of type Number) */
    compoundInputNumber: compoundInputNumberFilter_1.CompoundInputNumberFilter,
    /** Compound Input Password Filter (compound of Operator + Input of type Password, also note that only the text shown in the UI will be masked, filter query is still plain text) */
    compoundInputPassword: compoundInputPasswordFilter_1.CompoundInputPasswordFilter,
    /** Compound Input Text Filter (compound of Operator + Input Text) */
    compoundInputText: compoundInputFilter_1.CompoundInputFilter,
    /** Compound Slider Filter (compound of Operator + Slider) */
    compoundSlider: compoundSliderFilter_1.CompoundSliderFilter,
    /** Alias to inputText, input type text filter */
    input: inputFilter_1.InputFilter,
    /** Input Filter of type Number */
    inputNumber: inputNumberFilter_1.InputNumberFilter,
    /** Input Filter of type Password (note that only the text shown in the UI will be masked, filter query is still plain text) */
    inputPassword: inputPasswordFilter_1.InputPasswordFilter,
    /** Default Filter, input type text filter */
    inputText: inputFilter_1.InputFilter,
    /** Multiple Select filter, which uses 3rd party lib "multiple-select.js" */
    multipleSelect: multipleSelectFilter_1.MultipleSelectFilter,
    /** Single Select filter, which uses 3rd party lib "multiple-select.js" */
    singleSelect: singleSelectFilter_1.SingleSelectFilter,
    /** Select filter, which uses native DOM element select */
    select: nativeSelectFilter_1.NativeSelectFilter,
    /** Slider Filter */
    slider: sliderFilter_1.SliderFilter,
};
var filterFactory_1 = require("./filterFactory");
exports.FilterFactory = filterFactory_1.FilterFactory;
//# sourceMappingURL=index.js.map