import { EventAggregator } from 'aurelia-event-aggregator';
import { Column, ColumnSort, GridOption, CurrentSorter } from './../models/index';
export declare class SortService {
    private ea;
    private _currentLocalSorters;
    private _eventHandler;
    private _dataView;
    private _grid;
    private _gridOptions;
    private _isBackendGrid;
    private _slickSubscriber;
    constructor(ea: EventAggregator);
    /**
     * Attach a backend sort (single/multi) hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     */
    attachBackendOnSort(grid: any, dataView: any): void;
    onBackendSortChanged(event: Event | null, args: any): Promise<void>;
    /**
     * Attach a local sort (single/multi) hook to the grid
     * @param grid SlickGrid Grid object
     * @param gridOptions Grid Options object
     * @param dataView
     */
    attachLocalOnSort(grid: any, dataView: any): void;
    /**
     * Clear Sorting
     * - 1st, remove the SlickGrid sort icons (this setSortColumns function call really does only that)
     * - 2nd, we also need to trigger a sort change
     *   - for a backend grid, we will trigger a backend sort changed with an empty sort columns array
     *   - however for a local grid, we need to pass a sort column and so we will sort by the 1st column
     */
    clearSorting(): void;
    getCurrentLocalSorters(): CurrentSorter[];
    /**
     * Get column sorts,
     * If a column is passed as an argument, we won't add this column to our output array since it is already in the array
     * We want to know the sort prior to calling the next sorting command
     */
    getPreviousColumnSorts(columnId?: string): any;
    /**
     * load any presets if there are any
     * @param grid
     * @param gridOptions
     * @param dataView
     * @param columnDefinitions
     */
    loadLocalPresets(grid: any, gridOptions: GridOption, dataView: any, columnDefinitions: Column[]): void;
    onLocalSortChanged(grid: any, gridOptions: GridOption, dataView: any, sortColumns: ColumnSort[]): void;
    dispose(): void;
    /**
     * A simple function that will be called to emit a change when a sort changes.
     * Other services, like Pagination, can then subscribe to it.
     * @param sender
     */
    emitSortChanged(sender: 'local' | 'remote'): void;
}
