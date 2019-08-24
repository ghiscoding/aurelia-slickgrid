// import 3rd party lib multiple-select for the tests
import '../../../assets/lib/multiple-select/multiple-select';

import { BindingEngine } from 'aurelia-binding';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { BindingSignaler } from 'aurelia-templating-resources';
import { Column, FilterArguments, GridOption } from '../../models';
import { CollectionService } from './../../services/collection.service';
import { Filters } from '..';
import { MultipleSelectFilter } from '../multipleSelectFilter';

const containerId = 'demo-container';

// define a <div> container to simulate the grid container
const template = `<div id="${containerId}"></div>`;

const gridOptionMock = {
  enableFiltering: true,
  enableFilterTrimWhiteSpace: true,
} as GridOption;

const gridStub = {
  getOptions: () => gridOptionMock,
  getColumns: jest.fn(),
  getHeaderRowColumn: jest.fn(),
  render: jest.fn(),
};

describe('SelectFilter', () => {
  let ea: EventAggregator;
  let bindingEngine: BindingEngine;
  let i18n: I18N;
  let divContainer: HTMLDivElement;
  let filter: MultipleSelectFilter;
  let filterArguments: FilterArguments;
  let spyGetHeaderRow;
  let mockColumn: Column;
  let collectionService: CollectionService;

  beforeEach(() => {
    ea = new EventAggregator();
    bindingEngine = new BindingEngine();
    i18n = new I18N(ea, new BindingSignaler());
    collectionService = new CollectionService(i18n);

    divContainer = document.createElement('div');
    divContainer.innerHTML = template;
    document.body.appendChild(divContainer);
    spyGetHeaderRow = jest.spyOn(gridStub, 'getHeaderRowColumn').mockReturnValue(divContainer);

    mockColumn = {
      id: 'gender', field: 'gender', filterable: true,
      filter: {
        model: Filters.multipleSelect,
        collection: [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }]
      }
    };

    filterArguments = {
      grid: gridStub,
      columnDef: mockColumn,
      callback: jest.fn()
    };

    i18n.setup({
      resources: {
        en: {
          translation: {
            ALL_SELECTED: 'All Selected',
            FALSE: 'False',
            FEMALE: 'Female',
            MALE: 'Male',
            OK: 'OK',
            OTHER: 'Other',
            TRUE: 'True',
            SELECT_ALL: 'Select All',
            X_OF_Y_SELECTED: '# of % selected',
          }
        },
        fr: {
          translation:
          {
            ALL_SELECTED: 'Tout sélectionnés',
            FALSE: 'Faux',
            FEMALE: 'Femme',
            MALE: 'Mâle',
            OK: 'Terminé',
            OTHER: 'Autre',
            TRUE: 'Vrai',
            SELECT_ALL: 'Sélectionner tout',
            X_OF_Y_SELECTED: '# de % sélectionnés',
          }
        }
      },
      lng: 'en',
      fallbackLng: 'en',
      debug: false
    });

    filter = new MultipleSelectFilter(bindingEngine, collectionService, i18n);
  });

  afterEach(() => {
    filter.destroy();
  });

  it('should be a multiple-select filter', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    filter = new MultipleSelectFilter(bindingEngine, collectionService, i18n);
    filter.init(filterArguments, true);
    const filterCount = divContainer.querySelectorAll('select.ms-filter.search-filter.filter-gender').length;

    expect(spyGetHeaderRow).toHaveBeenCalled();
    expect(filterCount).toBe(1);
    expect(filter.isMultipleSelect).toBe(true);
  });
});
