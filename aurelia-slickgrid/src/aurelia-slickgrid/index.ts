import { PLATFORM } from 'aurelia-pal';
import { AureliaSlickgridCustomElement } from './aurelia-slickgrid';
import { SlickPaginationCustomElement } from './slick-pagination';
import { SlickgridConfig } from './slickgrid-config';

// models
import {
  BackendService,
  BackendServiceApi,
  CaseType,
  Column,
  DelimiterType,
  ExportOption,
  FileType,
  Filter,
  FilterArguments,
  FilterCallback,
  FilterCondition,
  FilterType,
  Formatter,
  FormElementType,
  FieldType,
  GraphqlResult,
  GraphqlServiceOption,
  GridOption,
  OnEventArgs,
  SearchTerm
} from './models/index';

// editors, formatters, ...
import { Editors } from './editors/index';
import { FilterConditions } from './filter-conditions/index';
import {
  Filters,
  PLUGIN_NAME as FILTER_PLUGIN_NAME
} from './filters/index';
import { Formatters } from './formatters/index';
import { Sorters } from './sorters/index';

// services and utilities
import {
  ControlAndPluginService,
  ExportService,
  FilterService,
  GraphqlService,
  GridExtraUtils,
  GridExtraService,
  GridEventService,
  GridOdataService,
  ResizerService,
  SortService
} from './services/index';

export function configure(aurelia: any, callback: any) {
  aurelia.globalResources(PLATFORM.moduleName('./aurelia-slickgrid'));
  aurelia.globalResources(PLATFORM.moduleName('./slick-pagination'));

  aurelia.container.registerSingleton(FILTER_PLUGIN_NAME, Filters.input);
  aurelia.container.registerSingleton(FILTER_PLUGIN_NAME, Filters.multipleSelect);
  aurelia.container.registerSingleton(FILTER_PLUGIN_NAME, Filters.singleSelect);
  aurelia.container.registerSingleton(FILTER_PLUGIN_NAME, Filters.select);

  const config = new SlickgridConfig();

  if (typeof callback === 'function') {
    callback(config);
  }
}

export {
  AureliaSlickgridCustomElement,
  SlickPaginationCustomElement,

  // models
  BackendService,
  BackendServiceApi,
  CaseType,
  Column,
  DelimiterType,
  ExportOption,
  FileType,
  Formatter,
  GraphqlResult,
  GraphqlServiceOption,
  GridOption,
  Filter,
  FilterArguments,
  FilterCallback,
  FilterCondition,
  FilterType,
  FILTER_PLUGIN_NAME,
  FormElementType,
  FieldType,
  OnEventArgs,
  SearchTerm,

  Editors,
  Filters,
  FilterConditions,
  Formatters,
  Sorters,

  // services
  ControlAndPluginService,
  ExportService,
  FilterService,
  GraphqlService,
  GridEventService,
  GridExtraUtils,
  GridExtraService,
  GridOdataService,
  ResizerService,
  SortService,

  SlickgridConfig
};
