System.register(["./services/utilities", "aurelia-framework"], function (exports_1, context_1) {
    "use strict";
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
                if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [0, t.value];
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
    var __moduleName = context_1 && context_1.id;
    var utilities_1, aurelia_framework_1, SlickPaginationCustomElement;
    return {
        setters: [
            function (utilities_1_1) {
                utilities_1 = utilities_1_1;
            },
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            }
        ],
        execute: function () {
            SlickPaginationCustomElement = /** @class */ (function () {
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
                    this.onPageChanged(new CustomEvent('build', { detail: 3 }), this.pageNumber);
                };
                SlickPaginationCustomElement.prototype.refreshPagination = function () {
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
                };
                SlickPaginationCustomElement.prototype.onPageChanged = function (event, pageNumber) {
                    return __awaiter(this, void 0, void 0, function () {
                        var itemsPerPage, query, observableOrPromise, responseProcess;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.recalculateFromToIndexes();
                                    if (this.dataTo > this.totalItems) {
                                        this.dataTo = this.totalItems;
                                    }
                                    if (!this._gridPaginationOptions.onBackendEventApi) return [3 /*break*/, 2];
                                    itemsPerPage = this.itemsPerPage;
                                    if (!this._gridPaginationOptions.onBackendEventApi.process || !this._gridPaginationOptions.onBackendEventApi.service) {
                                        throw new Error("onBackendEventApi requires at least a \"process\" function and a \"service\" defined");
                                    }
                                    if (this._gridPaginationOptions.onBackendEventApi.preProcess) {
                                        this._gridPaginationOptions.onBackendEventApi.preProcess();
                                    }
                                    query = this._gridPaginationOptions.onBackendEventApi.service.onPaginationChanged(event, { newPage: pageNumber, pageSize: itemsPerPage });
                                    observableOrPromise = this._gridPaginationOptions.onBackendEventApi.process(query);
                                    return [4 /*yield*/, utilities_1.castToPromise(observableOrPromise)];
                                case 1:
                                    responseProcess = _a.sent();
                                    // send the response process to the postProcess callback
                                    if (this._gridPaginationOptions.onBackendEventApi.postProcess) {
                                        this._gridPaginationOptions.onBackendEventApi.postProcess(responseProcess);
                                    }
                                    return [3 /*break*/, 3];
                                case 2: throw new Error('Pagination with a backend service requires "onBackendEventApi" to be defined in your grid options');
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                };
                SlickPaginationCustomElement.prototype.recalculateFromToIndexes = function () {
                    this.dataFrom = (this.pageNumber * this.itemsPerPage) - this.itemsPerPage + 1;
                    this.dataTo = (this.pageNumber * this.itemsPerPage);
                };
                __decorate([
                    aurelia_framework_1.bindable()
                ], SlickPaginationCustomElement.prototype, "grid", void 0);
                __decorate([
                    aurelia_framework_1.bindable()
                ], SlickPaginationCustomElement.prototype, "gridPaginationOptions", void 0);
                return SlickPaginationCustomElement;
            }());
            exports_1("SlickPaginationCustomElement", SlickPaginationCustomElement);
        }
    };
});
//# sourceMappingURL=slick-pagination.js.map