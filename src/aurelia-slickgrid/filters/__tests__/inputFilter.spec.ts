import { InputFilter } from '../inputFilter';
import { GridOption, FilterArguments, Column } from '../../models';
import { Filters } from '..';

const containerId = 'demo-container';

// define a <div> container to simulate the grid container
const template =
  `<div id="${containerId}"></div>`;

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

describe('InputFilter', () => {
  let divContainer: HTMLDivElement;
  let filter: InputFilter;
  let filterArguments: FilterArguments;
  let spyGetHeaderRow;
  let mockColumn: Column;

  beforeEach(() => {
    divContainer = document.createElement('div');
    divContainer.innerHTML = template;
    document.body.appendChild(divContainer);
    spyGetHeaderRow = jest.spyOn(gridStub, 'getHeaderRowColumn').mockReturnValue(divContainer);

    mockColumn = { id: 'isActive', field: 'isActive', filterable: true, filter: { model: Filters.input, operator: 'EQ' } };
    filterArguments = {
      grid: gridStub,
      columnDef: mockColumn,
      callback: jest.fn()
    };

    filter = new InputFilter();
  });

  afterEach(() => {
    filter.destroy();
  });

  it('should throw an error when trying to call init without any arguments', () => {
    expect(() => filter.init(null)).toThrowError('[Aurelia-SlickGrid] A filter must always have an "init()" with valid arguments.');
  });

  it('should initialize the filter', () => {
    filter.init(filterArguments);
    const filterCount = divContainer.querySelectorAll('input.filter-isActive').length;

    expect(spyGetHeaderRow).toHaveBeenCalled();
    expect(filterCount).toBe(1);
    expect(filter.inputType).toBe('text');
  });

  it('should have a placeholder when defined in its column definition', () => {
    const testValue = 'test placeholder';
    mockColumn.filter.placeholder = testValue;

    filter.init(filterArguments);
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-isActive');

    expect(filterElm.placeholder).toBe(testValue);
  });

  it('should call "setValues" and expect that value to be in the callback when triggered', () => {
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filter.init(filterArguments);
    filter.setValues('abc');
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-isActive');

    filterElm.focus();
    filterElm.dispatchEvent(new (window.window as any).KeyboardEvent('keyup', {
      keyCode: 97,
      bubbles: true,
      cancelable: true
    }));

    expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, operator: 'EQ', searchTerms: ['abc'], shouldTriggerQuery: true });
  });

  it('should trigger the callback method when user types something in the input', () => {
    const spyCallback = jest.spyOn(filterArguments, 'callback');

    filter.init(filterArguments);
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-isActive');

    filterElm.focus();
    filterElm.value = 'a';
    filterElm.dispatchEvent(new (window.window as any).KeyboardEvent('keyup', {
      keyCode: 97,
      bubbles: true,
      cancelable: true
    }));

    expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, operator: 'EQ', searchTerms: ['a'], shouldTriggerQuery: true });
  });

  it('should create the input filter with a default search term when passed as a filter argument', () => {
    filterArguments.searchTerms = ['xyz'];

    filter.init(filterArguments);
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-isActive');

    expect(filterElm.value).toBe('xyz');
  });

  it('should trigger a callback with the clear filter set when calling the "clear" method', () => {
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    filterArguments.searchTerms = ['xyz'];

    filter.init(filterArguments);
    filter.clear();
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-isActive');

    expect(filterElm.value).toBe('');
    expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, clearFilterTriggered: true, shouldTriggerQuery: true });
  });

  it('should trigger a callback with the clear filter but without querying when when calling the "clear" method with False as argument', () => {
    const spyCallback = jest.spyOn(filterArguments, 'callback');
    filterArguments.searchTerms = ['xyz'];

    filter.init(filterArguments);
    filter.clear(false);
    const filterElm = divContainer.querySelector<HTMLInputElement>('input.filter-isActive');

    expect(filterElm.value).toBe('');
    expect(spyCallback).toHaveBeenCalledWith(expect.anything(), { columnDef: mockColumn, clearFilterTriggered: true, shouldTriggerQuery: false });
  });
});
