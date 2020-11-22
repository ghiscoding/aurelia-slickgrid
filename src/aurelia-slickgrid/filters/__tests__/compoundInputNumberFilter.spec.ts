import { Column, FilterArguments, GridOption } from '../../models';
import { Filters } from '..';
import { CompoundInputNumberFilter } from '../compoundInputNumberFilter';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { BindingSignaler } from 'aurelia-templating-resources';

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

describe('CompoundInputNumberFilter', () => {
  let ea: EventAggregator;
  let i18n: I18N;
  let divContainer: HTMLDivElement;
  let filter: CompoundInputNumberFilter;
  let filterArguments: FilterArguments;
  let spyGetHeaderRow;
  let mockColumn: Column;

  beforeEach(() => {
    ea = new EventAggregator();
    i18n = new I18N(ea, new BindingSignaler());

    divContainer = document.createElement('div');
    divContainer.innerHTML = template;
    document.body.appendChild(divContainer);
    spyGetHeaderRow = jest.spyOn(gridStub, 'getHeaderRowColumn').mockReturnValue(divContainer);

    mockColumn = { id: 'duration', field: 'duration', filterable: true, filter: { model: Filters.input, operator: 'EQ' } };
    filterArguments = {
      grid: gridStub,
      columnDef: mockColumn,
      callback: jest.fn()
    };

    i18n.setup({
      resources: {
        en: {
          translation: {
            CONTAINS: 'Contains',
            EQUALS: 'Equals',
            ENDS_WITH: 'Ends With',
            STARTS_WITH: 'Starts With',
          }
        },
        fr: {
          translation:
          {
            CONTAINS: 'Contient',
            EQUALS: 'Égale',
            ENDS_WITH: 'Se termine par',
            STARTS_WITH: 'Commence par',
          }
        }
      },
      lng: 'en',
      fallbackLng: 'en',
      debug: false
    });

    filter = new CompoundInputNumberFilter(i18n);
  });

  afterEach(() => {
    filter.destroy();
  });

  it('should throw an error when trying to call init without any arguments', () => {
    expect(() => filter.init(null as any)).toThrowError('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
  });

  it('should initialize the filter and expect an input of type number', () => {
    filter.init(filterArguments);
    const filterCount = divContainer.querySelectorAll('.search-filter.filter-duration').length;

    expect(spyGetHeaderRow).toHaveBeenCalled();
    expect(filterCount).toBe(1);
    expect(filter.inputType).toBe('number');
  });
});
