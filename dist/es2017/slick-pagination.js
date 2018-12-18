var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { bindable, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
const aureliaEventPrefix = 'asg';
let SlickPaginationCustomElement = class SlickPaginationCustomElement {
    constructor(elm, ea) {
        this.elm = elm;
        this.ea = ea;
        this._isFirstRender = true;
        this.dataFrom = 1;
        this.dataTo = 1;
        this.pageCount = 0;
        this.pageNumber = 1;
        this.totalItems = 0;
        this.paginationPageSizes = [25, 75, 100];
    }
    bind(binding, contexts) {
        this._gridPaginationOptions = binding.gridPaginationOptions;
        if (!binding.gridPaginationOptions || (binding.gridPaginationOptions.pagination && binding.gridPaginationOptions.pagination.totalItems !== this.totalItems)) {
            this.refreshPagination();
        }
        else if (binding.gridPaginationOptions.pagination.totalItems === 0) {
            this.recalculateFromToIndexes();
        }
        // Subscribe to Filter changed and go back to page 1 when that happen
        this._filterSubscriber = this.ea.subscribe('filterService:filterChanged', (data) => {
            this.refreshPagination(true);
        });
        // Subscribe to Filter clear and go back to page 1 when that happen
        this._filterSubscriber = this.ea.subscribe('filterService:filterCleared', (data) => {
            this.refreshPagination(true);
        });
    }
    gridPaginationOptionsChanged(newGridOptions) {
        this._gridPaginationOptions = newGridOptions;
        if (newGridOptions) {
            this.refreshPagination();
            this._isFirstRender = false;
        }
    }
    detached() {
        this.dispose();
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
    changeToCurrentPage(event) {
        this.pageNumber = +((event && event.target && event.target.value) ? event.target.value : 1);
        if (this.pageNumber < 1) {
            this.pageNumber = 1;
        }
        else if (this.pageNumber > this.pageCount) {
            this.pageNumber = this.pageCount;
        }
        this.onPageChanged(event, this.pageNumber);
    }
    dispose() {
        if (this._filterSubscriber) {
            this._filterSubscriber.dispose();
        }
    }
    onChangeItemPerPage(event) {
        const itemsPerPage = +event.target.value;
        this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
        this.pageNumber = (this.totalItems > 0) ? 1 : 0;
        this.itemsPerPage = itemsPerPage;
        this.onPageChanged(event, this.pageNumber);
    }
    refreshPagination(isPageNumberReset = false) {
        const backendApi = this._gridPaginationOptions.backendServiceApi;
        if (!backendApi || !backendApi.service || !backendApi.process) {
            throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
        }
        if (this._gridPaginationOptions && this._gridPaginationOptions.pagination) {
            const pagination = this._gridPaginationOptions.pagination;
            // set the number of items per page if not already set
            if (!this.itemsPerPage) {
                this.itemsPerPage = +((backendApi && backendApi.options && backendApi.options.paginationOptions && backendApi.options.paginationOptions.first) ? backendApi.options.paginationOptions.first : this._gridPaginationOptions.pagination.pageSize);
            }
            // if totalItems changed, we should always go back to the first page and recalculation the From-To indexes
            if (isPageNumberReset || this.totalItems !== pagination.totalItems) {
                if (!isPageNumberReset && this._isFirstRender && pagination.pageNumber && pagination.pageNumber > 1) {
                    this.pageNumber = pagination.pageNumber || 1;
                    this._isFirstRender = false;
                }
                else {
                    this.pageNumber = 1;
                }
                // when page number is set to 1 then also reset the "offset" of backend service
                if (this.pageNumber === 1) {
                    backendApi.service.resetPaginationOptions();
                }
            }
            // calculate and refresh the multiple properties of the pagination UI
            this.paginationPageSizes = this._gridPaginationOptions.pagination.pageSizes;
            this.totalItems = this._gridPaginationOptions.pagination.totalItems;
            this.recalculateFromToIndexes();
        }
        this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    }
    async onPageChanged(event, pageNumber) {
        this.recalculateFromToIndexes();
        const backendApi = this._gridPaginationOptions.backendServiceApi;
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
            try {
                const itemsPerPage = +this.itemsPerPage;
                // keep start time & end timestamps & return it after process execution
                const startTime = new Date();
                if (backendApi.preProcess) {
                    backendApi.preProcess();
                }
                const query = backendApi.service.processOnPaginationChanged(event, { newPage: pageNumber, pageSize: itemsPerPage });
                // await for the Promise to resolve the data
                const processResult = await backendApi.process(query);
                const endTime = new Date();
                // from the result, call our internal post process to update the Dataset and Pagination info
                if (processResult && backendApi.internalPostProcess) {
                    backendApi.internalPostProcess(processResult);
                }
                // send the response process to the postProcess callback
                if (backendApi.postProcess) {
                    if (processResult instanceof Object) {
                        processResult.statistics = {
                            startTime,
                            endTime,
                            executionTime: endTime.valueOf() - startTime.valueOf(),
                            itemCount: this.totalItems,
                            totalItemCount: this.totalItems
                        };
                    }
                    backendApi.postProcess(processResult);
                }
            }
            catch (e) {
                if (backendApi && backendApi.onError) {
                    backendApi.onError(e);
                }
                else {
                    throw e;
                }
            }
        }
        else {
            throw new Error('Pagination with a backend service requires "BackendServiceApi" to be defined in your grid options');
        }
        // dispatch the changes to the parent component
        this.elm.dispatchEvent(new CustomEvent(`${aureliaEventPrefix}-on-pagination-changed`, {
            bubbles: true,
            detail: {
                pageNumber: this.pageNumber,
                pageSizes: this.paginationPageSizes,
                pageSize: this.itemsPerPage,
                totalItems: this.totalItems
            }
        }));
    }
    recalculateFromToIndexes() {
        if (this.totalItems === 0) {
            this.dataFrom = 0;
            this.dataTo = 0;
            this.pageNumber = 0;
        }
        else {
            this.dataFrom = (this.pageNumber * this.itemsPerPage) - this.itemsPerPage + 1;
            this.dataTo = (this.totalItems < this.itemsPerPage) ? this.totalItems : (this.pageNumber * this.itemsPerPage);
        }
    }
};
__decorate([
    bindable()
], SlickPaginationCustomElement.prototype, "grid", void 0);
__decorate([
    bindable()
], SlickPaginationCustomElement.prototype, "gridPaginationOptions", void 0);
SlickPaginationCustomElement = __decorate([
    inject(Element, EventAggregator)
], SlickPaginationCustomElement);
export { SlickPaginationCustomElement };
//# sourceMappingURL=slick-pagination.js.map