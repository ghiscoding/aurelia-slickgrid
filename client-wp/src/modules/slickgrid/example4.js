import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'bootstrap';
import data from './sample-data/example-data';
import {SlickService, Grid, Plugins} from 'aurelia-slickgrid';

// load necessary icons
let sortASC = '../../../node_modules/slickgrid-es6/images/sort-asc.gif';
let sortDSC = '../../../node_modules/slickgrid-es6/images/sort-desc.gif';

@inject(Router, SlickService, Plugins)
export class List {
  heading = 'Example 4: Header Menu Plugin';
  grid = {};
  gridOptions = {};
  gridColumns = {};

  constructor(router, slickService, plugins) {
    this.router = router;
    this.slick = slickService;
    this.plugins = plugins;
  }

  attached() {
    let self = this;
    // define the grid options & columns and then create the grid itself
    this.defineGrid();

    this.grid = new Grid("#myGrid", data, this.gridColumns, this.gridOptions);

        const headerMenuPlugin = new this.plugins.HeaderMenu({});

        headerMenuPlugin.onBeforeMenuShow.subscribe(function(e, args){
          const menu = args.menu;

          // We can add or modify the menu here, or cancel it by returning false.
          const i = menu.items.length;
          menu.items.push({
            title: 'Menu item ' + i,
            command: 'item' + i
          });
        });

        headerMenuPlugin.onCommand.subscribe(function(e, args){
          alert('Command: ' + args.command);
        });
console.log(headerMenuPlugin);
        self.grid.registerPlugin(headerMenuPlugin);

    //this.slick.createGrid('myGrid', this.gridColumns, this.gridOptions, data);
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
    for (let i = 0; i < this.gridColumns.length; i++) {
      this.gridColumns[i].header = {
        menu: {
          items: [
            {
              iconImage: sortASC,
              title: 'Sort Ascending',
              command: 'sort-asc'
            },
            {
              iconImage: sortDSC,
              title: 'Sort Descending',
              command: 'sort-desc'
            },
            {
              title: 'Hide Column',
              command: 'hide',
              disabled: true,
              tooltip: "Can't hide this column"
            },
            {
              iconCssClass: 'icon-help',
              title: 'Help',
              command: 'help'
            }
          ]
        }
      };
    }

    this.gridOptions = {
      autoResize: true,
      columns: this.gridColumns,
      forceFitColumns: true,
      rowHeight: 35,
      gridContainerId: "slickGridContainer",
      enableColumnReorder: false
    };
  }
}
