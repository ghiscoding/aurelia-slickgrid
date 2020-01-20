import { inject, singleton } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { BackendServiceApi, CurrentPagination, GraphqlResult, GraphqlPaginatedResult, Pagination } from '../models/index';
import { executeBackendProcessesCallback, onBackendError } from './backend-utilities';
import { SharedService } from './shared.service';
import { disposeAllSubscriptions } from './utilities';

const DEFAULT_AURELIA_EVENT_PREFIX = 'asg';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(EventAggregator, SharedService)
export class PaginationService {
  private _initialized = false;
  private _isLocalGrid = true;
  private _backendServiceApi: BackendServiceApi;
  private _aureliaEventPrefix = DEFAULT_AURELIA_EVENT_PREFIX;
  private _dataFrom = 1;
  private _dataTo = 1;
  private _itemsPerPage: number;
  private _pageCount = 1;
  private _pageNumber = 1;
  private _totalItems = 0;
  private _availablePageSizes: number[];
  private _eventHandler = new Slick.EventHandler();
  private _paginationOptions: Pagination;
  private _subscriptions: Subscription[] = [];
  onPaginationChangedCallback: (changes: any) => void;

  dataView: any;
  grid: any;
  serviceId: number;

  /** Constructor */
  constructor(private ea: EventAggregator, private sharedService: SharedService) { }

  set paginationOptions(paginationOptions: Pagination) {
    this._paginationOptions = paginationOptions;
  }
  get paginationOptions(): Pagination {
    return this._paginationOptions;
  }

  get availablePageSizes(): number[] {
    return this._availablePageSizes;
  }

  get dataFrom(): number {
    return this._dataFrom;
  }

  get dataTo(): number {
    return this._dataTo;
  }

  get itemsPerPage(): number {
    return this._itemsPerPage;
  }

  get pageCount(): number {
    return this._pageCount;
  }

  get pageNumber(): number {
    return this._pageNumber;
  }

  get totalItems(): number {
    return this._totalItems;
  }

  set totalItems(totalItems: number) {
    this._totalItems = totalItems;

    if (this._initialized) {
      this.refreshPagination();
    }
  }

  init(grid: any, dataView: any, paginationOptions: Pagination, backendServiceApi?: BackendServiceApi) {
    this._availablePageSizes = paginationOptions.pageSizes;
    this.dataView = dataView;
    this.grid = grid;
    this._backendServiceApi = backendServiceApi;
    this._paginationOptions = paginationOptions;
    this._isLocalGrid = !backendServiceApi;
    this._pageNumber = paginationOptions.pageNumber || 1;
    this.serviceId = Math.ceil(Math.random() * 10);

    if (backendServiceApi && (!backendServiceApi.service || !backendServiceApi.process)) {
      throw new Error(`BackendServiceApi requires the following 2 properties "process" and "service" to be defined.`);
    }

    if (this._isLocalGrid && this.dataView) {
      this.dataView.onPagingInfoChanged.subscribe((e, pagingInfo) => {
        if (this._totalItems !== pagingInfo.totalRows) {
          this._totalItems = pagingInfo.totalRows;
          this.refreshPagination(false, false);
        }
      });
      setTimeout(() => {
        this.dataView.setRefreshHints({ isFilterUnchanged: true });
        this.dataView.setPagingOptions({ pageSize: this.paginationOptions.pageSize, pageNum: (this._pageNumber - 1) }); // dataView page starts at 0 instead of 1
      });
    }

    // Subscribe to Filter Clear & Changed and go back to page 1 when that happen
    this._subscriptions.push(this.ea.subscribe('filterService:filterChanged', () => this.resetPagination()));
    this._subscriptions.push(this.ea.subscribe('filterService:filterCleared', () => this.resetPagination()));

    // Subscribe to any dataview row count changed so that when Adding/Deleting item(s) through the DataView
    // that would trigger a refresh of the pagination numbers
    if (this.dataView) {
      this._subscriptions.push(this.ea.subscribe(`${this._aureliaEventPrefix}:on-item-added`, (items: any | any[]) => this.processOnItemAddedOrRemoved(items, true)));
      this._subscriptions.push(this.ea.subscribe(`${this._aureliaEventPrefix}:on-item-deleted`, (items: any | any[]) => this.processOnItemAddedOrRemoved(items, false)));
    }

    // if (!this._paginationOptions || (this._paginationOptions.totalItems !== this._totalItems) || this._pageNumber > 1) {
    //   this.refreshPagination(false, false);
    // }
    this.refreshPagination(false, false);
    this._initialized = true;
  }

