import { PLATFORM } from 'aurelia-pal';
import { AureliaSlickgridCustomElement } from './aurelia-slickgrid';
import { SlickPaginationCustomElement } from './slick-pagination';
import { SlickgridConfig } from './slickgrid-config';
import { Filters, PLUGIN_NAME as FILTER_PLUGIN_NAME } from './filters/index';

const AURELIA_SERVICE_NAME = 'AURELIA_SLICKGRID_SERVICES';

// import all Services separately
import {
  CollectionService,
  ControlAndPluginService,
  ExportService,
  FilterService,
  GraphqlService,
  GridEventService,
  GridService,
  GridStateService,
  GridOdataService,
  GroupingAndColspanService,
  OdataService,
  ResizerService,
  SortService,
} from './services/index';

// expose all public classes
// aggregators, editors, formatters, services...
export * from './models/index';
export * from './formatters/index';
export * from './grouping-formatters/index';
export * from './sorters/index';

export * from './aggregators/index';
export * from './editors/index';
export * from './filter-conditions/index';
export * from './filters/index';

// export the Backend Services
export { GraphqlService, GridOdataService } from './services/index';

export function configure(aurelia: any, callback: any) {
  aurelia.globalResources(PLATFORM.moduleName('./aurelia-slickgrid'));
  aurelia.globalResources(PLATFORM.moduleName('./slick-pagination'));

  // must register a transient so the container will get a new instance everytime
  aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.compoundDate);
  aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.compoundInput);
  aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.input);
  aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.multipleSelect);
  aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.singleSelect);
  aurelia.container.registerTransient(FILTER_PLUGIN_NAME, Filters.select);

  // register all Services as transient to support multiple grids
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, ControlAndPluginService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, ExportService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, FilterService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, GraphqlService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, GridEventService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, GridService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, GridStateService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, GridOdataService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, GroupingAndColspanService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, OdataService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, ResizerService);
  aurelia.container.registerTransient(AURELIA_SERVICE_NAME, SortService);

  const config = new SlickgridConfig();

  aurelia.container.registerInstance(SlickgridConfig, config);

  if (typeof callback === 'function') {
    callback(config);
  }
}

export {
  AureliaSlickgridCustomElement,
  SlickPaginationCustomElement,
  SlickgridConfig
};
