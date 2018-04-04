import { PLATFORM } from 'aurelia-pal';
import { AureliaSlickgridCustomElement } from './aurelia-slickgrid';
import { SlickPaginationCustomElement } from './slick-pagination';
import { SlickgridConfig } from './slickgrid-config';
import { Filters, PLUGIN_NAME as FILTER_PLUGIN_NAME } from './filters/index';
// expose all public classes
// aggregators, editors, formatters, services...
export * from './models/index';
export * from './services/index';
export * from './formatters/index';
export * from './grouping-formatters/index';
export * from './sorters/index';
export * from './aggregators/index';
export * from './editors/index';
export * from './filter-conditions/index';
export * from './filters/index';
export function configure(aurelia, callback) {
    aurelia.globalResources(PLATFORM.moduleName('./aurelia-slickgrid'));
    aurelia.globalResources(PLATFORM.moduleName('./slick-pagination'));
    // must register a transient so the container will get a new instance everytime
    aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.compoundDate);
    aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.compoundInput);
    aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.input);
    aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.multipleSelect);
    aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.singleSelect);
    aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.select);
    const config = new SlickgridConfig();
    aurelia.container.registerInstance(SlickgridConfig, config);
    if (typeof callback === 'function') {
        callback(config);
    }
}
export { AureliaSlickgridCustomElement, SlickPaginationCustomElement, SlickgridConfig };
//# sourceMappingURL=index.js.map