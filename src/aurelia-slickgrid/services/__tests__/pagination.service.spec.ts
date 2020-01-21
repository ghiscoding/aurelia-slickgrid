import 'jest-extended';
import { EventAggregator } from 'aurelia-event-aggregator';

import { PaginationService } from './../pagination.service';
import { SharedService } from '../shared.service';
import { Column, GridOption } from '../../models';
import * as utilities from '../backend-utilities';

declare var Slick: any;
const DEFAULT_AURELIA_EVENT_PREFIX = 'asg';

const mockExecuteBackendProcess = jest.fn();
// @ts-ignore
utilities.executeBackendProcessesCallback = mockExecuteBackendProcess;

const mockBackendError = jest.fn();
// @ts-ignore
utilities.onBackendError = mockBackendError;

const dataviewStub = {
  onPagingInfoChanged: new Slick.Event(),
  onRowCountChanged: new Slick.Event(),
  onRowsChanged: new Slick.Event(),
  setPagingOptions: jest.fn(),
  setRefreshHints: jest.fn(),
};

const mockBackendService = {
  resetPaginationOptions: jest.fn(),
  buildQuery: jest.fn(),
  updateOptions: jest.fn(),
  processOnFilterChanged: jest.fn(),
  processOnSortChanged: jest.fn(),
  processOnPaginationChanged: jest.fn(),
};

const mockGridOption = {
  enableAutoResize: true,
  enablePagination: true,
  backendServiceApi: {
    service: mockBackendService,
    process: jest.fn(),
    options: {
      columnDefinitions: [{ id: 'name', field: 'name' }] as Column[],
      datasetName: 'user',
    }
  },
  pagination: {
    pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
    pageSize: 25,
    totalItems: 85
  }
} as GridOption;

const gridStub = {
  autosizeColumns: jest.fn(),
  getColumnIndex: jest.fn(),
  getOptions: () => mockGridOption,
  getColumns: jest.fn(),
  setColumns: jest.fn(),
  onColumnsReordered: jest.fn(),
  onColumnsResized: jest.fn(),
  registerPlugin: jest.fn(),
};

