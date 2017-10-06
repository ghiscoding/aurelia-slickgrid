"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_pal_1 = require("aurelia-pal");
var au_slickgrid_1 = require("./au-slickgrid");
exports.AuSlickgridCustomElement = au_slickgrid_1.AuSlickgridCustomElement;
var slickgrid_config_1 = require("./slickgrid-config");
exports.SlickgridConfig = slickgrid_config_1.SlickgridConfig;
var caseType_1 = require("./models/caseType");
exports.CaseType = caseType_1.CaseType;
var formElementType_1 = require("./models/formElementType");
exports.FormElementType = formElementType_1.FormElementType;
var fieldType_1 = require("./models/fieldType");
exports.FieldType = fieldType_1.FieldType;
var filter_conditions_1 = require("./filter-conditions");
exports.FilterConditions = filter_conditions_1.FilterConditions;
var filter_templates_1 = require("./filter-templates");
exports.FilterTemplates = filter_templates_1.FilterTemplates;
var formatters_1 = require("./formatters");
exports.Formatters = formatters_1.Formatters;
var sorters_1 = require("./sorters");
exports.Sorters = sorters_1.Sorters;
var filter_service_1 = require("./services/filter.service");
exports.FilterService = filter_service_1.FilterService;
var mouse_service_1 = require("./services/mouse.service");
exports.MouseService = mouse_service_1.MouseService;
var resizer_service_1 = require("./services/resizer.service");
exports.ResizerService = resizer_service_1.ResizerService;
var sort_service_1 = require("./services/sort.service");
exports.SortService = sort_service_1.SortService;
var grid_odata_service_1 = require("./services/grid-odata.service");
exports.GridOdataService = grid_odata_service_1.GridOdataService;
function configure(aurelia, callback) {
    aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./au-slickgrid'));
    var config = new slickgrid_config_1.SlickgridConfig();
    if (typeof callback === 'function') {
        callback(config);
    }
}
exports.configure = configure;
