import { inject, singleton } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import {
  Column,
  ColumnSort,
  EmitterType,
  FieldType,
  GridOption,
  SortDirection,
  CurrentSorter,
  SlickEventHandler,
  SortDirectionNumber,
  SortDirectionString,
  GraphqlResult,
} from './../models/index';
import { getDescendantProperty } from './utilities';
import { sortByFieldType } from '../sorters/sorterUtilities';
import { executeBackendProcessesCallback, onBackendError } from './backend-utilities';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(EventAggregator)
export class SortService {
  private _currentLocalSorters: CurrentSorter[] = [];
  private _eventHandler: SlickEventHandler;
  private _dataView: any;
  private _grid: any;
  private _isBackendGrid = false;

  constructor(private ea: EventAggregator) {
    this._eventHandler = new Slick.EventHandler();
  }

  /** Getter of the SlickGrid Event Handler */
  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }

  /** Getter for the Grid Options pulled through the Grid Object */
  private get _gridOptions(): GridOption {
    return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
  }

  /** Getter for the Column Definitions pulled through the Grid Object */
  private get _columnDefinitions(): Column[] {
    return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
  }

  /**
   * Bind a backend sort (single/multi) hook to the grid
   * @param grid SlickGrid Grid object
   * @param dataView SlickGrid DataView object
   */
  bindBackendOnSort(grid: any, dataView: any) {
    this._isBackendGrid = true;
    this._grid = grid;
    this._dataView = dataView;

    // subscribe to the SlickGrid event and call the backend execution
    this._eventHandler.subscribe(grid.onSort, this.onBackendSortChanged.bind(this));
  }

  /**
   * Bind a local sort (single/multi) hook to the grid
   * @param grid SlickGrid Grid object
   * @param gridOptions Grid Options object
   * @param dataView
   */
  bindLocalOnSort(grid: any, dataView: any) {
    this._isBackendGrid = false;
    this._grid = grid;
    this._dataView = dataView;

    this._eventHandler.subscribe(grid.onSort, (e: any, args: any) => {
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
      this.emitSortChanged(EmitterType.local);
    });
  }

  /**
   * Clear Sorting
   * - 1st, remove the SlickGrid sort icons (this setSortColumns function call really does only that)
   * - 2nd, we also need to trigger a sort change
   *   - for a backend grid, we will trigger a backend sort changed with an empty sort columns array
   *   - however for a local grid, we need to pass a sort column and so we will sort by the 1st column
   * @param trigger query event after executing clear filter?
   */
  clearSorting(triggerQueryEvent = true) {
    if (this._grid && this._gridOptions && this._dataView) {
      // remove any sort icons (this setSortColumns function call really does only that)
      this._grid.setSortColumns([]);

      // we also need to trigger a sort change
      // for a backend grid, we will trigger a backend sort changed with an empty sort columns array
      // however for a local grid, we need to pass a sort column and so we will sort by the 1st column
      if (triggerQueryEvent) {
        if (this._isBackendGrid) {
          this.onBackendSortChanged(undefined, { grid: this._grid, sortCols: [] });
        } else {
          if (this._columnDefinitions && Array.isArray(this._columnDefinitions)) {
            this.onLocalSortChanged(this._grid, this._dataView, new Array({ sortAsc: true, sortCol: this._columnDefinitions[0] }));
          }
        }
      } else if (this._isBackendGrid) {
        const backendService = this._gridOptions && this._gridOptions.backendServiceApi && this._gridOptions.backendServiceApi.service;
        if (backendService && backendService.clearSorters) {
          backendService.clearSorters();
        }
      }
    }

    // set current sorter to empty & emit a sort changed event
    this._currentLocalSorters = [];

    // emit an event when sorts are all cleared
    this.ea.publish('sortService:sortCleared', true);
  }

  getCurrentLocalSorters(): CurrentSorter[] {
    return this._currentLocalSorters;
  }

  /**
   * Get current column sorts,
   * If a column is passed as an argument, that will be exclusion so we won't add this column to our output array since it is already in the array.
   * The usage of this method is that we want to know the sort prior to calling the next sorting command
   */
  getCurrentColumnSorts(excludedColumnId?: string) {
    // getSortColumns() only returns sortAsc & columnId, we want the entire column definition
    const oldSortColumns = this._grid && this._grid.getSortColumns();

    // get the column definition but only keep column which are not equal to our current column
    if (Array.isArray(oldSortColumns)) {
      const sortedCols = oldSortColumns.reduce((cols: ColumnSort[], col: ColumnSort) => {
        if (!excludedColumnId || col.columnId !== excludedColumnId) {
          cols.push({ sortCol: this._columnDefinitions[this._grid.getColumnIndex(col.columnId)], sortAsc: col.sortAsc });
        }
        return cols;
      }, []);

      return sortedCols;
    }
    return [];
  }

  /**
   * Load any presets, if there are any, that are defined in the Grid Options
   * @param grid
   * @param gridOptions
   * @param dataView
   * @param columnDefinitions
   */
  loadLocalGridPresets(grid: any, dataView: any) {
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

  dispose() {
    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();
  }

  onBackendSortChanged(event: Event | undefined, args: any) {
    if (!args || !args.grid) {
      throw new Error('Something went wrong when trying to bind the "onBackendSortChanged(event, args)" function, it seems that "args" is not populated correctly');
    }
    const gridOptions: GridOption = (args.grid && args.grid.getOptions) ? args.grid.getOptions() : {};
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
    this.emitSortChanged(EmitterType.remote);

    // await for the Promise to resolve the data
    // the processes can be Observables (like HttpClient) or Promises
    const process = backendApi.process(query);
    if (process instanceof Promise && process.then) {
      process.then((processResult: GraphqlResult | any) => executeBackendProcessesCallback(startTime, processResult, backendApi, this._gridOptions))
        .catch((error: any) => onBackendError(error, backendApi));
    }
  }

  /** When a Sort Changes on a Local grid (JSON dataset) */
  onLocalSortChanged(grid: any, dataView: any, sortColumns: ColumnSort[], forceReSort = false) {
    if (grid && dataView) {
      if (forceReSort) {
        dataView.reSort();
      }

      dataView.sort(this.sortComparer.bind(this, sortColumns));

      grid.invalidate();
      grid.render();
    }
  }

  sortComparer(sortColumns: ColumnSort[], dataRow1: any, dataRow2: any) {
    if (Array.isArray(sortColumns)) {
      for (let i = 0, l = sortColumns.length; i < l; i++) {
        const columnSortObj = sortColumns[i];
        if (columnSortObj && columnSortObj.sortCol) {
          const sortDirection = columnSortObj.sortAsc ? SortDirectionNumber.asc : SortDirectionNumber.desc;
          const sortField = columnSortObj.sortCol.queryFieldSorter || columnSortObj.sortCol.queryField || columnSortObj.sortCol.field;
          const fieldType = columnSortObj.sortCol.type || FieldType.string;
          let value1 = dataRow1[sortField];
          let value2 = dataRow2[sortField];

          // when item is a complex object (dot "." notation), we need to filter the value contained in the object tree
          if (sortField && sortField.indexOf('.') >= 0) {
            value1 = getDescendantProperty(dataRow1, sortField);
            value2 = getDescendantProperty(dataRow2, sortField);
          }

          // user could provide his own custom Sorter
          if (columnSortObj.sortCol && columnSortObj.sortCol.sorter) {
            const customSortResult = columnSortObj.sortCol.sorter(value1, value2, sortDirection, columnSortObj.sortCol);
            if (customSortResult !== SortDirectionNumber.neutral) {
              return customSortResult;
            }
          } else {
            const sortResult = sortByFieldType(value1, value2, fieldType, sortDirection, columnSortObj.sortCol);
            if (sortResult !== SortDirectionNumber.neutral) {
              return sortResult;
            }
          }

        }
      }
    }
    return SortDirectionNumber.neutral;
  }

  // --
  // private functions
  // -------------------

  /**
   * A simple function that will be called to emit a change when a sort changes.
   * Other services, like Pagination, can then subscribe to it.
   * @param sender
   */
  private emitSortChanged(sender: EmitterType) {
    if (sender === EmitterType.remote && this._gridOptions && this._gridOptions.backendServiceApi) {
      let currentSorters: CurrentSorter[] = [];
      const backendService = this._gridOptions.backendServiceApi.service;
      if (backendService && backendService.getCurrentSorters) {
        currentSorters = backendService.getCurrentSorters() as CurrentSorter[];
      }
      this.ea.publish('sortService:sortChanged', currentSorters);
    } else if (sender === EmitterType.local) {
      this.ea.publish('sortService:sortChanged', this.getCurrentLocalSorters());
    }
  }
}
