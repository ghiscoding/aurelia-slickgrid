define(["require", "exports", "./compoundDateFilter", "./compoundInputFilter", "./compoundSliderFilter", "./inputFilter", "./sliderFilter", "./multipleSelectFilter", "./nativeSelectFilter", "./singleSelectFilter", "./filterFactory"], function (require, exports, compoundDateFilter_1, compoundInputFilter_1, compoundSliderFilter_1, inputFilter_1, sliderFilter_1, multipleSelectFilter_1, nativeSelectFilter_1, singleSelectFilter_1, filterFactory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.FilterFactory = filterFactory_1.FilterFactory;
});
//# sourceMappingURL=index.js.map