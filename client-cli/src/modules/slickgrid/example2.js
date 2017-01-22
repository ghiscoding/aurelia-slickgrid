import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'bootstrap';
import data from './sample-data/example-data';
import {SlickService, Formatters} from 'aurelia-slickgrid';

function checkmarkFormatter(row, cell, value, columnDef, dataContext){
  return value ? `<i class="fa fa-check" aria-hidden="true"></i>` : '';
}

@inject(Router, SlickService)
export class List {
  heading = 'Example 2: Formatters';
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
    this.gridColumns = [
      {id: 'title', name: 'Title', field: 'title', width: 120, cssClass: 'cell-title'},
      {id: 'duration', name: 'Duration', field: 'duration'},
      {id: '%', name: '% Complete', field: 'percentComplete', width: 100, resizable: false, formatter: Formatters.PercentCompleteBar},
      {id: 'start', name: 'Start', field: 'start', minWidth: 60},
      {id: 'finish', name: 'Finish', field: 'finish', minWidth: 60},
      {id: 'effort-driven', name: 'Effort Driven', sortable: false, width: 80, minWidth: 20, maxWidth: 80, cssClass: 'cell-effort-driven', field: 'effortDriven', formatter: checkmarkFormatter}
    ];

    this.gridOptions = {
      autoResize: true,
      columns: this.gridColumns,
      forceFitColumns: true,
      rowHeight: 35,
      gridContainerId: "slickGridContainer",
      editable: false,
      enableAddRow: false,
      enableCellNavigation: true,
      enableColumnReorder: false
    };
  }
}
