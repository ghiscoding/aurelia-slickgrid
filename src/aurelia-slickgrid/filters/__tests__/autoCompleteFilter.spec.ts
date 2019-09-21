import { BindingEngine } from 'aurelia-binding';
import { HttpClient } from 'aurelia-fetch-client';
import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';
import { Filters } from '..';
import { AutoCompleteFilter } from '../autoCompleteFilter';
import { AutocompleteOption, Column, FieldType, FilterArguments, GridOption, OperatorType } from '../../models';
import { CollectionService } from './../../services/collection.service';

const containerId = 'demo-container';

// define a <div> container to simulate the grid container
const template = `<div id="${containerId}"></div>`;

const bindingEngineStub = {
  createBindingExpression: jest.fn(),
  collectionObserver: jest.fn(),
  expressionObserver: jest.fn(),
  propertyObserver: jest.fn(),
  parseExpression: jest.fn(),
  registerAdapter: jest.fn(),
} as unknown as BindingEngine;

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

class HttpStub extends HttpClient {
  status: number;
  statusText: string;
  object: any = {};
  returnKey: string;
  returnValue: any;
  responseHeaders: any;

  fetch(input, init) {
    let request;
    const responseInit: any = {};
    responseInit.headers = new Headers()

    for (const name in this.responseHeaders || {}) {
      if (name) {
        responseInit.headers.set(name, this.responseHeaders[name]);
      }
    }

    responseInit.status = this.status || 200;

    if (Request.prototype.isPrototypeOf(input)) {
      request = input;
    } else {
      request = new Request(input, init || {});
    }
    if (request.body && request.body.type) {
      request.headers.set('Content-Type', request.body.type);
    }

    const promise = Promise.resolve().then(() => {
      if (request.headers.get('Content-Type') === 'application/json' && request.method !== 'GET') {
        return request.json().then((object) => {
          object[this.returnKey] = this.returnValue;
          const data = JSON.stringify(object);
          const response = new Response(data, responseInit);
          return this.status >= 200 && this.status < 300 ? Promise.resolve(response) : Promise.reject(response);
        });
      } else {
        const data = JSON.stringify(this.object);
        const response = new Response(data, responseInit);
        return this.status >= 200 && this.status < 300 ? Promise.resolve(response) : Promise.reject(response);
      }
    });
    return promise;
  }
}

