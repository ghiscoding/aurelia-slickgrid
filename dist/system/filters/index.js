System.register(["./compoundDateFilter", "./compoundInputFilter", "./compoundInputNumberFilter", "./compoundInputPasswordFilter", "./compoundSliderFilter", "./inputFilter", "./inputNumberFilter", "./inputPasswordFilter", "./multipleSelectFilter", "./nativeSelectFilter", "./singleSelectFilter", "./sliderFilter", "./filterFactory"], function (exports_1, context_1) {
    "use strict";
    var compoundDateFilter_1, compoundInputFilter_1, compoundInputNumberFilter_1, compoundInputPasswordFilter_1, compoundSliderFilter_1, inputFilter_1, inputNumberFilter_1, inputPasswordFilter_1, multipleSelectFilter_1, nativeSelectFilter_1, singleSelectFilter_1, sliderFilter_1, Filters;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (compoundDateFilter_1_1) {
                compoundDateFilter_1 = compoundDateFilter_1_1;
            },
            function (compoundInputFilter_1_1) {
                compoundInputFilter_1 = compoundInputFilter_1_1;
            },
            function (compoundInputNumberFilter_1_1) {
                compoundInputNumberFilter_1 = compoundInputNumberFilter_1_1;
            },
            function (compoundInputPasswordFilter_1_1) {
                compoundInputPasswordFilter_1 = compoundInputPasswordFilter_1_1;
            },
            function (compoundSliderFilter_1_1) {
                compoundSliderFilter_1 = compoundSliderFilter_1_1;
            },
            function (inputFilter_1_1) {
                inputFilter_1 = inputFilter_1_1;
            },
            function (inputNumberFilter_1_1) {
                inputNumberFilter_1 = inputNumberFilter_1_1;
            },
            function (inputPasswordFilter_1_1) {
                inputPasswordFilter_1 = inputPasswordFilter_1_1;
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
            function (sliderFilter_1_1) {
                sliderFilter_1 = sliderFilter_1_1;
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
            });
        }
    };
});
//# sourceMappingURL=index.js.map