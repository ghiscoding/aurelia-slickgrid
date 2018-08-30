System.register(["./compoundDateFilter", "./compoundInputFilter", "./compoundSliderFilter", "./inputFilter", "./sliderFilter", "./multipleSelectFilter", "./nativeSelectFilter", "./singleSelectFilter", "./filterFactory"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var compoundDateFilter_1, compoundInputFilter_1, compoundSliderFilter_1, inputFilter_1, sliderFilter_1, multipleSelectFilter_1, nativeSelectFilter_1, singleSelectFilter_1, Filters;
    return {
        setters: [
            function (compoundDateFilter_1_1) {
                compoundDateFilter_1 = compoundDateFilter_1_1;
            },
            function (compoundInputFilter_1_1) {
                compoundInputFilter_1 = compoundInputFilter_1_1;
            },
            function (compoundSliderFilter_1_1) {
                compoundSliderFilter_1 = compoundSliderFilter_1_1;
            },
            function (inputFilter_1_1) {
                inputFilter_1 = inputFilter_1_1;
            },
            function (sliderFilter_1_1) {
                sliderFilter_1 = sliderFilter_1_1;
            },
            function (multipleSelectFilter_1_1) {
                multipleSelectFilter_1 = multipleSelectFilter_1_1;
            },
            function (nativeSelectFilter_1_1) {
                nativeSelectFilter_1 = nativeSelectFilter_1_1;
            },
            function (singleSelectFilter_1_1) {
                singleSelectFilter_1 = singleSelectFilter_1_1;
            },
            function (filterFactory_1_1) {
                exports_1({
                    "FilterFactory": filterFactory_1_1["FilterFactory"]
                });
            }
        ],
        execute: function () {
            exports_1("Filters", Filters = {
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
            });
        }
    };
});
//# sourceMappingURL=index.js.map