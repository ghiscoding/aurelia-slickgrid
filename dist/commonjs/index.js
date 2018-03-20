"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_pal_1 = require("aurelia-pal");
var aurelia_slickgrid_1 = require("./aurelia-slickgrid");
exports.AureliaSlickgridCustomElement = aurelia_slickgrid_1.AureliaSlickgridCustomElement;
var slick_pagination_1 = require("./slick-pagination");
exports.SlickPaginationCustomElement = slick_pagination_1.SlickPaginationCustomElement;
var slickgrid_config_1 = require("./slickgrid-config");
exports.SlickgridConfig = slickgrid_config_1.SlickgridConfig;
// models
var index_1 = require("./models/index");
exports.CaseType = index_1.CaseType;
exports.DelimiterType = index_1.DelimiterType;
exports.FileType = index_1.FileType;
exports.FilterType = index_1.FilterType;
exports.FormElementType = index_1.FormElementType;
exports.FieldType = index_1.FieldType;
exports.OperatorType = index_1.OperatorType;
exports.SortDirection = index_1.SortDirection;
// editors, formatters, ...
var index_2 = require("./editors/index");
exports.Editors = index_2.Editors;
var index_3 = require("./filter-conditions/index");
exports.FilterConditions = index_3.FilterConditions;
var index_4 = require("./filters/index");
exports.Filters = index_4.Filters;
exports.FILTER_PLUGIN_NAME = index_4.PLUGIN_NAME;
var index_5 = require("./formatters/index");
exports.Formatters = index_5.Formatters;
var index_6 = require("./sorters/index");
exports.Sorters = index_6.Sorters;
// services and utilities
var index_7 = require("./services/index");
exports.ControlAndPluginService = index_7.ControlAndPluginService;
exports.ExportService = index_7.ExportService;
exports.FilterService = index_7.FilterService;
exports.GraphqlService = index_7.GraphqlService;
exports.GridExtraUtils = index_7.GridExtraUtils;
exports.GridExtraService = index_7.GridExtraService;
exports.GridEventService = index_7.GridEventService;
exports.GridOdataService = index_7.GridOdataService;
exports.GridStateService = index_7.GridStateService;
exports.ResizerService = index_7.ResizerService;
exports.SortService = index_7.SortService;
function configure(aurelia, callback) {
    aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./aurelia-slickgrid'));
    aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./slick-pagination'));
    // must register a transient so the container will get a new instance everytime
    aurelia.container.registerTransient(index_4.PLUGIN_NAME, index_4.Filters.compoundDate);
    aurelia.container.registerTransient(index_4.PLUGIN_NAME, index_4.Filters.compoundInput);
    aurelia.container.registerTransient(index_4.PLUGIN_NAME, index_4.Filters.input);
    aurelia.container.registerTransient(index_4.PLUGIN_NAME, index_4.Filters.multipleSelect);
    aurelia.container.registerTransient(index_4.PLUGIN_NAME, index_4.Filters.singleSelect);
    aurelia.container.registerTransient(index_4.PLUGIN_NAME, index_4.Filters.select);
    var config = new slickgrid_config_1.SlickgridConfig();
    aurelia.container.registerInstance(slickgrid_config_1.SlickgridConfig, config);
    if (typeof callback === 'function') {
        callback(config);
    }
}
exports.configure = configure;
//# sourceMappingURL=index.js.map