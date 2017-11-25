import { bindable, inject } from 'aurelia-framework';
import { GridOption } from './models/index';
import { FilterService } from './services/filter.service';
import { SortService } from './services/sort.service';

@inject(FilterService, SortService)
export class SlickPaginationCustomElement {
  @bindable() grid: any;
  @bindable() gridPaginationOptions: GridOption;
  private _gridPaginationOptions: GridOption;

  dataFrom = 1;
  dataTo = 1;
  itemsPerPage = 25;
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

  gotoFirstPage() {
    this.pageNumber = 1;
    this.onPageChanged(new CustomEvent('build', { detail: 3 }), this.pageNumber);
  }

  onChangeItemPerPage(event: any) {
    const itemsPerPage = event.target.value as number;
    this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
    this.pageNumber = 1;
    this.itemsPerPage = itemsPerPage;
    this.onPageChanged(event, this.pageNumber);
  }

  refreshPagination(isPageNumberReset?: boolean) {
    if (this._gridPaginationOptions && this._gridPaginationOptions.pagination) {
      // if totalItems changed, we should always go back to the first page and recalculation the From-To indexes
      if (isPageNumberReset || this.totalItems !== this._gridPaginationOptions.pagination.totalItems) {
        this.pageNumber = 1;
        this.recalculateFromToIndexes();
      }

      // calculate and refresh the multiple properties of the pagination UI
      this.paginationPageSizes = this._gridPaginationOptions.pagination.pageSizes;
      this.itemsPerPage = this._gridPaginationOptions.pagination.pageSize;
      this.totalItems = this._gridPaginationOptions.pagination.totalItems;
      this.dataTo = this.itemsPerPage;
    }
    this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  async onPageChanged(event: Event, pageNumber: number) {
    this.recalculateFromToIndexes();

    if (this.dataTo > this.totalItems) {
      this.dataTo = this.totalItems;
    }
    if (this._gridPaginationOptions.onBackendEventApi) {
      const itemsPerPage = this.itemsPerPage;

      if (!this._gridPaginationOptions.onBackendEventApi.process || !this._gridPaginationOptions.onBackendEventApi.service) {
        throw new Error(`onBackendEventApi requires at least a "process" function and a "service" defined`);
      }
      if (this._gridPaginationOptions.onBackendEventApi.preProcess) {
        this._gridPaginationOptions.onBackendEventApi.preProcess();
      }
      const query = this._gridPaginationOptions.onBackendEventApi.service.onPaginationChanged(event, { newPage: pageNumber, pageSize: itemsPerPage });

      // await for the Promise to resolve the data
      const responseProcess = await this._gridPaginationOptions.onBackendEventApi.process(query);

      // send the response process to the postProcess callback
      if (this._gridPaginationOptions.onBackendEventApi.postProcess) {
        this._gridPaginationOptions.onBackendEventApi.postProcess(responseProcess);
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
