// import 3rd party lib multiple-select for the tests
import '../../../assets/lib/multiple-select/multiple-select';

import {
  BackendService,
  Column,
  CurrentFilter,
  FilterChangedArgs,
  GridOption,
  SlickEventHandler,
} from '../../models';
import { Filters } from '../../filters';
import { FilterService } from '../filter.service';
import { FilterFactory } from '../../filters/filterFactory';
import { SlickgridConfig } from '../../slickgrid-config';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Container } from 'aurelia-framework';

jest.mock('flatpickr', () => { });
declare var Slick: any;
const DOM_ELEMENT_ID = 'row-detail123';

const gridOptionMock = {
  enableFiltering: true,
  enablePagination: true,
  backendServiceApi: {
    service: undefined,
    preProcess: jest.fn(),
    process: jest.fn(),
    postProcess: jest.fn(),
  }
} as GridOption;

const dataViewStub = {
  refresh: jest.fn(),
  reSort: jest.fn(),
  setFilter: jest.fn(),
  setFilterArgs: jest.fn(),
  sort: jest.fn(),
};

const backendServiceStub = {
  clearFilters: jest.fn(),
  getCurrentFilters: jest.fn(),
  getCurrentPagination: jest.fn(),
  processOnFilterChanged: (event: Event, args: FilterChangedArgs) => 'backend query',
} as unknown as BackendService;

const gridStub = {
  autosizeColumns: jest.fn(),
  getColumnIndex: jest.fn(),
  getOptions: () => gridOptionMock,
  getColumns: jest.fn(),
  getHeaderRowColumn: jest.fn(),
  getSortColumns: jest.fn(),
  invalidate: jest.fn(),
  onLocalSortChanged: jest.fn(),
  onSort: new Slick.Event(),
  onHeaderRowCellRendered: new Slick.Event(),
  render: jest.fn(),
  setSortColumns: jest.fn(),
};

