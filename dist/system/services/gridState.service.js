System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GridStateService;
    return {
        setters: [],
        execute: function () {
            GridStateService = /** @class */ (function () {
                function GridStateService() {
                }
                /**
                 * Initialize the Export Service
                 * @param grid
                 * @param gridOptions
                 * @param dataView
                 */
                GridStateService.prototype.init = function (grid, filterService, sortService) {
                    this._grid = grid;
                    this.filterService = filterService;
                    this.sortService = sortService;
                    this._gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
                };
                /**
                 * Get the current grid state (filters/sorters/pagination)
                 * @return grid state
                 */
                GridStateService.prototype.getCurrentGridState = function () {
                    var gridState = {
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
                return GridStateService;
            }());
            exports_1("GridStateService", GridStateService);
        }
    };
});
//# sourceMappingURL=gridState.service.js.map