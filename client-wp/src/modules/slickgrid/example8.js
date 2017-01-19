import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'bootstrap';
import data from './sample-data/example-data';
import {SlickService, FrozenGrid as Grid, Formatters, Editors, Data} from 'aurelia-slickgrid';


@inject(Router, SlickService)
export class List {
  heading = 'Example 8: Frozen Columns';
  grid = {};
  gridOptions = {};
  gridColumns = {};

  constructor(router, slickService) {
    this.router = router;
    this.slick = slickService;
  }

  attached() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    const dv = new Data.DataView();
    dv.setItems(data);
    //this.grid = new Grid("#myGrid", dv, this.gridColumns, this.gridOptions);
    this.slick.createGrid('myGrid', this.gridColumns, this.gridOptions, dv);
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.gridColumns = [
      {id: 'title', name: 'Title', field: 'title', maxWidth: 100, minWidth: 80},
      {id: 'duration', name: 'Duration', field: 'duration', resizable: false},
      {id: '%', name: '% Complete', field: 'percentComplete', width: 100},
      {id: 'start', name: 'Start', field: 'start', width: 300},
      {id: 'finish', name: 'Finish', field: 'finish', width: 300},
      {id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven'}
    ];

    this.gridOptions = {
      autoResize: true,
      columns: this.gridColumns,
      forceFitColumns: true,
      rowHeight: 35,
      gridContainerId: "slickGridContainer",
      gridType: "FrozenGrid",
      editable: true,
      enableAddRow: true,
      enableCellNavigation: true,
      asyncEditorLoading: true,
      forceFitColumns: false,
      autoEdit: false,
      topPanelHeight: 25,
      frozenColumn: 1
    };
  }
}
