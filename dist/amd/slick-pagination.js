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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var aureliaEventPrefix = 'asg';
    var SlickPaginationCustomElement = /** @class */ (function () {
        function SlickPaginationCustomElement(elm, ea) {
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
        SlickPaginationCustomElement.prototype.bind = function (binding, contexts) {
            var _this = this;
            this._gridPaginationOptions = binding.gridPaginationOptions;
            if (!binding.gridPaginationOptions || (binding.gridPaginationOptions.pagination && binding.gridPaginationOptions.pagination.totalItems !== this.totalItems)) {
                this.refreshPagination();
            }
            else if (binding.gridPaginationOptions.pagination.totalItems === 0) {
                this.recalculateFromToIndexes();
            }
            // Subscribe to Filter changed and go back to page 1 when that happen
            this._filterSubscriber = this.ea.subscribe('filterService:filterChanged', function (data) {
                _this.refreshPagination(true);
            });
            // Subscribe to Filter clear and go back to page 1 when that happen
            this._filterSubscriber = this.ea.subscribe('filterService:filterCleared', function (data) {
                _this.refreshPagination(true);
            });
        };
        SlickPaginationCustomElement.prototype.gridPaginationOptionsChanged = function (newGridOptions) {
            this._gridPaginationOptions = newGridOptions;
            if (newGridOptions) {
                this.refreshPagination();
                this._isFirstRender = false;
            }
        };
        SlickPaginationCustomElement.prototype.detached = function () {
            this.dispose();
        };
        SlickPaginationCustomElement.prototype.ceil = function (number) {
            return Math.ceil(number);
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
        SlickPaginationCustomElement.prototype.changeToCurrentPage = function (event) {
            this.pageNumber = +((event && event.target && event.target.value) ? event.target.value : 1);
            if (this.pageNumber < 1) {
                this.pageNumber = 1;
            }
            else if (this.pageNumber > this.pageCount) {
                this.pageNumber = this.pageCount;
            }
            this.onPageChanged(event, this.pageNumber);
        };
        SlickPaginationCustomElement.prototype.dispose = function () {
            if (this._filterSubscriber) {
                this._filterSubscriber.dispose();
            }
        };
        SlickPaginationCustomElement.prototype.onChangeItemPerPage = function (event) {
            var itemsPerPage = +event.target.value;
            this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
            this.pageNumber = (this.totalItems > 0) ? 1 : 0;
            this.itemsPerPage = itemsPerPage;
            this.onPageChanged(event, this.pageNumber);
        };
        SlickPaginationCustomElement.prototype.refreshPagination = function (isPageNumberReset) {
            if (isPageNumberReset === void 0) { isPageNumberReset = false; }
            var backendApi = this._gridPaginationOptions.backendServiceApi;
            if (!backendApi || !backendApi.service || !backendApi.process) {
                throw new Error("BackendServiceApi requires at least a \"process\" function and a \"service\" defined");
            }
            if (this._gridPaginationOptions && this._gridPaginationOptions.pagination) {
                var pagination = this._gridPaginationOptions.pagination;
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
        };
        SlickPaginationCustomElement.prototype.onPageChanged = function (event, pageNumber) {
            return __awaiter(this, void 0, void 0, function () {
                var backendApi, itemsPerPage, startTime, query, processResult, endTime, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.recalculateFromToIndexes();
                            backendApi = this._gridPaginationOptions.backendServiceApi;
                            if (!backendApi || !backendApi.service || !backendApi.process) {
                                throw new Error("BackendServiceApi requires at least a \"process\" function and a \"service\" defined");
                            }
                            if (this.dataTo > this.totalItems) {
                                this.dataTo = this.totalItems;
                            }
                            else if (this.totalItems < this.itemsPerPage) {
                                this.dataTo = this.totalItems;
                            }
                            if (!backendApi) return [3 /*break*/, 5];
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            itemsPerPage = +this.itemsPerPage;
                            startTime = new Date();
                            if (backendApi.preProcess) {
                                backendApi.preProcess();
                            }
                            query = backendApi.service.processOnPaginationChanged(event, { newPage: pageNumber, pageSize: itemsPerPage });
                            return [4 /*yield*/, backendApi.process(query)];
                        case 2:
                            processResult = _a.sent();
                            endTime = new Date();
                            // from the result, call our internal post process to update the Dataset and Pagination info
                            if (processResult && backendApi.internalPostProcess) {
                                backendApi.internalPostProcess(processResult);
                            }
                            // send the response process to the postProcess callback
                            if (backendApi.postProcess) {
                                if (processResult instanceof Object) {
                                    processResult.statistics = {
                                        startTime: startTime,
                                        endTime: endTime,
                                        executionTime: endTime.valueOf() - startTime.valueOf(),
                                        itemCount: this.totalItems,
                                        totalItemCount: this.totalItems
                                    };
                                }
                                backendApi.postProcess(processResult);
                            }
                            return [3 /*break*/, 4];
                        case 3:
                            e_1 = _a.sent();
                            if (backendApi && backendApi.onError) {
                                backendApi.onError(e_1);
                            }
                            else {
                                throw e_1;
                            }
                            return [3 /*break*/, 4];
                        case 4: return [3 /*break*/, 6];
                        case 5: throw new Error('Pagination with a backend service requires "BackendServiceApi" to be defined in your grid options');
                        case 6:
                            // dispatch the changes to the parent component
                            this.elm.dispatchEvent(new CustomEvent(aureliaEventPrefix + "-on-pagination-changed", {
                                bubbles: true,
                                detail: {
                                    pageNumber: this.pageNumber,
                                    pageSizes: this.paginationPageSizes,
                                    pageSize: this.itemsPerPage,
                                    totalItems: this.totalItems
                                }
                            }));
                            return [2 /*return*/];
                    }
                });
            });
        };
        SlickPaginationCustomElement.prototype.recalculateFromToIndexes = function () {
            if (this.totalItems === 0) {
                this.dataFrom = 0;
                this.dataTo = 0;
                this.pageNumber = 0;
            }
            else {
                this.dataFrom = (this.pageNumber * this.itemsPerPage) - this.itemsPerPage + 1;
                this.dataTo = (this.totalItems < this.itemsPerPage) ? this.totalItems : (this.pageNumber * this.itemsPerPage);
            }
        };
        __decorate([
            aurelia_framework_1.bindable()
        ], SlickPaginationCustomElement.prototype, "grid", void 0);
        __decorate([
            aurelia_framework_1.bindable()
        ], SlickPaginationCustomElement.prototype, "gridPaginationOptions", void 0);
        SlickPaginationCustomElement = __decorate([
            aurelia_framework_1.inject(Element, aurelia_event_aggregator_1.EventAggregator)
        ], SlickPaginationCustomElement);
        return SlickPaginationCustomElement;
    }());
    exports.SlickPaginationCustomElement = SlickPaginationCustomElement;
});
//# sourceMappingURL=slick-pagination.js.map