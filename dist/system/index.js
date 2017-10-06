System.register(["aurelia-pal", "./au-slickgrid", "./slickgrid-config", "./models/caseType", "./models/formElementType", "./models/fieldType", "./filter-conditions", "./filter-templates", "./formatters", "./sorters", "./services/filter.service", "./services/mouse.service", "./services/resizer.service", "./services/sort.service", "./services/grid-odata.service"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(aurelia, callback) {
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./au-slickgrid'));
        var config = new slickgrid_config_1.SlickgridConfig();
        if (typeof callback === 'function') {
            callback(config);
        }
    }
    exports_1("configure", configure);
    var aurelia_pal_1, au_slickgrid_1, slickgrid_config_1, caseType_1, formElementType_1, fieldType_1, filter_conditions_1, filter_templates_1, formatters_1, sorters_1, filter_service_1, mouse_service_1, resizer_service_1, sort_service_1, grid_odata_service_1;
    return {
        setters: [
            function (aurelia_pal_1_1) {
                aurelia_pal_1 = aurelia_pal_1_1;
            },
            function (au_slickgrid_1_1) {
                au_slickgrid_1 = au_slickgrid_1_1;
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
            function (filter_conditions_1_1) {
                filter_conditions_1 = filter_conditions_1_1;
            },
            function (filter_templates_1_1) {
                filter_templates_1 = filter_templates_1_1;
            },
            function (formatters_1_1) {
                formatters_1 = formatters_1_1;
            },
            function (sorters_1_1) {
                sorters_1 = sorters_1_1;
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
            exports_1("AuSlickgridCustomElement", au_slickgrid_1.AuSlickgridCustomElement);
            exports_1("SlickgridConfig", slickgrid_config_1.SlickgridConfig);
            exports_1("CaseType", caseType_1.CaseType);
            exports_1("FormElementType", formElementType_1.FormElementType);
            exports_1("FieldType", fieldType_1.FieldType);
            exports_1("FilterConditions", filter_conditions_1.FilterConditions);
            exports_1("FilterTemplates", filter_templates_1.FilterTemplates);
            exports_1("Formatters", formatters_1.Formatters);
            exports_1("Sorters", sorters_1.Sorters);
            exports_1("FilterService", filter_service_1.FilterService);
            exports_1("MouseService", mouse_service_1.MouseService);
            exports_1("ResizerService", resizer_service_1.ResizerService);
            exports_1("SortService", sort_service_1.SortService);
            exports_1("GridOdataService", grid_odata_service_1.GridOdataService);
        }
    };
});
