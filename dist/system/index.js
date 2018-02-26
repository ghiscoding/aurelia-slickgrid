System.register(["aurelia-pal", "./aurelia-slickgrid", "./slick-pagination", "./slickgrid-config", "./models/index", "./editors/index", "./filter-conditions/index", "./filters/index", "./formatters/index", "./sorters/index", "./services/index"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(aurelia, callback) {
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./aurelia-slickgrid'));
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./slick-pagination'));
        aurelia.container.registerSingleton(index_1.PLUGIN_NAME, index_1.Filters.input);
        aurelia.container.registerSingleton(index_1.PLUGIN_NAME, index_1.Filters.multipleSelect);
        aurelia.container.registerSingleton(index_1.PLUGIN_NAME, index_1.Filters.singleSelect);
        aurelia.container.registerSingleton(index_1.PLUGIN_NAME, index_1.Filters.select);
        var config = new slickgrid_config_1.SlickgridConfig();
        if (typeof callback === 'function') {
            callback(config);
        }
    }
    exports_1("configure", configure);
    var aurelia_pal_1, aurelia_slickgrid_1, slick_pagination_1, slickgrid_config_1, index_2, index_3, index_4, index_1, index_5, index_6, index_7;
    return {
        setters: [
            function (aurelia_pal_1_1) {
                aurelia_pal_1 = aurelia_pal_1_1;
            },
            function (aurelia_slickgrid_1_1) {
                aurelia_slickgrid_1 = aurelia_slickgrid_1_1;
            },
            function (slick_pagination_1_1) {
                slick_pagination_1 = slick_pagination_1_1;
            },
            function (slickgrid_config_1_1) {
                slickgrid_config_1 = slickgrid_config_1_1;
            },
            function (index_2_1) {
                index_2 = index_2_1;
            },
            function (index_3_1) {
                index_3 = index_3_1;
            },
            function (index_4_1) {
                index_4 = index_4_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (index_5_1) {
                index_5 = index_5_1;
            },
            function (index_6_1) {
                index_6 = index_6_1;
            },
            function (index_7_1) {
                index_7 = index_7_1;
            }
        ],
        execute: function () {
            exports_1("AureliaSlickgridCustomElement", aurelia_slickgrid_1.AureliaSlickgridCustomElement);
            exports_1("SlickPaginationCustomElement", slick_pagination_1.SlickPaginationCustomElement);
            exports_1("SlickgridConfig", slickgrid_config_1.SlickgridConfig);
            exports_1("CaseType", index_2.CaseType);
            exports_1("DelimiterType", index_2.DelimiterType);
            exports_1("FileType", index_2.FileType);
            exports_1("FilterType", index_2.FilterType);
            exports_1("FormElementType", index_2.FormElementType);
            exports_1("FieldType", index_2.FieldType);
            exports_1("Editors", index_3.Editors);
            exports_1("FilterConditions", index_4.FilterConditions);
            exports_1("Filters", index_1.Filters);
            exports_1("FILTER_PLUGIN_NAME", index_1.PLUGIN_NAME);
            exports_1("Formatters", index_5.Formatters);
            exports_1("Sorters", index_6.Sorters);
            exports_1("ControlAndPluginService", index_7.ControlAndPluginService);
            exports_1("ExportService", index_7.ExportService);
            exports_1("FilterService", index_7.FilterService);
            exports_1("GraphqlService", index_7.GraphqlService);
            exports_1("GridExtraUtils", index_7.GridExtraUtils);
            exports_1("GridExtraService", index_7.GridExtraService);
            exports_1("GridEventService", index_7.GridEventService);
            exports_1("GridOdataService", index_7.GridOdataService);
            exports_1("ResizerService", index_7.ResizerService);
            exports_1("SortService", index_7.SortService);
        }
    };
});
//# sourceMappingURL=index.js.map