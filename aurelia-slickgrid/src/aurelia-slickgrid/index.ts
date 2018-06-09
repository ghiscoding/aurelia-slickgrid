import { PLATFORM } from 'aurelia-pal';
import { AureliaSlickgridCustomElement } from './aurelia-slickgrid';
import { SlickPaginationCustomElement } from './slick-pagination';
import { SlickgridConfig } from './slickgrid-config';
import { Filters } from './filters/index';

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
  aurelia.container.registerTransient(Filters.compoundDate);
  aurelia.container.registerTransient(Filters.compoundInput);
  aurelia.container.registerTransient(Filters.input);
  aurelia.container.registerTransient(Filters.slider);
  aurelia.container.registerTransient(Filters.multipleSelect);
  aurelia.container.registerTransient(Filters.singleSelect);
  aurelia.container.registerTransient(Filters.select);

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
