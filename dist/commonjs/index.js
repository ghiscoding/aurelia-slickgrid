"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_pal_1 = require("aurelia-pal");
var aurelia_slickgrid_1 = require("./aurelia-slickgrid");
exports.AureliaSlickgridCustomElement = aurelia_slickgrid_1.AureliaSlickgridCustomElement;
var slick_pagination_1 = require("./slick-pagination");
exports.SlickPaginationCustomElement = slick_pagination_1.SlickPaginationCustomElement;
var slickgrid_config_1 = require("./slickgrid-config");
exports.SlickgridConfig = slickgrid_config_1.SlickgridConfig;
var index_1 = require("./filters/index");
// expose all public classes
// aggregators, editors, formatters, services...
__export(require("./models/index"));
__export(require("./formatters/index"));
__export(require("./grouping-formatters/index"));
__export(require("./sorters/index"));
__export(require("./aggregators/index"));
__export(require("./editors/index"));
__export(require("./filter-conditions/index"));
__export(require("./filters/index"));
// export the Backend Services
var index_2 = require("./services/index");
exports.GraphqlService = index_2.GraphqlService;
exports.GridOdataService = index_2.GridOdataService;
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
//# sourceMappingURL=index.js.map