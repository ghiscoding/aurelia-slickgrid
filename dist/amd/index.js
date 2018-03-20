define(["require", "exports", "aurelia-pal", "./aurelia-slickgrid", "./slick-pagination", "./slickgrid-config", "./models/index", "./editors/index", "./filter-conditions/index", "./filters/index", "./formatters/index", "./sorters/index", "./services/index"], function (require, exports, aurelia_pal_1, aurelia_slickgrid_1, slick_pagination_1, slickgrid_config_1, index_1, index_2, index_3, index_4, index_5, index_6, index_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AureliaSlickgridCustomElement = aurelia_slickgrid_1.AureliaSlickgridCustomElement;
    exports.SlickPaginationCustomElement = slick_pagination_1.SlickPaginationCustomElement;
    exports.SlickgridConfig = slickgrid_config_1.SlickgridConfig;
    exports.CaseType = index_1.CaseType;
    exports.DelimiterType = index_1.DelimiterType;
    exports.FileType = index_1.FileType;
    exports.FilterType = index_1.FilterType;
    exports.FormElementType = index_1.FormElementType;
    exports.FieldType = index_1.FieldType;
    exports.OperatorType = index_1.OperatorType;
    exports.SortDirection = index_1.SortDirection;
    exports.Editors = index_2.Editors;
    exports.FilterConditions = index_3.FilterConditions;
    exports.Filters = index_4.Filters;
    exports.FILTER_PLUGIN_NAME = index_4.PLUGIN_NAME;
    exports.Formatters = index_5.Formatters;
    exports.Sorters = index_6.Sorters;
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
});
//# sourceMappingURL=index.js.map