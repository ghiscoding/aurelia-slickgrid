import { bindable, inject } from 'aurelia-framework';
import { GridOption } from './models/index';
import { FilterService } from './services/filter.service';
import { SortService } from './services/sort.service';

@inject(FilterService, SortService)
export class SlickPaginationCustomElement {
  @bindable() grid: any;
  @bindable() gridPaginationOptions: GridOption;
  private _gridPaginationOptions: GridOption;
  private _isFirstRender = true;

  dataFrom = 1;
  dataTo = 1;
  itemsPerPage: number;
  pageCount = 0;
  pageNumber = 1;
  totalItems = 0;
  paginationCallback: () => void;
  paginationPageSizes = [25, 75, 100];

  constructor(private filterService: FilterService, private sortService: SortService) {
    this.filterService = filterService;
    this.sortService = sortService;
  }

  bind(binding: any, contexts: any) {
    this._gridPaginationOptions = binding.gridPaginationOptions;
    if (!binding.gridPaginationOptions || (binding.gridPaginationOptions.pagination && binding.gridPaginationOptions.pagination.totalItems !== this.totalItems)) {
      this.refreshPagination();
    }

    // Subscribe to Event Emitter of Filter & Sort changed, go back to page 1 when that happen
    this.filterService.onFilterChanged.subscribe('filterService:changed', (data: string) => {
      this.refreshPagination(true);
    });
    this.sortService.onSortChanged.subscribe('sortService:changed', (data: string) => {
      this.refreshPagination(true);
    });
  }

  ceil(number: number) {
    return Math.ceil(number);
  }

  changeToFirstPage(event: any) {
    this.pageNumber = 1;
    this.onPageChanged(event, this.pageNumber);
  }

  changeToLastPage(event: any) {
    this.pageNumber = this.pageCount;
    this.onPageChanged(event, this.pageNumber);
  }

  changeToNextPage(event: any) {
    if (this.pageNumber < this.pageCount) {
      this.pageNumber++;
      this.onPageChanged(event, this.pageNumber);
    }
  }

  changeToPreviousPage(event: any) {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.onPageChanged(event, this.pageNumber);
    }
  }

  onChangeItemPerPage(event: any) {
    const itemsPerPage = +event.target.value;
    this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
    this.pageNumber = 1;
    this.itemsPerPage = itemsPerPage;
    this.onPageChanged(event, this.pageNumber);
  }

  refreshPagination(isPageNumberReset?: boolean) {
    const backendApi = this._gridPaginationOptions.backendServiceApi || this._gridPaginationOptions.onBackendEventApi;
    if (!backendApi || !backendApi.service || !backendApi.process) {
      throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
    }

    if (this._gridPaginationOptions && this._gridPaginationOptions.pagination) {
      // set the number of items per page if not already set
      if (!this.itemsPerPage) {
        this.itemsPerPage = +((backendApi && backendApi.options && backendApi.options.paginationOptions && backendApi.options.paginationOptions.first) ? backendApi.options.paginationOptions.first : this._gridPaginationOptions.pagination.pageSize);
      }

      // if totalItems changed, we should always go back to the first page and recalculation the From-To indexes
      if (isPageNumberReset || this.totalItems !== this._gridPaginationOptions.pagination.totalItems) {
        this.pageNumber = 1;
        this.recalculateFromToIndexes();

        // also reset the "offset" of backend service
        backendApi.service.resetPaginationOptions();
      }

      // calculate and refresh the multiple properties of the pagination UI
      this.paginationPageSizes = this._gridPaginationOptions.pagination.pageSizes;
      this.totalItems = this._gridPaginationOptions.pagination.totalItems;
      this.dataTo = this.itemsPerPage;
    }
    this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  async onPageChanged(event: Event | undefined, pageNumber: number) {
    this.recalculateFromToIndexes();

    const backendApi = this._gridPaginationOptions.backendServiceApi || this._gridPaginationOptions.onBackendEventApi;
    if (!backendApi || !backendApi.service || !backendApi.process) {
      throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
    }

    if (this.dataTo > this.totalItems) {
      this.dataTo = this.totalItems;
    }
    if (backendApi) {
      const itemsPerPage = +this.itemsPerPage;

      if (backendApi.preProcess) {
        backendApi.preProcess();
      }

      const query = backendApi.service.onPaginationChanged(event, { newPage: pageNumber, pageSize: itemsPerPage });

      // await for the Promise to resolve the data
      const processResult = await backendApi.process(query);

      // from the result, call our internal post process to update the Dataset and Pagination info
      if (processResult && backendApi.internalPostProcess) {
        backendApi.internalPostProcess(processResult);
      }

      // send the response process to the postProcess callback
      if (backendApi.postProcess) {
        backendApi.postProcess(processResult);
      }
    } else {
      throw new Error('Pagination with a backend service requires "onBackendEventApi" to be defined in your grid options');
    }
  }

  recalculateFromToIndexes() {
    this.dataFrom = (this.pageNumber * this.itemsPerPage) - this.itemsPerPage + 1;
    this.dataTo = (this.pageNumber * this.itemsPerPage);
  }
}
