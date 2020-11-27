import { FrameworkConfiguration } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { AureliaSlickgridCustomElement } from './custom-elements/aurelia-slickgrid';
import { SlickPaginationCustomElement } from './custom-elements/slick-pagination';
import { SlickgridConfig } from './slickgrid-config';
import { Filters } from './filters/index';

// expose all public classes
// aggregators, editors, formatters, services...
export * from './aggregators/index';
export * from './editors/index';
export * from './filters/index';
export * from './filter-conditions/index';
export * from './formatters/index';
export * from './models/index';
export * from './services/index';
export * from './sorters/index';
export { GroupTotalFormatters } from '@slickgrid-universal/common';

export function configure(aurelia: FrameworkConfiguration, callback: (instance: SlickgridConfig) => void) {
  aurelia.globalResources(PLATFORM.moduleName('./custom-elements/aurelia-slickgrid'));
  aurelia.globalResources(PLATFORM.moduleName('./custom-elements/slick-pagination'));
  aurelia.globalResources(PLATFORM.moduleName('./value-converters/asgDateFormat'));
  aurelia.globalResources(PLATFORM.moduleName('./value-converters/asgNumber'));

  // must register a transient so the container will get a new instance everytime
  aurelia.container.registerTransient(Filters.autoComplete);
  aurelia.container.registerTransient(Filters.compoundDate);
  aurelia.container.registerTransient(Filters.compoundInput);
  aurelia.container.registerTransient(Filters.compoundInputNumber);
  aurelia.container.registerTransient(Filters.compoundInputPassword);
  aurelia.container.registerTransient(Filters.compoundInputText);
  aurelia.container.registerTransient(Filters.compoundSlider);
  aurelia.container.registerTransient(Filters.dateRange);
  aurelia.container.registerTransient(Filters.input);
  aurelia.container.registerTransient(Filters.inputMask);
  aurelia.container.registerTransient(Filters.inputNumber);
  aurelia.container.registerTransient(Filters.inputPassword);
  aurelia.container.registerTransient(Filters.inputText);
  aurelia.container.registerTransient(Filters.multipleSelect);
  aurelia.container.registerTransient(Filters.singleSelect);
  aurelia.container.registerTransient(Filters.select);
  aurelia.container.registerTransient(Filters.slider);
  aurelia.container.registerTransient(Filters.sliderRange);

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
