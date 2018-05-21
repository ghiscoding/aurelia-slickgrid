var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { GridStateType, } from './../models/index';
import { EventAggregator } from 'aurelia-event-aggregator';
let GridStateService = class GridStateService {
    constructor(ea) {
        this.ea = ea;
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
    init(grid, filterService, sortService) {
        this._grid = grid;
        this.filterService = filterService;
        this.sortService = sortService;
        // Subscribe to Event Emitter of Filter & Sort changed, go back to page 1 when that happen
        this._filterSubcription = this.ea.subscribe('filterService:filterChanged', (currentFilters) => {
            this.ea.publish('gridStateService:changed', { change: { newValues: currentFilters, type: GridStateType.filter }, gridState: this.getCurrentGridState() });
        });
        this._sorterSubcription = this.ea.subscribe('sortService:sortChanged', (currentSorters) => {
            this.ea.publish('gridStateService:changed', { change: { newValues: currentSorters, type: GridStateType.sorter }, gridState: this.getCurrentGridState() });
        });
    }
    dispose() {
        this._filterSubcription.dispose();
        this._sorterSubcription.dispose();
    }
    /**
     * Get the current grid state (filters/sorters/pagination)
     * @return grid state
     */
    getCurrentGridState() {
        const gridState = {
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
};
GridStateService = __decorate([
    inject(EventAggregator)
], GridStateService);
export { GridStateService };
//# sourceMappingURL=gridState.service.js.map