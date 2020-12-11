export * from '@slickgrid-universal/common';
import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';

import { AureliaSlickgridCustomElement } from './custom-elements/aurelia-slickgrid';
import { SlickPaginationCustomElement } from './custom-elements/slick-pagination';
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
  UniversalPubSubService,
  UniversalTranslateService,
  disposeAllSubscriptions
} from './services/index';

export function configure(aurelia: FrameworkConfiguration, callback: (instance: SlickgridConfig) => void) {
  aurelia.globalResources(PLATFORM.moduleName('./custom-elements/aurelia-slickgrid'));
  aurelia.globalResources(PLATFORM.moduleName('./custom-elements/slick-pagination'));
  aurelia.globalResources(PLATFORM.moduleName('./value-converters/asgDateFormat'));
  aurelia.globalResources(PLATFORM.moduleName('./value-converters/asgNumber'));

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
