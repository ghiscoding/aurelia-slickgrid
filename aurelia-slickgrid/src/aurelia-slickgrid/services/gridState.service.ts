import { inject } from 'aurelia-framework';
import {
  Column,
  CurrentFilter,
  CurrentPagination,
  CurrentSorter,
  GridOption,
  GridState,
  GridStateType,
} from './../models/index';
import { ControlAndPluginService, FilterService, SortService } from './../services/index';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import * as $ from 'jquery';

// using external non-typed js libraries
declare var Slick: any;

@inject(EventAggregator)
export class GridStateService {
  private _eventHandler = new Slick.EventHandler();
  private _currentColumns: Column[];
  private _grid: any;
  private _preset: GridState;
  private controlAndPluginService: ControlAndPluginService;
  private filterService: FilterService;
  private sortService: SortService;
  private subscriptions: Subscription[] = [];

  constructor(private ea: EventAggregator) { }

  /** Getter for the Grid Options pulled through the Grid Object */
  private get _gridOptions(): GridOption {
    return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
  }

  /**
   * Initialize the Service
   * @param grid
   * @param filterService
   * @param sortService
   */
  init(grid: any, controlAndPluginService: ControlAndPluginService, filterService: FilterService, sortService: SortService): void {
    this._grid = grid;
    this.controlAndPluginService = controlAndPluginService;
    this.filterService = filterService;
    this.sortService = sortService;

    // Subscribe to Event Emitter of Filter & Sort changed, go back to page 1 when that happen
    this.subscriptions.push(
      this.ea.subscribe('filterService:filterChanged', (currentFilters: CurrentFilter[]) => {
        this.ea.publish('gridStateService:changed', { change: { newValues: currentFilters, type: GridStateType.filter }, gridState: this.getCurrentGridState() });
      })
    );

    this.subscriptions.push(
      this.ea.subscribe('sortService:sortChanged', (currentSorters: CurrentSorter[]) => {
        this.ea.publish('gridStateService:changed', { change: { newValues: currentSorters, type: GridStateType.sorter }, gridState: this.getCurrentGridState() });
      })
    );

    // Subscribe to ColumnPicker and/or GridMenu for show/hide Columns visibility changes
    const columnPicker = this.controlAndPluginService && this.controlAndPluginService.getExtensionByName('ColumnPicker');
    const gridMenu = this.controlAndPluginService && this.controlAndPluginService.getExtensionByName('GridMenu');
    if (columnPicker && columnPicker.service && columnPicker.service.onColumnsChanged && columnPicker.service.onColumnsChanged.subscribe) {
      this._eventHandler.subscribe(columnPicker.service.onColumnsChanged, (e: Event, args: any) => {
        const columns: Column[] = args && args.columns;
        this.ea.publish('gridStateService:changed', { change: { newValues: columns, type: GridStateType.columns }, gridState: this.getCurrentGridState() });
      });
    }
    if (gridMenu && gridMenu.service && gridMenu.service.onColumnsChanged && gridMenu.service.onColumnsChanged.subscribe) {
      this._eventHandler.subscribe(gridMenu.service.onColumnsChanged, (e: Event, args: any) => {
        const columns: Column[] = args && args.columns;
        this.ea.publish('gridStateService:changed', { change: { newValues: columns, type: GridStateType.columns }, gridState: this.getCurrentGridState() });
      });
    }

    // subscribe to Column Reordering
    if (grid && grid.onColumnsReordered && grid.onColumnsReordered.subscribe) {
      this._eventHandler.subscribe(grid.onColumnsReordered, (e: Event, args: any) => {
        const columns: Column[] = grid.getColumns();
        this.ea.publish('gridStateService:changed', { change: { newValues: columns, type: GridStateType.columns }, gridState: this.getCurrentGridState() });
      });
    }

    // subscribe to Column Resize
    if (grid && grid.onColumnsResized && grid.onColumnsResized.subscribe) {
      this._eventHandler.subscribe(grid.onColumnsResized, (e: Event, args: any) => {
        const columns: Column[] = grid.getColumns();
        this.ea.publish('gridStateService:changed', { change: { newValues: columns, type: GridStateType.columns }, gridState: this.getCurrentGridState() });
      });
    }
  }

  dispose() {
    // also unsubscribe all Subscriptions
    this.subscriptions.forEach((subscription: Subscription) => {
      if (subscription && subscription.dispose) {
        subscription.dispose();
      }
    });
    this.subscriptions = [];

    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();
  }

  /**
   * Get the current grid state (filters/sorters/pagination)
   * @return grid state
   */
  getCurrentGridState(): GridState {
    const gridState: GridState = {
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
  getCurrentColumns(): Column[] {
    return this._currentColumns || this._grid.getColumns();
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
