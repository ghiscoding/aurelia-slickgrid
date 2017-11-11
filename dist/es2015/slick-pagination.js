var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { bindable } from 'aurelia-framework';
export class SlickPaginationCustomElement {
    constructor() {
        this.dataFrom = 1;
        this.dataTo = 1;
        this.itemsPerPage = 25;
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
    }
    ceil(number) {
        return Math.ceil(number);
    }
    onChangeItemPerPage(event) {
        const itemsPerPage = event.target.value;
        this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
        this.pageNumber = 1;
        this.itemsPerPage = itemsPerPage;
        this.onPageChanged(event, this.pageNumber);
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
    gotoFirstPage() {
        this.pageNumber = 1;
        this.onPageChanged(new CustomEvent('build', { detail: 3 }), this.pageNumber);
    }
    refreshPagination() {
        if (this._gridPaginationOptions && this._gridPaginationOptions.pagination) {
            // if totalItems changed, we should always go back to the first page and recalculation the From-To indexes
            if (this.totalItems !== this._gridPaginationOptions.pagination.totalItems) {
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
    onPageChanged(event, pageNumber) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const responseProcess = yield this._gridPaginationOptions.onBackendEventApi.process(query);
                // send the response process to the postProcess callback
                if (this._gridPaginationOptions.onBackendEventApi.postProcess) {
                    this._gridPaginationOptions.onBackendEventApi.postProcess(responseProcess);
                }
            }
            else {
                throw new Error('Pagination with a backend service requires "onBackendEventApi" to be defined in your grid options');
            }
        });
    }
    recalculateFromToIndexes() {
        this.dataFrom = (this.pageNumber * this.itemsPerPage) - this.itemsPerPage + 1;
        this.dataTo = (this.pageNumber * this.itemsPerPage);
    }
}
__decorate([
    bindable()
], SlickPaginationCustomElement.prototype, "grid", void 0);
__decorate([
    bindable()
], SlickPaginationCustomElement.prototype, "gridPaginationOptions", void 0);
//# sourceMappingURL=slick-pagination.js.map