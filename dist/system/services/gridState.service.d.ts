import { EventAggregator } from 'aurelia-event-aggregator';
import { Column, CurrentColumn, CurrentFilter, CurrentPagination, CurrentSorter, ExtensionName, GridState } from './../models/index';
import { ExtensionService } from './extension.service';
import { FilterService } from './filter.service';
import { SortService } from './sort.service';
export declare class GridStateService {
    private ea;
    private _eventHandler;
    private _columns;
    private _currentColumns;
    private _grid;
    private extensionService;
    private filterService;
    private sortService;
    private subscriptions;
    constructor(ea: EventAggregator);
    /** Getter for the Grid Options pulled through the Grid Object */
    private readonly _gridOptions;
    /**
     * Initialize the Service
     * @param grid
     * @param filterService
     * @param sortService
     */
    init(grid: any, extensionService: ExtensionService, filterService: FilterService, sortService: SortService): void;
    /** Dispose of all the SlickGrid & Aurelia subscriptions */
    dispose(): void;
    /**
     * Get the current grid state (filters/sorters/pagination)
     * @return grid state
     */
    getCurrentGridState(): GridState;
    /**
     * Get the Columns (and their state: visibility/position) that are currently applied in the grid
     * @return current columns
     */
    getColumns(): Column[];
    /**
     * From an array of Grid Column Definitions, get the associated Current Columns
     * @param gridColumns
     */
    getAssociatedCurrentColumns(gridColumns: Column[]): CurrentColumn[];
    /**
     * From an array of Current Columns, get the associated Grid Column Definitions
     * @param grid
     * @param currentColumns
     */
    getAssociatedGridColumns(grid: any, currentColumns: CurrentColumn[]): Column[];
    /**
     * Get the Columns (and their state: visibility/position) that are currently applied in the grid
     * @return current columns
     */
    getCurrentColumns(): CurrentColumn[];
    /**
     * Get the Filters (and their state, columnId, searchTerm(s)) that are currently applied in the grid
     * @return current filters
     */
    getCurrentFilters(): CurrentFilter[] | null;
    /**
     * Get current Pagination (and it's state, pageNumber, pageSize) that are currently applied in the grid
     * @return current pagination state
     */
    getCurrentPagination(): CurrentPagination | null;
    /**
     * Get the current Sorters (and their state, columnId, direction) that are currently applied in the grid
     * @return current sorters
     */
    getCurrentSorters(): CurrentSorter[] | null;
    /**
     * Hook a SlickGrid Extension Event to a Grid State change event
     * @param extension name
     * @param event name
     */
    hookExtensionEventToGridStateChange(extensionName: ExtensionName, eventName: string): void;
    /**
     * Hook a Grid Event to a Grid State change event
     * @param event name
     * @param grid
     */
    hookSlickGridEventToGridStateChange(eventName: string, grid: any): void;
    resetColumns(columnDefinitions?: Column[]): void;
    /** if we use Row Selection or the Checkbox Selector, we need to reset any selection */
    resetRowSelection(): void;
    /**
     * Subscribe to all necessary SlickGrid or Service Events that deals with a Grid change,
     * when triggered, we will publish a Grid State Event with current Grid State
     */
    subscribeToAllGridChanges(grid: any): void;
}
