System.register(["slickgrid/lib/jquery-ui-1.11.3", "slickgrid/lib/jquery.event.drag-2.3.0", "slickgrid/slick.core", "slickgrid/slick.dataview", "slickgrid/slick.grid", "slickgrid/controls/slick.columnpicker", "slickgrid/controls/slick.gridmenu", "slickgrid/controls/slick.pager", "slickgrid/plugins/slick.autotooltips", "slickgrid/plugins/slick.cellcopymanager", "slickgrid/plugins/slick.cellexternalcopymanager", "slickgrid/plugins/slick.cellrangedecorator", "slickgrid/plugins/slick.cellrangeselector", "slickgrid/plugins/slick.cellselectionmodel", "slickgrid/plugins/slick.checkboxselectcolumn", "slickgrid/plugins/slick.headerbuttons", "slickgrid/plugins/slick.headermenu", "slickgrid/plugins/slick.rowmovemanager", "slickgrid/plugins/slick.rowselectionmodel", "aurelia-framework", "aurelia-event-aggregator", "aurelia-i18n", "./global-grid-options", "./services/index", "jquery"], function (exports_1, context_1) {
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
    var __moduleName = context_1 && context_1.id;
    var aurelia_framework_1, aurelia_event_aggregator_1, aurelia_i18n_1, global_grid_options_1, index_1, $, AureliaSlickgridCustomElement;
    return {
        setters: [
            function (_1) {
            },
            function (_2) {
            },
            function (_3) {
            },
            function (_4) {
            },
            function (_5) {
            },
            function (_6) {
            },
            function (_7) {
            },
            function (_8) {
            },
            function (_9) {
            },
            function (_10) {
            },
            function (_11) {
            },
            function (_12) {
            },
            function (_13) {
            },
            function (_14) {
            },
            function (_15) {
            },
            function (_16) {
            },
            function (_17) {
            },
            function (_18) {
            },
            function (_19) {
            },
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (aurelia_event_aggregator_1_1) {
                aurelia_event_aggregator_1 = aurelia_event_aggregator_1_1;
            },
            function (aurelia_i18n_1_1) {
                aurelia_i18n_1 = aurelia_i18n_1_1;
            },
            function (global_grid_options_1_1) {
                global_grid_options_1 = global_grid_options_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            AureliaSlickgridCustomElement = /** @class */ (function () {
                function AureliaSlickgridCustomElement(controlPluginService, elm, ea, filterService, gridEventService, gridExtraService, i18n, resizer, sortService) {
                    this.controlPluginService = controlPluginService;
                    this.elm = elm;
                    this.ea = ea;
                    this.filterService = filterService;
                    this.gridEventService = gridEventService;
                    this.gridExtraService = gridExtraService;
                    this.i18n = i18n;
                    this.resizer = resizer;
                    this.sortService = sortService;
                    this.showPagination = false;
                    this.gridHeight = 100;
                    this.gridWidth = 600;
                    // Aurelia doesn't support well TypeScript @autoinject so we'll do it the old fashion way
                    this.controlPluginService = controlPluginService;
                    this.elm = elm;
                    this.ea = ea;
                    this.filterService = filterService;
                    this.gridEventService = gridEventService;
                    this.gridExtraService = gridExtraService;
                    this.i18n = i18n;
                    this.resizer = resizer;
                    this.sortService = sortService;
                }
                AureliaSlickgridCustomElement.prototype.attached = function () {
                    // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
                    this._dataset = this._dataset || [];
                    this._gridOptions = this.mergeGridOptions();
                    this.dataview = new Slick.Data.DataView();
                    this.controlPluginService.createPluginBeforeGridCreation(this.columnDefinitions, this._gridOptions);
                    this.grid = new Slick.Grid("#" + this.gridId, this.dataview, this.columnDefinitions, this._gridOptions);
                    this.controlPluginService.attachDifferentControlOrPlugins(this.grid, this.columnDefinitions, this._gridOptions, this.dataview);
                    this.attachDifferentHooks(this.grid, this._gridOptions, this.dataview);
                    this.grid.init();
                    this.dataview.beginUpdate();
                    this.dataview.setItems(this._dataset);
                    this.dataview.endUpdate();
                    // attach resize ONLY after the dataView is ready
                    this.attachResizeHook(this.grid, this._gridOptions);
                    // attach grid extra service
                    var gridExtraService = this.gridExtraService.init(this.grid, this.columnDefinitions, this._gridOptions, this.dataview);
                    // when user enables translation, we need to translate Headers on first pass & subsequently in the attachDifferentHooks
                    if (this._gridOptions.enableTranslate) {
                        this.controlPluginService.translateHeaders();
                    }
                };
                AureliaSlickgridCustomElement.prototype.detached = function () {
                    this.dataview = [];
                    this.controlPluginService.destroy();
                    this.filterService.destroy();
                    this.resizer.destroy();
                    this.grid.destroy();
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
                    // on locale change, we have to manually translate the Headers, GridMenu
                    this.ea.subscribe('i18n:locale:changed', function (payload) {
                        if (options.enableTranslate) {
                            _this.controlPluginService.translateHeaders();
                            _this.controlPluginService.translateColumnPicker();
                            _this.controlPluginService.translateGridMenu();
                        }
                    });
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
                    this.resizer.init(grid, options);
                    if (options.enableAutoResize) {
                        this.resizer.attachAutoResizeDataGrid();
                        if (options.autoFitColumnsOnFirstLoad) {
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
                    aurelia_framework_1.inject(index_1.ControlAndPluginService, Element, aurelia_event_aggregator_1.EventAggregator, index_1.FilterService, index_1.GridEventService, index_1.GridExtraService, aurelia_i18n_1.I18N, index_1.ResizerService, index_1.SortService)
                ], AureliaSlickgridCustomElement);
                return AureliaSlickgridCustomElement;
            }());
            exports_1("AureliaSlickgridCustomElement", AureliaSlickgridCustomElement);
        }
    };
});
//# sourceMappingURL=aurelia-slickgrid.js.map