import { PLATFORM } from 'aurelia-pal';
import { AureliaSlickgridCustomElement } from './aurelia-slickgrid';
import { SlickgridConfig } from './slickgrid-config';
import { CaseType } from './models/caseType';
import { FormElementType } from './models/formElementType';
import { FieldType } from './models/fieldType';
import { FilterConditions } from './filter-conditions/index';
import { FilterTemplates } from './filter-templates/index';
import { Formatters } from './formatters/index';
import { Sorters } from './sorters/index';
import { FilterService } from './services/filter.service';
import { MouseService } from './services/mouse.service';
import { ResizerService } from './services/resizer.service';
import { SortService } from './services/sort.service';
import { GridOdataService } from './services/grid-odata.service';
export function configure(aurelia, callback) {
    aurelia.globalResources(PLATFORM.moduleName('./aurelia-slickgrid'));
    var config = new SlickgridConfig();
    if (typeof callback === 'function') {
        callback(config);
    }
}
export { AureliaSlickgridCustomElement, CaseType, FormElementType, FieldType, FilterConditions, FilterTemplates, Formatters, Sorters, FilterService, MouseService, ResizerService, SortService, GridOdataService, SlickgridConfig };
