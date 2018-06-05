"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compoundDateFilter_1 = require("./compoundDateFilter");
var compoundInputFilter_1 = require("./compoundInputFilter");
var inputFilter_1 = require("./inputFilter");
var multipleSelectFilter_1 = require("./multipleSelectFilter");
var selectFilter_1 = require("./selectFilter");
var singleSelectFilter_1 = require("./singleSelectFilter");
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
var filterFactory_1 = require("./filterFactory");
exports.FilterFactory = filterFactory_1.FilterFactory;
//# sourceMappingURL=index.js.map