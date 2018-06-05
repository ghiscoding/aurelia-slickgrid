define(["require", "exports", "./compoundDateFilter", "./compoundInputFilter", "./inputFilter", "./multipleSelectFilter", "./selectFilter", "./singleSelectFilter", "./filterFactory"], function (require, exports, compoundDateFilter_1, compoundInputFilter_1, inputFilter_1, multipleSelectFilter_1, selectFilter_1, singleSelectFilter_1, filterFactory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Filters = {
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
    };
    exports.FilterFactory = filterFactory_1.FilterFactory;
});
//# sourceMappingURL=index.js.map