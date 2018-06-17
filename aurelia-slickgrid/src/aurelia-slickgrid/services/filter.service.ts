import { singleton, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FilterConditions } from './../filter-conditions/index';
import { Filters, FilterFactory } from './../filters/index';
import {
  Column,
  ColumnFilter,
  ColumnFilters,
  CurrentFilter,
  Filter,
  FilterArguments,
  FilterCallbackArg,
  FieldType,
  GridOption,
  OperatorType,
  OperatorString,
  SearchTerm,
  SlickEvent
} from './../models/index';
import * as $ from 'jquery';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(EventAggregator, FilterFactory)
export class FilterService {
  private _eventHandler = new Slick.EventHandler();
  private _slickSubscriber: SlickEvent;
  private _filters: any[] = [];
  private _columnFilters: ColumnFilters = {};
  private _dataView: any;
  private _grid: any;
  private _onFilterChangedOptions: any;

  constructor(private ea: EventAggregator, private filterFactory: FilterFactory) { }

  /** Getter for the Grid Options pulled through the Grid Object */
  private get _gridOptions(): GridOption {
    return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
  }

  /** Getter for the Column Definitions pulled through the Grid Object */
  private get _columnDefinitions(): Column[] {
    return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
  }

  /**
   * Initialize the Service
   * @param grid
   */
  init(grid: any): void {
    this._grid = grid;
  }

  /**
   * Attach a backend filter hook to the grid
   * @param grid SlickGrid Grid object
   */
  attachBackendOnFilter(grid: any) {
    this._filters = [];
    this._slickSubscriber = new Slick.Event();

    // subscribe to the SlickGrid event and call the backend execution
    this._slickSubscriber.subscribe(this.attachBackendOnFilterSubscribe.bind(this));

    // subscribe to SlickGrid onHeaderRowCellRendered event to create filter template
    this._eventHandler.subscribe(grid.onHeaderRowCellRendered, (e: Event, args: any) => {
      this.addFilterTemplateToHeaderRow(args);
    });
  }

  async attachBackendOnFilterSubscribe(event: Event, args: any) {
    if (!args || !args.grid) {
      throw new Error('Something went wrong when trying to attach the "attachBackendOnFilterSubscribe(event, args)" function, it seems that "args" is not populated correctly');
    }
    const gridOptions: GridOption = args.grid.getOptions() || {};

    const backendApi = gridOptions.backendServiceApi;
    if (!backendApi || !backendApi.process || !backendApi.service) {
      throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
    }

    // run a preProcess callback if defined
    if (backendApi.preProcess) {
      backendApi.preProcess();
    }

    // call the service to get a query back
    const query = await backendApi.service.processOnFilterChanged(event, args);

    // emit an onFilterChanged event
    if (args && !args.clearFilterTriggered) {
      this.emitFilterChanged('remote');
    }

    // await for the Promise to resolve the data
    const processResult = await backendApi.process(query);

    // from the result, call our internal post process to update the Dataset and Pagination info
    if (processResult && backendApi.internalPostProcess) {
      backendApi.internalPostProcess(processResult);
    }

    // send the response process to the postProcess callback
    if (backendApi.postProcess !== undefined) {
      backendApi.postProcess(processResult);
    }
  }

  /**
   * Attach a local filter hook to the grid
   * @param grid SlickGrid Grid object
   * @param gridOptions Grid Options object
   * @param dataView
   */
  attachLocalOnFilter(grid: any, dataView: any) {
    this._filters = [];
    this._dataView = dataView;
    this._slickSubscriber = new Slick.Event();

    dataView.setFilterArgs({ columnFilters: this._columnFilters, grid: this._grid });
    dataView.setFilter(this.customLocalFilter.bind(this, dataView));

    this._slickSubscriber.subscribe((e: any, args: any) => {
      const columnId = args.columnId;
      if (columnId != null) {
        dataView.refresh();
      }
      if (args && !args.clearFilterTriggered) {
        this.emitFilterChanged('local');
      }
    });

    // subscribe to SlickGrid onHeaderRowCellRendered event to create filter template
    this._eventHandler.subscribe(grid.onHeaderRowCellRendered, (e: Event, args: any) => {
      this.addFilterTemplateToHeaderRow(args);
    });
  }

