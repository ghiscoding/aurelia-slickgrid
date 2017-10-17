define(["require", "exports", "aurelia-pal", "./aurelia-slickgrid", "./slickgrid-config", "./models/caseType", "./models/formElementType", "./models/fieldType", "./filter-conditions/index", "./filter-templates/index", "./formatters/index", "./sorters/index", "./services/filter.service", "./services/mouse.service", "./services/resizer.service", "./services/sort.service", "./services/grid-odata.service"], function (require, exports, aurelia_pal_1, aurelia_slickgrid_1, slickgrid_config_1, caseType_1, formElementType_1, fieldType_1, index_1, index_2, index_3, index_4, filter_service_1, mouse_service_1, resizer_service_1, sort_service_1, grid_odata_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AureliaSlickgridCustomElement = aurelia_slickgrid_1.AureliaSlickgridCustomElement;
    exports.SlickgridConfig = slickgrid_config_1.SlickgridConfig;
    exports.CaseType = caseType_1.CaseType;
    exports.FormElementType = formElementType_1.FormElementType;
    exports.FieldType = fieldType_1.FieldType;
    exports.FilterConditions = index_1.FilterConditions;
    exports.FilterTemplates = index_2.FilterTemplates;
    exports.Formatters = index_3.Formatters;
    exports.Sorters = index_4.Sorters;
    exports.FilterService = filter_service_1.FilterService;
    exports.MouseService = mouse_service_1.MouseService;
    exports.ResizerService = resizer_service_1.ResizerService;
    exports.SortService = sort_service_1.SortService;
    exports.GridOdataService = grid_odata_service_1.GridOdataService;
    function configure(aurelia, callback) {
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./aurelia-slickgrid'));
        var config = new slickgrid_config_1.SlickgridConfig();
        if (typeof callback === 'function') {
            callback(config);
        }
    }
    exports.configure = configure;
});
