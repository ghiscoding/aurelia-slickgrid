// import 3rd party vendor libs
import 'slickgrid/controls/slick.columnpicker';
import 'slickgrid/controls/slick.pager';
import 'slickgrid/lib/jquery-ui-1.11.3';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/plugins/slick.rowselectionmodel';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';

import { bindable, bindingMode, inject } from 'aurelia-framework';

import { GlobalGridOptions } from './global-grid-options';
import { Column } from './models/column.interface';
import { ColumnFilters } from './models/columnFilters.interface';
import { GridOption } from './models/gridOption.interface';
import { FilterService } from './services/filter.service';
import { MouseService } from './services/mouse.service';
import { ResizerService } from './services/resizer.service';
import { SortService } from './services/sort.service';

// using external js modules in Aurelia
declare var Slick: any;
declare var $: any;

@inject(Element)
export class AuSlickgridCustomElement {
  private _domElm: HTMLElement;
  private _dataset: any[];
  private _dataView: any;
  private _gridOptions: GridOption;
  private _columnFilters: ColumnFilters = {};
  grid: any;
  gridPaginationOptions: GridOption;
  gridHeightString: string;
  gridWidthString: string;
  showPagination = false;
  onFilter = new Slick.Event();
  style: any;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) element: Element;
  @bindable() gridId: string;
  @bindable() columnDefinitions: Column[];
  @bindable() gridOptions: GridOption;
  @bindable() gridHeight = 100;
  @bindable() gridWidth = 600;
  @bindable() pickerOptions: any;
  @bindable()
  set dataset(dataset: any[]) {
    this._dataset = dataset;
    this.refreshGridData(dataset);
  }
  get dataset(): any[] {
    return this._dataView.getItems();
  }

  constructor(
    private elm: Element,
    private resizer: ResizerService,
    private mouseService: MouseService,
    private filterService: FilterService,
    private sortService: SortService) {
  }

  attached() {
    // reference to the DOM element
    this._domElm = $(this.elm);

    // finally create the bootstrap-select with all options
    // let pickerOptions = Object.assign({}, GlobalGridOptions, this.pickerOptions || {});

    // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
    this._dataset = this._dataset || [];
    this._gridOptions = this.mergeGridOptions();

    this._dataView = new Slick.Data.DataView();

    this.grid = new Slick.Grid(`#${this.gridId}`, this._dataView, this.columnDefinitions, this._gridOptions);
    this.grid.setSelectionModel(new Slick.RowSelectionModel());
    // const columnpicker = new Slick.Controls.ColumnPicker(this.columnDefinitions, this.grid, this._gridOptions);

    this.grid.init();
    this._dataView.beginUpdate();
    this.attachDifferentHooks(this.grid, this._gridOptions, this._dataView);

    this._dataView.setItems(this._dataset);
    this._dataView.endUpdate();

    // attach resize ONLY after the dataView is ready
    this.attachResizeHook(this.grid, this._gridOptions);
  }

  /**
   * Keep original value(s) that could be passed by the user ViewModel.
   * If nothing was passed, it will default to first option of select
   */
  bind() {
    this.style = {
      height: `${this.gridHeight}px`,
      width: `${this.gridWidth}px`
    };
  }

  /*
  unbind(binding, scope) {
  }
  */

  attachDifferentHooks(grid: any, options: GridOption, dataView: any) {
    // attach external sorting (backend) when available or default onSort (dataView)
    if (options.enableSorting) {
      (typeof options.onSortChanged === 'function') ? this.sortService.attachBackendOnSort(grid, options) : this.sortService.attachLocalOnSort(grid, this._dataView);
    }

    // attach external filter (backend) when available or default onSort (dataView)
    if (options.enableFiltering) {
      this.filterService.init(grid, options, this.columnDefinitions, this._columnFilters);
      (typeof options.onFilterChanged === 'function') ? this.filterService.attachBackendOnFilter() : this.filterService.attachLocalOnFilter(this._dataView);
    }

    // if enable, change background color on mouse over
    if (options.enableMouseOverRow) {
      this.mouseService.attachOnMouseHover(grid);
    }

    dataView.onRowCountChanged.subscribe((e: any, args: any) => {
      grid.updateRowCount();
      grid.render();
    });
    dataView.onRowsChanged.subscribe((e: any, args: any) => {
      grid.invalidateRows(args.rows);
      grid.render();
    });
  }

  attachResizeHook(grid: any, options: GridOption) {
    // expand/autofit columns on first page load
    if (this._gridOptions.autoFitColumnsOnFirstLoad) {
      this.grid.autosizeColumns();
    }

    // auto-resize grid on browser resize
    if (options.enableAutoResize) {
      this.resizer.attachAutoResizeDataGrid(grid, options);
      if (options.autoFitColumnsOnFirstLoad) {
        grid.autosizeColumns();
      }
    } else {
      this.resizer.resizeGrid(grid, options, { height: this.gridHeight, width: this.gridWidth });
    }
  }

  mergeGridOptions(): GridOption {
    this.gridOptions.gridId = this.gridId;
    this.gridOptions.gridContainerId = `slickGridContainer-${this.gridId}`;
    if (this.gridOptions.enableFiltering) {
      this.gridOptions.showHeaderRow = true;
    }
    const options = { ...GlobalGridOptions, ...this.gridOptions };
    return options;
  }

  /** Toggle the filter row displayed on first row */
  showHeaderRow(isShowing: boolean) {
    this.grid.setHeaderRowVisibility(isShowing);
    return isShowing;
  }

  /** Toggle the filter row displayed on first row */
  toggleHeaderRow() {
    const isShowing = !this.grid.getOptions().showHeaderRow;
    this.grid.setHeaderRowVisibility(isShowing);
    return isShowing;
  }

  refreshGridData(dataset: any[]) {
    if (dataset && this.grid) {
      this._dataView.setItems(dataset);

      // this.grid.setData(dataset);
      this.grid.invalidate();
      this.grid.render();

      if (this._gridOptions.enablePagination) {
        this.showPagination = true;
        this.gridPaginationOptions = this.mergeGridOptions();
      }
      if (this._gridOptions.enableAutoResize) {
        // resize the grid inside a slight timeout, in case other DOM element changed prior to the resize (like a filter/pagination changed)
        setTimeout(() => {
          this.resizer.resizeGrid(this.grid, this._gridOptions);
          this.grid.autosizeColumns();
        });
      }
    }
  }
}
