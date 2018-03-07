var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
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
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "aurelia-i18n", "./global-grid-options", "./services/index", "jquery", "slickgrid/lib/jquery-ui-1.11.3", "slickgrid/lib/jquery.event.drag-2.3.0", "slickgrid/slick.core", "slickgrid/slick.dataview", "slickgrid/slick.grid", "slickgrid/controls/slick.columnpicker", "slickgrid/controls/slick.gridmenu", "slickgrid/controls/slick.pager", "slickgrid/plugins/slick.autotooltips", "slickgrid/plugins/slick.cellcopymanager", "slickgrid/plugins/slick.cellexternalcopymanager", "slickgrid/plugins/slick.cellrangedecorator", "slickgrid/plugins/slick.cellrangeselector", "slickgrid/plugins/slick.cellselectionmodel", "slickgrid/plugins/slick.checkboxselectcolumn", "slickgrid/plugins/slick.headerbuttons", "slickgrid/plugins/slick.headermenu", "slickgrid/plugins/slick.rowmovemanager", "slickgrid/plugins/slick.rowselectionmodel"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, aurelia_i18n_1, global_grid_options_1, index_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var eventPrefix = 'sg';
    // Aurelia doesn't support well TypeScript @autoinject in a Plugin so we'll do it the old fashion way
    var AureliaSlickgridCustomElement = /** @class */ (function () {
        function AureliaSlickgridCustomElement(controlAndPluginService, exportService, elm, ea, filterService, graphqlService, gridEventService, gridExtraService, gridStateService, i18n, resizer, sortService) {
            this.controlAndPluginService = controlAndPluginService;
            this.exportService = exportService;
            this.elm = elm;
            this.ea = ea;
            this.filterService = filterService;
            this.graphqlService = graphqlService;
            this.gridEventService = gridEventService;
            this.gridExtraService = gridExtraService;
            this.gridStateService = gridStateService;
            this.i18n = i18n;
            this.resizer = resizer;
            this.sortService = sortService;
            this._eventHandler = new Slick.EventHandler();
            this.showPagination = false;
            this.gridHeight = 100;
            this.gridWidth = 600;
        }
        AureliaSlickgridCustomElement.prototype.attached = function () {
            this.elm.dispatchEvent(new CustomEvent(eventPrefix + "-on-before-grid-create", {
                bubbles: true,
            }));
            this.ea.publish('onBeforeGridCreate', true);
            // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
            this._dataset = this._dataset || this.dataset || [];
            this.gridOptions = this.mergeGridOptions();
            this.createBackendApiInternalPostProcessCallback(this.gridOptions);
            this.dataview = new Slick.Data.DataView();
            this.controlAndPluginService.createPluginBeforeGridCreation(this.columnDefinitions, this.gridOptions);
            this.grid = new Slick.Grid("#" + this.gridId, this.dataview, this.columnDefinitions, this.gridOptions);
            this.controlAndPluginService.attachDifferentControlOrPlugins(this.grid, this.columnDefinitions, this.gridOptions, this.dataview);
            this.attachDifferentHooks(this.grid, this.gridOptions, this.dataview);
            this.grid.init();
            this.dataview.beginUpdate();
            this.dataview.setItems(this._dataset, this.gridOptions.datasetIdPropertyName);
            this.dataview.endUpdate();
            // publish certain events
            this.elm.dispatchEvent(new CustomEvent(eventPrefix + "-on-grid-created", {
                bubbles: true,
                detail: this.grid
            }));
            this.ea.publish('onGridCreated', this.grid);
            this.elm.dispatchEvent(new CustomEvent(eventPrefix + "-on-dataview-created", {
                bubbles: true,
                detail: this.dataview
            }));
            this.ea.publish('onDataviewCreated', this.dataview);
            // attach resize ONLY after the dataView is ready
            this.attachResizeHook(this.grid, this.gridOptions);
            // attach grid extra service
            this.gridExtraService.init(this.grid, this.columnDefinitions, this.gridOptions, this.dataview);
            // when user enables translation, we need to translate Headers on first pass & subsequently in the attachDifferentHooks
            if (this.gridOptions.enableTranslate) {
                this.controlAndPluginService.translateHeaders();
            }
            // if Export is enabled, initialize the service with the necessary grid and other objects
            if (this.gridOptions.enableExport) {
                this.exportService.init(this.grid, this.gridOptions, this.dataview);
            }
            // attach the Backend Service API callback functions only after the grid is initialized
            // because the preProcess() and onInit() might get triggered
            if (this.gridOptions && (this.gridOptions.backendServiceApi || this.gridOptions.onBackendEventApi)) {
                this.attachBackendCallbackFunctions(this.gridOptions);
            }
            this.gridStateService.init(this.grid, this.filterService, this.sortService);
        };
        AureliaSlickgridCustomElement.prototype.detached = function () {
            this.ea.publish('onBeforeGridDestroy', this.grid);
            this.elm.dispatchEvent(new CustomEvent(eventPrefix + "-on-before-grid-destroy", {
                bubbles: true,
                detail: this.grid
            }));
            this.dataview = [];
            this._eventHandler.unsubscribeAll();
            this.controlAndPluginService.dispose();
            this.gridEventService.dispose();
            this.filterService.dispose();
            this.resizer.dispose();
            this.sortService.dispose();
            this.grid.destroy();
            this.localeChangedSubscriber.dispose();
            this.ea.publish('onAfterGridDestroyed', true);
            this.elm.dispatchEvent(new CustomEvent(eventPrefix + "-on-after-grid-destroyed", {
                bubbles: true,
                detail: this.grid
            }));
        };
        /**
         * Keep original value(s) that could be passed by the user ViewModel.
         * If nothing was passed, it will default to first option of select
         */
        AureliaSlickgridCustomElement.prototype.bind = function (binding, contexts) {
            // get the grid options (priority is Global Options first, then user option which could overwrite the Global options)
            this.gridOptions = __assign({}, global_grid_options_1.GlobalGridOptions, binding.gridOptions);
            this.style = {
                height: binding.gridHeight + "px",
                width: binding.gridWidth + "px"
            };
        };
        AureliaSlickgridCustomElement.prototype.datasetChanged = function (newValue, oldValue) {
            this._dataset = newValue;
            this.refreshGridData(newValue);
            // expand/autofit columns on first page load
            // we can assume that if the oldValue was empty then we are on first load
            if (!oldValue || oldValue.length < 1) {
                if (this.gridOptions.autoFitColumnsOnFirstLoad) {
                    this.grid.autosizeColumns();
                }
            }
        };
        /**
         * Define what our internal Post Process callback, it will execute internally after we get back result from the Process backend call
         * For now, this is GraphQL Service only feautre and it will basically refresh the Dataset & Pagination without having the user to create his own PostProcess every time
         */
        AureliaSlickgridCustomElement.prototype.createBackendApiInternalPostProcessCallback = function (gridOptions) {
            var _this = this;
            if (gridOptions && (gridOptions.backendServiceApi || gridOptions.onBackendEventApi)) {
                var backendApi_1 = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
                // internalPostProcess only works with a GraphQL Service, so make sure it is that type
                if (backendApi_1 && backendApi_1.service && backendApi_1.service instanceof index_1.GraphqlService) {
                    backendApi_1.internalPostProcess = function (processResult) {
                        var datasetName = (backendApi_1 && backendApi_1.service && typeof backendApi_1.service.getDatasetName === 'function') ? backendApi_1.service.getDatasetName() : '';
                        if (!processResult || !processResult.data || !processResult.data[datasetName]) {
                            throw new Error("Your GraphQL result is invalid and/or does not follow the required result structure. Please check the result and/or review structure to use in Aurelia-Slickgrid Wiki in the GraphQL section.");
                        }
                        _this._dataset = processResult.data[datasetName].nodes;
                        _this.refreshGridData(_this._dataset, processResult.data[datasetName].totalCount);
                    };
                }
            }
        };
        AureliaSlickgridCustomElement.prototype.attachDifferentHooks = function (grid, gridOptions, dataView) {
            var _this = this;
            // on locale change, we have to manually translate the Headers, GridMenu
            this.localeChangedSubscriber = this.ea.subscribe('i18n:locale:changed', function (payload) {
                if (gridOptions.enableTranslate) {
                    _this.controlAndPluginService.translateHeaders();
                    _this.controlAndPluginService.translateColumnPicker();
                    _this.controlAndPluginService.translateGridMenu();
                }
            });
            // attach external sorting (backend) when available or default onSort (dataView)
            if (gridOptions.enableSorting) {
                (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) ? this.sortService.attachBackendOnSort(grid, gridOptions) : this.sortService.attachLocalOnSort(grid, gridOptions, this.dataview, this.columnDefinitions);
            }
            // attach external filter (backend) when available or default onFilter (dataView)
            if (gridOptions.enableFiltering) {
                this.filterService.init(grid, gridOptions, this.columnDefinitions);
                // if user entered some "presets", we need to reflect them all in the DOM
                if (gridOptions.presets && gridOptions.presets.filters) {
                    this.filterService.populateColumnFilterSearchTerms(gridOptions, this.columnDefinitions);
                }
                (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) ? this.filterService.attachBackendOnFilter(grid, gridOptions) : this.filterService.attachLocalOnFilter(grid, gridOptions, this.dataview);
            }
            // if user set an onInit Backend, we'll run it right away (and if so, we also need to run preProcess, internalPostProcess & postProcess)
            if (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) {
                var backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
                if (gridOptions.onBackendEventApi) {
                    console.warn("\"onBackendEventApi\" has been DEPRECATED, please consider using \"backendServiceApi\" in the short term since \"onBackendEventApi\" will be removed in future versions. You can take look at the Aurelia-Slickgrid Wikis for OData/GraphQL Services implementation");
                }
                if (backendApi && backendApi.service && backendApi.service.init) {
                    backendApi.service.init(backendApi.options, gridOptions.pagination, this.grid);
                }
            }
            var _loop_1 = function (prop) {
                if (grid.hasOwnProperty(prop) && prop.startsWith('on')) {
                    this_1._eventHandler.subscribe(grid[prop], function (e, args) {
                        _this.elm.dispatchEvent(new CustomEvent(eventPrefix + "-" + index_1.toKebabCase(prop), {
                            bubbles: true,
                            detail: {
                                eventData: e,
                                args: args
                            }
                        }));
                    });
                }
            };
            var this_1 = this;
            for (var prop in grid) {
                _loop_1(prop);
            }
            var _loop_2 = function (prop) {
                if (dataView.hasOwnProperty(prop) && prop.startsWith('on')) {
                    this_2._eventHandler.subscribe(dataView[prop], function (e, args) {
                        _this.elm.dispatchEvent(new CustomEvent(eventPrefix + "-" + index_1.toKebabCase(prop), {
                            bubbles: true,
                            detail: {
                                eventData: e,
                                args: args
                            }
                        }));
                    });
                }
            };
            var this_2 = this;
            for (var prop in dataView) {
                _loop_2(prop);
            }
            // on cell click, mainly used with the columnDef.action callback
            this.gridEventService.attachOnCellChange(grid, this.gridOptions, dataView);
            this.gridEventService.attachOnClick(grid, this.gridOptions, dataView);
            this._eventHandler.subscribe(dataView.onRowCountChanged, function (e, args) {
                grid.updateRowCount();
                grid.render();
            });
            this._eventHandler.subscribe(dataView.onRowsChanged, function (e, args) {
                grid.invalidateRows(args.rows);
                grid.render();
            });
        };
        AureliaSlickgridCustomElement.prototype.attachBackendCallbackFunctions = function (gridOptions) {
            var _this = this;
            var backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
            var serviceOptions = (backendApi && backendApi.service && backendApi.service.options) ? backendApi.service.options : {};
            var isExecuteCommandOnInit = (!serviceOptions) ? false : ((serviceOptions && serviceOptions.hasOwnProperty('executeProcessCommandOnInit')) ? serviceOptions['executeProcessCommandOnInit'] : true);
            // update backend filters (if need be) before the query runs
            if (backendApi) {
                var backendService = backendApi.service;
                if (gridOptions && gridOptions.presets) {
                    if (backendService && backendService.updateFilters && gridOptions.presets.filters) {
                        backendService.updateFilters(gridOptions.presets.filters, true);
                    }
                    if (backendService && backendService.updateSorters && gridOptions.presets.sorters) {
                        backendService.updateSorters(undefined, gridOptions.presets.sorters);
                    }
                    if (backendService && backendService.updatePagination && gridOptions.presets.pagination) {
                        backendService.updatePagination(gridOptions.presets.pagination.pageNumber, gridOptions.presets.pagination.pageSize);
                    }
                }
                else {
                    var columnFilters = this.filterService.getColumnFilters();
                    if (columnFilters && backendService && backendService.updateFilters) {
                        backendService.updateFilters(columnFilters, false);
                    }
                }
            }
            if (backendApi && backendApi.service && (backendApi.onInit || isExecuteCommandOnInit)) {
                var query = (typeof backendApi.service.buildQuery === 'function') ? backendApi.service.buildQuery() : '';
                var onInitPromise_1 = (isExecuteCommandOnInit) ? (backendApi && backendApi.process) ? backendApi.process(query) : undefined : (backendApi && backendApi.onInit) ? backendApi.onInit(query) : null;
                // wrap this inside a setTimeout to avoid timing issue since the gridOptions needs to be ready before running this onInit
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var processResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (backendApi.preProcess) {
                                    backendApi.preProcess();
                                }
                                return [4 /*yield*/, onInitPromise_1];
                            case 1:
                                processResult = _a.sent();
                                // define what our internal Post Process callback, only available for GraphQL Service for now
                                // it will basically refresh the Dataset & Pagination without having the user to create his own PostProcess every time
                                if (processResult && backendApi && backendApi.service instanceof index_1.GraphqlService && backendApi.internalPostProcess) {
                                    backendApi.internalPostProcess(processResult);
                                }
                                // send the response process to the postProcess callback
                                if (backendApi.postProcess) {
                                    backendApi.postProcess(processResult);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
        };
        AureliaSlickgridCustomElement.prototype.attachResizeHook = function (grid, options) {
            // expand/autofit columns on first page load
            if (grid && options.autoFitColumnsOnFirstLoad && typeof grid.autosizeColumns === 'function') {
                this.grid.autosizeColumns();
            }
            // auto-resize grid on browser resize
            this.resizer.init(grid, options);
            if (grid && options.enableAutoResize) {
                this.resizer.attachAutoResizeDataGrid();
                if (options.autoFitColumnsOnFirstLoad && typeof grid.autosizeColumns === 'function') {
                    grid.autosizeColumns();
                }
            }
            else {
                this.resizer.resizeGrid(0, { height: this.gridHeight, width: this.gridWidth });
            }
        };
        AureliaSlickgridCustomElement.prototype.mergeGridOptions = function () {
            this.gridOptions.gridId = this.gridId;
            this.gridOptions.gridContainerId = "slickGridContainer-" + this.gridId;
            if (this.gridOptions.enableFiltering) {
                this.gridOptions.showHeaderRow = true;
            }
            // use jquery extend to deep merge and avoid immutable properties changed in GlobalGridOptions after route change
            return $.extend(true, {}, global_grid_options_1.GlobalGridOptions, this.gridOptions);
        };
        /**
         * When dataset changes, we need to refresh the entire grid UI & possibly resize it as well
         * @param dataset
         */
        AureliaSlickgridCustomElement.prototype.refreshGridData = function (dataset, totalCount) {
            if (dataset && this.grid && this.dataview && typeof this.dataview.setItems === 'function') {
                this.dataview.setItems(dataset, this.gridOptions.datasetIdPropertyName);
                // this.grid.setData(dataset);
                this.grid.invalidate();
                this.grid.render();
                if (this.gridOptions.enablePagination || this.gridOptions.backendServiceApi) {
                    // do we want to show pagination?
                    // if we have a backendServiceApi and the enablePagination is undefined, we'll assume that we do want to see it, else get that defined value
                    this.showPagination = ((this.gridOptions.backendServiceApi && this.gridOptions.enablePagination === undefined) ? true : this.gridOptions.enablePagination) || false;
                    // before merging the grid options, make sure that it has the totalItems count
                    // once we have that, we can merge and pass all these options to the pagination component
                    if (!this.gridOptions.pagination) {
                        this.gridOptions.pagination = (this.gridOptions.pagination) ? this.gridOptions.pagination : undefined;
                    }
                    if (this.gridOptions.pagination && totalCount) {
                        this.gridOptions.pagination.totalItems = totalCount;
                    }
                    if (this.gridOptions.presets && this.gridOptions.presets.pagination && this.gridOptions.pagination) {
                        this.gridOptions.pagination.pageSize = this.gridOptions.presets.pagination.pageSize;
                        this.gridOptions.pagination.pageNumber = this.gridOptions.presets.pagination.pageNumber;
                    }
                    this.gridPaginationOptions = this.mergeGridOptions();
                }
                if (this.grid && this.gridOptions.enableAutoResize) {
                    // resize the grid inside a slight timeout, in case other DOM element changed prior to the resize (like a filter/pagination changed)
                    this.resizer.resizeGrid(10);
                    // this.grid.autosizeColumns();
                }
            }
        };
        /**
         * Toggle the filter row displayed on first row
         * @param isShowing
         */
        AureliaSlickgridCustomElement.prototype.showHeaderRow = function (isShowing) {
            this.grid.setHeaderRowVisibility(isShowing);
            return isShowing;
        };
        /** Toggle the filter row displayed on first row */
        AureliaSlickgridCustomElement.prototype.toggleHeaderRow = function () {
            var isShowing = !this.grid.getOptions().showHeaderRow;
            this.grid.setHeaderRowVisibility(isShowing);
            return isShowing;
        };
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay })
        ], AureliaSlickgridCustomElement.prototype, "element", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay })
        ], AureliaSlickgridCustomElement.prototype, "dataset", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay })
        ], AureliaSlickgridCustomElement.prototype, "paginationOptions", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay })
        ], AureliaSlickgridCustomElement.prototype, "gridPaginationOptions", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay })
        ], AureliaSlickgridCustomElement.prototype, "dataview", void 0);
        __decorate([
            aurelia_framework_1.bindable({ defaultBindingMode: aurelia_framework_1.bindingMode.twoWay })
        ], AureliaSlickgridCustomElement.prototype, "grid", void 0);
        __decorate([
            aurelia_framework_1.bindable()
        ], AureliaSlickgridCustomElement.prototype, "gridId", void 0);
        __decorate([
            aurelia_framework_1.bindable()
        ], AureliaSlickgridCustomElement.prototype, "columnDefinitions", void 0);
        __decorate([
            aurelia_framework_1.bindable()
        ], AureliaSlickgridCustomElement.prototype, "gridOptions", void 0);
        __decorate([
            aurelia_framework_1.bindable()
        ], AureliaSlickgridCustomElement.prototype, "gridHeight", void 0);
        __decorate([
            aurelia_framework_1.bindable()
        ], AureliaSlickgridCustomElement.prototype, "gridWidth", void 0);
        __decorate([
            aurelia_framework_1.bindable()
        ], AureliaSlickgridCustomElement.prototype, "pickerOptions", void 0);
        AureliaSlickgridCustomElement = __decorate([
            aurelia_framework_1.inject(index_1.ControlAndPluginService, index_1.ExportService, Element, aurelia_event_aggregator_1.EventAggregator, index_1.FilterService, index_1.GraphqlService, index_1.GridEventService, index_1.GridExtraService, index_1.GridStateService, aurelia_i18n_1.I18N, index_1.ResizerService, index_1.SortService)
        ], AureliaSlickgridCustomElement);
        return AureliaSlickgridCustomElement;
    }());
    exports.AureliaSlickgridCustomElement = AureliaSlickgridCustomElement;
});
//# sourceMappingURL=aurelia-slickgrid.js.map