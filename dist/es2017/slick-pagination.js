var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { bindable, inject } from 'aurelia-framework';
import { FilterService } from './services/filter.service';
import { SortService } from './services/sort.service';
let SlickPaginationCustomElement = class SlickPaginationCustomElement {
    constructor(filterService, sortService) {
        this.filterService = filterService;
        this.sortService = sortService;
        this._isFirstRender = true;
        this.dataFrom = 1;
        this.dataTo = 1;
        this.pageCount = 0;
        this.pageNumber = 1;
        this.totalItems = 0;
        this.paginationPageSizes = [25, 75, 100];
        this.filterService = filterService;
        this.sortService = sortService;
    }
    bind(binding, contexts) {
        this._gridPaginationOptions = binding.gridPaginationOptions;
        if (!binding.gridPaginationOptions || (binding.gridPaginationOptions.pagination && binding.gridPaginationOptions.pagination.totalItems !== this.totalItems)) {
            this.refreshPagination();
        }
        // Subscribe to Event Emitter of Filter & Sort changed, go back to page 1 when that happen
        this.filterService.onFilterChanged.subscribe('filterService:changed', (data) => {
            this.refreshPagination(true);
        });
        this.sortService.onSortChanged.subscribe('sortService:changed', (data) => {
            this.refreshPagination(true);
        });
    }
    ceil(number) {
        return Math.ceil(number);
    }
    changeToFirstPage(event) {
        this.pageNumber = 1;
        this.onPageChanged(event, this.pageNumber);
    }
    changeToLastPage(event) {
        this.pageNumber = this.pageCount;
        this.onPageChanged(event, this.pageNumber);
    }
    changeToNextPage(event) {
        if (this.pageNumber < this.pageCount) {
            this.pageNumber++;
            this.onPageChanged(event, this.pageNumber);
        }
    }
    changeToPreviousPage(event) {
        if (this.pageNumber > 0) {
            this.pageNumber--;
            this.onPageChanged(event, this.pageNumber);
        }
    }
    onChangeItemPerPage(event) {
        const itemsPerPage = +event.target.value;
        this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
        this.pageNumber = 1;
        this.itemsPerPage = itemsPerPage;
        this.onPageChanged(event, this.pageNumber);
    }
    refreshPagination(isPageNumberReset) {
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
            this.dataTo = (this.totalItems < this.itemsPerPage) ? this.totalItems : this.itemsPerPage;
        }
        this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    }
    async onPageChanged(event, pageNumber) {
        this.recalculateFromToIndexes();
        const backendApi = this._gridPaginationOptions.backendServiceApi || this._gridPaginationOptions.onBackendEventApi;
        if (!backendApi || !backendApi.service || !backendApi.process) {
            throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
        }
        if (this.dataTo > this.totalItems) {
            this.dataTo = this.totalItems;
        }
        else if (this.totalItems < this.itemsPerPage) {
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
        }
        else {
            throw new Error('Pagination with a backend service requires "onBackendEventApi" to be defined in your grid options');
        }
    }
    recalculateFromToIndexes() {
        this.dataFrom = (this.pageNumber * this.itemsPerPage) - this.itemsPerPage + 1;
        this.dataTo = (this.pageNumber * this.itemsPerPage);
    }
};
__decorate([
    bindable()
], SlickPaginationCustomElement.prototype, "grid", void 0);
__decorate([
    bindable()
], SlickPaginationCustomElement.prototype, "gridPaginationOptions", void 0);
SlickPaginationCustomElement = __decorate([
    inject(FilterService, SortService)
], SlickPaginationCustomElement);
export { SlickPaginationCustomElement };
//# sourceMappingURL=slick-pagination.js.map