describe('PaginationService', () => {
  let service: PaginationService;
  let sharedService: SharedService;
  const ea = new EventAggregator();

  beforeEach(() => {
    sharedService = new SharedService();
    service = new PaginationService(ea, sharedService);
    service.onPaginationChangedCallback = jest.fn();
  });

  afterEach(() => {
    mockGridOption.pagination.pageSize = 25;
    mockGridOption.pagination.pageNumber = 2;
    mockGridOption.pagination.totalItems = 85;
    service.dispose();
    jest.clearAllMocks();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize the service and call "refreshPagination" and trigger "onPaginationChanged" event', () => {
    const refreshSpy = jest.spyOn(service, 'refreshPagination');
    service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);

    expect(service.paginationOptions).toEqual(mockGridOption.pagination);
    expect(refreshSpy).toHaveBeenCalled();
    expect(service.getCurrentPageNumber()).toBe(2);
  });

  it('should initialize the service and be able to change the grid options by the SETTER and expect the GETTER to have updated options', () => {
    const mockGridOptionCopy = { ...mockGridOption, options: null };
    service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
    service.paginationOptions = mockGridOption.pagination;

    expect(service.paginationOptions).toEqual(mockGridOption.pagination);
    expect(service.getCurrentPageNumber()).toBe(2);
  });

  it('should initialize the service and be able to change the totalItems by the SETTER and not expect the "refreshPagination" method to be called within the SETTER before initialization', () => {
    const spy = jest.spyOn(service, 'refreshPagination');
    service.totalItems = 125;
    service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);

    expect(service.totalItems).toEqual(125);
    expect(service.getCurrentPageNumber()).toBe(2);
    expect(spy).toHaveBeenCalledWith(false, false);
  });

  it('should be able to change the totalItems by the SETTER after the initialization and expect the "refreshPagination" method to be called', () => {
    const spy = jest.spyOn(service, 'refreshPagination');
    service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
    service.totalItems = 125;

    expect(service.totalItems).toEqual(125);
    expect(service.getCurrentPageNumber()).toBe(2);
    expect(spy).toHaveBeenCalledTimes(2); // called 2x times inside the init() and SETTER
  });

  describe('Getters and Setters', () => {
    it('should get the availablePageSizes and equal the one defined in the grid options pagination', () => {
      mockGridOption.pagination.pageSizes = [5, 10, 15, 20];
      service.init(gridStub, dataviewStub, mockGridOption.pagination);
      expect(service.availablePageSizes).toEqual(mockGridOption.pagination.pageSizes);
    });

    it('should get the itemsPerPage and equal the one defined in the grid options pagination', () => {
      mockGridOption.pagination.pageSize = 20;
      service.init(gridStub, dataviewStub, mockGridOption.pagination);
      expect(service.itemsPerPage).toEqual(mockGridOption.pagination.pageSize);
    });

    it('should get the pageCount and equal the one defined in the grid options pagination', () => {
      service.init(gridStub, dataviewStub, mockGridOption.pagination);
      expect(service.pageCount).toEqual(4); // since totalItems is 85 and our pageSize is 20/page
    });

    it('should get the pageNumber and equal the one defined in the grid options pagination', () => {
      mockGridOption.pagination.pageNumber = 3;
      service.init(gridStub, dataviewStub, mockGridOption.pagination);
      expect(service.pageNumber).toEqual(mockGridOption.pagination.pageNumber);
    });
  });

  describe('changeItemPerPage method', () => {
    it('should be on page 0 when total items is 0', () => {
      mockGridOption.pagination.totalItems = 0;
      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.changeItemPerPage(30);

      expect(service.getCurrentPageNumber()).toBe(0);
      expect(service.getCurrentItemPerPageCount()).toBe(30);
    });

    it('should be on page 1 with 2 pages when total items is 51 and we set 50 per page', () => {
      mockGridOption.pagination.pageSize = 25;
      mockGridOption.pagination.pageNumber = 2;
      mockGridOption.pagination.totalItems = 51;

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.changeItemPerPage(50);

      expect(service.getCurrentPageNumber()).toBe(1);
      expect(service.getCurrentItemPerPageCount()).toBe(50);
    });

    it('should be on page 1 with 2 pages when total items is 100 and we set 50 per page', () => {
      mockGridOption.pagination.pageSize = 25;
      mockGridOption.pagination.pageNumber = 2;
      mockGridOption.pagination.totalItems = 100;

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.changeItemPerPage(50);

      expect(service.getCurrentPageNumber()).toBe(1);
      expect(service.getCurrentItemPerPageCount()).toBe(50);
    });
  });

  describe('goToFirstPage method', () => {
    it('should expect current page to be 1 and "processOnPageChanged" method to be called', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');
      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToFirstPage();

      expect(service.dataFrom).toBe(1);
      expect(service.dataTo).toBe(25);
      expect(service.getCurrentPageNumber()).toBe(1);
      expect(spy).toHaveBeenCalledWith(1, undefined);
    });
  });

  describe('goToLastPage method', () => {
    it('should call "goToLastPage" method and expect current page to be last page and "processOnPageChanged" method to be called', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToLastPage();

      expect(service.dataFrom).toBe(76);
      expect(service.dataTo).toBe(85);
      expect(service.getCurrentPageNumber()).toBe(4);
      expect(spy).toHaveBeenCalledWith(4, undefined);
    });
  });

  describe('goToNextPage method', () => {
    it('should expect page to increment by 1 and "processOnPageChanged" method to be called', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToNextPage();

      expect(service.dataFrom).toBe(51);
      expect(service.dataTo).toBe(75);
      expect(service.getCurrentPageNumber()).toBe(3);
      expect(spy).toHaveBeenCalledWith(3, undefined);
    });

    it('should expect page to increment by 1 and "processOnPageChanged" method to be called', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToNextPage();

      expect(service.dataFrom).toBe(51);
      expect(service.dataTo).toBe(75);
      expect(service.getCurrentPageNumber()).toBe(3);
      expect(spy).toHaveBeenCalledWith(3, undefined);
    });

    it('should not expect "processOnPageChanged" method to be called when we are already on last page', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');
      mockGridOption.pagination.pageNumber = 4;

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToNextPage();

      expect(service.dataFrom).toBe(76);
      expect(service.dataTo).toBe(85);
      expect(service.getCurrentPageNumber()).toBe(4);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('goToPreviousPage method', () => {
    it('should expect page to decrement by 1 and "processOnPageChanged" method to be called', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToPreviousPage();

      expect(service.dataFrom).toBe(1);
      expect(service.dataTo).toBe(25);
      expect(service.getCurrentPageNumber()).toBe(1);
      expect(spy).toHaveBeenCalledWith(1, undefined);
    });

    it('should not expect "processOnPageChanged" method to be called when we are already on first page', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');
      mockGridOption.pagination.pageNumber = 1;

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToPreviousPage();

      expect(service.dataFrom).toBe(1);
      expect(service.dataTo).toBe(25);
      expect(service.getCurrentPageNumber()).toBe(1);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('goToPageNumber', () => {
    it('should expect page to decrement by 1 and "processOnPageChanged" method to be called', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToPageNumber(4);

      expect(service.dataFrom).toBe(76);
      expect(service.dataTo).toBe(85);
      expect(service.getCurrentPageNumber()).toBe(4);
      expect(spy).toHaveBeenCalledWith(4, undefined);
    });

    it('should expect to go to page 1 when input number is below 1', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToPageNumber(0);

      expect(service.dataFrom).toBe(1);
      expect(service.dataTo).toBe(25);
      expect(service.getCurrentPageNumber()).toBe(1);
      expect(spy).toHaveBeenCalledWith(1, undefined);
    });

    it('should expect to go to last page (4) when input number is bigger than the last page number', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToPageNumber(10);

      expect(service.dataFrom).toBe(76);
      expect(service.dataTo).toBe(85);
      expect(service.getCurrentPageNumber()).toBe(4);
      expect(spy).toHaveBeenCalledWith(4, undefined);
    });

    it('should not expect "processOnPageChanged" method to be called when we are already on same page', () => {
      const spy = jest.spyOn(service, 'processOnPageChanged');
      mockGridOption.pagination.pageNumber = 2;

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.goToPageNumber(2);

      expect(service.dataFrom).toBe(26);
      expect(service.dataTo).toBe(50);
      expect(service.getCurrentPageNumber()).toBe(2);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('processOnPageChanged method', () => {
    beforeEach(() => {
      mockGridOption.backendServiceApi = {
        service: mockBackendService,
        process: jest.fn(),
        options: {
          columnDefinitions: [{ id: 'name', field: 'name' }] as Column[],
          datasetName: 'user',
        }
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should execute "preProcess" method when defined', () => {
      const spy = jest.fn();
      mockGridOption.backendServiceApi.preProcess = spy;

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.processOnPageChanged(1);

      expect(spy).toHaveBeenCalled();
    });

    it('should execute "process" method and catch error when process Promise rejects', async () => {
      const mockError = { error: '404' };
      const postSpy = jest.fn();
      mockGridOption.backendServiceApi.process = postSpy;
      jest.spyOn(mockBackendService, 'processOnPaginationChanged').mockReturnValue('backend query');
      const promise = new Promise((resolve, reject) => setTimeout(() => reject(mockError), 1));
      jest.spyOn(mockGridOption.backendServiceApi, 'process').mockReturnValue(promise);

      try {
        service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
        await service.processOnPageChanged(1);
      } catch (e) {
        expect(mockBackendError).toHaveBeenCalledWith(mockError, mockGridOption.backendServiceApi);
      }
    });

    it('should execute "process" method when defined', (done) => {
      const postSpy = jest.fn();
      mockGridOption.backendServiceApi.process = postSpy;
      jest.spyOn(mockBackendService, 'processOnPaginationChanged').mockReturnValue('backend query');
      const now = new Date();
      const processResult = { users: [{ name: 'John' }], metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 } };
      const promise = new Promise((resolve) => setTimeout(() => resolve(processResult), 1));
      jest.spyOn(mockGridOption.backendServiceApi, 'process').mockReturnValue(promise);

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.processOnPageChanged(1);

      setTimeout(() => {
        expect(postSpy).toHaveBeenCalled();
        expect(mockExecuteBackendProcess).toHaveBeenCalledWith(expect.toBeDate(), processResult, mockGridOption.backendServiceApi, 85);
        done();
      }, 10);
    });

    it('should call "setPagingOptions" from the DataView and trigger "onPaginationChanged" when using a Local Grid', () => {
      const eaSpy = jest.spyOn(ea, 'publish');
      const setPagingSpy = jest.spyOn(dataviewStub, 'setPagingOptions');
      const changedSpy = jest.spyOn(service, 'onPaginationChangedCallback');

      mockGridOption.backendServiceApi = null;
      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.processOnPageChanged(1);

      expect(setPagingSpy).toHaveBeenCalledWith({ pageSize: 25, pageNum: 0 });
      expect(changedSpy).toHaveBeenCalledWith({
        dataFrom: 26, dataTo: 50, pageSize: 25, pageCount: 4, pageNumber: 2, totalItems: 85, pageSizes: mockGridOption.pagination.pageSizes,
      });
    });
  });

  describe('recalculateFromToIndexes method', () => {
    it('should recalculate the From/To as 0 when total items is 0', () => {
      mockGridOption.pagination.pageSize = 25;
      mockGridOption.pagination.pageNumber = 2;
      mockGridOption.pagination.totalItems = 0;

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.recalculateFromToIndexes();

      expect(service.dataFrom).toBe(0);
      expect(service.dataTo).toBe(0);
    });

    it('should recalculate the From/To within range', () => {
      mockGridOption.pagination.pageSize = 25;
      mockGridOption.pagination.pageNumber = 2;
      mockGridOption.pagination.totalItems = 85;

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.recalculateFromToIndexes();

      expect(service.dataFrom).toBe(26);
      expect(service.dataTo).toBe(50);
    });

    it('should recalculate the From/To within range and have the To equal the total items when total items is not a modulo of 1', () => {
      mockGridOption.pagination.pageSize = 25;
      mockGridOption.pagination.pageNumber = 4;
      mockGridOption.pagination.totalItems = 85;

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.recalculateFromToIndexes();

      expect(service.dataFrom).toBe(76);
      expect(service.dataTo).toBe(85);
    });
  });

  describe('refreshPagination method', () => {
    beforeEach(() => {
      mockGridOption.backendServiceApi = {
        service: mockBackendService,
        process: jest.fn(),
        options: {
          columnDefinitions: [{ id: 'name', field: 'name' }] as Column[],
          datasetName: 'user',
        }
      };
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should throw an error when backendServiceApi is defined without a "process" method', (done) => {
      try {
        // @ts-ignore
        mockGridOption.backendServiceApi = {};
        service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
        service.refreshPagination();
      } catch (e) {
        expect(e.toString()).toContain(`BackendServiceApi requires the following 2 properties "process" and "service" to be defined.`);
        done();
      }
    });

    it('should call refreshPagination when "onFilterCleared" is triggered', () => {
      const resetSpy = jest.spyOn(service, 'resetPagination');
      const refreshSpy = jest.spyOn(service, 'refreshPagination');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      ea.publish(`filterService:filterCleared`, true);

      expect(resetSpy).toHaveBeenCalled();
      expect(refreshSpy).toHaveBeenCalledWith(true, true);
    });

    it('should call refreshPagination when "onFilterChanged" is triggered', () => {
      const eaSpy = jest.spyOn(ea, 'publish');
      const resetSpy = jest.spyOn(service, 'resetPagination');
      const refreshSpy = jest.spyOn(service, 'refreshPagination');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      ea.publish(`filterService:filterChanged`, { columnId: 'field1', operator: '=', searchTerms: [] });

      expect(eaSpy).toHaveBeenCalledWith(`paginationService:on-pagination-refreshed`, true);
      expect(resetSpy).toHaveBeenCalled();
      expect(refreshSpy).toHaveBeenCalledWith(true, true);
    });
  });

  describe('resetPagination method', () => {
    it('should call "refreshPagination" with 2 arguments True when calling the method', () => {
      const spy = jest.spyOn(service, 'refreshPagination');
      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.resetPagination();

      expect(spy).toHaveBeenCalledWith(true, true);
    });

    it('should call "refreshPagination" with True and False arguments when calling the method with False being passed as input argument', () => {
      const spy = jest.spyOn(service, 'refreshPagination');
      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      service.resetPagination(false);

      expect(spy).toHaveBeenCalledWith(true, false);
    });
  });

  // processOnItemAddedOrRemoved is private but we can spy on recalculateFromToIndexes
  describe('processOnItemAddedOrRemoved private method', () => {
    afterEach(() => {
      mockGridOption.pagination.pageSize = 25;
      mockGridOption.pagination.pageNumber = 2;
      mockGridOption.pagination.totalItems = 85;
      jest.clearAllMocks();
    });

    it('should call "processOnItemAddedOrRemoved" and expect the (To) to be incremented by 1 when "onItemAdded" is triggered with a single item', (done) => {
      const mockItems = { name: 'John' };
      const eaSpy = jest.spyOn(ea, 'publish');
      const recalculateSpy = jest.spyOn(service, 'recalculateFromToIndexes');
      const changedSpy = jest.spyOn(service, 'onPaginationChangedCallback');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      ea.publish(`${DEFAULT_AURELIA_EVENT_PREFIX}:on-item-added`, mockItems);

      setTimeout(() => {
        expect(recalculateSpy).toHaveBeenCalledTimes(2);
        expect(eaSpy).toHaveBeenCalledTimes(2); // 2x times (1x for onItemAdded then 1x for onPaginationRefreshed)
        expect(changedSpy).toHaveBeenCalledWith({
          dataFrom: 26, dataTo: (50 + 1), pageSize: 25, pageCount: 4, pageNumber: 2, totalItems: (85 + 1), pageSizes: mockGridOption.pagination.pageSizes
        });
        expect(service.dataFrom).toBe(26);
        expect(service.dataTo).toBe(50 + 1);
        done();
      });
    });

    it('should call "processOnItemAddedOrRemoved" and expect the (To) to be incremented by 2 when "onItemAdded" is triggered with an array of 2 new items', (done) => {
      const mockItems = [{ name: 'John' }, { name: 'Jane' }];
      const eaSpy = jest.spyOn(ea, 'publish');
      const recalculateSpy = jest.spyOn(service, 'recalculateFromToIndexes');
      const changedSpy = jest.spyOn(service, 'onPaginationChangedCallback');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      ea.publish(`${DEFAULT_AURELIA_EVENT_PREFIX}:on-item-added`, mockItems);

      setTimeout(() => {
        expect(recalculateSpy).toHaveBeenCalledTimes(2);
        expect(eaSpy).toHaveBeenCalledTimes(2); // 2x times (1x for onItemAdded then 1x for onPaginationRefreshed)
        expect(changedSpy).toHaveBeenCalledWith({
          dataFrom: 26, dataTo: (50 + mockItems.length), pageSize: 25, pageCount: 4, pageNumber: 2, totalItems: (85 + mockItems.length), pageSizes: mockGridOption.pagination.pageSizes
        });
        expect(service.dataFrom).toBe(26);
        expect(service.dataTo).toBe(50 + mockItems.length);
        done();
      });
    });

    it('should call "processOnItemAddedOrRemoved" and expect not onPaginationChangedCallback to be triggered and the (To) to remain the same when "onItemAdded" is triggered without any items', (done) => {
      const eaSpy = jest.spyOn(ea, 'publish');
      const recalculateSpy = jest.spyOn(service, 'recalculateFromToIndexes');
      const changedSpy = jest.spyOn(service, 'onPaginationChangedCallback');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      ea.publish(`${DEFAULT_AURELIA_EVENT_PREFIX}:on-item-added`, null);

      setTimeout(() => {
        expect(recalculateSpy).toHaveBeenCalledTimes(1);
        expect(eaSpy).toHaveBeenCalledTimes(2); // 2x times (1x for onItemAdded then 1x for onPaginationRefreshed)
        expect(changedSpy).not.toHaveBeenCalled();
        expect(service.dataFrom).toBe(26);
        expect(service.dataTo).toBe(50);
        done();
      });
    });

    it('should call "processOnItemAddedOrRemoved" and expect the (To) to be decremented by 2 when "onItemDeleted" is triggered with a single item', (done) => {
      const mockItems = { name: 'John' };
      const eaSpy = jest.spyOn(ea, 'publish');
      const recalculateSpy = jest.spyOn(service, 'recalculateFromToIndexes');
      const changedSpy = jest.spyOn(service, 'onPaginationChangedCallback');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      ea.publish(`${DEFAULT_AURELIA_EVENT_PREFIX}:on-item-deleted`, mockItems);

      setTimeout(() => {
        // called 2x times by init() then by processOnItemAddedOrRemoved()
        expect(recalculateSpy).toHaveBeenCalledTimes(2);
        expect(eaSpy).toHaveBeenCalledTimes(2); // 2x times (1x for onItemDeleted then 1x for onPaginationRefreshed)
        expect(changedSpy).toHaveBeenCalledWith({
          dataFrom: 26, dataTo: (50 - 1), pageSize: 25, pageCount: 4, pageNumber: 2, totalItems: (85 - 1), pageSizes: mockGridOption.pagination.pageSizes
        });
        expect(service.dataFrom).toBe(26);
        expect(service.dataTo).toBe(50 - 1);
        done();
      });
    });

    it('should call "processOnItemAddedOrRemoved" and expect the (To) to be decremented by 2 when "onItemDeleted" is triggered with an array of 2 new items', (done) => {
      const mockItems = [{ name: 'John' }, { name: 'Jane' }];
      const eaSpy = jest.spyOn(ea, 'publish');
      const recalculateSpy = jest.spyOn(service, 'recalculateFromToIndexes');
      const changedSpy = jest.spyOn(service, 'onPaginationChangedCallback');

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      ea.publish(`${DEFAULT_AURELIA_EVENT_PREFIX}:on-item-deleted`, mockItems);

      setTimeout(() => {
        // called 2x times by init() then by processOnItemAddedOrRemoved()
        expect(recalculateSpy).toHaveBeenCalledTimes(2);
        expect(eaSpy).toHaveBeenCalledTimes(2); // 2x times (1x for onItemDeleted then 1x for onPaginationRefreshed)
        expect(changedSpy).toHaveBeenCalledWith({
          dataFrom: 26, dataTo: (50 - mockItems.length), pageSize: 25, pageCount: 4, pageNumber: 2, totalItems: (85 - mockItems.length), pageSizes: mockGridOption.pagination.pageSizes
        });
        done();
      });
    });

    it('should call "processOnItemAddedOrRemoved" and expect the (To) to remain the same when "onItemDeleted" is triggered without any items', (done) => {
      const eaSpy = jest.spyOn(ea, 'publish');
      const recalculateSpy = jest.spyOn(service, 'recalculateFromToIndexes');

      // service.totalItems = 85;
      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      ea.publish(`${DEFAULT_AURELIA_EVENT_PREFIX}:on-item-deleted`, null);

      setTimeout(() => {
        // called 1x time by init() only
        expect(recalculateSpy).toHaveBeenCalledTimes(1);
        expect(eaSpy).toHaveBeenCalledTimes(2); // 2x times (1x for onItemDeleted then 2x for onPaginationRefreshed)
        expect(service.dataFrom).toBe(26);
        expect(service.dataTo).toBe(50);
        done();
      });
    });

    it('should call "processOnItemAddedOrRemoved" and expect the (To) to equal the total items when it is lower than the total pageSize count', (done) => {
      mockGridOption.pagination.pageNumber = 4;
      mockGridOption.pagination.totalItems = 100;
      const mockItems = { name: 'John' };

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      ea.publish(`${DEFAULT_AURELIA_EVENT_PREFIX}:on-item-added`, mockItems);
      service.changeItemPerPage(200);

      setTimeout(() => {
        expect(service.dataFrom).toBe(1);
        expect(service.dataTo).toBe(101);
        done();
      });
    });

    it('should call "processOnItemAddedOrRemoved" and expect the (To) to equal the total items when it is higher than the total pageSize count', (done) => {
      mockGridOption.pagination.pageNumber = 4;
      mockGridOption.pagination.totalItems = 99;
      const mockItems = { name: 'John' };

      service.init(gridStub, dataviewStub, mockGridOption.pagination, mockGridOption.backendServiceApi);
      ea.publish(`${DEFAULT_AURELIA_EVENT_PREFIX}:on-item-added`, mockItems);
      service.changeItemPerPage(100);

      setTimeout(() => {
        expect(service.dataFrom).toBe(1);
        expect(service.dataTo).toBe(100);
        done();
      });
    });
  });

  describe('with Local Grid', () => {
    beforeEach(() => {
      mockGridOption.pagination.pageSize = 25;
      mockGridOption.pagination.pageNumber = 1;
      mockGridOption.pagination.totalItems = 85;
      mockGridOption.backendServiceApi = null;
    });

    it('should initialize the service and call "refreshPagination" with some DataView calls', (done) => {
      const refreshSpy = jest.spyOn(service, 'refreshPagination');
      const onPagingSpy = jest.spyOn(dataviewStub.onPagingInfoChanged, 'subscribe');
      const setRefreshSpy = jest.spyOn(dataviewStub, 'setRefreshHints');
      const setPagingSpy = jest.spyOn(dataviewStub, 'setPagingOptions');
      service.init(gridStub, dataviewStub, mockGridOption.pagination);

      setTimeout(() => {
        expect(service.paginationOptions).toEqual(mockGridOption.pagination);
        expect(refreshSpy).toHaveBeenCalled();
        expect(onPagingSpy).toHaveBeenCalled();
        expect(setRefreshSpy).toHaveBeenCalled();
        expect(setPagingSpy).toHaveBeenCalledWith({ pageSize: 25, pageNum: 0 });
        expect(service.getCurrentPageNumber()).toBe(1);
        done();
      });
    });

    it('should initialize the service with a page number bigger than 1 (3) and the DataView calls to set pagingInfo to page 2 (3-1)', (done) => {
      const refreshSpy = jest.spyOn(service, 'refreshPagination');
      const onPagingSpy = jest.spyOn(dataviewStub.onPagingInfoChanged, 'subscribe');
      const setRefreshSpy = jest.spyOn(dataviewStub, 'setRefreshHints');
      const setPagingSpy = jest.spyOn(dataviewStub, 'setPagingOptions');
      mockGridOption.pagination.pageNumber = 3;
      service.init(gridStub, dataviewStub, mockGridOption.pagination);

      setTimeout(() => {
        expect(service.paginationOptions).toEqual(mockGridOption.pagination);
        expect(refreshSpy).toHaveBeenCalled();
        expect(onPagingSpy).toHaveBeenCalled();
        expect(setRefreshSpy).toHaveBeenCalled();
        expect(setPagingSpy).toHaveBeenCalledWith({ pageSize: 25, pageNum: 2 });
        expect(service.getCurrentPageNumber()).toBe(3);
        done();
      });
    });

    it('should change the totalItems when "onPagingInfoChanged" from the DataView is triggered with a different total', () => {
      const expectedNewTotal = 22;
      const mockSlickPagingInfo = { pageSize: 5, pageNum: 2, totalRows: expectedNewTotal, totalPages: 3, dataView: dataviewStub };

      service.init(gridStub, dataviewStub, mockGridOption.pagination);
      dataviewStub.onPagingInfoChanged.notify(mockSlickPagingInfo, new Slick.EventData(), dataviewStub);

      expect(service.totalItems).toBe(expectedNewTotal);
    });
  });
});
