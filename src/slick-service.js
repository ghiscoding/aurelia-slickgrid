import { Grid } from 'slickgrid-es6';
import {inject} from 'aurelia-framework';
import {SlickWindowResizer} from './slick-window-resizer';
import $ from 'jquery';

@inject(SlickWindowResizer)
export class SlickService {
  columnDefinition = {};
  data = {};
  grid = {};
  gridId = "myGrid";
  gridOptions = {};
  isCreated = false;
  paginationCallback = null;

  constructor(slickWindowResizer) {
    this.slickResizer = slickWindowResizer;
  }

  createDatagrid(gridId, columnDefinition, gridOptions, data) {
    this.columnDefinition = columnDefinition || {};
    this.data = data || {};
    this.gridId = gridId || "myGrid";
    this.gridOptions = gridOptions || {};
    this.gridOptions.gridId = this.gridId;

    // create the slickgrid object
    this.grid = new Grid(`#${this.gridId}`, this.data, this.columnDefinition, this.gridOptions);
    this.isCreated = true;
    if(typeof this.gridOptions.onSortingChanged === "function") {
      this.grid.onSort.subscribe(this.gridOptions.onSortingChanged);
    }

    // attach datagrid autoResizeGrid as per user's request
    if (!!this.gridOptions.autoResize) {
      this.slickResizer.attachAutoResizeDataGrid(this.grid, this.gridOptions);
    }
  }

  get gridObject() {
    return this.grid;
  }

  refreshDataset(dataset) {
    if(dataset) {
      this.grid.setData(dataset);
      this.grid.invalidate();
      this.grid.render();
    }
  }
}
