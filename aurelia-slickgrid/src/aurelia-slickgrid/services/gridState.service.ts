import { inject } from 'aurelia-framework';
import {
  CurrentFilter,
  CurrentPagination,
  CurrentSorter,
  GridOption,
  GridState,
  GridStateType,
} from './../models/index';
import { FilterService, SortService } from './../services/index';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import * as $ from 'jquery';

@inject(EventAggregator)
export class GridStateService {
  private _grid: any;
  private _gridOptions: GridOption;
  private _preset: GridState;
  private filterService: FilterService;
  private _filterSubcription: Subscription;
  private _sorterSubcription: Subscription;
  private sortService: SortService;

  constructor(private ea: EventAggregator) { }

  /**
   * Initialize the Export Service
   * @param grid
   * @param gridOptions
   * @param dataView
   */
  init(grid: any, filterService: FilterService, sortService: SortService): void {
    this._grid = grid;
    this.filterService = filterService;
    this.sortService = sortService;
    this._gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};

    // Subscribe to Event Emitter of Filter & Sort changed, go back to page 1 when that happen
    this._filterSubcription = this.ea.subscribe('filterService:filterChanged', (currentFilters: CurrentFilter[]) => {
      this.ea.publish('gridStateService:changed', { change: { newValues: currentFilters, type: GridStateType.filter }, gridState: this.getCurrentGridState() });
    });
    this._sorterSubcription = this.ea.subscribe('sortService:sortChanged', (currentSorters: CurrentSorter[]) => {
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
  getCurrentGridState(): GridState {
    const gridState: GridState = {
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
  getCurrentFilters(): CurrentFilter[] | null {
    if (this._gridOptions && this._gridOptions.backendServiceApi) {
      const backendService = this._gridOptions.backendServiceApi.service;
      if (backendService && backendService.getCurrentFilters) {
        return backendService.getCurrentFilters() as CurrentFilter[];
      }
    } else if (this.filterService && this.filterService.getCurrentLocalFilters) {
      return this.filterService.getCurrentLocalFilters();
    }
    return null;
  }

  /**
   * Get current Pagination (and it's state, pageNumber, pageSize) that are currently applied in the grid
   * @return current pagination state
   */
  getCurrentPagination(): CurrentPagination | null {
    if (this._gridOptions && this._gridOptions.backendServiceApi) {
      const backendService = this._gridOptions.backendServiceApi.service;
      if (backendService && backendService.getCurrentPagination) {
        return backendService.getCurrentPagination();
      }
    } else {
      // TODO implement this whenever local pagination gets implemented
    }
    return null;
  }

  /**
   * Get the current Sorters (and their state, columnId, direction) that are currently applied in the grid
   * @return current sorters
   */
  getCurrentSorters(): CurrentSorter[] | null {
    if (this._gridOptions && this._gridOptions.backendServiceApi) {
      const backendService = this._gridOptions.backendServiceApi.service;
      if (backendService && backendService.getCurrentSorters) {
        return backendService.getCurrentSorters() as CurrentSorter[];
      }
    } else if (this.sortService && this.sortService.getCurrentLocalSorters) {
      return this.sortService.getCurrentLocalSorters();
    }
    return null;
  }
}