  /** Clear the search filters (below the column titles) */
  clearFilters() {
    this._filters.forEach((filter: Filter) => {
      if (filter && filter.clear) {
        // clear element and trigger a change
        filter.clear();
      }
    });

    // we need to loop through all columnFilters and delete them 1 by 1
    // only trying to clear columnFilter (without looping through) would not trigger a dataset change
    for (const columnId in this._columnFilters) {
      if (columnId && this._columnFilters[columnId]) {
        delete this._columnFilters[columnId];
      }
    }

    // we also need to refresh the dataView and optionally the grid (it's optional since we use DataView)
    if (this._dataView) {
      this._dataView.refresh();
      this._grid.invalidate();
      this._grid.render();
    }

    // emit an event when filters are all cleared
    this.ea.publish('filterService:filterCleared', this._columnFilters);
  }

  /** Local Grid Filter search */
  customLocalFilter(dataView: any, item: any, args: any) {
    for (const columnId of Object.keys(args.columnFilters)) {
      const columnFilter = args.columnFilters[columnId];
      const columnIndex = args.grid.getColumnIndex(columnId);
      const columnDef = args.grid.getColumns()[columnIndex];
      if (!columnDef) {
        return false;
      }
      const fieldType = columnDef.type || FieldType.string;
      const filterSearchType = (columnDef.filterSearchType) ? columnDef.filterSearchType : null;

      let cellValue = item[columnDef.queryField || columnDef.queryFieldFilter || columnDef.field];

      // if we find searchTerms use them but make a deep copy so that we don't affect original array
      // we might have to overwrite the value(s) locally that are returned
      // e.g: we don't want to operator within the search value, since it will fail filter condition check trigger afterward
      const searchValues = (columnFilter && columnFilter.searchTerms) ? [...columnFilter.searchTerms] : null;

      let fieldSearchValue = (Array.isArray(searchValues) && searchValues.length === 1) ? searchValues[0] : '';
      fieldSearchValue = '' + fieldSearchValue; // make sure it's a string
      const matches = fieldSearchValue.match(/^([<>!=\*]{0,2})(.*[^<>!=\*])([\*]?)$/); // group 1: Operator, 2: searchValue, 3: last char is '*' (meaning starts with, ex.: abc*)
      let operator = columnFilter.operator || ((matches) ? matches[1] : '');
      const searchTerm = (!!matches) ? matches[2] : '';
      const lastValueChar = (!!matches) ? matches[3] : (operator === '*z' ? '*' : '');

      if (searchValues && searchValues.length > 1) {
        fieldSearchValue = searchValues.join(',');
      } else if (typeof fieldSearchValue === 'string') {
        // escaping the search value
        fieldSearchValue = fieldSearchValue.replace(`'`, `''`); // escape single quotes by doubling them
        if (operator === '*' || operator === 'a*' || operator === '*z' || lastValueChar === '*') {
          operator = (operator === '*' || operator === '*z') ? OperatorType.endsWith : OperatorType.startsWith;
        }
      }

      // no need to query if search value is empty
      if (searchTerm === '' && (!searchValues || (Array.isArray(searchValues) && searchValues.length === 0))) {
        return true;
      }

      // if search value has a regex match we will only keep the value without the operator
      // in this case we need to overwrite the returned search values to truncate operator from the string search
      if (Array.isArray(matches) && matches.length >= 1 && (Array.isArray(searchValues) && searchValues.length === 1)) {
        searchValues[0] = searchTerm;
      }

      // filter search terms should always be string type (even though we permit the end user to input numbers)
      // so make sure each term are strings, if user has some default search terms, we will cast them to string
      if (searchValues && Array.isArray(searchValues)) {
        for (let k = 0, ln = searchValues.length; k < ln; k++) {
          // make sure all search terms are strings
          searchValues[k] = ((searchValues[k] === undefined || searchValues[k] === null) ? '' : searchValues[k]) + '';
        }
      }

      // when using localization (i18n), we should use the formatter output to search as the new cell value
      if (columnDef && columnDef.params && columnDef.params.useFormatterOuputToFilter) {
        const rowIndex = (dataView && typeof dataView.getIdxById === 'function') ? dataView.getIdxById(item.id) : 0;
        cellValue = columnDef.formatter(rowIndex, columnIndex, cellValue, columnDef, item, this._grid);
      }

      // make sure cell value is always a string
      if (typeof cellValue === 'number') {
        cellValue = cellValue.toString();
      }

      const conditionOptions = {
        fieldType,
        searchTerms: searchValues,
        cellValue,
        operator,
        cellValueLastChar: lastValueChar,
        filterSearchType
      };

      if (!FilterConditions.executeMappedCondition(conditionOptions)) {
        return false;
      }
    }

    return true;
  }

