System.register(["aurelia-pal", "./aurelia-slickgrid", "./slick-pagination", "./slickgrid-config", "./filters/index", "./models/index", "./formatters/index", "./grouping-formatters/index", "./sorters/index", "./aggregators/index", "./editors/index", "./filter-conditions/index", "./services/index"], function (exports_1, context_1) {
    "use strict";
    var aurelia_pal_1, aurelia_slickgrid_1, slick_pagination_1, slickgrid_config_1, index_1;
    var __moduleName = context_1 && context_1.id;
    function configure(aurelia, callback) {
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./aurelia-slickgrid'));
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./slick-pagination'));
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./value-converters/number'));
        // must register a transient so the container will get a new instance everytime
        aurelia.container.registerTransient(index_1.Filters.compoundDate);
        aurelia.container.registerTransient(index_1.Filters.compoundInput);
        aurelia.container.registerTransient(index_1.Filters.compoundSlider);
        aurelia.container.registerTransient(index_1.Filters.input);
        aurelia.container.registerTransient(index_1.Filters.multipleSelect);
        aurelia.container.registerTransient(index_1.Filters.singleSelect);
        aurelia.container.registerTransient(index_1.Filters.select);
        aurelia.container.registerTransient(index_1.Filters.slider);
        var config = new slickgrid_config_1.SlickgridConfig();
        aurelia.container.registerInstance(slickgrid_config_1.SlickgridConfig, config);
        if (typeof callback === 'function') {
            callback(config);
        }
    }
    exports_1("configure", configure);
    var exportedNames_1 = {
        "configure": true,
        "AureliaSlickgridCustomElement": true,
        "SlickPaginationCustomElement": true,
        "SlickgridConfig": true,
        "GraphqlService": true,
        "GridOdataService": true
    };
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) exports[n] = m[n];
        }
        exports_1(exports);
    }
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
            function (index_1_1) {
                index_1 = index_1_1;
                exportStar_1(index_1_1);
            },
            function (index_2_1) {
                exportStar_1(index_2_1);
            },
            function (index_3_1) {
                exportStar_1(index_3_1);
            },
            function (index_4_1) {
                exportStar_1(index_4_1);
            },
            function (index_5_1) {
                exportStar_1(index_5_1);
            },
            function (index_6_1) {
                exportStar_1(index_6_1);
            },
            function (index_7_1) {
                exportStar_1(index_7_1);
            },
            function (index_8_1) {
                exportStar_1(index_8_1);
            },
            function (index_9_1) {
                exports_1({
                    "GraphqlService": index_9_1["GraphqlService"],
                    "GridOdataService": index_9_1["GridOdataService"]
                });
            }
        ],
        execute: function () {
            exports_1("AureliaSlickgridCustomElement", aurelia_slickgrid_1.AureliaSlickgridCustomElement);
            exports_1("SlickPaginationCustomElement", slick_pagination_1.SlickPaginationCustomElement);
            exports_1("SlickgridConfig", slickgrid_config_1.SlickgridConfig);
        }
    };
});
//# sourceMappingURL=index.js.map