  dispose() {
    this._initialized = false;

    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();

    // also unsubscribe all Subscriptions
    this._subscriptions = disposeAllSubscriptions(this._subscriptions);
  }

  getCurrentPagination(): CurrentPagination {
    return {
      pageNumber: this._pageNumber,
      pageSize: this._itemsPerPage
    };
  }

  getFullPagination(): Pagination {
    return {
      pageCount: this._pageCount,
      pageNumber: this._pageNumber,
      pageSize: this._itemsPerPage,
      pageSizes: this._availablePageSizes,
      totalItems: this._totalItems,
      dataFrom: this._dataFrom,
      dataTo: this._dataTo,
    };
  }

  getCurrentPageNumber(): number {
    return this._pageNumber;
  }

  getCurrentItemPerPageCount(): number {
    return this._itemsPerPage;
  }

  changeItemPerPage(itemsPerPage: number, event?: any): Promise<any> {
    this._pageNumber = 1;
    this._pageCount = Math.ceil(this._totalItems / itemsPerPage);
    this._itemsPerPage = itemsPerPage;
    return this.processOnPageChanged(this._pageNumber, event);
  }

  goToFirstPage(event?: any): Promise<any> {
    this._pageNumber = 1;
    return this.processOnPageChanged(this._pageNumber, event);
  }

  goToLastPage(event?: any): Promise<any> {
    this._pageNumber = this._pageCount || 1;
    return this.processOnPageChanged(this._pageNumber || 1, event);
  }

  goToNextPage(event?: any): Promise<any> {
    if (this._pageNumber < this._pageCount) {
      this._pageNumber++;
      return this.processOnPageChanged(this._pageNumber, event);
    } else {
      return new Promise(resolve => resolve(false));
    }
  }

  goToPageNumber(pageNumber: number, event?: any): Promise<any> {
    const previousPageNumber = this._pageNumber;

    if (pageNumber < 1) {
      this._pageNumber = 1;
    } else if (pageNumber > this._pageCount) {
      this._pageNumber = this._pageCount;
    } else {
      this._pageNumber = pageNumber;
    }

    if (this._pageNumber !== previousPageNumber) {
      return this.processOnPageChanged(this._pageNumber, event);
    } else {
      return new Promise(resolve => resolve(false));
    }
  }

  goToPreviousPage(event?: any): Promise<any> {
    if (this._pageNumber > 1) {
      this._pageNumber--;
      return this.processOnPageChanged(this._pageNumber, event);
    } else {
      return new Promise(resolve => resolve(false));
    }
  }

  refreshPagination(isPageNumberReset: boolean = false, triggerChangedEvent = true) {
    // trigger an event to inform subscribers
    this.ea.publish(`paginationService:on-pagination-refreshed`, true);

    if (this._paginationOptions) {
      const pagination = this._paginationOptions;

      // set the number of items per page if not already set
      if (!this._itemsPerPage) {
        if (this._isLocalGrid) {
          this._itemsPerPage = pagination.pageSize;
        } else {
          this._itemsPerPage = +((this._backendServiceApi && this._backendServiceApi.options && this._backendServiceApi.options.paginationOptions && this._backendServiceApi.options.paginationOptions.first) ? this._backendServiceApi.options.paginationOptions.first : pagination.pageSize);
        }
      }

      // if totalItems changed, we should always go back to the first page and recalculation the From-To indexes
      if (isPageNumberReset || this._totalItems !== pagination.totalItems) {
        if (isPageNumberReset) {
          this._pageNumber = 1;
          this.paginationOptions.pageNumber = 1;
        } else if (!this._initialized && pagination.pageNumber && pagination.pageNumber > 1) {
          this._pageNumber = pagination.pageNumber || 1;
        }

        // when page number is set to 1 then also reset the "offset" of backend service
        if (this._pageNumber === 1 && this._backendServiceApi) {
          this._backendServiceApi.service.resetPaginationOptions();
        }
      }

      // calculate and refresh the multiple properties of the pagination UI
      this._availablePageSizes = pagination.pageSizes;
      if (!this._totalItems && pagination.totalItems) {
        this._totalItems = pagination.totalItems;
      }
      this.recalculateFromToIndexes();
    }
    this._pageCount = Math.ceil(this._totalItems / this._itemsPerPage);
    if (triggerChangedEvent) {
      if (this.onPaginationChangedCallback) {
        this.onPaginationChangedCallback(this.getFullPagination());
      }
    }
    this.sharedService.currentPagination = this.getCurrentPagination();
  }

