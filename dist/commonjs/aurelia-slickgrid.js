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
var global_grid_options_1 = require("./global-grid-options");
var index_1 = require("./services/index");
var $ = require("jquery");
var AureliaSlickgridCustomElement = /** @class */ (function () {
    function AureliaSlickgridCustomElement(elm, controlPluginService, resizer, gridEventService, filterService, sortService) {
        this.elm = elm;
        this.controlPluginService = controlPluginService;
        this.resizer = resizer;
        this.gridEventService = gridEventService;
        this.filterService = filterService;
        this.sortService = sortService;
        this.showPagination = false;
        this.gridHeight = 100;
        this.gridWidth = 600;
        this.elm = elm;
        this.resizer = resizer;
        this.controlPluginService = controlPluginService;
        this.gridEventService = gridEventService;
        this.filterService = filterService;
        this.sortService = sortService;
    }
    AureliaSlickgridCustomElement.prototype.attached = function () {
        // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
        this._dataset = this._dataset || [];
        this._gridOptions = this.mergeGridOptions();
        this.dataview = new Slick.Data.DataView();
        this.grid = new Slick.Grid("#" + this.gridId, this.dataview, this.columnDefinitions, this._gridOptions);
        this.controlPluginService.attachDifferentControlOrPlugins(this.grid, this.columnDefinitions, this._gridOptions, this.dataview);
        this.attachDifferentHooks(this.grid, this._gridOptions, this.dataview);
        this.grid.init();
        this.dataview.beginUpdate();
        this.dataview.setItems(this._dataset);
        this.dataview.endUpdate();
        // attach resize ONLY after the dataView is ready
        this.attachResizeHook(this.grid, this._gridOptions);
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
    AureliaSlickgridCustomElement.prototype.attachDifferentHooks = function (grid, options, dataView) {
        var _this = this;
        // attach external sorting (backend) when available or default onSort (dataView)
        if (options.enableSorting) {
            (options.onBackendEventApi) ? this.sortService.attachBackendOnSort(grid, options) : this.sortService.attachLocalOnSort(grid, options, this.dataview);
        }
        // attach external filter (backend) when available or default onFilter (dataView)
        if (options.enableFiltering) {
            this.filterService.init(grid, options, this.columnDefinitions);
            (options.onBackendEventApi) ? this.filterService.attachBackendOnFilter(grid, options) : this.filterService.attachLocalOnFilter(grid, options, this.dataview);
        }
        if (options.onBackendEventApi && options.onBackendEventApi.onInit) {
            var backendApi_1 = options.onBackendEventApi;
            var query_1 = backendApi_1.service.buildQuery();
            // wrap this inside a setTimeout to avoid timing issue since the gridOptions needs to be ready before running this onInit
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var responseProcess;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(options && options.onBackendEventApi && options.onBackendEventApi.onInit)) return [3 /*break*/, 2];
                            return [4 /*yield*/, options.onBackendEventApi.onInit(query_1)];
                        case 1:
                            responseProcess = _a.sent();
                            // send the response process to the postProcess callback
                            if (backendApi_1.postProcess) {
                                backendApi_1.postProcess(responseProcess);
                            }
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            }); });
        }
        // on cell click, mainly used with the columnDef.action callback
        this.gridEventService.attachOnCellChange(grid, this._gridOptions, dataView);
        this.gridEventService.attachOnClick(grid, this._gridOptions, dataView);
        // if enable, change background color on mouse over
        if (options.enableMouseHoverHighlightRow) {
            this.gridEventService.attachOnMouseHover(grid);
        }
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
        if (this._gridOptions.autoFitColumnsOnFirstLoad) {
            this.grid.autosizeColumns();
        }
        // auto-resize grid on browser resize
        if (options.enableAutoResize) {
            this.resizer.attachAutoResizeDataGrid(grid, options);
            if (options.autoFitColumnsOnFirstLoad) {
                grid.autosizeColumns();
            }
        }
        else {
            this.resizer.resizeGrid(grid, options, 0, { height: this.gridHeight, width: this.gridWidth });
        }
    };
    AureliaSlickgridCustomElement.prototype.mergeGridOptions = function () {
        this.gridOptions.gridId = this.gridId;
        this.gridOptions.gridContainerId = "slickGridContainer-" + this.gridId;
        if (this.gridOptions.enableFiltering) {
            this.gridOptions.showHeaderRow = true;
        }
        // use an immutable merge to avoid changing properties in GlobalGridOptions when changing route
        return $.extend(true, {}, global_grid_options_1.GlobalGridOptions, this.gridOptions);
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
    AureliaSlickgridCustomElement.prototype.refreshGridData = function (dataset) {
        if (dataset && this.grid) {
            this.dataview.setItems(dataset);
            // this.grid.setData(dataset);
            this.grid.invalidate();
            this.grid.render();
            if (this._gridOptions.enablePagination) {
                this.showPagination = true;
                this.gridPaginationOptions = this.mergeGridOptions();
            }
            if (this._gridOptions.enableAutoResize) {
                // resize the grid inside a slight timeout, in case other DOM element changed prior to the resize (like a filter/pagination changed)
                this.resizer.resizeGrid(this.grid, this._gridOptions, 10);
                // this.grid.autosizeColumns();
            }
        }
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
        aurelia_framework_1.inject(Element, index_1.ControlAndPluginService, index_1.ResizerService, index_1.GridEventService, index_1.FilterService, index_1.SortService)
    ], AureliaSlickgridCustomElement);
    return AureliaSlickgridCustomElement;
}());
exports.AureliaSlickgridCustomElement = AureliaSlickgridCustomElement;
//# sourceMappingURL=aurelia-slickgrid.js.map