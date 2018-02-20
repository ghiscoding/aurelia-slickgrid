System.register(["./inputFilter", "./multipleSelectFilter", "./selectFilter", "./singleSelectFilter"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var inputFilter_1, multipleSelectFilter_1, selectFilter_1, singleSelectFilter_1, Filters;
    return {
        setters: [
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
            }
        ],
        execute: function () {
            exports_1("Filters", Filters = {
                input: inputFilter_1.InputFilter,
                multipleSelect: multipleSelectFilter_1.MultipleSelectFilter,
                singleSelect: singleSelectFilter_1.SingleSelectFilter,
                select: selectFilter_1.SelectFilter
            });
        }
    };
});
//# sourceMappingURL=index.js.map