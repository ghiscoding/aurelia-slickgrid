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
var caseType_1 = require("./models/caseType");
exports.CaseType = caseType_1.CaseType;
var formElementType_1 = require("./models/formElementType");
exports.FormElementType = formElementType_1.FormElementType;
var fieldType_1 = require("./models/fieldType");
exports.FieldType = fieldType_1.FieldType;
// editors, formatters, ...
var index_1 = require("./editors/index");
exports.Editors = index_1.Editors;
var index_2 = require("./filter-conditions/index");
exports.FilterConditions = index_2.FilterConditions;
var index_3 = require("./filter-templates/index");
exports.FilterTemplates = index_3.FilterTemplates;
var index_4 = require("./formatters/index");
exports.Formatters = index_4.Formatters;
var index_5 = require("./sorters/index");
exports.Sorters = index_5.Sorters;
// services and utilities
var controlAndPlugin_service_1 = require("./services/controlAndPlugin.service");
exports.ControlAndPluginService = controlAndPlugin_service_1.ControlAndPluginService;
var filter_service_1 = require("./services/filter.service");
exports.FilterService = filter_service_1.FilterService;
var graphql_service_1 = require("./services/graphql.service");
exports.GraphqlService = graphql_service_1.GraphqlService;
var gridExtraUtils_1 = require("./services/gridExtraUtils");
exports.GridExtraUtils = gridExtraUtils_1.GridExtraUtils;
var gridExtra_service_1 = require("./services/gridExtra.service");
exports.GridExtraService = gridExtra_service_1.GridExtraService;
var gridEvent_service_1 = require("./services/gridEvent.service");
exports.GridEventService = gridEvent_service_1.GridEventService;
var grid_odata_service_1 = require("./services/grid-odata.service");
exports.GridOdataService = grid_odata_service_1.GridOdataService;
var resizer_service_1 = require("./services/resizer.service");
exports.ResizerService = resizer_service_1.ResizerService;
var sort_service_1 = require("./services/sort.service");
exports.SortService = sort_service_1.SortService;
function configure(aurelia, callback) {
    aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./aurelia-slickgrid'));
    aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./slick-pagination'));
    var config = new slickgrid_config_1.SlickgridConfig();
    if (typeof callback === 'function') {
        callback(config);
    }
}
exports.configure = configure;
//# sourceMappingURL=index.js.map