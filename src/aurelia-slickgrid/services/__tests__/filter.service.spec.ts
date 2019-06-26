import {
  BackendService,
  Column,
  ColumnFilter,
  CurrentFilter,
  GridOption,
  SlickEventHandler,
  FilterChangedArgs,
  FieldType,
} from '../../models';
import { Filters } from '../../filters';
import { FilterService } from '../filter.service';
import { FilterFactory } from '../../filters/filterFactory';
import { SlickgridConfig, CollectionService } from '../..';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Container } from 'aurelia-framework';

jest.mock('flatpickr', () => { });
declare var Slick: any;

const gridOptionMock = {
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
  sort: jest.fn(),
  reSort: jest.fn(),
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
        service: backendServiceStub,
        process: () => new Promise((resolve) => resolve(jest.fn()))
      };
    });

    it('should call "onBackendFilterChange" when "onSearchChange" event triggered', () => {
      const spy = jest.spyOn(service, 'onBackendFilterChange');
      const mockArgs = {
        clearFilterTriggered: false,
        shouldTriggerQuery: false,
        columnId: 'firstName',
        columnDef: { id: 'firstName', field: 'firstName' },
        columnFilters: {},
        operator: 'EQ',
        searchTerms: [],
        grid: gridStub
      };

      service.init(gridStub);
      service.bindBackendOnFilter(gridStub, dataViewStub);
      service.onSearchChange.notify(mockArgs, new Slick.EventData(), gridStub);

      expect(spy).toHaveBeenCalledWith(expect.anything(), { grid: gridStub, ...mockArgs });
    });
  });
});