describe('FilterService', () => {
  let ea: EventAggregator;
  let container: Container;
  let service: FilterService;
  let slickgridEventHandler: SlickEventHandler;

  beforeEach(() => {
    // define a <div> container to simulate a row detail DOM element
    const div = document.createElement('div');
    div.innerHTML = `<div id="${DOM_ELEMENT_ID}">some text</div>`;
    document.body.appendChild(div);

    ea = new EventAggregator();
    container = new Container();
    const filterFactory = new FilterFactory(container, new SlickgridConfig());
    service = new FilterService(ea, filterFactory);
    slickgridEventHandler = service.eventHandler;
  });

  afterEach(() => {
    delete gridOptionMock.backendServiceApi;
    jest.clearAllMocks();
    service.dispose();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should dispose of the event handler', () => {
    const spy = jest.spyOn(slickgridEventHandler, 'unsubscribeAll');
    service.dispose();
    expect(spy).toHaveBeenCalled();
  });

  describe('bindBackendOnFilter method', () => {
    beforeEach(() => {
      gridOptionMock.backendServiceApi = {
        filterTypingDebounce: 0,
        service: backendServiceStub,
        process: () => new Promise((resolve) => resolve(jest.fn())),
      };
    });

    it('should create a filter and its metadata when "onHeaderRowCellRendered" event is triggered', () => {
      const mockArgs = {
        grid: gridStub,
        column: { id: 'firstName', field: 'firstName', filterable: true } as Column,
        node: document.getElementById(DOM_ELEMENT_ID),
      };

      service.init(gridStub);
      service.bindBackendOnFilter(gridStub, dataViewStub);
      gridStub.onHeaderRowCellRendered.notify(mockArgs, new Slick.EventData(), gridStub);
      const columnFilters = service.getColumnFilters();
      const filterMetadataArray = service.getFiltersMetadata();

      expect(columnFilters).toEqual({});
      expect(filterMetadataArray.length).toBe(1);
      expect(filterMetadataArray[0]).toContainEntry(['$filterElm', expect.anything()]);
      expect(filterMetadataArray[0]).toContainEntry(['searchTerms', []]);
    });

    it('should call the same filter twice but expect the filter to be rendered only once', () => {
      const mockColumn = {
        id: 'isActive', field: 'isActive', filterable: true,
        filter: {
          model: Filters.singleSelect, searchTerms: [true], collection: [{ value: true, label: 'True' }, { value: false, label: 'False' }],
        }
      } as Column;
      const mockArgs = { grid: gridStub, column: mockColumn, node: document.getElementById(DOM_ELEMENT_ID), };

      service.init(gridStub);
      service.bindBackendOnFilter(gridStub, dataViewStub);
      gridStub.onHeaderRowCellRendered.notify(mockArgs, new Slick.EventData(), gridStub);
      gridStub.onHeaderRowCellRendered.notify(mockArgs, new Slick.EventData(), gridStub);
      const columnFilters = service.getColumnFilters();
      const filterMetadataArray = service.getFiltersMetadata();

      expect(service.isFilterFirstRender).toBe(false);
      expect(columnFilters).toEqual({
        isActive: { columnDef: mockColumn, columnId: 'isActive', operator: 'EQ', searchTerms: [true], },
      });
      expect(filterMetadataArray.length).toBe(1);
      expect(filterMetadataArray[0]).toContainEntry(['$filterElm', expect.anything()]);
      expect(filterMetadataArray[0]).toContainEntry(['searchTerms', [true]]);
    });

    it('should call "onBackendFilterChange" when "onSearchChange" event is triggered', (done) => {
      const expectationCurrentFilters = [{ columnId: 'isActive', operator: 'EQ', searchTerms: ['John'] }] as CurrentFilter[];
      const mockColumn = {
        id: 'isActive', field: 'isActive', filterable: true,
        filter: {
          model: Filters.singleSelect, searchTerms: [true], collection: [{ value: true, label: 'True' }, { value: false, label: 'False' }],
        }
      } as Column;
      const mockSearchArgs = {
        clearFilterTriggered: false,
        shouldTriggerQuery: true,
        columnId: 'isActive',
        columnDef: mockColumn,
        operator: 'EQ',
        searchTerms: ['John'],
        grid: gridStub
      };
      const mockHeaderArgs = { grid: gridStub, column: mockColumn, node: document.getElementById(DOM_ELEMENT_ID), };
      const spyCurrentFilters = jest.spyOn(gridOptionMock.backendServiceApi.service, 'getCurrentFilters').mockReturnValue(expectationCurrentFilters);
      const spyBackendChange = jest.spyOn(service, 'onBackendFilterChange');
      const eaSpy = jest.spyOn(ea, 'publish');

      service.init(gridStub);
      service.bindBackendOnFilter(gridStub, dataViewStub);
      gridStub.onHeaderRowCellRendered.notify(mockHeaderArgs, new Slick.EventData(), gridStub);
      service.onSearchChange.notify(mockSearchArgs, new Slick.EventData(), gridStub);

      expect(spyBackendChange).toHaveBeenCalledWith(expect.anything(), { grid: gridStub, ...mockSearchArgs });
      setTimeout(() => {
        expect(spyCurrentFilters).toHaveBeenCalled();
        expect(eaSpy).toHaveBeenCalledWith(`filterService:filterChanged`, [{ columnId: 'isActive', operator: 'EQ', searchTerms: ['John'] }]);
        done();
      });
    });
  });

  describe('bindLocalOnFilter method', () => {
    beforeEach(() => {
      gridOptionMock.backendServiceApi = undefined;
    });

    it('should create a filter and its metadata when "onHeaderRowCellRendered" event is triggered', () => {
      const mockArgs = {
        grid: gridStub,
        column: { id: 'firstName', field: 'firstName', filterable: true } as Column,
        node: document.getElementById(DOM_ELEMENT_ID),
      };

      service.init(gridStub);
      service.bindLocalOnFilter(gridStub, dataViewStub);
      gridStub.onHeaderRowCellRendered.notify(mockArgs, new Slick.EventData(), gridStub);
      const columnFilters = service.getColumnFilters();
      const filterMetadataArray = service.getFiltersMetadata();

      expect(columnFilters).toEqual({});
      expect(filterMetadataArray.length).toBe(1);
      expect(filterMetadataArray[0]).toContainEntry(['$filterElm', expect.anything()]);
      expect(filterMetadataArray[0]).toContainEntry(['searchTerms', []]);
    });

    it('should call "onFilterChanged" when "onSearchChange" event is triggered', () => {
      const eaSpy = jest.spyOn(ea, 'publish');
      const mockArgs = {
        clearFilterTriggered: false,
        shouldTriggerQuery: true,
        columnId: 'firstName',
        columnDef: { id: 'firstName', field: 'firstName', filterable: true } as Column,
        operator: 'EQ',
        searchTerms: ['John'],
        grid: gridStub
      };

      service.init(gridStub);
      service.bindLocalOnFilter(gridStub, dataViewStub);
      service.onSearchChange.notify(mockArgs, new Slick.EventData(), gridStub);

      expect(eaSpy).toHaveBeenCalledWith(`filterService:filterChanged`, []);
    });

    it('should call "onFilterChanged" with column filter when both onHeaderRowCellRendered" and "onSearchChange" events are triggered', () => {
      const eaSpy = jest.spyOn(ea, 'publish');
      const mockColumn = {
        id: 'firstName', field: 'firstName', filterable: true,
        filter: {
          model: Filters.singleSelect, searchTerms: [true], collection: [{ value: true, label: 'True' }, { value: false, label: 'False' }],
        }
      } as Column;
      const mockHeaderArgs = { grid: gridStub, column: mockColumn, node: document.getElementById(DOM_ELEMENT_ID), };
      const mockSearchArgs = {
        clearFilterTriggered: false,
        shouldTriggerQuery: true,
        columnId: 'firstName',
        columnDef: { id: 'firstName', field: 'firstName', filterable: true } as Column,
        operator: 'EQ',
        searchTerms: ['John'],
        grid: gridStub
      };

      service.init(gridStub);
      service.bindLocalOnFilter(gridStub, dataViewStub);
      gridStub.onHeaderRowCellRendered.notify(mockHeaderArgs, new Slick.EventData(), gridStub);
      service.onSearchChange.notify(mockSearchArgs, new Slick.EventData(), gridStub);

      expect(eaSpy).toHaveBeenCalledWith(`filterService:filterChanged`, [{ columnId: 'firstName', operator: 'EQ', searchTerms: [true] }]);
    });
  });
});
