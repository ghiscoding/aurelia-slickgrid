// import 3rd party lib multiple-select for the tests
// import '../../../assets/lib/multiple-select/multiple-select';

import { BindingEngine } from 'aurelia-binding';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { BindingSignaler } from 'aurelia-templating-resources';
import { Column, FilterArguments, GridOption, SlickGrid } from '../../models';
import { CollectionService } from './../../services/collection.service';
import { Filters } from '..';
import { SelectFilter } from '../selectFilter';

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
} as unknown as SlickGrid;

describe('SelectFilter', () => {
  let ea: EventAggregator;
  let bindingEngine: BindingEngine;
  let i18n: I18N;
  let divContainer: HTMLDivElement;
  let filter: SelectFilter;
  let filterArguments: FilterArguments;
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

    mockColumn = {
      id: 'gender', field: 'gender', filterable: true,
      filter: {
        model: Filters.select,
        collection: [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }]
      }
    };

    filterArguments = {
      grid: gridStub,
      columnDef: mockColumn,
      callback: jest.fn()
    };

    filter = new SelectFilter(bindingEngine, collectionService, i18n);
  });

  afterEach(() => {
    filter.destroy();
  });

  it('should throw an error when multiple-select.js is not provided or imported', () => {
    expect(() => filter.init(filterArguments, true)).toThrowError(`multiple-select.js was not found, make sure to read the HOWTO Wiki on how to install it.`);
  });
});
