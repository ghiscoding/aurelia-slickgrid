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
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var index_1 = require("./../models/index");
var index_2 = require("./../sorters/index");
var SortService = /** @class */ (function () {
    function SortService(ea) {
        this.ea = ea;
        this._currentLocalSorters = [];
        this._eventHandler = new Slick.EventHandler();
        this._slickSubscriber = new Slick.Event();
    }
    /**
     * Attach a backend sort (single/multi) hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     */
    SortService.prototype.attachBackendOnSort = function (grid, gridOptions) {
        this._grid = grid;
        this._gridOptions = gridOptions;
        this._slickSubscriber = grid.onSort;
        // subscribe to the SlickGrid event and call the backend execution
        this._slickSubscriber.subscribe(this.attachBackendOnSortSubscribe.bind(this));
    };
    SortService.prototype.attachBackendOnSortSubscribe = function (event, args) {
        return __awaiter(this, void 0, void 0, function () {
            var gridOptions, backendApi, query, processResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!args || !args.grid) {
                            throw new Error('Something went wrong when trying to attach the "attachBackendOnSortSubscribe(event, args)" function, it seems that "args" is not populated correctly');
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
    SortService.prototype.attachLocalOnSort = function (grid, gridOptions, dataView, columnDefinitions) {
        var _this = this;
        this._grid = grid;
        this._gridOptions = gridOptions;
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
                            direction: sortColumn.sortAsc ? index_1.SortDirection.ASC : index_1.SortDirection.DESC
                        });
                    }
                });
            }
            _this.onLocalSortChanged(grid, gridOptions, dataView, sortColumns);
            _this.emitSortChanged('local');
        });
        this._eventHandler.subscribe(dataView.onRowCountChanged, function (e, args) {
            // load any presets if there are any
            if (args.current > 0) {
                _this.loadLocalPresets(grid, gridOptions, dataView, columnDefinitions);
            }
        });
    };
    SortService.prototype.getCurrentLocalSorters = function () {
        return this._currentLocalSorters;
    };
    /**
     * load any presets if there are any
     * @param grid
     * @param gridOptions
     * @param dataView
     * @param columnDefinitions
     */
    SortService.prototype.loadLocalPresets = function (grid, gridOptions, dataView, columnDefinitions) {
        var _this = this;
        var sortCols = [];
        this._currentLocalSorters = []; // reset current local sorters
        if (gridOptions && gridOptions.presets && gridOptions.presets.sorters) {
            var sorters_1 = gridOptions.presets.sorters;
            columnDefinitions.forEach(function (columnDef) {
                var columnPreset = sorters_1.find(function (currentSorter) {
                    return currentSorter.columnId === columnDef.id;
                });
                if (columnPreset) {
                    sortCols.push({
                        columnId: columnDef.id,
                        sortAsc: ((columnPreset.direction.toUpperCase() === index_1.SortDirection.ASC) ? true : false),
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
                this.onLocalSortChanged(grid, gridOptions, dataView, sortCols);
                grid.setSortColumns(sortCols);
            }
        }
    };
    SortService.prototype.onLocalSortChanged = function (grid, gridOptions, dataView, sortColumns) {
        dataView.sort(function (dataRow1, dataRow2) {
            for (var i = 0, l = sortColumns.length; i < l; i++) {
                var columnSortObj = sortColumns[i];
                if (columnSortObj && columnSortObj.sortCol) {
                    var sortDirection = columnSortObj.sortAsc ? 1 : -1;
                    var sortField = columnSortObj.sortCol.queryField || columnSortObj.sortCol.queryFieldSorter || columnSortObj.sortCol.field;
                    var fieldType = columnSortObj.sortCol.type || 'string';
                    var value1 = dataRow1[sortField];
                    var value2 = dataRow2[sortField];
                    var result = 0;
                    switch (fieldType) {
                        case index_1.FieldType.number:
                            result = index_2.Sorters.numeric(value1, value2, sortDirection);
                            break;
                        case index_1.FieldType.date:
                            result = index_2.Sorters.date(value1, value2, sortDirection);
                            break;
                        case index_1.FieldType.dateIso:
                            result = index_2.Sorters.dateIso(value1, value2, sortDirection);
                            break;
                        case index_1.FieldType.dateUs:
                            result = index_2.Sorters.dateUs(value1, value2, sortDirection);
                            break;
                        case index_1.FieldType.dateUsShort:
                            result = index_2.Sorters.dateUsShort(value1, value2, sortDirection);
                            break;
                        default:
                            result = index_2.Sorters.string(value1, value2, sortDirection);
                            break;
                    }
                    if (result !== 0) {
                        return result;
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
        aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator)
    ], SortService);
    return SortService;
}());
exports.SortService = SortService;
//# sourceMappingURL=sort.service.js.map