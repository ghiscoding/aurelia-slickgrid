"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compoundDateFilter_1 = require("./compoundDateFilter");
var compoundInputFilter_1 = require("./compoundInputFilter");
var compoundSliderFilter_1 = require("./compoundSliderFilter");
var inputFilter_1 = require("./inputFilter");
var sliderFilter_1 = require("./sliderFilter");
var multipleSelectFilter_1 = require("./multipleSelectFilter");
var nativeSelectFilter_1 = require("./nativeSelectFilter");
var singleSelectFilter_1 = require("./singleSelectFilter");
exports.Filters = {
    /** Compound Date Filter (compound of Operator + Date picker) */
    compoundDate: compoundDateFilter_1.CompoundDateFilter,
    /** Compound Input Filter (compound of Operator + Input) */
    compoundInput: compoundInputFilter_1.CompoundInputFilter,
    /** Compound Slider Filter (compound of Operator + Slider) */
    compoundSlider: compoundSliderFilter_1.CompoundSliderFilter,
    /** Default Filter, input type text filter */
    input: inputFilter_1.InputFilter,
    /** Slider Filter */
    slider: sliderFilter_1.SliderFilter,
    /** Multiple Select filter, which uses 3rd party lib "multiple-select.js" */
    multipleSelect: multipleSelectFilter_1.MultipleSelectFilter,
    /** Single Select filter, which uses 3rd party lib "multiple-select.js" */
    singleSelect: singleSelectFilter_1.SingleSelectFilter,
    /** Select filter, which uses native DOM element select */
    select: nativeSelectFilter_1.NativeSelectFilter
};
var filterFactory_1 = require("./filterFactory");
exports.FilterFactory = filterFactory_1.FilterFactory;
//# sourceMappingURL=index.js.map