  /** Reset the Pagination to first page and recalculate necessary numbers */
  resetPagination(triggerChangedEvent = true) {
    this.refreshPagination(true, triggerChangedEvent);
  }

  processOnPageChanged(pageNumber: number, event?: Event | undefined): Promise<any> {
    return new Promise((resolve, reject) => {
      this.recalculateFromToIndexes();
      if (this._dataTo > this._totalItems) {
        this._dataTo = this._totalItems;
      } else if (this._totalItems < this._itemsPerPage) {
        this._dataTo = this._totalItems;
      }

      if (this._isLocalGrid) {
        this.dataView.setPagingOptions({ pageSize: this._itemsPerPage, pageNum: (pageNumber - 1) }); // dataView page starts at 0 instead of 1
        if (this.onPaginationChangedCallback) {
          this.onPaginationChangedCallback(this.getFullPagination());
        }
      } else {
        const itemsPerPage = +this._itemsPerPage;

        // keep start time & end timestamps & return it after process execution
        const startTime = new Date();

        // run any pre-process, if defined, for example a spinner
        if (this._backendServiceApi && this._backendServiceApi.preProcess) {
          this._backendServiceApi.preProcess();
        }

        const query = this._backendServiceApi.service.processOnPaginationChanged(event, { newPage: pageNumber, pageSize: itemsPerPage });

        // the processes can be Promises or an Observables (like HttpClient)
        const process = this._backendServiceApi.process(query);
        if (process instanceof Promise) {
          process
            .then((processResult: GraphqlResult | GraphqlPaginatedResult | any) => {
              executeBackendProcessesCallback(startTime, processResult, this._backendServiceApi, this._totalItems);
              resolve(this.getFullPagination());
            })
            .catch((error) => {
              onBackendError(error, this._backendServiceApi);
              reject(process);
            });
        }
        if (this.onPaginationChangedCallback) {
          this.onPaginationChangedCallback(this.getFullPagination());
        }
      }
    });
  }

  recalculateFromToIndexes() {
    if (this._totalItems === 0) {
      this._dataFrom = 1;
      this._dataTo = 1;
      this._pageNumber = 1;
    } else {
      this._dataFrom = this._pageNumber > 1 ? ((this._pageNumber * this._itemsPerPage) - this._itemsPerPage + 1) : 1;
      this._dataTo = (this._totalItems < this._itemsPerPage) ? this._totalItems : (this._pageNumber * this._itemsPerPage);
      if (this._dataTo > this._totalItems) {
        this._dataTo = this._totalItems;
      }
    }
  }

  // --
  // private functions
  // --------------------

  /**
   * When item is added or removed, we will refresh the numbers on the pagination however we won't trigger a backend change
   * This will have a side effect though, which is that the "To" count won't be matching the "items per page" count,
   * that is a necessary side effect to avoid triggering a backend query just to refresh the paging,
   * basically we assume that this offset is fine for the time being,
   * until user does an action which will refresh the data hence the pagination which will then become normal again
   */
  private processOnItemAddedOrRemoved(items: any | any[], isItemAdded = true) {
    if (items !== null) {
      const previousDataTo = this._dataTo;
      const itemCount = Array.isArray(items) ? items.length : 1;
      const itemCountWithDirection = isItemAdded ? +itemCount : -itemCount;

      // refresh the total count in the pagination and in the UI
      this._totalItems += itemCountWithDirection;
      this.recalculateFromToIndexes();

      // finally refresh the "To" count and we know it might be different than the "items per page" count
      // but this is necessary since we don't want an actual backend refresh
      this._dataTo = previousDataTo + itemCountWithDirection;
      if (this.onPaginationChangedCallback) {
        this.onPaginationChangedCallback(this.getFullPagination());
      }
    }
  }
}
