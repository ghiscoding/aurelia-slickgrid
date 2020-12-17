export * from '@slickgrid-universal/common';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FrameworkConfiguration, NewInstance } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

import { AureliaSlickgridCustomElement } from './custom-elements/aurelia-slickgrid';
import { SlickPaginationCustomElement } from './custom-elements/slick-pagination';
import { SlickgridEventAggregator } from './custom-elements/slickgridEventAggregator';
import { SlickgridConfig } from './slickgrid-config';
import {
  AureliaGridInstance,
  AureliaViewOutput,
  Formatter,
  GridOption,
  RowDetailView,
  SlickGrid,
  ViewModelBindableData,
  ViewModelBindableInputData
} from './models/index';

// re-export only the Aurelia interfaces (models), some of which were overriden
export {
  AureliaGridInstance,
  AureliaViewOutput,
  Formatter,
  GridOption,
  RowDetailView,
  SlickGrid,
  ViewModelBindableData,
  ViewModelBindableInputData
};

// expose all public classes
export {
  AureliaUtilService,
  ResizerService,
  PubSubService,
  TranslaterService,
  disposeAllSubscriptions
} from './services/index';

export function configure(aurelia: FrameworkConfiguration, callback: (instance: SlickgridConfig) => void) {
  aurelia.globalResources(PLATFORM.moduleName('./custom-elements/aurelia-slickgrid'));
  aurelia.globalResources(PLATFORM.moduleName('./custom-elements/slick-pagination'));
  aurelia.globalResources(PLATFORM.moduleName('./value-converters/asgDateFormat'));
  aurelia.globalResources(PLATFORM.moduleName('./value-converters/asgNumber'));

  // register a local (internal) event aggregator
  aurelia.container.registerResolver(SlickgridEventAggregator, NewInstance.of(EventAggregator).as(SlickgridEventAggregator));

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
