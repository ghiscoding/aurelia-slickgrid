define(["require", "exports", "aurelia-pal", "./aurelia-slickgrid", "./slick-pagination", "./slickgrid-config", "./models/caseType", "./models/filterType.enum", "./models/formElementType", "./models/fieldType.enum", "./editors/index", "./filter-conditions/index", "./filters/index", "./formatters/index", "./sorters/index", "./services/controlAndPlugin.service", "./services/filter.service", "./services/graphql.service", "./services/gridExtraUtils", "./services/gridExtra.service", "./services/gridEvent.service", "./services/grid-odata.service", "./services/resizer.service", "./services/sort.service"], function (require, exports, aurelia_pal_1, aurelia_slickgrid_1, slick_pagination_1, slickgrid_config_1, caseType_1, filterType_enum_1, formElementType_1, fieldType_enum_1, index_1, index_2, index_3, index_4, index_5, controlAndPlugin_service_1, filter_service_1, graphql_service_1, gridExtraUtils_1, gridExtra_service_1, gridEvent_service_1, grid_odata_service_1, resizer_service_1, sort_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AureliaSlickgridCustomElement = aurelia_slickgrid_1.AureliaSlickgridCustomElement;
    exports.SlickPaginationCustomElement = slick_pagination_1.SlickPaginationCustomElement;
    exports.SlickgridConfig = slickgrid_config_1.SlickgridConfig;
    exports.CaseType = caseType_1.CaseType;
    exports.FilterType = filterType_enum_1.FilterType;
    exports.FormElementType = formElementType_1.FormElementType;
    exports.FieldType = fieldType_enum_1.FieldType;
    exports.Editors = index_1.Editors;
    exports.FilterConditions = index_2.FilterConditions;
    exports.Filters = index_3.Filters;
    exports.Formatters = index_4.Formatters;
    exports.Sorters = index_5.Sorters;
    exports.ControlAndPluginService = controlAndPlugin_service_1.ControlAndPluginService;
    exports.FilterService = filter_service_1.FilterService;
    exports.GraphqlService = graphql_service_1.GraphqlService;
    exports.GridExtraUtils = gridExtraUtils_1.GridExtraUtils;
    exports.GridExtraService = gridExtra_service_1.GridExtraService;
    exports.GridEventService = gridEvent_service_1.GridEventService;
    exports.GridOdataService = grid_odata_service_1.GridOdataService;
    exports.ResizerService = resizer_service_1.ResizerService;
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
});
//# sourceMappingURL=index.js.map