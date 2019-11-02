// import 3rd party lib multiple-select for the tests
import '../../../assets/lib/multiple-select/multiple-select';

import { DOM } from 'aurelia-pal';
import { BindingEngine } from 'aurelia-binding';
import { EventAggregator } from 'aurelia-event-aggregator';
import { HttpClient } from 'aurelia-fetch-client';
import { I18N } from 'aurelia-i18n';
import { BindingSignaler } from 'aurelia-templating-resources';
import { Column, FilterArguments, GridOption, FieldType, OperatorType } from '../../models';
import { CollectionService } from './../../services/collection.service';
import { Filters } from '..';
import { SelectFilter } from '../selectFilter';

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

describe('SelectFilter', () => {
  let ea: EventAggregator;
  let i18n: I18N;
  let divContainer: HTMLDivElement;
  let filter: SelectFilter;
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
        model: Filters.multipleSelect,
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

    filter = new SelectFilter(bindingEngineStub, collectionService, i18n);
  });

  afterEach(() => {
    mockColumn.filter = undefined;
    filter.destroy();
  });

  it('should throw an error when trying to call init without any arguments', () => {
    expect(() => filter.init(null, true)).toThrowError('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
  });

  it('should throw an error when there is no collection provided in the filter property', (done) => {
    try {
      filter.init(filterArguments, true);
    } catch (e) {
      expect(e.message).toContain(`[Aurelia-SlickGrid] You need to pass a "collection" (or "collectionAsync") for the MultipleSelect/SingleSelect Filter to work correctly.`);
      done();
    }
  });

  it('should throw an error when collection is not a valid array', (done) => {
    try {
      // @ts-ignore
      mockColumn.filter.collection = { hello: 'world' };
      filter.init(filterArguments, true);
    } catch (e) {
      expect(e.message).toContain(`The "collection" passed to the Select Filter is not a valid array.`);
      done();
    }
  });

  it('should throw an error when collection is not a valid value/label pair array', (done) => {
    try {
      mockColumn.filter.collection = [{ hello: 'world' }];
      filter.init(filterArguments, true);
    } catch (e) {
      expect(e.message).toContain(`[select-filter] A collection with value/label (or value/labelKey when using Locale) is required to populate the Select list`);
      done();
    }
  });

  it('should throw an error when "enableTranslateLabel" is set without a valid I18N Service', (done) => {
    try {
      i18n = undefined;
      mockColumn.filter.enableTranslateLabel = true;
      mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
      filter = new SelectFilter(bindingEngineStub, collectionService, i18n);
      filter.init(filterArguments, true);
    } catch (e) {
      expect(e.toString()).toContain(`[select-filter] The i18n Service is required for the Select Filter to work correctly when "enableTranslateLabel" is set.`);
      done();
    }
  });

  it('should initialize the filter', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    filter.init(filterArguments, true);
    const filterCount = divContainer.querySelectorAll('select.ms-filter.search-filter.filter-gender').length;

    expect(spyGetHeaderRow).toHaveBeenCalled();
    expect(filterCount).toBe(1);
  });

  it('should be a multiple-select filter by default when it is not specified in the constructor', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    filter = new SelectFilter(bindingEngineStub, collectionService, i18n);
    filter.init(filterArguments, true);
    const filterCount = divContainer.querySelectorAll('select.ms-filter.search-filter.filter-gender').length;

    expect(spyGetHeaderRow).toHaveBeenCalled();
    expect(filterCount).toBe(1);
    expect(filter.isMultipleSelect).toBe(true);
  });

  it('should have a placeholder when defined in its column definition', () => {
    const testValue = 'test placeholder';
    mockColumn.filter.placeholder = testValue;
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];

    filter.init(filterArguments, true);
    const filterElm = divContainer.querySelector<HTMLSpanElement>('.ms-filter.search-filter.filter-gender .placeholder');

    expect(filterElm.innerHTML).toBe(testValue);
  });

  it('should trigger multiple select change event and expect the callback to be called with the search terms we select from dropdown list', () => {
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
    const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
    filterBtnElm.click();

    // we can use property "checked" or dispatch an event
    filterListElm[0].dispatchEvent(DOM.createCustomEvent('click'));
    filterOkElm.click();

    const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
    expect(filterListElm.length).toBe(2);
    expect(filterFilledElms.length).toBe(1);
    expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'IN', searchTerms: ['male'], shouldTriggerQuery: true });
  });

  it('should trigger multiple select change event and expect this to work with a regular array of strings', () => {
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    mockColumn.filter.collection = ['male', 'female'];
    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
    const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
    filterBtnElm.click();

    // here we use "checked" property instead of dispatching an event
    filterListElm[0].checked = true;
    filterOkElm.click();

    const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
    expect(filterListElm.length).toBe(2);
    expect(filterFilledElms.length).toBe(1);
    expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'IN', searchTerms: ['male'], shouldTriggerQuery: true });
  });

  it('should pass a different operator then trigger an input change event and expect the callback to be called with the search terms we select from dropdown list', () => {
    mockColumn.filter.operator = 'NIN';
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
    const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
    filterBtnElm.click();

    filterListElm[0].checked = true;
    filterOkElm.click();

    const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
    expect(filterListElm.length).toBe(2);
    expect(filterFilledElms.length).toBe(1);
    expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'NIN', searchTerms: ['male'], shouldTriggerQuery: true });
  });

  it('should have same value in "getValues" after being set in "setValues"', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    filter.init(filterArguments, true);
    filter.setValues('female');
    const values = filter.getValues();

    expect(values).toEqual(['female']);
    expect(values.length).toBe(1);
  });

  it('should have empty array returned from "getValues" when nothing is set', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    filter.init(filterArguments, true);
    const values = filter.getValues();

    expect(values).toEqual([]);
    expect(values.length).toBe(0);
  });

  it('should have empty array returned from "getValues" even when filter is not yet created', () => {
    const values = filter.getValues();

    expect(values).toEqual([]);
    expect(values.length).toBe(0);
  });

  it('should create the multi-select filter with a default search term when passed as a filter argument', () => {
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filterArguments.searchTerms = ['female'];
    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
    const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
    const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
    filterBtnElm.click();
    filterOkElm.click();

    expect(filterListElm.length).toBe(2);
    expect(filterFilledElms.length).toBe(1);
    expect(filterListElm[1].checked).toBe(true);
    expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'IN', searchTerms: ['female'], shouldTriggerQuery: true });
  });

  it('should create the multi-select filter with default boolean search term converted as strings when passed as a filter argument', () => {
    mockColumn.filter.collection = [{ value: true, label: 'True' }, { value: false, label: 'False' }];
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filterArguments.searchTerms = [false];
    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
    const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
    const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
    filterBtnElm.click();
    filterOkElm.click();

    expect(filterListElm.length).toBe(2);
    expect(filterFilledElms.length).toBe(1);
    expect(filterListElm[1].checked).toBe(true);
    expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'IN', searchTerms: ['false'], shouldTriggerQuery: true });
  });

  it('should create the multi-select filter with default number search term converted as strings when passed as a filter argument', () => {
    mockColumn.filter.collection = [{ value: 1, label: 'male' }, { value: 2, label: 'female' }];
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filterArguments.searchTerms = [2];
    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
    const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
    const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
    filterBtnElm.click();
    filterOkElm.click();

    expect(filterListElm.length).toBe(2);
    expect(filterFilledElms.length).toBe(1);
    expect(filterListElm[1].checked).toBe(true);
    expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'IN', searchTerms: ['2'], shouldTriggerQuery: true });
  });

  it('should create the multi-select filter with a default search term when passed as a filter argument even with collection an array of strings', () => {
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    mockColumn.filter.collection = ['male', 'female'];

    filterArguments.searchTerms = ['female'];
    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
    const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
    const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
    filterBtnElm.click();
    filterOkElm.click();

    expect(filterListElm.length).toBe(2);
    expect(filterFilledElms.length).toBe(1);
    expect(filterListElm[1].checked).toBe(true);
    expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'IN', searchTerms: ['female'], shouldTriggerQuery: true });
  });

  it('should create the multi-select filter and sort the string collection when "collectionSortBy" is set', () => {
    mockColumn.filter = {
      collection: ['other', 'male', 'female'],
      collectionSortBy: {
        sortDesc: true,
        fieldType: FieldType.string
      }
    };

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
    filterBtnElm.click();

    expect(filterListElm.length).toBe(3);
    expect(filterListElm[0].textContent).toBe('other');
    expect(filterListElm[1].textContent).toBe('male');
    expect(filterListElm[2].textContent).toBe('female');
  });

  it('should create the multi-select filter and sort the value/label pair collection when "collectionSortBy" is set', () => {
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

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
    filterBtnElm.click();

    expect(filterListElm.length).toBe(3);
    expect(filterListElm[0].textContent).toBe('female');
    expect(filterListElm[1].textContent).toBe('male');
    expect(filterListElm[2].textContent).toBe('other');
  });

  it('should create the multi-select filter and filter the string collection when "collectionFilterBy" is set', () => {
    mockColumn.filter = {
      collection: ['other', 'male', 'female'],
      collectionFilterBy: { operator: OperatorType.equal, value: 'other' }
    };

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
    filterBtnElm.click();

    expect(filterListElm.length).toBe(1);
    expect(filterListElm[0].textContent).toBe('other');
  });

  it('should create the multi-select filter and filter the value/label pair collection when "collectionFilterBy" is set', () => {
    mockColumn.filter = {
      collection: [{ value: 'other', description: 'other' }, { value: 'male', description: 'male' }, { value: 'female', description: 'female' }],
      collectionFilterBy: [
        { property: 'value', operator: OperatorType.notEqual, value: 'other' },
        { property: 'value', operator: OperatorType.notEqual, value: 'male' }
      ],
      customStructure: { value: 'value', label: 'description', },
    };

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
    filterBtnElm.click();

    expect(filterListElm.length).toBe(1);
    expect(filterListElm[0].textContent).toBe('female');
  });

  it('should create the multi-select filter and filter the value/label pair collection when "collectionFilterBy" is set and "filterResultAfterEachPass" is set to "merge"', () => {
    mockColumn.filter = {
      collection: [{ value: 'other', description: 'other' }, { value: 'male', description: 'male' }, { value: 'female', description: 'female' }],
      collectionFilterBy: [
        { property: 'value', operator: OperatorType.equal, value: 'other' },
        { property: 'value', operator: OperatorType.equal, value: 'male' }
      ],
      collectionOptions: { filterResultAfterEachPass: 'merge' },
      customStructure: { value: 'value', label: 'description', },
    };

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
    filterBtnElm.click();

    expect(filterListElm.length).toBe(2);
    expect(filterListElm[0].textContent).toBe('other');
    expect(filterListElm[1].textContent).toBe('male');
  });

  it('should create the multi-select filter with a value/label pair collection that is inside an object when "collectionInsideObjectProperty" is defined with a dot notation', () => {
    mockColumn.filter = {
      // @ts-ignore
      collection: { deep: { myCollection: [{ value: 'other', description: 'other' }, { value: 'male', description: 'male' }, { value: 'female', description: 'female' }] } },
      collectionOptions: { collectionInsideObjectProperty: 'deep.myCollection' },
      customStructure: { value: 'value', label: 'description', },
    };

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
    filterBtnElm.click();

    expect(filterListElm.length).toBe(3);
    expect(filterListElm[0].textContent).toBe('other');
    expect(filterListElm[1].textContent).toBe('male');
    expect(filterListElm[2].textContent).toBe('female');
  });

  it('should create the multi-select filter with a value/label pair collectionAsync that is inside an object when "collectionInsideObjectProperty" is defined with a dot notation', (done) => {
    jest.spyOn(bindingEngineStub, 'collectionObserver').mockReturnValue({ subscribe: jest.fn() });
    jest.spyOn(bindingEngineStub, 'propertyObserver').mockReturnValue({ subscribe: jest.fn() });
    const mockDataResponse = { deep: { myCollection: [{ value: 'other', description: 'other' }, { value: 'male', description: 'male' }, { value: 'female', description: 'female' }] } };
    mockColumn.filter = {
      collectionAsync: new Promise((resolve) => setTimeout(() => resolve(mockDataResponse), 1)),
      collectionOptions: { collectionInsideObjectProperty: 'deep.myCollection' },
      customStructure: { value: 'value', label: 'description', },
    };

    filter.init(filterArguments, true);

    setTimeout(() => {
      const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
      const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
      filterBtnElm.click();

      expect(filterListElm.length).toBe(3);
      expect(filterListElm[0].textContent).toBe('other');
      expect(filterListElm[1].textContent).toBe('male');
      expect(filterListElm[2].textContent).toBe('female');
      done();
    }, 2);
  });

  it('should create the multi-select filter with a default search term when using "collectionAsync" as a Promise', (done) => {
    jest.spyOn(bindingEngineStub, 'collectionObserver').mockReturnValue({ subscribe: jest.fn() });
    jest.spyOn(bindingEngineStub, 'propertyObserver').mockReturnValue({ subscribe: jest.fn() });
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    const mockCollection = ['male', 'female'];
    mockColumn.filter.collectionAsync = new Promise((resolve) => setTimeout(() => resolve(mockCollection)));

    filterArguments.searchTerms = ['female'];
    filter.init(filterArguments, true);

    setTimeout(() => {
      const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
      const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
      const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
      const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
      filterBtnElm.click();
      filterOkElm.click();

      expect(filterListElm.length).toBe(2);
      expect(filterFilledElms.length).toBe(1);
      expect(filterListElm[1].checked).toBe(true);
      expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'IN', searchTerms: ['female'], shouldTriggerQuery: true });
      done();
    }, 2);
  });

  it('should create the multi-select filter with a default search term when using "collectionAsync" as a Promise with content to simulate http-client', (done) => {
    jest.spyOn(bindingEngineStub, 'collectionObserver').mockReturnValue({ subscribe: jest.fn() });
    jest.spyOn(bindingEngineStub, 'propertyObserver').mockReturnValue({ subscribe: jest.fn() });
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    const mockCollection = ['male', 'female'];
    mockColumn.filter.collectionAsync = new Promise((resolve) => setTimeout(() => resolve({ content: mockCollection })));

    filterArguments.searchTerms = ['female'];
    filter.init(filterArguments, true);

    setTimeout(() => {
      const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
      const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
      const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
      const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
      filterBtnElm.click();
      filterOkElm.click();

      expect(filterListElm.length).toBe(2);
      expect(filterFilledElms.length).toBe(1);
      expect(filterListElm[1].checked).toBe(true);
      expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'IN', searchTerms: ['female'], shouldTriggerQuery: true });
      done();
    }, 1);
  });

  it('should create the multi-select filter with a default search term when using "collectionAsync" is a Fetch Promise', (done) => {
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
    filter.init(filterArguments, true);

    setTimeout(() => {
      const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
      const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
      const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
      const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
      filterBtnElm.click();
      filterOkElm.click();

      expect(filterListElm.length).toBe(2);
      expect(filterFilledElms.length).toBe(1);
      expect(filterListElm[1].checked).toBe(true);
      expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'IN', searchTerms: ['female'], shouldTriggerQuery: true });
      done();
    });
  });

  xit('should create the multi-select filter with a "collectionAsync" as a Promise and expect the collectionObserver to trigger "renderDomElement" call', (done) => {
    const mockSubscribe = jest.fn();
    jest.spyOn(bindingEngineStub, 'collectionObserver').mockReturnValue({ subscribe: mockSubscribe });
    jest.spyOn(bindingEngineStub, 'propertyObserver').mockReturnValue({ subscribe: jest.fn() });
    const mockCollection = ['male', 'female'];
    const promise = new Promise((resolve) => setTimeout(() => resolve(mockCollection)));
    mockColumn.filter.collectionAsync = promise;

    filterArguments.searchTerms = ['female'];
    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
    filterBtnElm.click();

    mockCollection.push('other');

    // before await
    expect(filterListElm.length).toBe(2);
    expect(filterListElm[1].checked).toBe(true);

    mockSubscribe.mockReturnValue([{ changes: { index: 2, addedCount: 1, removed: [] } }]);

    setTimeout(() => {
      // after await
      const filterUpdatedListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
      expect(filterUpdatedListElm.length).toBe(3);
      done();
    });
  });

  xit('should throw an error when "collectionAsync" Promise does not return a valid array', (done) => {
    try {
      const promise = new Promise((resolve) => setTimeout(() => resolve({ hello: 'world' })));
      mockColumn.filter.collectionAsync = promise;
      filter.init(filterArguments, true);
    } catch (e) {
      expect(e.toString()).toContain(`Something went wrong while trying to pull the collection from the "collectionAsync" call in the Select Filter, the collection is not a valid array.`);
      done();
    }
  });

  it('should create the multi-select filter with a default search term and have the HTML rendered when "enableRenderHtml" is set', () => {
    mockColumn.filter = {
      enableRenderHtml: true,
      collection: [{ value: true, label: 'True', labelPrefix: `<i class="fa fa-check"></i> ` }, { value: false, label: 'False' }],
      customStructure: {
        value: 'isEffort',
        label: 'label',
        labelPrefix: 'labelPrefix',
      },
    };

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
    filterBtnElm.click();

    expect(filterListElm.length).toBe(2);
    expect(filterListElm[0].innerHTML).toBe('<i class="fa fa-check"></i> True');
  });

  it('should create the multi-select filter with a default search term and have the HTML rendered and sanitized when "enableRenderHtml" is set and has <script> tag', () => {
    mockColumn.filter = {
      enableRenderHtml: true,
      collection: [{ value: true, label: 'True', labelPrefix: `<script>alert('test')></script><i class="fa fa-check"></i> ` }, { value: false, label: 'False' }],
      customStructure: {
        value: 'isEffort',
        label: 'label',
        labelPrefix: 'labelPrefix',
      },
    };

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
    filterBtnElm.click();

    expect(filterListElm.length).toBe(2);
    expect(filterListElm[0].innerHTML).toBe('<i class="fa fa-check"></i> True');
  });

  it('should create the multi-select filter with a blank entry at the beginning of the collection when "addBlankEntry" is set in the "collectionOptions" property', () => {
    filterArguments.searchTerms = ['female'];
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    mockColumn.filter.collectionOptions = { addBlankEntry: true };
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filter.init(filterArguments, true);
    const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
    const filterListElm = divContainer.querySelectorAll<HTMLInputElement>(`[name=filter-gender].ms-drop ul>li input[type=checkbox]`);
    const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');
    const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
    filterBtnElm.click();
    filterOkElm.click();

    expect(filterListElm.length).toBe(3);
    expect(filterFilledElms.length).toBe(1);
    expect(filterListElm[2].checked).toBe(true);
    expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, operator: 'IN', searchTerms: ['female'], shouldTriggerQuery: true });
  });

  it('should trigger a callback with the clear filter set when calling the "clear" method', () => {
    filterArguments.searchTerms = ['female'];
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filter.init(filterArguments, true);
    filter.clear();
    const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');

    expect(filter.searchTerms.length).toBe(0);
    expect(filterFilledElms.length).toBe(0);
    expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, clearFilterTriggered: true, shouldTriggerQuery: true });
  });

  it('should trigger a callback with the clear filter but without querying when when calling the "clear" method with False as argument', () => {
    filterArguments.searchTerms = ['female'];
    mockColumn.filter.collection = [{ value: 'male', label: 'male' }, { value: 'female', label: 'female' }];
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filter.init(filterArguments, true);
    filter.clear(false);
    const filterFilledElms = divContainer.querySelectorAll<HTMLDivElement>('.ms-parent.ms-filter.search-filter.filter-gender.filled');

    expect(filter.searchTerms.length).toBe(0);
    expect(filterFilledElms.length).toBe(0);
    expect(spyCallback).toHaveBeenCalledWith(undefined, { columnDef: mockColumn, clearFilterTriggered: true, shouldTriggerQuery: false });
  });

  it('should work with English locale when locale is changed', (done) => {
    i18n.setLocale('en');
    gridOptionMock.enableTranslate = true;
    mockColumn.filter = {
      enableTranslateLabel: true,
      collection: [
        { value: 'other', labelKey: 'OTHER' },
        { value: 'male', labelKey: 'MALE' },
        { value: 'female', labelKey: 'FEMALE' }
      ],
      filterOptions: { minimumCountSelected: 1 }
    };

    filterArguments.searchTerms = ['male', 'female'];
    filter.init(filterArguments, true);

    setTimeout(() => {
      const filterSelectAllElm = divContainer.querySelector<HTMLSpanElement>('.filter-gender .ms-select-all label span');
      const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
      const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
      const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
      const filterParentElm = divContainer.querySelector<HTMLButtonElement>(`.ms-parent.ms-filter.search-filter.filter-gender button`);
      filterBtnElm.click();

      expect(filterListElm.length).toBe(3);
      expect(filterListElm[0].textContent).toBe('Other');
      expect(filterListElm[1].textContent).toBe('Male');
      expect(filterListElm[2].textContent).toBe('Female');
      expect(filterOkElm.textContent).toBe('OK');
      expect(filterSelectAllElm.textContent).toBe('Select All');
      expect(filterParentElm.textContent).toBe('2 of 3 selected');
      done();
    });
  });

  it('should work with French locale when locale is changed', (done) => {
    i18n.setLocale('fr');
    gridOptionMock.enableTranslate = true;
    mockColumn.filter = {
      enableTranslateLabel: true,
      collection: [
        { value: 'other', labelKey: 'OTHER' },
        { value: 'male', labelKey: 'MALE' },
        { value: 'female', labelKey: 'FEMALE' }
      ],
      filterOptions: { minimumCountSelected: 1 }
    };

    filterArguments.searchTerms = ['male', 'female'];
    filter.init(filterArguments, true);
    setTimeout(() => {
      const filterSelectAllElm = divContainer.querySelector<HTMLSpanElement>('.filter-gender .ms-select-all label span');
      const filterBtnElm = divContainer.querySelector<HTMLButtonElement>('.ms-parent.ms-filter.search-filter.filter-gender button.ms-choice');
      const filterListElm = divContainer.querySelectorAll<HTMLSpanElement>(`[name=filter-gender].ms-drop ul>li span`);
      const filterOkElm = divContainer.querySelector<HTMLButtonElement>(`[name=filter-gender].ms-drop .ms-ok-button`);
      const filterParentElm = divContainer.querySelector<HTMLButtonElement>(`.ms-parent.ms-filter.search-filter.filter-gender button`);
      filterBtnElm.click();

      expect(filterListElm.length).toBe(3);
      expect(filterListElm[0].textContent).toBe('Autre');
      expect(filterListElm[1].textContent).toBe('Mâle');
      expect(filterListElm[2].textContent).toBe('Femme');
      expect(filterOkElm.textContent).toBe('Terminé');
      expect(filterSelectAllElm.textContent).toBe('Sélectionner tout');
      expect(filterParentElm.textContent).toBe('2 de 3 sélectionnés');
      done();
    });
  });
});
