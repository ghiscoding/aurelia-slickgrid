System.register(["aurelia-pal", "./aurelia-slickgrid", "./slick-pagination", "./slickgrid-config", "./models/caseType", "./models/formElementType", "./models/fieldType", "./filter-conditions/index", "./filter-templates/index", "./formatters/index", "./sorters/index", "./services/filter.service", "./services/mouse.service", "./services/resizer.service", "./services/sort.service", "./services/grid-odata.service"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(aurelia, callback) {
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./aurelia-slickgrid'));
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./slick-pagination'));
        var config = new slickgrid_config_1.SlickgridConfig();
        if (typeof callback === 'function') {
            callback(config);
        }
    }
    exports_1("configure", configure);
    var aurelia_pal_1, aurelia_slickgrid_1, slick_pagination_1, slickgrid_config_1, caseType_1, formElementType_1, fieldType_1, index_1, index_2, index_3, index_4, filter_service_1, mouse_service_1, resizer_service_1, sort_service_1, grid_odata_service_1;
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
            function (caseType_1_1) {
                caseType_1 = caseType_1_1;
            },
            function (formElementType_1_1) {
                formElementType_1 = formElementType_1_1;
            },
            function (fieldType_1_1) {
                fieldType_1 = fieldType_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
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
            function (filter_service_1_1) {
                filter_service_1 = filter_service_1_1;
            },
            function (mouse_service_1_1) {
                mouse_service_1 = mouse_service_1_1;
            },
            function (resizer_service_1_1) {
                resizer_service_1 = resizer_service_1_1;
            },
            function (sort_service_1_1) {
                sort_service_1 = sort_service_1_1;
            },
            function (grid_odata_service_1_1) {
                grid_odata_service_1 = grid_odata_service_1_1;
            }
        ],
        execute: function () {
            exports_1("AureliaSlickgridCustomElement", aurelia_slickgrid_1.AureliaSlickgridCustomElement);
            exports_1("SlickPaginationCustomElement", slick_pagination_1.SlickPaginationCustomElement);
            exports_1("SlickgridConfig", slickgrid_config_1.SlickgridConfig);
            exports_1("CaseType", caseType_1.CaseType);
            exports_1("FormElementType", formElementType_1.FormElementType);
            exports_1("FieldType", fieldType_1.FieldType);
            exports_1("FilterConditions", index_1.FilterConditions);
            exports_1("FilterTemplates", index_2.FilterTemplates);
            exports_1("Formatters", index_3.Formatters);
            exports_1("Sorters", index_4.Sorters);
            exports_1("FilterService", filter_service_1.FilterService);
            exports_1("MouseService", mouse_service_1.MouseService);
            exports_1("ResizerService", resizer_service_1.ResizerService);
            exports_1("SortService", sort_service_1.SortService);
            exports_1("GridOdataService", grid_odata_service_1.GridOdataService);
        }
    };
});
//# sourceMappingURL=index.js.map