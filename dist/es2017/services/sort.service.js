var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject, singleton } from 'aurelia-framework';
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
    /** Getter for the Grid Options pulled through the Grid Object */
    get _gridOptions() {
        return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
    }
    /** Getter for the Column Definitions pulled through the Grid Object */
    get _columnDefinitions() {
        return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
    }
    /**
     * Attach a backend sort (single/multi) hook to the grid
     * @param grid SlickGrid Grid object
     * @param dataView SlickGrid DataView object
     */
    attachBackendOnSort(grid, dataView) {
        this._isBackendGrid = true;
        this._grid = grid;
        this._dataView = dataView;
        this._slickSubscriber = grid.onSort;
        // subscribe to the SlickGrid event and call the backend execution
        this._slickSubscriber.subscribe(this.onBackendSortChanged.bind(this));
    }
    async onBackendSortChanged(event, args) {
        if (!args || !args.grid) {
            throw new Error('Something went wrong when trying to attach the "onBackendSortChanged(event, args)" function, it seems that "args" is not populated correctly');
        }
        const gridOptions = args.grid.getOptions() || {};
        const backendApi = gridOptions.backendServiceApi;
        if (!backendApi || !backendApi.process || !backendApi.service) {
            throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
        }
        if (backendApi.preProcess) {
            backendApi.preProcess();
        }
        const query = backendApi.service.processOnSortChanged(event, args);
        this.emitSortChanged('remote');
        // await for the Promise to resolve the data
        const processResult = await backendApi.process(query);
        // from the result, call our internal post process to update the Dataset and Pagination info
        if (processResult && backendApi.internalPostProcess) {
            backendApi.internalPostProcess(processResult);
        }
        // send the response process to the postProcess callback
        if (backendApi.postProcess) {
            backendApi.postProcess(processResult);
        }
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
            this.onLocalSortChanged(grid, dataView, sortColumns);
            this.emitSortChanged('local');
        });
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
                if (this._columnDefinitions && Array.isArray(this._columnDefinitions)) {
                    this.onLocalSortChanged(this._grid, this._dataView, new Array({ sortAsc: true, sortCol: this._columnDefinitions[0] }));
                }
            }
        }
        // set current sorter to empty & emit a sort changed event
        this._currentLocalSorters = [];
        // emit an event when filters are all cleared
        this.ea.publish('sortService:sortCleared', this._currentLocalSorters);
    }
    getCurrentLocalSorters() {
        return this._currentLocalSorters;
    }
    /**
     * Get column sorts,
     * If a column is passed as an argument, we won't add this column to our output array since it is already in the array
     * We want to know the sort prior to calling the next sorting command
     */
    getPreviousColumnSorts(columnId) {
        // getSortColumns() only returns sortAsc & columnId, we want the entire column definition
        const oldSortColumns = this._grid.getSortColumns();
        const columnDefinitions = this._grid.getColumns();
        // get the column definition but only keep column which are not equal to our current column
        const sortedCols = oldSortColumns.reduce((cols, col) => {
            if (!columnId || col.columnId !== columnId) {
                cols.push({ sortCol: this._columnDefinitions[this._grid.getColumnIndex(col.columnId)], sortAsc: col.sortAsc });
            }
            return cols;
        }, []);
        return sortedCols;
    }
    /**
     * load any presets if there are any
     * @param grid
     * @param gridOptions
     * @param dataView
     * @param columnDefinitions
     */
    loadLocalPresets(grid, dataView) {
        const sortCols = [];
        this._currentLocalSorters = []; // reset current local sorters
        if (this._gridOptions && this._gridOptions.presets && this._gridOptions.presets.sorters) {
            const sorters = this._gridOptions.presets.sorters;
            sorters.forEach((presetSorting) => {
                const gridColumn = this._columnDefinitions.find((col) => col.id === presetSorting.columnId);
                if (gridColumn) {
                    sortCols.push({
                        columnId: gridColumn.id,
                        sortAsc: ((presetSorting.direction.toUpperCase() === SortDirection.ASC) ? true : false),
                        sortCol: gridColumn
                    });
                    // keep current sorters
                    this._currentLocalSorters.push({
                        columnId: gridColumn.id + '',
                        direction: presetSorting.direction.toUpperCase()
                    });
                }
            });
            if (sortCols.length > 0) {
                this.onLocalSortChanged(grid, dataView, sortCols);
                grid.setSortColumns(sortCols); // use this to add sort icon(s) in UI
            }
        }
    }
    onLocalSortChanged(grid, dataView, sortColumns) {
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
    singleton(true),
    inject(EventAggregator)
], SortService);
export { SortService };
//# sourceMappingURL=sort.service.js.map