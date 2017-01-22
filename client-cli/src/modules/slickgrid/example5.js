import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'bootstrap';
import origData from './sample-data/example-data';
import {SlickService, Grid, Formatters, Plugins} from 'aurelia-slickgrid';

// load necessary icons
let Help = '../../../node_modules/slickgrid-es6/images/help.png';
let TagRed = '../../../node_modules/slickgrid-es6/images/tag_red.png';
let CommentYellow = '../../../node_modules/slickgrid-es6/images/comment_yellow.gif';
let Info = '../../../node_modules/slickgrid-es6/images/info.gif';

let grid;
const columns = [];
const options = {
  autoResize: true,
  columns: columns,
  forceFitColumns: true,
  rowHeight: 35,
  gridContainerId: "slickGridContainer",
  editable: false,
  enableAddRow: false,
  enableCellNavigation: true,
  enableColumnReorder: false
};
const columnsWithHighlightingById = {};

let data = origData.slice(0, 100);

// Set up some test columns.
for (let i = 0; i < 10; i++){
  columns.push({
    id: i,
    name: String.fromCharCode('A'.charCodeAt(0) + i),
    field: i,
    width: (i <= 1 ? 120: 90), // have the 2 first columns wider
    sortable: true,
    formatter: highlightingFormatter,
    header: {
      buttons: [
        {
          cssClass: 'icon-highlight-off',
          command: 'toggle-highlight',
          tooltip: 'Highlight negative numbers.'
        }
      ]
    }
  });
}

// Set multiple buttons on the first column to demonstrate overflow.
columns[0].name = 'Resize me!';
columns[0].header = {
  buttons: [
    {
      image: TagRed
    },
    {
      image: CommentYellow
    },
    {
      image: Info
    },
    {
      image: Help
    }
  ]
};

// Set a button on the second column to demonstrate hover.
columns[1].name = 'Hover me!';
columns[1].header = {
  buttons: [
    {
      image: Help,
      showOnHover: true,
      tooltip: 'This button only appears on hover.',
      handler: function(e){
        alert('Help');
      }
    }
  ]
};

// Set up some test data.
for (let i = 0; i < 100; i++){
  const d = (data[i] = {});
  d['id'] = i;
  for (let j = 0; j < columns.length; j++){
    d[j] = Math.round(Math.random() * 10) - 5;
  }
}

function highlightingFormatter(row, cell, value, columnDef, dataContext){
  if (columnsWithHighlightingById[columnDef.id] && value < 0){
    return "<div style='color:red; font-weight:bold;'>" + value + '</div>';
  } else {
    return value;
  }
}

function checkmarkFormatter(row, cell, value, columnDef, dataContext){
  return value ? `<i class="fa fa-check" aria-hidden="true"></i>` : '';
}

@inject(Router, SlickService, Plugins)
export class List {
  heading = 'Example 5: Header Button Plugin';
  description = 'This example demonstrates using the <b>Slick.Plugins.HeaderButtons</b> plugin to easily add buttons to colum headers.  These buttons can be specified directly in the column definition, and are very easy to configure and use. Click on top-right blue icon to enable highlight of negative numbers.';
  gridOptions = {};
  gridColumns = {};

  constructor(router, slickService, plugins) {
    this.router = router;
    this.slick = slickService;
    this.plugins = plugins;
  }

  attached() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    let grid = this.slick.createGrid('myGrid', columns, options, data);

    const headerButtonsPlugin = new this.plugins.HeaderButtons();

    headerButtonsPlugin.onCommand.subscribe(function(e, args){
      const column = args.column;
      const button = args.button;
      const command = args.command;

      if (command == 'toggle-highlight'){
        if (button.cssClass == 'icon-highlight-on'){
          delete columnsWithHighlightingById[column.id];
          button.cssClass = 'icon-highlight-off';
          button.tooltip = 'Highlight negative numbers.';
        } else {
          columnsWithHighlightingById[column.id] = true;
          button.cssClass = 'icon-highlight-on';
          button.tooltip = 'Remove highlight.';
        }

        grid.invalidate();
      }
    });

    grid.registerPlugin(headerButtonsPlugin);
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
