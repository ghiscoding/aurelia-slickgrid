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
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FieldType, SortDirection, SortDirectionNumber } from './../models/index';
import { sortByFieldType } from '../sorters/sorterUtilities';
let SortService = class SortService {
    constructor(ea) {
        this.ea = ea;
        this._currentLocalSorters = [];
        this._eventHandler = new Slick.EventHandler();
        this._isBackendGrid = false;
        this._slickSubscriber = new Slick.Event();
    }
    /**
     * Attach a backend sort (single/multi) hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     */
    attachBackendOnSort(grid, dataView) {
        this._isBackendGrid = true;
        this._grid = grid;
        this._dataView = dataView;
        if (grid) {
            this._gridOptions = grid.getOptions();
        }
        this._slickSubscriber = grid.onSort;
        // subscribe to the SlickGrid event and call the backend execution
        this._slickSubscriber.subscribe(this.onBackendSortChanged.bind(this));
    }
    onBackendSortChanged(event, args) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!args || !args.grid) {
                throw new Error('Something went wrong when trying to attach the "onBackendSortChanged(event, args)" function, it seems that "args" is not populated correctly');
            }
            const gridOptions = args.grid.getOptions() || {};
            const backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
            if (!backendApi || !backendApi.process || !backendApi.service) {
                throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
            }
            if (backendApi.preProcess) {
                backendApi.preProcess();
            }
            const query = backendApi.service.onSortChanged(event, args);
            this.emitSortChanged('remote');
            // await for the Promise to resolve the data
            const processResult = yield backendApi.process(query);
            // from the result, call our internal post process to update the Dataset and Pagination info
            if (processResult && backendApi.internalPostProcess) {
                backendApi.internalPostProcess(processResult);
            }
            // send the response process to the postProcess callback
            if (backendApi.postProcess) {
                backendApi.postProcess(processResult);
            }
        });
    }
    /**
     * Attach a local sort (single/multi) hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     * @param dataView
     */
    attachLocalOnSort(grid, dataView) {
        this._isBackendGrid = false;
        this._grid = grid;
        this._dataView = dataView;
        let columnDefinitions = [];
        if (grid) {
            this._gridOptions = grid.getOptions();
            columnDefinitions = grid.getColumns();
        }
        this._slickSubscriber = grid.onSort;
        this._slickSubscriber.subscribe((e, args) => {
            // multiSort and singleSort are not exactly the same, but we want to structure it the same for the (for loop) after
            // also to avoid having to rewrite the for loop in the sort, we will make the singleSort an array of 1 object
            const sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortAsc: args.sortAsc, sortCol: args.sortCol });
            // keep current sorters
            this._currentLocalSorters = []; // reset current local sorters
            if (Array.isArray(sortColumns)) {
                sortColumns.forEach((sortColumn) => {
                    if (sortColumn.sortCol) {
                        this._currentLocalSorters.push({
                            columnId: sortColumn.sortCol.id,
                            direction: sortColumn.sortAsc ? SortDirection.ASC : SortDirection.DESC
                        });
                    }
                });
            }
            this.onLocalSortChanged(grid, this._gridOptions, dataView, sortColumns);
            this.emitSortChanged('local');
        });
        if (dataView && dataView.onRowCountChanged) {
            this._eventHandler.subscribe(dataView.onRowCountChanged, (e, args) => {
                // load any presets if there are any
                if (args.current > 0) {
                    this.loadLocalPresets(grid, this._gridOptions, dataView, columnDefinitions);
                }
            });
        }
    }
    /**
     * Clear Sorting
     * - 1st, remove the SlickGrid sort icons (this setSortColumns function call really does only that)
     * - 2nd, we also need to trigger a sort change
     *   - for a backend grid, we will trigger a backend sort changed with an empty sort columns array
     *   - however for a local grid, we need to pass a sort column and so we will sort by the 1st column
     */
    clearSorting() {
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
                const columnDefinitions = this._grid.getColumns();
                if (columnDefinitions && Array.isArray(columnDefinitions)) {
                    this.onLocalSortChanged(this._grid, this._gridOptions, this._dataView, new Array({ sortAsc: true, sortCol: columnDefinitions[0] }));
                }
            }
        }
    }
    getCurrentLocalSorters() {
        return this._currentLocalSorters;
    }
    /**
     * load any presets if there are any
     * @param grid
     * @param gridOptions
     * @param dataView
     * @param columnDefinitions
     */
    loadLocalPresets(grid, gridOptions, dataView, columnDefinitions) {
        const sortCols = [];
        this._currentLocalSorters = []; // reset current local sorters
        if (gridOptions && gridOptions.presets && gridOptions.presets.sorters) {
            const sorters = gridOptions.presets.sorters;
            columnDefinitions.forEach((columnDef) => {
                const columnPreset = sorters.find((currentSorter) => {
                    return currentSorter.columnId === columnDef.id;
                });
                if (columnPreset) {
                    sortCols.push({
                        columnId: columnDef.id,
                        sortAsc: ((columnPreset.direction.toUpperCase() === SortDirection.ASC) ? true : false),
                        sortCol: columnDef
                    });
                    // keep current sorters
                    this._currentLocalSorters.push({
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
    }
    onLocalSortChanged(grid, gridOptions, dataView, sortColumns) {
        dataView.sort((dataRow1, dataRow2) => {
            for (let i = 0, l = sortColumns.length; i < l; i++) {
                const columnSortObj = sortColumns[i];
                if (columnSortObj && columnSortObj.sortCol) {
                    const sortDirection = columnSortObj.sortAsc ? SortDirectionNumber.asc : SortDirectionNumber.desc;
                    const sortField = columnSortObj.sortCol.queryField || columnSortObj.sortCol.queryFieldFilter || columnSortObj.sortCol.field;
                    const fieldType = columnSortObj.sortCol.type || FieldType.string;
                    const value1 = dataRow1[sortField];
                    const value2 = dataRow2[sortField];
                    const sortResult = sortByFieldType(value1, value2, fieldType, sortDirection);
                    if (sortResult !== SortDirectionNumber.neutral) {
                        return sortResult;
                    }
                }
            }
            return 0;
        });
        grid.invalidate();
        grid.render();
    }
    dispose() {
        // unsubscribe local event
        if (this._slickSubscriber && typeof this._slickSubscriber.unsubscribe === 'function') {
            this._slickSubscriber.unsubscribe();
        }
        // unsubscribe all SlickGrid events
        this._eventHandler.unsubscribeAll();
    }
    /**
     * A simple function that will be called to emit a change when a sort changes.
     * Other services, like Pagination, can then subscribe to it.
     * @param sender
     */
    emitSortChanged(sender) {
        if (sender === 'remote' && this._gridOptions && this._gridOptions.backendServiceApi) {
            let currentSorters = [];
            const backendService = this._gridOptions.backendServiceApi.service;
            if (backendService && backendService.getCurrentSorters) {
                currentSorters = backendService.getCurrentSorters();
            }
            this.ea.publish('sortService:sortChanged', currentSorters);
        }
        else if (sender === 'local') {
            this.ea.publish('sortService:sortChanged', this.getCurrentLocalSorters());
        }
    }
};
SortService = __decorate([
    inject(EventAggregator)
], SortService);
export { SortService };
//# sourceMappingURL=sort.service.js.map