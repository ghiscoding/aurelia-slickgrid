var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { bindable } from 'aurelia-framework';
var SlickPaginationCustomElement = /** @class */ (function () {
    function SlickPaginationCustomElement() {
        this.dataFrom = 1;
        this.dataTo = 1;
        this.itemsPerPage = 25;
        this.pageCount = 0;
        this.pageNumber = 1;
        this.totalItems = 0;
        this.paginationPageSizes = [25, 75, 100];
    }
    SlickPaginationCustomElement.prototype.bind = function (binding, contexts) {
        this._gridPaginationOptions = binding.gridPaginationOptions;
        if (!binding.gridPaginationOptions || (binding.gridPaginationOptions.pagination && binding.gridPaginationOptions.pagination.totalItems !== this.totalItems)) {
            this.refreshPagination();
        }
    };
    SlickPaginationCustomElement.prototype.ceil = function (number) {
        return Math.ceil(number);
    };
    SlickPaginationCustomElement.prototype.onChangeItemPerPage = function (event) {
        var itemsPerPage = event.target.value;
        this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
        this.pageNumber = 1;
        this.itemsPerPage = itemsPerPage;
        this.onPageChanged(event, this.pageNumber);
    };
    SlickPaginationCustomElement.prototype.changeToFirstPage = function (event) {
        this.pageNumber = 1;
        this.onPageChanged(event, this.pageNumber);
    };
    SlickPaginationCustomElement.prototype.changeToLastPage = function (event) {
        this.pageNumber = this.pageCount;
        this.onPageChanged(event, this.pageNumber);
    };
    SlickPaginationCustomElement.prototype.changeToNextPage = function (event) {
        if (this.pageNumber < this.pageCount) {
            this.pageNumber++;
            this.onPageChanged(event, this.pageNumber);
        }
    };
    SlickPaginationCustomElement.prototype.changeToPreviousPage = function (event) {
        if (this.pageNumber > 0) {
            this.pageNumber--;
            this.onPageChanged(event, this.pageNumber);
        }
    };
    SlickPaginationCustomElement.prototype.gotoFirstPage = function () {
        this.pageNumber = 1;
        this.onPageChanged(undefined, this.pageNumber);
    };
    SlickPaginationCustomElement.prototype.refreshPagination = function () {
        if (this._gridPaginationOptions) {
            // if totalItems changed, we should always go back to the first page and recalculation the From-To indexes
            if (!this._gridPaginationOptions.pagination || this.totalItems !== this._gridPaginationOptions.pagination.totalItems) {
                this.pageNumber = 1;
                this.recalculateFromToIndexes();
            }
            // calculate and refresh the multiple properties of the pagination UI
            if (this._gridPaginationOptions.pagination) {
                this.paginationPageSizes = this._gridPaginationOptions.pagination.pageSizes;
                this.itemsPerPage = this._gridPaginationOptions.pagination.pageSize;
                if (this._gridPaginationOptions.onPaginationChanged) {
                    this.paginationCallback = this._gridPaginationOptions.onPaginationChanged;
                }
                this.totalItems = this._gridPaginationOptions.pagination.totalItems;
                this.dataTo = this.itemsPerPage;
            }
        }
        this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
    };
    SlickPaginationCustomElement.prototype.onPageChanged = function (event, pageNumber) {
        this.recalculateFromToIndexes();
        if (this.dataTo > this.totalItems) {
            this.dataTo = this.totalItems;
        }
        if (typeof this.paginationCallback === 'function') {
            var itemsPerPage = this.itemsPerPage;
            this.paginationCallback(event, { newPage: pageNumber, pageSize: itemsPerPage });
        }
    };
    SlickPaginationCustomElement.prototype.recalculateFromToIndexes = function () {
        this.dataFrom = (this.pageNumber * this.itemsPerPage) - this.itemsPerPage + 1;
        this.dataTo = (this.pageNumber * this.itemsPerPage);
    };
    __decorate([
        bindable()
    ], SlickPaginationCustomElement.prototype, "grid", void 0);
    __decorate([
        bindable()
    ], SlickPaginationCustomElement.prototype, "gridPaginationOptions", void 0);
    return SlickPaginationCustomElement;
}());
export { SlickPaginationCustomElement };
