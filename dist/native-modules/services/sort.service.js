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
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FieldType, SortDirection, SortDirectionNumber } from './../models/index';
import { sortByFieldType } from '../sorters/sorterUtilities';
var SortService = /** @class */ (function () {
    function SortService(ea) {
        this.ea = ea;
        this._currentLocalSorters = [];
        this._eventHandler = new Slick.EventHandler();
        this._isBackendGrid = false;
        this._slickSubscriber = new Slick.Event();
    }
    Object.defineProperty(SortService.prototype, "_gridOptions", {
        /** Getter for the Grid Options pulled through the Grid Object */
        get: function () {
            return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SortService.prototype, "_columnDefinitions", {
        /** Getter for the Column Definitions pulled through the Grid Object */
        get: function () {
            return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Attach a backend sort (single/multi) hook to the grid
     * @param grid SlickGrid Grid object
     * @param dataView SlickGrid DataView object
     */
    SortService.prototype.attachBackendOnSort = function (grid, dataView) {
        this._isBackendGrid = true;
        this._grid = grid;
        this._dataView = dataView;
        this._slickSubscriber = grid.onSort;
        // subscribe to the SlickGrid event and call the backend execution
        this._slickSubscriber.subscribe(this.onBackendSortChanged.bind(this));
    };
    SortService.prototype.onBackendSortChanged = function (event, args) {
        return __awaiter(this, void 0, void 0, function () {
            var gridOptions, backendApi, query, processResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!args || !args.grid) {
                            throw new Error('Something went wrong when trying to attach the "onBackendSortChanged(event, args)" function, it seems that "args" is not populated correctly');
                        }
                        gridOptions = args.grid.getOptions() || {};
                        backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
                        if (!backendApi || !backendApi.process || !backendApi.service) {
                            throw new Error("BackendServiceApi requires at least a \"process\" function and a \"service\" defined");
                        }
                        if (backendApi.preProcess) {
                            backendApi.preProcess();
                        }
                        query = backendApi.service.onSortChanged(event, args);
                        this.emitSortChanged('remote');
                        return [4 /*yield*/, backendApi.process(query)];
                    case 1:
                        processResult = _a.sent();
                        // from the result, call our internal post process to update the Dataset and Pagination info
                        if (processResult && backendApi.internalPostProcess) {
                            backendApi.internalPostProcess(processResult);
                        }
                        // send the response process to the postProcess callback
                        if (backendApi.postProcess) {
                            backendApi.postProcess(processResult);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Attach a local sort (single/multi) hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     * @param dataView
     */
    SortService.prototype.attachLocalOnSort = function (grid, dataView) {
        var _this = this;
        this._isBackendGrid = false;
        this._grid = grid;
        this._dataView = dataView;
        var columnDefinitions = [];
        if (grid) {
            columnDefinitions = grid.getColumns();
        }
        this._slickSubscriber = grid.onSort;
        this._slickSubscriber.subscribe(function (e, args) {
            // multiSort and singleSort are not exactly the same, but we want to structure it the same for the (for loop) after
            // also to avoid having to rewrite the for loop in the sort, we will make the singleSort an array of 1 object
            var sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortAsc: args.sortAsc, sortCol: args.sortCol });
            // keep current sorters
            _this._currentLocalSorters = []; // reset current local sorters
            if (Array.isArray(sortColumns)) {
                sortColumns.forEach(function (sortColumn) {
                    if (sortColumn.sortCol) {
                        _this._currentLocalSorters.push({
                            columnId: sortColumn.sortCol.id,
                            direction: sortColumn.sortAsc ? SortDirection.ASC : SortDirection.DESC
                        });
                    }
                });
            }
            _this.onLocalSortChanged(grid, dataView, sortColumns);
            _this.emitSortChanged('local');
        });
        if (dataView && dataView.onRowCountChanged) {
            this._eventHandler.subscribe(dataView.onRowCountChanged, function (e, args) {
                // load any presets if there are any
                if (args.current > 0) {
                    _this.loadLocalPresets(grid, dataView);
                }
            });
        }
    };
    /**
     * Clear Sorting
     * - 1st, remove the SlickGrid sort icons (this setSortColumns function call really does only that)
     * - 2nd, we also need to trigger a sort change
     *   - for a backend grid, we will trigger a backend sort changed with an empty sort columns array
     *   - however for a local grid, we need to pass a sort column and so we will sort by the 1st column
     */
    SortService.prototype.clearSorting = function () {
        if (this._grid && this._gridOptions && this._dataView) {
            // remove any sort icons (this setSortColumns function call really does only that)
            this._grid.setSortColumns([]);
            // we also need to trigger a sort change
            // for a backend grid, we will trigger a backend sort changed with an empty sort columns array
            // however for a local grid, we need to pass a sort column and so we will sort by the 1st column
            if (this._isBackendGrid) {
                this.onBackendSortChanged(null, { grid: this._grid, sortCols: [] });
            }
            else {
                if (this._columnDefinitions && Array.isArray(this._columnDefinitions)) {
                    this.onLocalSortChanged(this._grid, this._dataView, new Array({ sortAsc: true, sortCol: this._columnDefinitions[0] }));
                }
            }
        }
    };
    SortService.prototype.getCurrentLocalSorters = function () {
        return this._currentLocalSorters;
    };
    /**
     * Get column sorts,
     * If a column is passed as an argument, we won't add this column to our output array since it is already in the array
     * We want to know the sort prior to calling the next sorting command
     */
    SortService.prototype.getPreviousColumnSorts = function (columnId) {
        var _this = this;
        // getSortColumns() only returns sortAsc & columnId, we want the entire column definition
        var oldSortColumns = this._grid.getSortColumns();
        var columnDefinitions = this._grid.getColumns();
        // get the column definition but only keep column which are not equal to our current column
        var sortedCols = oldSortColumns.reduce(function (cols, col) {
            if (!columnId || col.columnId !== columnId) {
                cols.push({ sortCol: _this._columnDefinitions[_this._grid.getColumnIndex(col.columnId)], sortAsc: col.sortAsc });
            }
            return cols;
        }, []);
        return sortedCols;
    };
    /**
     * load any presets if there are any
     * @param grid
     * @param gridOptions
     * @param dataView
     * @param columnDefinitions
     */
    SortService.prototype.loadLocalPresets = function (grid, dataView) {
        var _this = this;
        var sortCols = [];
        this._currentLocalSorters = []; // reset current local sorters
        if (this._gridOptions && this._gridOptions.presets && this._gridOptions.presets.sorters) {
            var sorters_1 = this._gridOptions.presets.sorters;
            this._columnDefinitions.forEach(function (columnDef) {
                var columnPreset = sorters_1.find(function (currentSorter) {
                    return currentSorter.columnId === columnDef.id;
                });
                if (columnPreset) {
                    sortCols.push({
                        columnId: columnDef.id,
                        sortAsc: ((columnPreset.direction.toUpperCase() === SortDirection.ASC) ? true : false),
                        sortCol: columnDef
                    });
                    // keep current sorters
                    _this._currentLocalSorters.push({
                        columnId: columnDef.id + '',
                        direction: columnPreset.direction.toUpperCase()
                    });
                }
            });
            if (sortCols.length > 0) {
                this.onLocalSortChanged(grid, dataView, sortCols);
                grid.setSortColumns(sortCols); // add sort icon in UI
            }
        }
    };
    SortService.prototype.onLocalSortChanged = function (grid, dataView, sortColumns) {
        dataView.sort(function (dataRow1, dataRow2) {
            for (var i = 0, l = sortColumns.length; i < l; i++) {
                var columnSortObj = sortColumns[i];
                if (columnSortObj && columnSortObj.sortCol) {
                    var sortDirection = columnSortObj.sortAsc ? SortDirectionNumber.asc : SortDirectionNumber.desc;
                    var sortField = columnSortObj.sortCol.queryField || columnSortObj.sortCol.queryFieldFilter || columnSortObj.sortCol.field;
                    var fieldType = columnSortObj.sortCol.type || FieldType.string;
                    var value1 = dataRow1[sortField];
                    var value2 = dataRow2[sortField];
                    var sortResult = sortByFieldType(value1, value2, fieldType, sortDirection);
                    if (sortResult !== SortDirectionNumber.neutral) {
                        return sortResult;
                    }
                }
            }
            return 0;
        });
        grid.invalidate();
        grid.render();
    };
    SortService.prototype.dispose = function () {
        // unsubscribe local event
        if (this._slickSubscriber && typeof this._slickSubscriber.unsubscribe === 'function') {
            this._slickSubscriber.unsubscribe();
        }
        // unsubscribe all SlickGrid events
        this._eventHandler.unsubscribeAll();
    };
    /**
     * A simple function that will be called to emit a change when a sort changes.
     * Other services, like Pagination, can then subscribe to it.
     * @param sender
     */
    SortService.prototype.emitSortChanged = function (sender) {
        if (sender === 'remote' && this._gridOptions && this._gridOptions.backendServiceApi) {
            var currentSorters = [];
            var backendService = this._gridOptions.backendServiceApi.service;
            if (backendService && backendService.getCurrentSorters) {
                currentSorters = backendService.getCurrentSorters();
            }
            this.ea.publish('sortService:sortChanged', currentSorters);
        }
        else if (sender === 'local') {
            this.ea.publish('sortService:sortChanged', this.getCurrentLocalSorters());
        }
    };
    SortService = __decorate([
        inject(EventAggregator)
    ], SortService);
    return SortService;
}());
export { SortService };
//# sourceMappingURL=sort.service.js.map