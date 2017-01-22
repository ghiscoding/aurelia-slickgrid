import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'bootstrap';
import data from './sample-data/example-data';
import {SlickService, Grid, Formatters, Plugins} from 'aurelia-slickgrid';

let grid;
const columns = [
  {id: 'title', name: 'Title', field: 'title'},
  {id: 'duration', name: 'Duration', field: 'duration'},
  {id: '%', name: '% Complete', field: 'percentComplete'},
  {id: 'start', name: 'Start', field: 'start'},
  {id: 'finish', name: 'Finish', field: 'finish'},
  {id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven'}
];

const options = {
  enableCellNavigation: true,
  enableColumnReorder: true,
  forceFitColumns: true,
  rowHeight: 35,
};

@inject(Router, Plugins, SlickService)
export class List {
  heading = 'Example 7: AutoTooltips plugin';
  description = '<h2>Instructions:</h2>' +
  '<p>Resize the columns until see ellipsis in column or header.  Hover over cell to see tooltip.</p>' +
  '<h2>Usage:</h2>' +
  '<pre style="background-color: white; font-size: 110%; border-radius: 5px; padding: 20px; ">plugin = new Slick.AutoTooltips(pluginOptions);' +
  'grid.registerPlugin(plugin);' +
  'grid.render();</pre>';
  gridOptions = {};
  gridColumns = {};

  constructor(router, plugins, slickService) {
    this.router = router;
    this.plugins = plugins;
    this.slick = slickService;
  }

  attached() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    let grid = this.slick.createGrid('myGrid', this.gridColumns, this.gridOptions, data);
    const autoTooltips = new this.plugins.AutoTooltips({ enableForHeaderCells: true });

    grid.registerPlugin(autoTooltips);
    grid.render();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.gridColumns = [
      {id: 'title', name: 'Title', field: 'title'},
      {id: 'duration', name: 'Duration', field: 'duration'},
      {id: '%', name: '% Complete', field: 'percentComplete'},
      {id: 'start', name: 'Start', field: 'start'},
      {id: 'finish', name: 'Finish', field: 'finish'},
      {id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven'}
    ];

    this.gridOptions = {
      autoResize: true,
      columns: this.gridColumns,
      forceFitColumns: true,
      rowHeight: 35,
      gridContainerId: "slickGridContainer",
      editable: false,
      enableCellNavigation: true,
      enableColumnReorder: true
    };
  }
}
