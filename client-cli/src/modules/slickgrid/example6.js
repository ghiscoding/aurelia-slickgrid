import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'bootstrap';
import data from './sample-data/example-data';
import {SlickService, Grid, Plugins, Formatters} from 'aurelia-slickgrid';

// load necessary icons
let Help = '../../../node_modules/slickgrid-es6/images/help.png';
let TagRed = '../../../node_modules/slickgrid-es6/images/tag_red.png';
let CommentYellow = '../../../node_modules/slickgrid-es6/images/comment_yellow.gif';
let Info = '../../../node_modules/slickgrid-es6/images/info.gif';
let sortASC = '../../../node_modules/slickgrid-es6/images/sort-asc.gif';
let sortDSC = '../../../node_modules/slickgrid-es6/images/sort-desc.gif';

let grid;
const columns = [
  {id: 'title', name: 'Title', field: 'title'},
  {id: 'duration', name: 'Duration', field: 'duration'},
  {id: '%', name: '% Complete', field: 'percentComplete'},
  {id: 'start', name: 'Start', field: 'start'},
  {id: 'finish', name: 'Finish', field: 'finish'},
  {id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven'}
];

for (let i = 0; i < columns.length; i++){
  columns[i].header = {
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

const options = {
  enableColumnReorder: !false
};

@inject(Router, Plugins, SlickService)
export class List {
  heading = 'Example 6: Header Menu Plugin';
  description = '<p>This example demonstrates using the <b>Slick.Plugins.HeaderMenu</b> plugin to add drop-down menus to column' +
               ' headers.  (Hover over the headers.)</p>';
  gridOptions = {};
  gridColumns = {};

  constructor(router, plugins, slickService) {
    this.router = router;
    this.plugins = plugins;
    this.slick = slickService;
  }

  attached() {
    grid = new Grid("#myGrid", data, columns, options);

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

    grid.registerPlugin(headerMenuPlugin);
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
