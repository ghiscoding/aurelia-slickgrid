var _dec, _class;

import { FrozenGrid, Grid } from 'slickgrid-es6';
import { inject } from 'aurelia-framework';
import { SlickWindowResizer } from './slick-window-resizer';

export let SlickService = (_dec = inject(SlickWindowResizer), _dec(_class = class SlickService {

  constructor(slickWindowResizer) {
    this.columnDefinition = {};
    this.data = {};
    this.grid = {};
    this.gridId = 'myGrid';
    this.gridOptions = {};
    this.isCreated = false;
    this.paginationCallback = null;

    this.slickResizer = slickWindowResizer;
  }

  createGrid(gridId, columnDefinition, gridOptions, data) {
    this.columnDefinition = columnDefinition || {};
    this.data = data || {};
    this.gridId = gridId || 'myGrid';
    this.gridOptions = gridOptions || {};
    this.gridOptions.gridId = this.gridId;

    if (!!gridOptions.gridType && gridOptions.gridType.toLowerCase() === 'frozengrid') {
      this.grid = new FrozenGrid(`#${ this.gridId }`, this.data, this.columnDefinition, this.gridOptions);
    } else {
      this.grid = new Grid(`#${ this.gridId }`, this.data, this.columnDefinition, this.gridOptions);
    }

    this.isCreated = true;
    if (typeof this.gridOptions.onSortingChanged === 'function') {
      this.grid.onSort.subscribe(this.gridOptions.onSortingChanged);
    }

    if (!!this.gridOptions.autoResize) {
      this.slickResizer.attachAutoResizeDataGrid(this.grid, this.gridOptions);
    }

    return this.grid;
  }

  get gridObject() {
    return this.grid;
  }

  refreshDataset(dataset) {
    if (dataset) {
      this.grid.setData(dataset);
      this.grid.invalidate();
      this.grid.render();
    }
  }
}) || _class);