describe('AutoCompleteFilter', () => {
  let ea: EventAggregator;
  let i18n: I18N;
  let divContainer: HTMLDivElement;
  let filter: AutoCompleteFilter;
  let filterArguments: FilterArguments;
  let spyGetHeaderRow;
  let mockColumn: Column;
  let collectionService: CollectionService;
  const http = new HttpStub();

  beforeEach(() => {
    ea = new EventAggregator();
    i18n = new I18N(ea, new BindingSignaler());
    collectionService = new CollectionService(i18n);

    divContainer = document.createElement('div');
    divContainer.innerHTML = template;
    document.body.appendChild(divContainer);
    spyGetHeaderRow = jest.spyOn(gridStub, 'getHeaderRowColumn').mockReturnValue(divContainer);

    mockColumn = {
      id: 'gender', field: 'gender', filterable: true,
      filter: {
        model: Filters.autoComplete,
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
            FEMALE: 'Female',
            MALE: 'Male',
            OK: 'OK',
            OTHER: 'Other',
            SELECT_ALL: 'Select All',
            X_OF_Y_SELECTED: '# of % selected',
          }
        },
        fr: {
          translation:
          {
            ALL_SELECTED: 'Tout sélectionnés',
            FEMALE: 'Femme',
            MALE: 'Mâle',
            OK: 'Terminé',
            OTHER: 'Autre',
            SELECT_ALL: 'Sélectionner tout',
            X_OF_Y_SELECTED: '# de % sélectionnés',
          }
        }
      },
      lng: 'en',
      fallbackLng: 'en',
      debug: false
    });

    filter = new AutoCompleteFilter(bindingEngineStub, collectionService);
  });

  afterEach(() => {
    filter.destroy();
  });

  it('should throw an error when trying to call init without any arguments', () => {
    expect(() => filter.init(null)).toThrowError('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
  });

  it('should throw an error when there is no collection provided in the filter property', (done) => {
    try {
      mockColumn.filter.collection = undefined;
      filter.init(filterArguments);
    } catch (e) {
      expect(e.toString()).toContain(`[Aurelia-SlickGrid] You need to pass a "collection" (or "collectionAsync") for the AutoComplete Filter to work correctly.`);
      done();
    }
  });

  it('should throw an error when collection is not a valid array', (done) => {
    try {
      // @ts-ignore
      mockColumn.filter.collection = { hello: 'world' };
      filter.init(filterArguments);
    } catch (e) {
      expect(e.toString()).toContain(`The "collection" passed to the Autocomplete Filter is not a valid array.`);
      done();
    }
  });

  it('should initialize the filter', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    filter.init(filterArguments);
    const filterCount = divContainer.querySelectorAll('input.search-filter.filter-gender').length;
    const autocompleteUlElms = document.body.querySelectorAll<HTMLUListElement>('ul.ui-autocomplete');

    expect(autocompleteUlElms.length).toBe(1);
    expect(spyGetHeaderRow).toHaveBeenCalled();
    expect(filterCount).toBe(1);
  });

  it('should initialize the filter even when user define his own filter options', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    mockColumn.filter.filterOptions = { minLength: 3 } as AutocompleteOption;
    filter.init(filterArguments);
    const filterCount = divContainer.querySelectorAll('input.search-filter.filter-gender').length;
    const autocompleteUlElms = document.body.querySelectorAll<HTMLUListElement>('ul.ui-autocomplete');

    expect(autocompleteUlElms.length).toBe(1);
    expect(spyGetHeaderRow).toHaveBeenCalled();
    expect(filterCount).toBe(1);
  });

  it('should have a placeholder when defined in its column definition', () => {
    const testValue = 'test placeholder';
    mockColumn.filter.placeholder = testValue;
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];

    filter.init(filterArguments);
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.search-filter.filter-gender');

    expect(filterElm.placeholder).toBe(testValue);
  });

  it('should call "setValues" and expect that value to be in the callback when triggered', () => {
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];

    filter.init(filterArguments);
    filter.setValues('male');
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');

    filterElm.focus();
    filterElm.dispatchEvent(new (window.window as any).KeyboardEvent('keydown', { keyCode: 109, bubbles: true, cancelable: true }));
    filterElm.dispatchEvent(new (window.window as any).KeyboardEvent('keyup', { keyCode: 109, bubbles: true, cancelable: true }));
    const filterFilledElms = divContainer.querySelectorAll<HTMLInputElement>('input.filter-gender.filled');
    const autocompleteListElms = document.body.querySelectorAll<HTMLLIElement>('ul.ui-autocomplete li');

    expect(filterFilledElms.length).toBe(1);
    // expect(autocompleteListElms.length).toBe(2);
    expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, operator: 'EQ', searchTerms: ['male'], shouldTriggerQuery: true });
  });

  it('should call "setValues" with extra spaces at the beginning of the searchTerms and trim value when "enableFilterTrimWhiteSpace" is enabled in grid options', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    gridOptionMock.enableFilterTrimWhiteSpace = true;
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filter.init(filterArguments);
    filter.setValues('    abc ');
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');

    filterElm.focus();
    filterElm.dispatchEvent(new (window.window as any).KeyboardEvent('keyup', { keyCode: 97, bubbles: true, cancelable: true }));
    const filterFilledElms = divContainer.querySelectorAll<HTMLInputElement>('input.filter-gender.filled');

    expect(filterFilledElms.length).toBe(1);
    expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, operator: 'EQ', searchTerms: ['abc'], shouldTriggerQuery: true });
  });

  it('should call "setValues" with extra spaces at the beginning of the searchTerms and trim value when "enableTrimWhiteSpace" is enabled in the column filter', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    gridOptionMock.enableFilterTrimWhiteSpace = false;
    mockColumn.filter.enableTrimWhiteSpace = true;
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filter.init(filterArguments);
    filter.setValues('    abc ');
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');

    filterElm.focus();
    filterElm.dispatchEvent(new (window.window as any).KeyboardEvent('keyup', { keyCode: 97, bubbles: true, cancelable: true }));
    const filterFilledElms = divContainer.querySelectorAll<HTMLInputElement>('input.filter-gender.filled');

    expect(filterFilledElms.length).toBe(1);
    expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, operator: 'EQ', searchTerms: ['abc'], shouldTriggerQuery: true });
  });

  it('should trigger the callback method when user types something in the input', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filter.init(filterArguments);
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');

    filterElm.focus();
    filterElm.value = 'a';
    filterElm.dispatchEvent(new (window.window as any).KeyboardEvent('keyup', { keyCode: 97, bubbles: true, cancelable: true }));
    const autocompleteListElms = document.body.querySelectorAll<HTMLLIElement>('ul.ui-autocomplete li');

    // expect(autocompleteListElms.length).toBe(2);
    expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, operator: 'EQ', searchTerms: ['a'], shouldTriggerQuery: true });
  });

  it('should create the input filter with a default search term when passed as a filter argument', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    filterArguments.searchTerms = ['xyz'];

    filter.init(filterArguments);
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');

    expect(filterElm.value).toBe('xyz');
  });

  it('should expect the input not to have the "filled" css class when the search term provided is an empty string', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    filterArguments.searchTerms = [''];

    filter.init(filterArguments);
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');
    const filterFilledElms = divContainer.querySelectorAll<HTMLInputElement>('input.filter-gender.filled');

    expect(filterElm.value).toBe('');
    expect(filterFilledElms.length).toBe(0);
  });

  it('should trigger a callback with the clear filter set when calling the "clear" method', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    filterArguments.searchTerms = ['xyz'];

    filter.init(filterArguments);
    filter.clear();
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');
    const filterFilledElms = divContainer.querySelectorAll<HTMLInputElement>('input.filter-gender.filled');

    expect(filterElm.value).toBe('');
    expect(filterFilledElms.length).toBe(0);
    expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, clearFilterTriggered: true, shouldTriggerQuery: true });
  });

  it('should trigger a callback with the clear filter but without querying when when calling the "clear" method with False as argument', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    filterArguments.searchTerms = ['xyz'];

    filter.init(filterArguments);
    filter.clear(false);
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');
    const filterFilledElms = divContainer.querySelectorAll<HTMLInputElement>('input.filter-gender.filled');

    expect(filterElm.value).toBe('');
    expect(filterFilledElms.length).toBe(0);
    expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, clearFilterTriggered: true, shouldTriggerQuery: false });
  });

  it('should create the filter with a default search term when using "collectionAsync" as a Promise', (done) => {
    jest.spyOn(bindingEngineStub, 'collectionObserver').mockReturnValue({ subscribe: jest.fn() });
    jest.spyOn(bindingEngineStub, 'propertyObserver').mockReturnValue({ subscribe: jest.fn() });
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    const mockCollection = ['male', 'female'];
    mockColumn.filter.collectionAsync = new Promise((resolve) => setTimeout(() => resolve(mockCollection)));

    filterArguments.searchTerms = ['female'];
    filter.init(filterArguments);

    setTimeout(() => {
      const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');
      const autocompleteUlElms = document.body.querySelectorAll<HTMLUListElement>('ul.ui-autocomplete');
      filter.setValues('male');

      filterElm.focus();
      filterElm.dispatchEvent(new (window.window as any).KeyboardEvent('keyup', { keyCode: 97, bubbles: true, cancelable: true }));
      const filterFilledElms = divContainer.querySelectorAll<HTMLInputElement>('input.filter-gender.filled');

      expect(autocompleteUlElms.length).toBe(1);
      expect(filterFilledElms.length).toBe(1);
      expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, operator: 'EQ', searchTerms: ['male'], shouldTriggerQuery: true });
      done();
    });
  });

  it('should create the filter with a default search term when using "collectionAsync" as a Promise with content to simulate http-client', (done) => {
    jest.spyOn(bindingEngineStub, 'collectionObserver').mockReturnValue({ subscribe: jest.fn() });
    jest.spyOn(bindingEngineStub, 'propertyObserver').mockReturnValue({ subscribe: jest.fn() });
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    const mockCollection = ['male', 'female'];
    mockColumn.filter.collectionAsync = new Promise((resolve) => setTimeout(() => resolve({ content: mockCollection })));

    filterArguments.searchTerms = ['female'];
    filter.init(filterArguments);

    setTimeout(() => {
      const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');
      const autocompleteUlElms = document.body.querySelectorAll<HTMLUListElement>('ul.ui-autocomplete');
      filter.setValues('male');

      filterElm.focus();
      filterElm.dispatchEvent(new (window.window as any).KeyboardEvent('keyup', { keyCode: 97, bubbles: true, cancelable: true }));
      const filterFilledElms = divContainer.querySelectorAll<HTMLInputElement>('input.filter-gender.filled');

      expect(autocompleteUlElms.length).toBe(1);
      expect(filterFilledElms.length).toBe(1);
      expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, operator: 'EQ', searchTerms: ['male'], shouldTriggerQuery: true });
      done();
    });
  });

  it('should create the filter with a default search term when using "collectionAsync" is a Fetch Promise', (done) => {
    jest.spyOn(bindingEngineStub, 'collectionObserver').mockReturnValue({ subscribe: jest.fn() });
    jest.spyOn(bindingEngineStub, 'propertyObserver').mockReturnValue({ subscribe: jest.fn() });
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    const mockCollection = ['male', 'female'];

    http.status = 200;
    http.object = mockCollection;
    http.returnKey = 'date';
    http.returnValue = '6/24/1984';
    http.responseHeaders = { accept: 'json' };
    mockColumn.filter.collectionAsync = http.fetch('/api', { method: 'GET' });

    filterArguments.searchTerms = ['female'];
    filter.init(filterArguments);

    setTimeout(() => {
      const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-gender');
      const autocompleteUlElms = document.body.querySelectorAll<HTMLUListElement>('ul.ui-autocomplete');
      filter.setValues('male');

      filterElm.focus();
      filterElm.dispatchEvent(new (window.window as any).KeyboardEvent('keyup', { keyCode: 97, bubbles: true, cancelable: true }));
      const filterFilledElms = divContainer.querySelectorAll<HTMLInputElement>('input.filter-gender.filled');

      expect(autocompleteUlElms.length).toBe(1);
      expect(filterFilledElms.length).toBe(1);
      expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, operator: 'EQ', searchTerms: ['male'], shouldTriggerQuery: true });
      done();
    });
  });

  it('should create the filter and filter the string collection when "collectionFilterBy" is set', () => {
    mockColumn.filter = {
      collection: ['other', 'male', 'female'],
      collectionFilterBy: { operator: OperatorType.equal, value: 'other' }
    };

    filter.init(filterArguments);
    const filterCollection = filter.collection;

    expect(filterCollection.length).toBe(1);
    expect(filterCollection[0]).toBe('other');
  });

  it('should create the filter and filter the value/label pair collection when "collectionFilterBy" is set', () => {
    mockColumn.filter = {
      collection: [{ value: 'other', description: 'other' }, { value: 'male', description: 'male' }, { value: 'female', description: 'female' }],
      collectionFilterBy: [
        { property: 'value', operator: OperatorType.notEqual, value: 'other' },
        { property: 'value', operator: OperatorType.notEqual, value: 'male' }
      ],
      customStructure: { value: 'value', label: 'description', },
    };

    filter.init(filterArguments);
    const filterCollection = filter.collection;

    expect(filterCollection.length).toBe(1);
    expect(filterCollection[0]).toEqual({ value: 'female', description: 'female' });
  });

  it('should create the filter and filter the value/label pair collection when "collectionFilterBy" is set and "filterResultAfterEachPass" is set to "merge"', () => {
    mockColumn.filter = {
      collection: [{ value: 'other', description: 'other' }, { value: 'male', description: 'male' }, { value: 'female', description: 'female' }],
      collectionFilterBy: [
        { property: 'value', operator: OperatorType.equal, value: 'other' },
        { property: 'value', operator: OperatorType.equal, value: 'male' }
      ],
      collectionOptions: { filterResultAfterEachPass: 'merge' },
      customStructure: { value: 'value', label: 'description', },
    };

    filter.init(filterArguments);
    const filterCollection = filter.collection;

    expect(filterCollection.length).toBe(2);
    expect(filterCollection[0]).toEqual({ value: 'other', description: 'other' });
    expect(filterCollection[1]).toEqual({ value: 'male', description: 'male' });
  });

  it('should create the filter with a value/label pair collection that is inside an object when "collectionInsideObjectProperty" is defined with a dot notation', () => {
    mockColumn.filter = {
      // @ts-ignore
      collection: { deep: { myCollection: [{ value: 'other', description: 'other' }, { value: 'male', description: 'male' }, { value: 'female', description: 'female' }] } },
      collectionOptions: { collectionInsideObjectProperty: 'deep.myCollection' },
      customStructure: { value: 'value', label: 'description', },
    };

    filter.init(filterArguments);
    const filterCollection = filter.collection;

    expect(filterCollection.length).toBe(3);
    expect(filterCollection[0]).toEqual({ value: 'other', description: 'other' });
    expect(filterCollection[1]).toEqual({ value: 'male', description: 'male' });
    expect(filterCollection[2]).toEqual({ value: 'female', description: 'female' });
  });

  it('should create the filter with a value/label pair collectionAsync that is inside an object when "collectionInsideObjectProperty" is defined with a dot notation', (done) => {
    jest.spyOn(bindingEngineStub, 'collectionObserver').mockReturnValue({ subscribe: jest.fn() });
    jest.spyOn(bindingEngineStub, 'propertyObserver').mockReturnValue({ subscribe: jest.fn() });
    const mockCollection = { deep: { myCollection: [{ value: 'other', description: 'other' }, { value: 'male', description: 'male' }, { value: 'female', description: 'female' }] } };
    mockColumn.filter = {
      collectionAsync: new Promise((resolve) => setTimeout(() => resolve(mockCollection), 1)),
      collectionOptions: { collectionInsideObjectProperty: 'deep.myCollection' },
      customStructure: { value: 'value', label: 'description', },
    };

    filter.init(filterArguments);

    setTimeout(() => {
      const filterCollection = filter.collection;

      expect(filterCollection.length).toBe(3);
      expect(filterCollection[0]).toEqual({ value: 'other', description: 'other' });
      expect(filterCollection[1]).toEqual({ value: 'male', description: 'male' });
      expect(filterCollection[2]).toEqual({ value: 'female', description: 'female' });
      done();
    }, 2);
  });

  it('should create the filter and sort the string collection when "collectionSortBy" is set', () => {
    mockColumn.filter = {
      collection: ['other', 'male', 'female'],
      collectionSortBy: {
        sortDesc: true,
        fieldType: FieldType.string
      }
    };

    filter.init(filterArguments);
    const filterCollection = filter.collection;

    expect(filterCollection.length).toBe(3);
    expect(filterCollection[0]).toEqual('other');
    expect(filterCollection[1]).toEqual('male');
    expect(filterCollection[2]).toEqual('female');
  });

  it('should create the filter and sort the value/label pair collection when "collectionSortBy" is set', () => {
    mockColumn.filter = {
      collection: [{ value: 'other', description: 'other' }, { value: 'male', description: 'male' }, { value: 'female', description: 'female' }],
      collectionSortBy: {
        property: 'value',
        sortDesc: false,
        fieldType: FieldType.string
      },
      customStructure: {
        value: 'value',
        label: 'description',
      },
    };

    filter.init(filterArguments);
    const filterCollection = filter.collection;

    expect(filterCollection.length).toBe(3);
    expect(filterCollection[0]).toEqual({ value: 'female', description: 'female' });
    expect(filterCollection[1]).toEqual({ value: 'male', description: 'male' });
    expect(filterCollection[2]).toEqual({ value: 'other', description: 'other' });
  });
});
