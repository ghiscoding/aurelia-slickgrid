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
import { inject } from 'aurelia-framework';
import { GridStateType, } from './../models/index';
import { EventAggregator } from 'aurelia-event-aggregator';
var GridStateService = /** @class */ (function () {
    function GridStateService(ea) {
        this.ea = ea;
        this._eventHandler = new Slick.EventHandler();
        this._columns = [];
        this._currentColumns = [];
        this.subscriptions = [];
    }
    Object.defineProperty(GridStateService.prototype, "_gridOptions", {
        /** Getter for the Grid Options pulled through the Grid Object */
        get: function () {
            return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Initialize the Service
     * @param grid
     * @param filterService
     * @param sortService
     */
    GridStateService.prototype.init = function (grid, controlAndPluginService, filterService, sortService) {
        this._grid = grid;
        this.controlAndPluginService = controlAndPluginService;
        this.filterService = filterService;
        this.sortService = sortService;
        this.subscribeToAllGridChanges(grid);
    };
    /** Dispose of all the SlickGrid & Aurelia subscriptions */
    GridStateService.prototype.dispose = function () {
        // unsubscribe all SlickGrid events
        this._eventHandler.unsubscribeAll();
        // also unsubscribe all Aurelia Subscriptions
        this.subscriptions.forEach(function (subscription) {
            if (subscription && subscription.dispose) {
                subscription.dispose();
            }
        });
        this.subscriptions = [];
    };
    /**
     * Get the current grid state (filters/sorters/pagination)
     * @return grid state
     */
    GridStateService.prototype.getCurrentGridState = function () {
        var gridState = {
            columns: this.getCurrentColumns(),
            filters: this.getCurrentFilters(),
            sorters: this.getCurrentSorters()
        };
        var currentPagination = this.getCurrentPagination();
        if (currentPagination) {
            gridState.pagination = currentPagination;
        }
        return gridState;
    };
    /**
     * Get the Columns (and their state: visibility/position) that are currently applied in the grid
     * @return current columns
     */
    GridStateService.prototype.getColumns = function () {
        return this._columns || this._grid.getColumns();
    };
    /**
     * From an array of Grid Column Definitions, get the associated Current Columns
     * @param gridColumns
     */
    GridStateService.prototype.getAssociatedCurrentColumns = function (gridColumns) {
        var currentColumns = [];
        if (gridColumns && Array.isArray(gridColumns)) {
            gridColumns.forEach(function (column, index) {
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
    };
    /**
     * From an array of Current Columns, get the associated Grid Column Definitions
     * @param grid
     * @param currentColumns
     */
    GridStateService.prototype.getAssociatedGridColumns = function (grid, currentColumns) {
        var columns = [];
        var gridColumns = grid.getColumns();
        if (currentColumns && Array.isArray(currentColumns)) {
            currentColumns.forEach(function (currentColumn, index) {
                var gridColumn = gridColumns.find(function (c) { return c.id === currentColumn.columnId; });
                if (gridColumn && gridColumn.id) {
                    columns.push(__assign({}, gridColumn, { cssClass: currentColumn.cssClass, headerCssClass: currentColumn.headerCssClass, width: currentColumn.width }));
                }
            });
        }
        this._columns = columns;
        return columns;
    };
    /**
     * Get the Columns (and their state: visibility/position) that are currently applied in the grid
     * @return current columns
     */
    GridStateService.prototype.getCurrentColumns = function () {
        var currentColumns = [];
        if (this._currentColumns && Array.isArray(this._currentColumns) && this._currentColumns.length > 0) {
            currentColumns = this._currentColumns;
        }
        else {
            currentColumns = this.getAssociatedCurrentColumns(this._grid.getColumns());
        }
        return currentColumns;
    };
    /**
     * Get the Filters (and their state, columnId, searchTerm(s)) that are currently applied in the grid
     * @return current filters
     */
    GridStateService.prototype.getCurrentFilters = function () {
        if (this._gridOptions && this._gridOptions.backendServiceApi) {
            var backendService = this._gridOptions.backendServiceApi.service;
            if (backendService && backendService.getCurrentFilters) {
                return backendService.getCurrentFilters();
            }
        }
        else if (this.filterService && this.filterService.getCurrentLocalFilters) {
            return this.filterService.getCurrentLocalFilters();
        }
        return null;
    };
    /**
     * Get current Pagination (and it's state, pageNumber, pageSize) that are currently applied in the grid
     * @return current pagination state
     */
    GridStateService.prototype.getCurrentPagination = function () {
        if (this._gridOptions && this._gridOptions.backendServiceApi) {
            var backendService = this._gridOptions.backendServiceApi.service;
            if (backendService && backendService.getCurrentPagination) {
                return backendService.getCurrentPagination();
            }
        }
        else {
            // TODO implement this whenever local pagination gets implemented
        }
        return null;
    };
    /**
     * Get the current Sorters (and their state, columnId, direction) that are currently applied in the grid
     * @return current sorters
     */
    GridStateService.prototype.getCurrentSorters = function () {
        if (this._gridOptions && this._gridOptions.backendServiceApi) {
            var backendService = this._gridOptions.backendServiceApi.service;
            if (backendService && backendService.getCurrentSorters) {
                return backendService.getCurrentSorters();
            }
        }
        else if (this.sortService && this.sortService.getCurrentLocalSorters) {
            return this.sortService.getCurrentLocalSorters();
        }
        return null;
    };
    /**
     * Hook a SlickGrid Extension Event to a Grid State change event
     * @param extension name
     * @param grid
     */
    GridStateService.prototype.hookExtensionEventToGridStateChange = function (extensionName, eventName) {
        var _this = this;
        var extension = this.controlAndPluginService && this.controlAndPluginService.getExtensionByName(extensionName);
        if (extension && extension.service && extension.service[eventName] && extension.service[eventName].subscribe) {
            this._eventHandler.subscribe(extension.service[eventName], function (e, args) {
                var columns = args && args.columns;
                var currentColumns = _this.getAssociatedCurrentColumns(columns);
                _this.ea.publish('gridStateService:changed', { change: { newValues: currentColumns, type: GridStateType.columns }, gridState: _this.getCurrentGridState() });
            });
        }
    };
    /**
     * Hook a Grid Event to a Grid State change event
     * @param event name
     * @param grid
     */
    GridStateService.prototype.hookSlickGridEventToGridStateChange = function (eventName, grid) {
        var _this = this;
        if (grid && grid[eventName] && grid[eventName].subscribe) {
            this._eventHandler.subscribe(grid[eventName], function (e, args) {
                var columns = grid.getColumns();
                var currentColumns = _this.getAssociatedCurrentColumns(columns);
                _this.ea.publish('gridStateService:changed', { change: { newValues: currentColumns, type: GridStateType.columns }, gridState: _this.getCurrentGridState() });
            });
        }
    };
    GridStateService.prototype.resetColumns = function (columnDefinitions) {
        var columns = columnDefinitions || this._columns;
        var currentColumns = this.getAssociatedCurrentColumns(columns);
        this.ea.publish('gridStateService:changed', { change: { newValues: currentColumns, type: GridStateType.columns }, gridState: this.getCurrentGridState() });
    };
    /**
     * Subscribe to all necessary SlickGrid or Service Events that deals with a Grid change,
     * when triggered, we will publish a Grid State Event with current Grid State
     */
    GridStateService.prototype.subscribeToAllGridChanges = function (grid) {
        var _this = this;
        // Subscribe to Event Emitter of Filter changed
        this.subscriptions.push(this.ea.subscribe('filterService:filterChanged', function (currentFilters) {
            _this.ea.publish('gridStateService:changed', { change: { newValues: currentFilters, type: GridStateType.filter }, gridState: _this.getCurrentGridState() });
        }));
        // Subscribe to Event Emitter of Filter cleared
        this.subscriptions.push(this.ea.subscribe('filterService:filterCleared', function (currentFilters) {
            _this.ea.publish('gridStateService:changed', { change: { newValues: currentFilters, type: GridStateType.filter }, gridState: _this.getCurrentGridState() });
        }));
        // Subscribe to Event Emitter of Sort changed
        this.subscriptions.push(this.ea.subscribe('sortService:sortChanged', function (currentSorters) {
            _this.ea.publish('gridStateService:changed', { change: { newValues: currentSorters, type: GridStateType.sorter }, gridState: _this.getCurrentGridState() });
        }));
        // Subscribe to Event Emitter of Sort cleared
        this.subscriptions.push(this.ea.subscribe('sortService:sortCleared', function (currentSorters) {
            _this.ea.publish('gridStateService:changed', { change: { newValues: currentSorters, type: GridStateType.sorter }, gridState: _this.getCurrentGridState() });
        }));
        // Subscribe to ColumnPicker and/or GridMenu for show/hide Columns visibility changes
        this.hookExtensionEventToGridStateChange('ColumnPicker', 'onColumnsChanged');
        this.hookExtensionEventToGridStateChange('GridMenu', 'onColumnsChanged');
        // subscribe to Column Resize & Reordering
        this.hookSlickGridEventToGridStateChange('onColumnsReordered', grid);
        this.hookSlickGridEventToGridStateChange('onColumnsResized', grid);
    };
    GridStateService = __decorate([
        inject(EventAggregator)
    ], GridStateService);
    return GridStateService;
}());
export { GridStateService };
//# sourceMappingURL=gridState.service.js.map