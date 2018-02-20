import { PLATFORM } from 'aurelia-pal';
import { AureliaSlickgridCustomElement } from './aurelia-slickgrid';
import { SlickPaginationCustomElement } from './slick-pagination';
import { SlickgridConfig } from './slickgrid-config';

// models
import { CaseType } from './models/caseType';
import { Column } from './models/column.interface';
import { Filter } from './models/filter.interface';
import { FilterArguments } from './models/filterArguments.interface';
import { FilterCallback } from './models/filterCallback.interface';
import { FilterCondition } from './models/filterCondition.interface';
import { FilterType } from './models/filterType.enum';
import { Formatter } from './models/formatter.interface';
import { FormElementType } from './models/formElementType';
import { FieldType } from './models/fieldType.enum';
import { GraphqlResult } from './models/graphqlResult.interface';
import { GraphqlServiceOption } from './models/graphqlServiceOption.interface';
import { GridOption } from './models/gridOption.interface';
import { OnEventArgs } from './models/onEventArgs.interface';

// editors, formatters, ...
import { Editors } from './editors/index';
import { FilterConditions } from './filter-conditions/index';
import { Filters } from './filters/index';
import { Formatters } from './formatters/index';
import { Sorters } from './sorters/index';

// services and utilities
import { ControlAndPluginService } from './services/controlAndPlugin.service';
import { FilterService } from './services/filter.service';
import { GraphqlService } from './services/graphql.service';
import { GridExtraUtils } from './services/gridExtraUtils';
import { GridExtraService } from './services/gridExtra.service';
import { GridEventService } from './services/gridEvent.service';
import { GridOdataService } from './services/grid-odata.service';
import { ResizerService } from './services/resizer.service';
import { SortService } from './services/sort.service';

export function configure(aurelia: any, callback: any) {
  aurelia.globalResources(PLATFORM.moduleName('./aurelia-slickgrid'));
  aurelia.globalResources(PLATFORM.moduleName('./slick-pagination'));

  const config = new SlickgridConfig();

  if (typeof callback === 'function') {
    callback(config);
  }
}

export {
  AureliaSlickgridCustomElement,
  SlickPaginationCustomElement,

  // models
  CaseType,
  Column,
  Formatter,
  GraphqlResult,
  GraphqlServiceOption,
  GridOption,
  Filter,
  FilterArguments,
  FilterCallback,
  FilterCondition,
  FilterType,
  FormElementType,
  FieldType,
  OnEventArgs,

  Editors,
  Filters,
  FilterConditions,
  Formatters,
  Sorters,

  // services
  ControlAndPluginService,
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