  dispose() {
    this.disposeColumnFilters();

    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();

    // unsubscribe local event
    if (this._slickSubscriber && typeof this._slickSubscriber.unsubscribe === 'function') {
      this._slickSubscriber.unsubscribe();
    }
  }

  /**
   * Dispose of the filters, since it's a singleton, we don't want to affect other grids with same columns
   */
  disposeColumnFilters() {
    // we need to loop through all columnFilters and delete them 1 by 1
    // only trying to make columnFilter an empty (without looping) would not trigger a dataset change
    for (const columnId in this._columnFilters) {
      if (columnId && this._columnFilters[columnId]) {
        delete this._columnFilters[columnId];
      }
    }

    // also destroy each Filter instances
    this._filters.forEach((filter, index) => {
      if (filter && filter.destroy) {
        filter.destroy(true);
      }
    });
  }

  getColumnFilters() {
    return this._columnFilters;
  }

  getCurrentLocalFilters(): CurrentFilter[] {
    const currentFilters: CurrentFilter[] = [];
    if (this._columnFilters) {
      for (const colId of Object.keys(this._columnFilters)) {
        const columnFilter = this._columnFilters[colId];
        const columnDef = columnFilter.columnDef;
        const filter = { columnId: colId || '' } as CurrentFilter;

        if (columnFilter && columnFilter.searchTerms) {
          filter.searchTerms = columnFilter.searchTerms;
        }
        if (columnFilter.operator) {
          filter.operator = columnFilter.operator;
        }
        if (Array.isArray(filter.searchTerms) && filter.searchTerms.length > 0 && filter.searchTerms[0] !== '') {
          currentFilters.push(filter);
        }
      }
    }
    return currentFilters;
  }

  callbackSearchEvent(e: Event | undefined, args: FilterCallbackArg) {
    if (args) {
      const searchTerm = ((e && e.target) ? (e.target as HTMLInputElement).value : undefined);
      const searchTerms = (args.searchTerms && Array.isArray(args.searchTerms)) ? args.searchTerms : (searchTerm ? [searchTerm] : undefined);
      const columnDef = args.columnDef || null;
      const columnId = columnDef ? (columnDef.id || '') : '';
      const operator = args.operator || undefined;

      if (!searchTerms || (Array.isArray(searchTerms) && searchTerms.length === 0)) {
        // delete the property from the columnFilters when it becomes empty
        // without doing this, it would leave an incorrect state of the previous column filters when filtering on another column
        delete this._columnFilters[columnId];
      } else {
        const colId = '' + columnId as string;
        const colFilter: ColumnFilter = {
          columnId: colId,
          columnDef,
          searchTerms,
        };
        if (operator) {
          colFilter.operator = operator;
        }
        this._columnFilters[colId] = colFilter;
      }

      this.triggerEvent(this._slickSubscriber, {
        clearFilterTriggered: args && args.clearFilterTriggered,
        columnId,
        columnDef: args.columnDef || null,
        columnFilters: this._columnFilters,
        operator,
        searchTerms,
        serviceOptions: this._onFilterChangedOptions,
        grid: this._grid
      }, e);
    }
  }

