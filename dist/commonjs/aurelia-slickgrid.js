"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
// import 3rd party vendor libs
require("slickgrid/lib/jquery-ui-1.11.3");
require("slickgrid/lib/jquery.event.drag-2.3.0");
require("slickgrid/slick.core");
require("slickgrid/slick.dataview");
require("slickgrid/slick.grid");
require("slickgrid/controls/slick.columnpicker");
require("slickgrid/controls/slick.gridmenu");
require("slickgrid/controls/slick.pager");
require("slickgrid/plugins/slick.autotooltips");
require("slickgrid/plugins/slick.cellcopymanager");
require("slickgrid/plugins/slick.cellexternalcopymanager");
require("slickgrid/plugins/slick.cellrangedecorator");
require("slickgrid/plugins/slick.cellrangeselector");
require("slickgrid/plugins/slick.cellselectionmodel");
require("slickgrid/plugins/slick.checkboxselectcolumn");
require("slickgrid/plugins/slick.headerbuttons");
require("slickgrid/plugins/slick.headermenu");
require("slickgrid/plugins/slick.rowmovemanager");
require("slickgrid/plugins/slick.rowselectionmodel");
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var aurelia_i18n_1 = require("aurelia-i18n");
var global_grid_options_1 = require("./global-grid-options");
var index_1 = require("./services/index");
var $ = require("jquery");
var AureliaSlickgridCustomElement = /** @class */ (function () {
    function AureliaSlickgridCustomElement(controlAndPluginService, elm, ea, filterService, graphqlService, gridEventService, gridExtraService, i18n, resizer, sortService) {
        this.controlAndPluginService = controlAndPluginService;
        this.elm = elm;
        this.ea = ea;
        this.filterService = filterService;
        this.graphqlService = graphqlService;
        this.gridEventService = gridEventService;
        this.gridExtraService = gridExtraService;
        this.i18n = i18n;
        this.resizer = resizer;
        this.sortService = sortService;
        this.showPagination = false;
        this.gridHeight = 100;
        this.gridWidth = 600;
        // Aurelia doesn't support well TypeScript @autoinject so we'll do it the old fashion way
        this.controlAndPluginService = controlAndPluginService;
        this.elm = elm;
        this.ea = ea;
        this.filterService = filterService;
        this.graphqlService = graphqlService;
        this.gridEventService = gridEventService;
        this.gridExtraService = gridExtraService;
        this.i18n = i18n;
        this.resizer = resizer;
        this.sortService = sortService;
    }
    AureliaSlickgridCustomElement.prototype.attached = function () {
        this.ea.publish('onBeforeGridCreate', true);
        // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
        this._dataset = this._dataset || [];
        this._gridOptions = this.mergeGridOptions();
        this.createBackendApiInternalPostProcessCallback(this._gridOptions);
        this.dataview = new Slick.Data.DataView();
        this.controlAndPluginService.createPluginBeforeGridCreation(this.columnDefinitions, this._gridOptions);
        this.grid = new Slick.Grid("#" + this.gridId, this.dataview, this.columnDefinitions, this._gridOptions);
        this.controlAndPluginService.attachDifferentControlOrPlugins(this.grid, this.columnDefinitions, this._gridOptions, this.dataview);
        this.attachDifferentHooks(this.grid, this._gridOptions, this.dataview);
        this.grid.init();
        this.dataview.beginUpdate();
        this.dataview.setItems(this._dataset);
        this.dataview.endUpdate();
        // publish certain events
        this.ea.publish('onGridCreated', this.grid);
        this.ea.publish('onDataviewCreated', this.dataview);
        // attach resize ONLY after the dataView is ready
        this.attachResizeHook(this.grid, this._gridOptions);
        // attach grid extra service
        var gridExtraService = this.gridExtraService.init(this.grid, this.columnDefinitions, this._gridOptions, this.dataview);
        // when user enables translation, we need to translate Headers on first pass & subsequently in the attachDifferentHooks
        if (this._gridOptions.enableTranslate) {
            this.controlAndPluginService.translateHeaders();
        }
    };
    AureliaSlickgridCustomElement.prototype.detached = function () {
        this.ea.publish('onBeforeGridDestroy', this.grid);
        this.dataview = [];
        this.controlAndPluginService.destroy();
        this.filterService.destroy();
        this.resizer.destroy();
        this.sortService.destroy();
        this.grid.destroy();
        this.ea.publish('onAfterGridDestroyed', true);
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
    AureliaSlickgridCustomElement.prototype.unbind = function (binding, scope) {
        this.resizer.destroy();
    };
    AureliaSlickgridCustomElement.prototype.datasetChanged = function (newValue, oldValue) {
        this._dataset = newValue;
        this.refreshGridData(newValue);
        // expand/autofit columns on first page load
        // we can assume that if the oldValue was empty then we are on first load
        if (!oldValue || oldValue.length < 1) {
            if (this._gridOptions.autoFitColumnsOnFirstLoad) {
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
                        throw new Error("Your GraphQL result is invalid and/or does not follow the required result structure. Please check the result and/or review structure to use in Angular-Slickgrid Wiki in the GraphQL section.");
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
        this.ea.subscribe('i18n:locale:changed', function (payload) {
            if (gridOptions.enableTranslate) {
                _this.controlAndPluginService.translateHeaders();
                _this.controlAndPluginService.translateColumnPicker();
                _this.controlAndPluginService.translateGridMenu();
            }
        });
        // attach external sorting (backend) when available or default onSort (dataView)
        if (gridOptions.enableSorting) {
            (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) ? this.sortService.attachBackendOnSort(grid, gridOptions) : this.sortService.attachLocalOnSort(grid, gridOptions, this.dataview);
        }
        // attach external filter (backend) when available or default onFilter (dataView)
        if (gridOptions.enableFiltering) {
            this.filterService.init(grid, gridOptions, this.columnDefinitions);
            (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) ? this.filterService.attachBackendOnFilter(grid, gridOptions) : this.filterService.attachLocalOnFilter(grid, gridOptions, this.dataview);
        }
        // if user set an onInit Backend, we'll run it right away (and if so, we also need to run preProcess, internalPostProcess & postProcess)
        if (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) {
            if (gridOptions.onBackendEventApi) {
                console.warn("\"onBackendEventApi\" has been DEPRECATED, please consider using \"backendServiceApi\" in the short term since \"onBackendEventApi\" will be removed in future versions. You can take look at the Angular-Slickgrid Wikis for OData/GraphQL Services implementation");
            }
            if (gridOptions.backendServiceApi && gridOptions.backendServiceApi.service) {
                gridOptions.backendServiceApi.service.initOptions(gridOptions.backendServiceApi.options || {}, gridOptions.pagination);
            }
            var backendApi_2 = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
            var serviceOptions = (backendApi_2 && backendApi_2.service && backendApi_2.service.options) ? backendApi_2.service.options : {};
            var isExecuteCommandOnInit = (!serviceOptions) ? false : ((serviceOptions && serviceOptions.hasOwnProperty('executeProcessCommandOnInit')) ? serviceOptions['executeProcessCommandOnInit'] : true);
            if (backendApi_2 && backendApi_2.service && (backendApi_2.onInit || isExecuteCommandOnInit)) {
                var query = (typeof backendApi_2.service.buildQuery === 'function') ? backendApi_2.service.buildQuery() : '';
                var onInitPromise_1 = (isExecuteCommandOnInit) ? (backendApi_2 && backendApi_2.process) ? backendApi_2.process(query) : undefined : (backendApi_2 && backendApi_2.onInit) ? backendApi_2.onInit(query) : null;
                // wrap this inside a setTimeout to avoid timing issue since the gridOptions needs to be ready before running this onInit
                setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                    var processResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                if (backendApi_2.preProcess) {
                                    backendApi_2.preProcess();
                                }
                                return [4 /*yield*/, onInitPromise_1];
                            case 1:
                                processResult = _a.sent();
                                // define what our internal Post Process callback, only available for GraphQL Service for now
                                // it will basically refresh the Dataset & Pagination without having the user to create his own PostProcess every time
                                if (processResult && backendApi_2 && backendApi_2.service instanceof index_1.GraphqlService && backendApi_2.internalPostProcess) {
                                    backendApi_2.internalPostProcess(processResult);
                                }
                                // send the response process to the postProcess callback
                                if (backendApi_2.postProcess) {
                                    backendApi_2.postProcess(processResult);
                                }
                                return [2 /*return*/];
                        }
                    });
                }); });
            }
        }
        // on cell click, mainly used with the columnDef.action callback
        this.gridEventService.attachOnCellChange(grid, this._gridOptions, dataView);
        this.gridEventService.attachOnClick(grid, this._gridOptions, dataView);
        dataView.onRowCountChanged.subscribe(function (e, args) {
            grid.updateRowCount();
            grid.render();
        });
        dataView.onRowsChanged.subscribe(function (e, args) {
            grid.invalidateRows(args.rows);
            grid.render();
        });
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
     * @param {object} dataset
     */
    AureliaSlickgridCustomElement.prototype.refreshGridData = function (dataset, totalCount) {
        if (dataset && this.grid) {
            this.dataview.setItems(dataset);
            // this.grid.setData(dataset);
            this.grid.invalidate();
            this.grid.render();
            if (this._gridOptions.enablePagination || this._gridOptions.backendServiceApi) {
                this.showPagination = true;
                // before merging the grid options, make sure that it has the totalItems count
                // once we have that, we can merge and pass all these options to the pagination component
                if (!this.gridOptions.pagination) {
                    this.gridOptions.pagination = (this._gridOptions.pagination) ? this._gridOptions.pagination : undefined;
                }
                if (this.gridOptions.pagination && totalCount) {
                    this.gridOptions.pagination.totalItems = totalCount;
                }
                this.gridPaginationOptions = this.mergeGridOptions();
            }
            if (this.grid && this._gridOptions.enableAutoResize) {
                // resize the grid inside a slight timeout, in case other DOM element changed prior to the resize (like a filter/pagination changed)
                this.resizer.resizeGrid(10);
                // this.grid.autosizeColumns();
            }
        }
    };
    /** Toggle the filter row displayed on first row */
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
        aurelia_framework_1.inject(index_1.ControlAndPluginService, Element, aurelia_event_aggregator_1.EventAggregator, index_1.FilterService, index_1.GraphqlService, index_1.GridEventService, index_1.GridExtraService, aurelia_i18n_1.I18N, index_1.ResizerService, index_1.SortService)
    ], AureliaSlickgridCustomElement);
    return AureliaSlickgridCustomElement;
}());
exports.AureliaSlickgridCustomElement = AureliaSlickgridCustomElement;
//# sourceMappingURL=aurelia-slickgrid.js.map