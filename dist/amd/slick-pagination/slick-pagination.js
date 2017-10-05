var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SlickPaginationComponent = /** @class */ (function () {
        function SlickPaginationComponent() {
            this.dataFrom = 1;
            this.dataTo = 1;
            this.itemsPerPage = 25;
            this.pageCount = 0;
            this.pageNumber = 1;
            this.totalItems = 0;
            this.paginationPageSizes = [25, 75, 100];
        }
        Object.defineProperty(SlickPaginationComponent.prototype, "gridPaginationOptions", {
            get: function () {
                return this._gridPaginationOptions;
            },
            set: function (gridPaginationOptions) {
                this._gridPaginationOptions = gridPaginationOptions;
                if (!gridPaginationOptions || (gridPaginationOptions.pagination && gridPaginationOptions.pagination.totalItems !== this.totalItems)) {
                    this.refreshPagination();
                }
            },
            enumerable: true,
            configurable: true
        });
        SlickPaginationComponent.prototype.attached = function () {
            this._gridPaginationOptions = this._gridPaginationOptions;
            if (!this._gridPaginationOptions || (this._gridPaginationOptions.pagination && this._gridPaginationOptions.pagination.totalItems !== this.totalItems)) {
                this.refreshPagination();
            }
        };
        SlickPaginationComponent.prototype.ceil = function (number) {
            return Math.ceil(number);
        };
        SlickPaginationComponent.prototype.onChangeItemPerPage = function (event) {
            var itemsPerPage = event.target.value;
            this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
            this.pageNumber = 1;
            this.itemsPerPage = itemsPerPage;
            this.onPageChanged(event, this.pageNumber);
        };
        SlickPaginationComponent.prototype.changeToFirstPage = function (event) {
            this.pageNumber = 1;
            this.onPageChanged(event, this.pageNumber);
        };
        SlickPaginationComponent.prototype.changeToLastPage = function (event) {
            this.pageNumber = this.pageCount;
            this.onPageChanged(event, this.pageNumber);
        };
        SlickPaginationComponent.prototype.changeToNextPage = function (event) {
            if (this.pageNumber < this.pageCount) {
                this.pageNumber++;
                this.onPageChanged(event, this.pageNumber);
            }
        };
        SlickPaginationComponent.prototype.changeToPreviousPage = function (event) {
            if (this.pageNumber > 0) {
                this.pageNumber--;
                this.onPageChanged(event, this.pageNumber);
            }
        };
        SlickPaginationComponent.prototype.gotoFirstPage = function () {
            this.pageNumber = 1;
            this.onPageChanged(undefined, this.pageNumber);
        };
        SlickPaginationComponent.prototype.refreshPagination = function () {
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
        SlickPaginationComponent.prototype.onPageChanged = function (event, pageNumber) {
            this.recalculateFromToIndexes();
            if (this.dataTo > this.totalItems) {
                this.dataTo = this.totalItems;
            }
            if (typeof this.paginationCallback === 'function') {
                var itemsPerPage = this.itemsPerPage;
                this.paginationCallback(event, { newPage: pageNumber, pageSize: itemsPerPage });
            }
        };
        SlickPaginationComponent.prototype.recalculateFromToIndexes = function () {
            this.dataFrom = (this.pageNumber * this.itemsPerPage) - this.itemsPerPage + 1;
            this.dataTo = (this.pageNumber * this.itemsPerPage);
        };
        __decorate([
            aurelia_framework_1.bindable()
        ], SlickPaginationComponent.prototype, "grid", void 0);
        __decorate([
            aurelia_framework_1.bindable()
        ], SlickPaginationComponent.prototype, "gridPaginationOptions", null);
        return SlickPaginationComponent;
    }());
    exports.SlickPaginationComponent = SlickPaginationComponent;
});