  addFilterTemplateToHeaderRow(args: { column: Column; grid: any; node: any }) {
    const columnDef = args.column;
    const columnId = columnDef.id || '';

    if (columnDef && columnId !== 'selector' && columnDef.filterable) {
      let searchTerms: SearchTerm[] | undefined;
      let operator: OperatorString | OperatorType | undefined;
      const filter: Filter | undefined = this.filterFactory.createFilter(args.column.filter);
      operator = (columnDef && columnDef.filter && columnDef.filter.operator) || (filter && filter.operator);

      if (this._columnFilters[columnDef.id]) {
        searchTerms = this._columnFilters[columnDef.id].searchTerms || undefined;
        operator = this._columnFilters[columnDef.id].operator || undefined;
      } else if (columnDef.filter) {
        // when hiding/showing (with Column Picker or Grid Menu), it will try to re-create yet again the filters (since SlickGrid does a re-render)
        // because of that we need to first get searchTerm(s) from the columnFilters (that is what the user last entered)
        searchTerms = columnDef.filter.searchTerms || undefined;
        this.updateColumnFilters(searchTerms, columnDef, operator);
      }

      const filterArguments: FilterArguments = {
        grid: this._grid,
        operator,
        searchTerms,
        columnDef,
        callback: this.callbackSearchEvent.bind(this)
      };

      if (filter) {
        filter.init(filterArguments);
        const filterExistIndex = this._filters.findIndex((filt) => filter.columnDef.name === filt.columnDef.name);

        // add to the filters arrays or replace it when found
        if (filterExistIndex === -1) {
          this._filters.push(filter);
        } else {
          this._filters[filterExistIndex] = filter;
        }

        // when hiding/showing (with Column Picker or Grid Menu), it will try to re-create yet again the filters (since SlickGrid does a re-render)
        // we need to also set again the values in the DOM elements if the values were set by a searchTerm(s)
        if (searchTerms && filter.setValues) {
          filter.setValues(searchTerms);
        }
      }
    }
  }

  /**
   * A simple function that will be called to emit a change when a filter changes.
   * Other services, like Pagination, can then subscribe to it.
   * @param sender
   */
  emitFilterChanged(sender: 'local' | 'remote') {
    if (sender === 'remote' && this._gridOptions && this._gridOptions.backendServiceApi) {
      let currentFilters: CurrentFilter[] = [];
      const backendService = this._gridOptions.backendServiceApi.service;
      if (backendService && backendService.getCurrentFilters) {
        currentFilters = backendService.getCurrentFilters() as CurrentFilter[];
      }
      this.ea.publish('filterService:filterChanged', currentFilters);
    } else if (sender === 'local') {
      this.ea.publish('filterService:filterChanged', this.getCurrentLocalFilters());
    }
  }

  /**
   * When user passes an array of preset filters, we need to pre-populate each column filter searchTerm(s)
   * The process is to loop through the preset filters array, find the associated column from columnDefinitions and fill in the filter object searchTerm(s)
   * This is basically the same as if we would manually add searchTerm(s) to a column filter object in the column definition, but we do it programmatically.
   * At the end of the day, when creating the Filter (DOM Element), it will use these searchTerm(s) so we can take advantage of that without recoding each Filter type (DOM element)
   * @param grid
   */
  populateColumnFilterSearchTerms() {
    if (this._gridOptions.presets && Array.isArray(this._gridOptions.presets.filters) && this._gridOptions.presets.filters.length > 0) {
      const filters = this._gridOptions.presets.filters;
      this._columnDefinitions.forEach((columnDef: Column) => {
        // clear any columnDef searchTerms before applying Presets
        if (columnDef.filter && columnDef.filter.searchTerms) {
          delete columnDef.filter.searchTerms;
        }

        // from each presets, we will find the associated columnDef and apply the preset searchTerms & operator if there is
        const columnPreset = filters.find((presetFilter: CurrentFilter) => {
          return presetFilter.columnId === columnDef.id;
        });
        if (columnPreset && columnPreset.searchTerms && Array.isArray(columnPreset.searchTerms)) {
          columnDef.filter = columnDef.filter || {};
          columnDef.filter.operator = columnPreset.operator || columnDef.filter.operator || '';
          columnDef.filter.searchTerms = columnPreset.searchTerms;
        }
      });
    }
    return this._columnDefinitions;
  }

  private updateColumnFilters(searchTerms: SearchTerm[] | undefined, columnDef: any, operator?: OperatorType | OperatorString) {
    if (searchTerms && columnDef) {
      this._columnFilters[columnDef.id] = {
        columnId: columnDef.id,
        columnDef,
        searchTerms,
        operator
      };
    }
  }

  private triggerEvent(slickEvent: any, args: any, e: any) {
    slickEvent = slickEvent || new Slick.Event();

    // event might have been created as a CustomEvent (e.g. CompoundDateFilter), without being a valid Slick.EventData.
    // if so we will create a new Slick.EventData and merge it with that CustomEvent to avoid having SlickGrid errors
    let event = e;
    if (e && typeof e.isPropagationStopped !== 'function') {
      event = $.extend({}, new Slick.EventData(), e);
    }
    slickEvent.notify(args, event, args.grid);
  }
}
