define(["require", "exports", "aurelia-pal", "./aurelia-slickgrid", "./slick-pagination", "./slickgrid-config", "./filters/index", "./models/index", "./formatters/index", "./grouping-formatters/index", "./sorters/index", "./aggregators/index", "./editors/index", "./filter-conditions/index", "./filters/index", "./services/index"], function (require, exports, aurelia_pal_1, aurelia_slickgrid_1, slick_pagination_1, slickgrid_config_1, index_1, index_2, index_3, index_4, index_5, index_6, index_7, index_8, index_9, index_10) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AureliaSlickgridCustomElement = aurelia_slickgrid_1.AureliaSlickgridCustomElement;
    exports.SlickPaginationCustomElement = slick_pagination_1.SlickPaginationCustomElement;
    exports.SlickgridConfig = slickgrid_config_1.SlickgridConfig;
    // expose all public classes
    // aggregators, editors, formatters, services...
    __export(index_2);
    __export(index_3);
    __export(index_4);
    __export(index_5);
    __export(index_6);
    __export(index_7);
    __export(index_8);
    __export(index_9);
    exports.GraphqlService = index_10.GraphqlService;
    exports.GridOdataService = index_10.GridOdataService;
    function configure(aurelia, callback) {
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./aurelia-slickgrid'));
        aurelia.globalResources(aurelia_pal_1.PLATFORM.moduleName('./slick-pagination'));
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
    exports.configure = configure;
});
//# sourceMappingURL=index.js.map