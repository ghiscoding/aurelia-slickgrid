import { inject, singleton } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import {
  Column,
  ColumnSort,
  FieldType,
  GridOption,
  SlickEvent,
  SortDirection,
  CurrentSorter,
  CellArgs,
  SortDirectionNumber,
  SortDirectionString
} from './../models/index';
import { Sorters } from './../sorters/index';
import { sortByFieldType } from '../sorters/sorterUtilities';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(EventAggregator)
export class SortService {
  private _currentLocalSorters: CurrentSorter[] = [];
  private _eventHandler: any = new Slick.EventHandler();
  private _dataView: any;
  private _grid: any;
  private _isBackendGrid = false;
  private _slickSubscriber: SlickEvent = new Slick.Event();

  constructor(private ea: EventAggregator) { }

  /** Getter for the Grid Options pulled through the Grid Object */
  private get _gridOptions(): GridOption {
    return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
  }

  /** Getter for the Column Definitions pulled through the Grid Object */
  private get _columnDefinitions(): Column[] {
    return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
  }

  /**
   * Attach a backend sort (single/multi) hook to the grid
   * @param grid SlickGrid Grid object
   * @param dataView SlickGrid DataView object
   */
  attachBackendOnSort(grid: any, dataView: any) {
    this._isBackendGrid = true;
    this._grid = grid;
    this._dataView = dataView;
    this._slickSubscriber = grid.onSort;

    // subscribe to the SlickGrid event and call the backend execution
    this._slickSubscriber.subscribe(this.onBackendSortChanged.bind(this));
  }

  async onBackendSortChanged(event: Event | null, args: any) {
    if (!args || !args.grid) {
      throw new Error('Something went wrong when trying to attach the "onBackendSortChanged(event, args)" function, it seems that "args" is not populated correctly');
    }
    const gridOptions: GridOption = args.grid.getOptions() || {};
    const backendApi = gridOptions.backendServiceApi;

    if (!backendApi || !backendApi.process || !backendApi.service) {
      throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
    }

    // keep start time & end timestamps & return it after process execution
    const startTime = new Date();

    if (backendApi.preProcess) {
      backendApi.preProcess();
    }

    const query = backendApi.service.processOnSortChanged(event, args);
    this.emitSortChanged('remote');

    // await for the Promise to resolve the data
    const processResult = await backendApi.process(query);
    const endTime = new Date();

    // from the result, call our internal post process to update the Dataset and Pagination info
    if (processResult && backendApi.internalPostProcess) {
      if (processResult instanceof Object) {
        processResult.statistics = {
          startTime,
          endTime,
          executionTime: endTime.valueOf() - startTime.valueOf(),
          totalItemCount: this._gridOptions && this._gridOptions.pagination && this._gridOptions.pagination.totalItems
        };
      }
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
  attachLocalOnSort(grid: any, dataView: any) {
    this._isBackendGrid = false;
    this._grid = grid;
    this._dataView = dataView;
    let columnDefinitions: Column[] = [];

    if (grid) {
      columnDefinitions = grid.getColumns();
    }
    this._slickSubscriber = grid.onSort;

    this._slickSubscriber.subscribe((e: any, args: any) => {
      // multiSort and singleSort are not exactly the same, but we want to structure it the same for the (for loop) after
      // also to avoid having to rewrite the for loop in the sort, we will make the singleSort an array of 1 object
      const sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortAsc: args.sortAsc, sortCol: args.sortCol });

      // keep current sorters
      this._currentLocalSorters = []; // reset current local sorters
      if (Array.isArray(sortColumns)) {
        sortColumns.forEach((sortColumn: { sortCol: Column, sortAsc: number }) => {
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
      } else {
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

  getCurrentLocalSorters(): CurrentSorter[] {
    return this._currentLocalSorters;
  }

  /**
   * Get column sorts,
   * If a column is passed as an argument, we won't add this column to our output array since it is already in the array
   * We want to know the sort prior to calling the next sorting command
   */
  getPreviousColumnSorts(columnId?: string) {
    // getSortColumns() only returns sortAsc & columnId, we want the entire column definition
    const oldSortColumns = this._grid.getSortColumns();
    const columnDefinitions = this._grid.getColumns();

    // get the column definition but only keep column which are not equal to our current column
    const sortedCols = oldSortColumns.reduce((cols: ColumnSort[], col: ColumnSort) => {
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
  loadLocalPresets(grid: any, dataView: any) {
    const sortCols: ColumnSort[] = [];
    this._currentLocalSorters = []; // reset current local sorters
    if (this._gridOptions && this._gridOptions.presets && this._gridOptions.presets.sorters) {
      const sorters = this._gridOptions.presets.sorters;

      sorters.forEach((presetSorting: CurrentSorter) => {
        const gridColumn = this._columnDefinitions.find((col: Column) => col.id === presetSorting.columnId);
        if (gridColumn) {
          sortCols.push({
            columnId: gridColumn.id,
            sortAsc: ((presetSorting.direction.toUpperCase() === SortDirection.ASC) ? true : false),
            sortCol: gridColumn
          });

          // keep current sorters
          this._currentLocalSorters.push({
            columnId: gridColumn.id + '',
            direction: presetSorting.direction.toUpperCase() as SortDirectionString
          });
        }
      });

      if (sortCols.length > 0) {
        this.onLocalSortChanged(grid, dataView, sortCols);
        grid.setSortColumns(sortCols); // use this to add sort icon(s) in UI
      }
    }
  }

  onLocalSortChanged(grid: any, dataView: any, sortColumns: ColumnSort[]) {
    dataView.sort((dataRow1: any, dataRow2: any) => {
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
  emitSortChanged(sender: 'local' | 'remote') {
    if (sender === 'remote' && this._gridOptions && this._gridOptions.backendServiceApi) {
      let currentSorters: CurrentSorter[] = [];
      const backendService = this._gridOptions.backendServiceApi.service;
      if (backendService && backendService.getCurrentSorters) {
        currentSorters = backendService.getCurrentSorters() as CurrentSorter[];
      }
      this.ea.publish('sortService:sortChanged', currentSorters);
    } else if (sender === 'local') {
      this.ea.publish('sortService:sortChanged', this.getCurrentLocalSorters());
    }
  }
}
