import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'bootstrap';
import data from './sample-data/example-data';
import {SlickService} from 'aurelia-slickgrid';

var sampleDataRoot = 'src/modules/slickgrid/sample-data';

@inject(Router, SlickService)
export class List {
  heading = 'Example 1 - Frozen Grid, Simple Example';
  description = 'Resize browser window smaller until you see horizontal scrolling bar (you will see 1st column is Frozen Column)';
  gridOptions = {};
  gridColumns = {};

  constructor(router, slickService) {
    this.router = router;
    this.slick = slickService;
  }

  attached() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.slick.createGrid('myGrid', this.gridColumns, this.gridOptions, data);
  }

  /* Define grid Options and Columns */
  defineGrid() {
    let self = this;
    this.gridColumns = [
      {id: 'title', name: 'Title', field: 'title', maxWidth: 100, minWidth: 80},
      {id: 'duration', name: 'Duration', field: 'duration', resizable: false},
      {id: '%', name: '% Complete', field: 'percentComplete', width: 100},
      {id: 'start', name: 'Start', field: 'start', width: 120},
      {id: 'finish', name: 'Finish', field: 'finish', width: 120},
      {id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', width: 120}
    ];

    this.gridOptions = {
      autoResize: true,
      columns: this.gridColumns,
      forceFitColumns: false,
      rowHeight: 35,
      gridContainerId: "slickGridContainer",
      gridType: "FrozenGrid",
      enableCellNavigation: true,
      enableColumnReorder: false,
      frozenColumn: 0,
      frozenRow: 1
    };
  }
}
