import { PLATFORM } from 'aurelia-pal';
import { AureliaSlickgridCustomElement } from './aurelia-slickgrid';
import { SlickPaginationCustomElement } from './slick-pagination';
import { SlickgridConfig } from './slickgrid-config';

// models
import { CaseType } from './models/caseType';
import { Column } from './models/column.interface';
import { Formatter } from './models/formatter.interface';
import { GridOption } from './models/gridOption.interface';
import { FormElementType } from './models/formElementType';
import { FieldType } from './models/fieldType';
import { OnCellClickArgs } from './models/onCellClickArgs.interface';

// editors, formatters, ...
import { Editors } from './editors/index';
import { FilterConditions } from './filter-conditions/index';
import { FilterTemplates } from './filter-templates/index';
import { Formatters } from './formatters/index';
import { Sorters } from './sorters/index';

// services and utilities
import { FilterService } from './services/filter.service';
import { GraphqlService } from './services/graphql.service';
import { GridExtraUtils } from './services/gridExtraUtils';
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
  CaseType,
  Column,
  Formatter,
  GridOption,
  FormElementType,
  FieldType,
  OnCellClickArgs,

  Editors,
  FilterConditions,
  FilterTemplates,
  Formatters,
  Sorters,

  // services
  FilterService,
  GraphqlService,
  GridExtraUtils,
  GridEventService,
  GridOdataService,
  ResizerService,
  SortService,

  SlickgridConfig
};
