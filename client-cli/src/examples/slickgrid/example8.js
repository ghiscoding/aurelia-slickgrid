import { inject, bindable } from 'aurelia-framework';
import { ControlAndPluginService, Formatters, SortService } from 'aurelia-slickgrid';
import * as $ from 'jquery';

@inject(ControlAndPluginService, SortService)
export class Example8 {
  @bindable() gridObj;
  @bindable() dataview;
  title = 'Example 8: Header Menu Plugin';
  subTitle = `
    This example demonstrates using the <b>Slick.Plugins.HeaderMenu</b> plugin to easily add menus to colum headers.<br/>
    These menus can be specified directly in the column definition, and are very easy to configure and use.
    (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Header-Menu-&-Header-Buttons" target="_blank">Wiki docs</a>)
    <ul>
      <li>Now enabled by default in the Global Grid Options, it will add the default commands of (hide column, sort asc/desc)</li>
      <li>Hover over any column header to see an arrow showing up on the right</li>
      <li>Try Sorting (multi-sort) the 2 columns "Duration" and "% Complete" (the other ones are disabled)</li>
      <li>Try hiding any columns (you use the "Column Picker" plugin by doing a right+click on the header to show the column back)</li>
    </ul>
  `;
  columnDefinitions;
  gridOptions;
  dataset = [];
  controlService;
  sortService;

  constructor(controlService, sortService) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.controlService = controlService;
    this.sortService = sortService;
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  detached() {
    // unsubscrible any Slick.Event you might have used
    // a reminder again, these are SlickGrid Event, not Event Aggregator events
    this.gridObj.onSort.unsubscribe();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title' },
      { id: 'duration', name: 'Duration', field: 'duration', sortable: true },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true },
      { id: 'start', name: 'Start', field: 'start' },
      { id: 'finish', name: 'Finish', field: 'finish' },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', formatter: Formatters.checkmark }
    ];

    this.columnDefinitions.forEach((columnDef) => {
      columnDef.header = {
        menu: {
          items: [
            {
              iconCssClass: 'fa fa-sort-asc',
              title: 'Sort Ascending',
              disabled: !columnDef.sortable,
              command: 'sort-asc'
            },
            {
              iconCssClass: 'fa fa-sort-desc',
              title: 'Sort Descending',
              disabled: !columnDef.sortable,
              command: 'sort-desc'
            },
            {
              iconCssClass: 'fa fa-times',
              title: 'Hide Column',
              command: 'hide'
            },
            {
              iconCssClass: 'fa fa-question-circle',
              title: 'Help',
              command: 'help'
            }
          ]
        }
      };
    });

    this.gridOptions = {
      enableAutoResize: true,
      enableHeaderMenu: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableFiltering: false,
      enableCellNavigation: true,
      headerMenu: {
        onCommand: (e, args) => {
          if (args.command === 'hide') {
            this.controlService.hideColumn(args.column);
            this.controlService.autoResizeColumns();
          } else if (args.command === 'sort-asc' || args.command === 'sort-desc') {
            // get previously sorted columns
            const cols = this.sortService.getPreviousColumnSorts(args.column.id + '');

            // add to the column array, the column sorted by the header menu
            cols.push({ sortCol: args.column, sortAsc: (args.command === 'sort-asc') });
            this.sortService.onLocalSortChanged(this.gridObj, this.dataview, cols);

            // update the this.gridObj sortColumns array which will at the same add the visual sort icon(s) on the UI
            const newSortColumns = cols.map((col) => {
              return { columnId: col.sortCol.id, sortAsc: col.sortAsc };
            });
            this.gridObj.setSortColumns(newSortColumns); // add sort icon in UI
          } else {
            alert('Command: ' + args.command);
          }
        }
      }
    };
  }

  getData() {
    // Set up some test columns.
    const mockDataset = [];
    for (let i = 0; i < 500; i++) {
      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 25) + ' days',
        percentComplete: Math.round(Math.random() * 100),
        start: '01/01/2009',
        finish: '01/05/2009',
        effortDriven: (i % 5 === 0)
      };
    }
    this.dataset = mockDataset;
  }

  gridObjChanged(grid) {
    this.gridObj = grid;
  }

  dataviewChanged(dataview) {
    this.dataview = dataview;
  }
}
