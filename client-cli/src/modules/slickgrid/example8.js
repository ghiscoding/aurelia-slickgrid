import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'jquery';
import data from './sample-data/example-data';
import {SlickService, FrozenGrid as Grid, Formatters, Editors, Data} from 'aurelia-slickgrid';

@inject(Router, SlickService)
export class List {
  heading = 'Example 8: DataFilter frozen column';
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
    this.slick.createGrid('myGrid', this.gridColumns, this.gridOptions, dv);
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.gridColumns = [
      {id: 'title', name: 'Title', field: 'title', maxWidth: 100, minWidth: 80},
      {id: 'duration', name: 'Duration', field: 'duration', resizable: false},
      {id: '%', name: '% Complete', field: 'percentComplete', width: 100, formatter: Formatters.PercentCompleteBar},
      {id: 'start', name: 'Start', field: 'start', width: 300},
      {id: 'finish', name: 'Finish', field: 'finish', width: 300},
      {id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven'}
    ];

    this.gridOptions = {
      asyncEditorLoading: true,
      autoEdit: false,
      autoResize: true,
      columns: this.gridColumns,
      enableAddRow: true,
      enableCellNavigation: true,
      editable: true,
      forceFitColumns: false,
      frozenColumn: 1,
      gridContainerId: "slickGridContainer",
      gridType: "FrozenGrid",
      inlineFilter: false,
      rowHeight: 35,
      topPanelHeight: 25
    };
  }
}
