var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { GridStateType, } from './../models/index';
import { disposeAllSubscriptions } from './../services/index';
import { EventAggregator } from 'aurelia-event-aggregator';
let GridStateService = class GridStateService {
    constructor(ea) {
        this.ea = ea;
        this._eventHandler = new Slick.EventHandler();
        this._columns = [];
        this._currentColumns = [];
        this.subscriptions = [];
    }
    /** Getter for the Grid Options pulled through the Grid Object */
    get _gridOptions() {
        return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
    }
    /**
     * Initialize the Service
     * @param grid
     * @param filterService
     * @param sortService
     */
    init(grid, controlAndPluginService, filterService, sortService) {
        this._grid = grid;
        this.controlAndPluginService = controlAndPluginService;
        this.filterService = filterService;
        this.sortService = sortService;
        this.subscribeToAllGridChanges(grid);
    }
    /** Dispose of all the SlickGrid & Aurelia subscriptions */
    dispose() {
        // unsubscribe all SlickGrid events
        this._eventHandler.unsubscribeAll();
        // also dispose of all Subscriptions
        this.subscriptions = disposeAllSubscriptions(this.subscriptions);
    }
    /**
     * Get the current grid state (filters/sorters/pagination)
     * @return grid state
     */
    getCurrentGridState() {
        const gridState = {
            columns: this.getCurrentColumns(),
            filters: this.getCurrentFilters(),
            sorters: this.getCurrentSorters()
        };
        const currentPagination = this.getCurrentPagination();
        if (currentPagination) {
            gridState.pagination = currentPagination;
        }
        return gridState;
    }
    /**
     * Get the Columns (and their state: visibility/position) that are currently applied in the grid
     * @return current columns
     */
    getColumns() {
        return this._columns || this._grid.getColumns();
    }
    /**
     * From an array of Grid Column Definitions, get the associated Current Columns
     * @param gridColumns
     */
    getAssociatedCurrentColumns(gridColumns) {
        const currentColumns = [];
        if (gridColumns && Array.isArray(gridColumns)) {
            gridColumns.forEach((column, index) => {
                if (column && column.id) {
                    currentColumns.push({
                        columnId: column.id,
                        cssClass: column.cssClass || '',
                        headerCssClass: column.headerCssClass || '',
                        width: column.width || 0
                    });
                }
            });
        }
        this._currentColumns = currentColumns;
        return currentColumns;
    }
    /**
     * From an array of Current Columns, get the associated Grid Column Definitions
     * @param grid
     * @param currentColumns
     */
    getAssociatedGridColumns(grid, currentColumns) {
        const columns = [];
        const gridColumns = grid.getColumns();
        if (currentColumns && Array.isArray(currentColumns)) {
            currentColumns.forEach((currentColumn, index) => {
                const gridColumn = gridColumns.find((c) => c.id === currentColumn.columnId);
                if (gridColumn && gridColumn.id) {
                    columns.push(Object.assign({}, gridColumn, { cssClass: currentColumn.cssClass, headerCssClass: currentColumn.headerCssClass, width: currentColumn.width }));
                }
            });
        }
        this._columns = columns;
        return columns;
    }
    /**
     * Get the Columns (and their state: visibility/position) that are currently applied in the grid
     * @return current columns
     */
    getCurrentColumns() {
        let currentColumns = [];
        if (this._currentColumns && Array.isArray(this._currentColumns) && this._currentColumns.length > 0) {
            currentColumns = this._currentColumns;
        }
        else {
            currentColumns = this.getAssociatedCurrentColumns(this._grid.getColumns());
        }
        return currentColumns;
    }
    /**
     * Get the Filters (and their state, columnId, searchTerm(s)) that are currently applied in the grid
     * @return current filters
     */
    getCurrentFilters() {
        if (this._gridOptions && this._gridOptions.backendServiceApi) {
            const backendService = this._gridOptions.backendServiceApi.service;
            if (backendService && backendService.getCurrentFilters) {
                return backendService.getCurrentFilters();
            }
        }
        else if (this.filterService && this.filterService.getCurrentLocalFilters) {
            return this.filterService.getCurrentLocalFilters();
        }
        return null;
    }
    /**
     * Get current Pagination (and it's state, pageNumber, pageSize) that are currently applied in the grid
     * @return current pagination state
     */
    getCurrentPagination() {
        if (this._gridOptions && this._gridOptions.backendServiceApi) {
            const backendService = this._gridOptions.backendServiceApi.service;
            if (backendService && backendService.getCurrentPagination) {
                return backendService.getCurrentPagination();
            }
        }
        else {
            // TODO implement this whenever local pagination gets implemented
        }
        return null;
    }
    /**
     * Get the current Sorters (and their state, columnId, direction) that are currently applied in the grid
     * @return current sorters
     */
    getCurrentSorters() {
        if (this._gridOptions && this._gridOptions.backendServiceApi) {
            const backendService = this._gridOptions.backendServiceApi.service;
            if (backendService && backendService.getCurrentSorters) {
                return backendService.getCurrentSorters();
            }
        }
        else if (this.sortService && this.sortService.getCurrentLocalSorters) {
            return this.sortService.getCurrentLocalSorters();
        }
        return null;
    }
    /**
     * Hook a SlickGrid Extension Event to a Grid State change event
     * @param extension name
     * @param grid
     */
    hookExtensionEventToGridStateChange(extensionName, eventName) {
        const extension = this.controlAndPluginService && this.controlAndPluginService.getExtensionByName(extensionName);
        if (extension && extension.service && extension.service[eventName] && extension.service[eventName].subscribe) {
            this._eventHandler.subscribe(extension.service[eventName], (e, args) => {
                const columns = args && args.columns;
                const currentColumns = this.getAssociatedCurrentColumns(columns);
                this.ea.publish('gridStateService:changed', { change: { newValues: currentColumns, type: GridStateType.columns }, gridState: this.getCurrentGridState() });
            });
        }
    }
    /**
     * Hook a Grid Event to a Grid State change event
     * @param event name
     * @param grid
     */
    hookSlickGridEventToGridStateChange(eventName, grid) {
        if (grid && grid[eventName] && grid[eventName].subscribe) {
            this._eventHandler.subscribe(grid[eventName], (e, args) => {
                const columns = grid.getColumns();
                const currentColumns = this.getAssociatedCurrentColumns(columns);
                this.ea.publish('gridStateService:changed', { change: { newValues: currentColumns, type: GridStateType.columns }, gridState: this.getCurrentGridState() });
            });
        }
    }
    resetColumns(columnDefinitions) {
        const columns = columnDefinitions || this._columns;
        const currentColumns = this.getAssociatedCurrentColumns(columns);
        this.ea.publish('gridStateService:changed', { change: { newValues: currentColumns, type: GridStateType.columns }, gridState: this.getCurrentGridState() });
    }
    /** if we use Row Selection or the Checkbox Selector, we need to reset any selection */
    resetRowSelection() {
        if (this._gridOptions.enableRowSelection || this._gridOptions.enableCheckboxSelector) {
            this._grid.setSelectedRows([]);
        }
    }
    /**
     * Subscribe to all necessary SlickGrid or Service Events that deals with a Grid change,
     * when triggered, we will publish a Grid State Event with current Grid State
     */
    subscribeToAllGridChanges(grid) {
        // Subscribe to Event Emitter of Filter changed
        this.subscriptions.push(this.ea.subscribe('filterService:filterChanged', (currentFilters) => {
            this.resetRowSelection();
            this.ea.publish('gridStateService:changed', { change: { newValues: currentFilters, type: GridStateType.filter }, gridState: this.getCurrentGridState() });
        }));
        // Subscribe to Event Emitter of Filter cleared
        this.subscriptions.push(this.ea.subscribe('filterService:filterCleared', (currentFilters) => {
            this.resetRowSelection();
            this.ea.publish('gridStateService:changed', { change: { newValues: currentFilters, type: GridStateType.filter }, gridState: this.getCurrentGridState() });
        }));
        // Subscribe to Event Emitter of Sort changed
        this.subscriptions.push(this.ea.subscribe('sortService:sortChanged', (currentSorters) => {
            this.resetRowSelection();
            this.ea.publish('gridStateService:changed', { change: { newValues: currentSorters, type: GridStateType.sorter }, gridState: this.getCurrentGridState() });
        }));
        // Subscribe to Event Emitter of Sort cleared
        this.subscriptions.push(this.ea.subscribe('sortService:sortCleared', (currentSorters) => {
            this.resetRowSelection();
            this.ea.publish('gridStateService:changed', { change: { newValues: currentSorters, type: GridStateType.sorter }, gridState: this.getCurrentGridState() });
        }));
        // Subscribe to ColumnPicker and/or GridMenu for show/hide Columns visibility changes
        this.hookExtensionEventToGridStateChange('ColumnPicker', 'onColumnsChanged');
        this.hookExtensionEventToGridStateChange('GridMenu', 'onColumnsChanged');
        // subscribe to Column Resize & Reordering
        this.hookSlickGridEventToGridStateChange('onColumnsReordered', grid);
        this.hookSlickGridEventToGridStateChange('onColumnsResized', grid);
    }
};
GridStateService = __decorate([
    inject(EventAggregator)
], GridStateService);
export { GridStateService };
//# sourceMappingURL=gridState.service.js.map