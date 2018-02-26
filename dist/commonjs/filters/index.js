"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inputFilter_1 = require("./inputFilter");
var multipleSelectFilter_1 = require("./multipleSelectFilter");
var selectFilter_1 = require("./selectFilter");
var singleSelectFilter_1 = require("./singleSelectFilter");
exports.Filters = {
    input: inputFilter_1.InputFilter,
    multipleSelect: multipleSelectFilter_1.MultipleSelectFilter,
    singleSelect: singleSelectFilter_1.SingleSelectFilter,
    select: selectFilter_1.SelectFilter
};
var filterFactory_1 = require("./filterFactory");
exports.PLUGIN_NAME = filterFactory_1.PLUGIN_NAME;
exports.FilterFactory = filterFactory_1.FilterFactory;
//# sourceMappingURL=index.js.map