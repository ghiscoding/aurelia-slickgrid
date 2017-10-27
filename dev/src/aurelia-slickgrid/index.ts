import { PLATFORM } from 'aurelia-pal';
import { AureliaSlickgridCustomElement } from './aurelia-slickgrid';
import { SlickPaginationCustomElement } from './slick-pagination';
import { SlickgridConfig } from './slickgrid-config';

import { CaseType } from './models/caseType';
import { Column } from './models/column.interface';
import { Formatter } from './models/formatter.interface';
import { GridOption } from './models/gridOption.interface';
import { FormElementType } from './models/formElementType';
import { FieldType } from './models/fieldType';
import { OnCellClickArgs } from './models/onCellClickArgs.interface';

import { Editors } from './editors/index';
import { FilterConditions } from './filter-conditions/index';
import { FilterTemplates } from './filter-templates/index';
import { Formatters } from './formatters/index';
import { Sorters } from './sorters/index';

import { FilterService } from './services/filter.service';
import { GridEventService } from './services/gridEvent.service';
import { ResizerService } from './services/resizer.service';
import { SortService } from './services/sort.service';
import { GridOdataService } from './services/grid-odata.service';

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

  FilterService,
  GridEventService,
  ResizerService,
  SortService,
  GridOdataService,

  SlickgridConfig
};
