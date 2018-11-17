import { singleton, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { CellArgs, Column, GridOption, OnEventArgs } from './../models/index';
import { ExtensionService } from './extension.service';
import { FilterService } from './filter.service';
import { GridStateService } from './gridState.service';
import { SortService } from './sort.service';
import * as $ from 'jquery';

// using external non-typed js libraries
declare var Slick: any;

@singleton(true)
@inject(ExtensionService, FilterService, I18N, GridStateService, SortService)
export class GridService {
  private _grid: any;
  private _dataView: any;

  constructor(
    private extensionService: ExtensionService,
    private filterService: FilterService,
    private i18n: I18N,
    private gridStateService: GridStateService,
    private sortService: SortService
  ) { }

  /** Getter for the Column Definitions pulled through the Grid Object */
  private get _columnDefinitions(): Column[] {
    return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
  }

  /** Getter for the Grid Options pulled through the Grid Object */
  private get _gridOptions(): GridOption {
    return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
  }

  /**
   * Initialize the Service
   * @param grid
   * @param dataView
   */
  init(grid: any, dataView: any): void {
    this._grid = grid;
    this._dataView = dataView;
  }

  /**
   * From a SlickGrid Event triggered get the Column Definition and Item Data Context
   *
   * For example the SlickGrid onClick will return cell arguments when subscribing to it.
   * From these cellArgs, we want to get the Column Definition and Item Data
   * @param cell event args
   * @return object with columnDef and dataContext
   */
  getColumnFromEventArguments(args: CellArgs): OnEventArgs {
    if (!args || !args.grid || !args.grid.getColumns || !args.grid.getDataItem) {
      throw new Error('To get the column definition and data, we need to have these arguments passed as objects (row, cell, grid)');
    }

    return {
      row: args.row,
      cell: args.cell,
      columnDef: args.grid.getColumns()[args.cell],
      dataContext: args.grid.getDataItem(args.row),
      dataView: this._dataView,
      grid: this._grid,
      gridDefinition: this._gridOptions
    };
  }

  /** Get data item by it's row index number */
  getDataItemByRowNumber(rowNumber: number): any {
    if (!this._grid || typeof this._grid.getDataItem !== 'function') {
      throw new Error('We could not find SlickGrid Grid object');
    }
    return this._grid.getDataItem(rowNumber);
  }

  /** Override the item Metadata with our implementation of Metadata at given row index */
  getItemRowMetadataToHighlight(previousItemMetadata: any): any {
    return (rowNumber: number) => {
      const item = this._dataView.getItem(rowNumber);
      let meta = { cssClasses: '' };
      if (typeof previousItemMetadata === 'function') {
        meta = previousItemMetadata(rowNumber);
      }

      if (item && item._dirty) {
        meta.cssClasses = (meta && meta.cssClasses || '') + ' dirty';
      }

      if (!meta) {
        meta = { cssClasses: '' };
      }

      if (item && item.rowClass && meta) {
        meta.cssClasses += ` ${item.rowClass}`;
        meta.cssClasses += ` row${rowNumber}`;
      }

      return meta;
    };
  }

  /**
   * Highlight then fade a row for x seconds.
   * The implementation follows this SO answer: https://stackoverflow.com/a/19985148/1212166
   * @param rowNumber
   * @param fadeDelay
   */
  highlightRow(rowNumber: number, fadeDelay: number = 1500) {
    // create a SelectionModel if there's not one yet
    if (!this._grid.getSelectionModel()) {
      const rowSelectionPlugin = new Slick.RowSelectionModel(this._gridOptions.rowSelectionOptions || {});
      this._grid.setSelectionModel(rowSelectionPlugin);
    }

    this._grid.setSelectedRows([rowNumber]);
    this._dataView.getItemMetadata = this.getItemRowMetadataToHighlight(this._dataView.getItemMetadata);

    const item = this._dataView.getItem(rowNumber);
    if (item && item.id) {
      item.rowClass = 'highlight';
      this._dataView.updateItem(item.id, item);

      // highlight the row for a user defined timeout
      $(`#${this._gridOptions.gridId}`)
        .find(`.highlight.row${rowNumber}`)
        .first();

      // delete the row's CSS that was attached for highlighting
      setTimeout(() => {
        if (item && item.id) {
          delete item.rowClass;
          const gridIdx = this._dataView.getIdxById(item.id);
          if (gridIdx !== undefined) {
            this._dataView.updateItem(item.id, item);
          }
        }
      }, fadeDelay + 10);
    }
  }

  /** Get the Data Item from a grid row index */
  getDataItemByRowIndex(index: number): any {
    if (!this._grid || typeof this._grid.getDataItem !== 'function') {
      throw new Error('We could not find SlickGrid Grid object');
    }

    return this._grid.getDataItem(index);
  }

  /** Get the Data Item from an array of grid row indexes */
  getDataItemByRowIndexes(indexes: number[]): any[] {
    if (!this._grid || typeof this._grid.getDataItem !== 'function') {
      throw new Error('We could not find SlickGrid Grid object');
    }

    const dataItems: any[] = [];

    if (Array.isArray(indexes)) {
      indexes.forEach((idx) => {
        dataItems.push(this._grid.getDataItem(idx));
      });
    }

    return dataItems;
  }

  /** Get the currently selected row indexes */
  getSelectedRows(): number[] {
    return this._grid.getSelectedRows();
  }

  /** Get the currently selected rows item data */
  getSelectedRowsDataItem(): any[] {
    if (!this._grid || typeof this._grid.getSelectedRows !== 'function') {
      throw new Error('We could not find SlickGrid Grid object');
    }

    const selectedRowIndexes = this._grid.getSelectedRows();
    return this.getDataItemByRowIndexes(selectedRowIndexes);
  }

  /** Select the selected row by a row index */
  setSelectedRow(rowIndex: number) {
    this._grid.setSelectedRows([rowIndex]);
  }

  /** Set selected rows with provided array of row indexes */
  setSelectedRows(rowIndexes: number[]) {
    this._grid.setSelectedRows(rowIndexes);
  }

  /** Re-Render the Grid */
  renderGrid() {
    if (this._grid && typeof this._grid.invalidate === 'function') {
      this._grid.invalidate();
      this._grid.render();
    }
  }

  /**
   * Reset the grid to it's original state (clear any filters, sorting & pagination if exists) .
   * The column definitions could be passed as argument to reset (this can be used after a Grid State reset)
   * The reset will clear the Filters & Sort, then will reset the Columns to their original state
   */
  resetGrid(columnDefinitions?: Column[]) {
    // reset columns to original states & refresh the grid
    if (this._grid && this._dataView) {
      const originalColumns = this.extensionService.getAllColumns();
      // const originalColumns = columnDefinitions || this._columnDefinitions;
      if (Array.isArray(originalColumns) && originalColumns.length > 0) {
        // set the grid columns to it's original column definitions
        this._grid.setColumns(originalColumns);
        this._dataView.refresh();
        if (this._gridOptions && this._gridOptions.enableAutoSizeColumns) {
          this._grid.autosizeColumns();
        }
        this.gridStateService.resetColumns(columnDefinitions);
      }
    }
    if (this.filterService && this.filterService.clearFilters) {
      this.filterService.clearFilters();
    }
    if (this.sortService && this.sortService.clearSorting) {
      this.sortService.clearSorting();
    }
  }

  /**
   * Add an item (data item) to the datagrid, by default it will highlight (flashing) the inserted row but we can disable it too
   * @param object dataItem: item object holding all properties of that row
   * @param shouldHighlightRow do we want to highlight the row after adding item
   */
  addItemToDatagrid(item: any, shouldHighlightRow = true): void {
    if (!this._grid || !this._gridOptions || !this._dataView) {
      throw new Error('We could not find SlickGrid Grid, DataView objects');
    }

    const row = 0;
    this._dataView.insertItem(row, item);
    this._grid.scrollRowIntoView(0); // scroll to row 0

    // highlight the row we just added, if defined
    if (shouldHighlightRow) {
      this.highlightRow(0, 1500);
    }

    // refresh dataview & grid
    this._dataView.refresh();
  }

  /**
   * Add item array (data item) to the datagrid, by default it will highlight (flashing) the inserted row but we can disable it too
   * @param dataItem array: item object holding all properties of that row
   * @param shouldHighlightRow do we want to highlight the row after adding item
   */
  addItemsToDatagrid(items: any[], shouldHighlightRow = true) {
    if (Array.isArray(items)) {
      items.forEach((item: any) => this.addItemToDatagrid(item, shouldHighlightRow));
    }
  }

  /**
   * Delete an existing item from the datagrid (dataView)
   * @param object item: item object holding all properties of that row
   */
  deleteDataGridItem(item: any) {
    if (!item || !item.hasOwnProperty('id')) {
      throw new Error(`deleteDataGridItem() requires an item object which includes the "id" property`);
    }
    const itemId = (!item || !item.hasOwnProperty('id')) ? undefined : item.id;
    this.deleteDataGridItemById(itemId);
  }

  /**
   * Delete an existing item from the datagrid (dataView) by it's id
   * @param itemId: item unique id
   */
  deleteDataGridItemById(itemId: string | number) {
    if (itemId === undefined) {
      throw new Error(`Cannot delete a row without a valid "id"`);
    }
    if (this._dataView.getRowById(itemId) === undefined) {
      throw new Error(`Could not find the item in the grid by it's associated "id"`);
    }

    // delete the item from the dataView
    this._dataView.deleteItem(itemId);
    this._dataView.refresh();
  }

  /**
   * Update an existing item with new properties inside the datagrid
   * @param object item: item object holding all properties of that row
   */
  updateDataGridItem(item: any) {
    const itemId = (!item || !item.hasOwnProperty('id')) ? undefined : item.id;

    if (itemId === undefined) {
      throw new Error(`Could not find the item in the grid or it's associated "id"`);
    }

    this.updateDataGridItemById(itemId, item);
  }

  /**
   * Update an existing item in the datagrid by it's id and new properties
   * @param itemId: item unique id
   * @param object item: item object holding all properties of that row
   * @param shouldHighlightRow do we want to highlight the row after update
   */
  updateDataGridItemById(itemId: number | string, item: any, shouldHighlightRow = true) {
    if (itemId === undefined) {
      throw new Error(`Cannot update a row without a valid "id"`);
    }
    const row = this._dataView.getRowById(itemId);

    if (!item || row === undefined) {
      throw new Error(`Could not find the item in the grid or it's associated "id"`);
    }

    const gridIdx = this._dataView.getIdxById(itemId);
    if (gridIdx !== undefined) {
      // Update the item itself inside the dataView
      this._dataView.updateItem(itemId, item);

      // highlight the row we just updated, if defined
      if (shouldHighlightRow) {
        this.highlightRow(row, 1500);
      }

      // refresh dataview & grid
      this._dataView.refresh();
    }
  }
}
