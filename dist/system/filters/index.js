System.register(["./compoundDateFilter", "./compoundInputFilter", "./inputFilter", "./multipleSelectFilter", "./selectFilter", "./singleSelectFilter", "./filterFactory"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var compoundDateFilter_1, compoundInputFilter_1, inputFilter_1, multipleSelectFilter_1, selectFilter_1, singleSelectFilter_1, Filters;
    return {
        setters: [
            function (compoundDateFilter_1_1) {
                compoundDateFilter_1 = compoundDateFilter_1_1;
            },
            function (compoundInputFilter_1_1) {
                compoundInputFilter_1 = compoundInputFilter_1_1;
            },
            function (inputFilter_1_1) {
                inputFilter_1 = inputFilter_1_1;
            },
            function (multipleSelectFilter_1_1) {
                multipleSelectFilter_1 = multipleSelectFilter_1_1;
            },
            function (selectFilter_1_1) {
                selectFilter_1 = selectFilter_1_1;
            },
            function (singleSelectFilter_1_1) {
                singleSelectFilter_1 = singleSelectFilter_1_1;
            },
            function (filterFactory_1_1) {
                exports_1({
                    "PLUGIN_NAME": filterFactory_1_1["PLUGIN_NAME"],
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
                /** Default Filter, input type text filter with a magnifying glass placeholder */
                input: inputFilter_1.InputFilter,
                /** Multiple Select filter, which uses 3rd party lib "multiple-select.js" */
                multipleSelect: multipleSelectFilter_1.MultipleSelectFilter,
                /** Single Select filter, which uses 3rd party lib "multiple-select.js" */
                singleSelect: singleSelectFilter_1.SingleSelectFilter,
                /** Select filter, which uses native DOM element select */
                select: selectFilter_1.SelectFilter
            });
        }
    };
});
//# sourceMappingURL=index.js.map