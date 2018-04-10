import { autoinject, bindable } from 'aurelia-framework';
import { Column, ControlAndPluginService, FieldType, Formatter, Formatters, GridOption } from '../../aurelia-slickgrid';
import * as $ from 'jquery';

@autoinject()
export class Example8 {
  @bindable() gridObj: any;
  @bindable() dataview: any;
  title = 'Example 8: Header Menu Plugin';
  subTitle = `
    This example demonstrates using the <b>Slick.Plugins.HeaderMenu</b> plugin to easily add menus to colum headers.<br/>
    These menus can be specified directly in the column definition, and are very easy to configure and use.
    (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/SlickGrid-Plugins" target="_blank">Wiki docs</a>)
    <ul>
      <li>Hover over any column header to see an arrow showing up on the right</li>
      <li>Try Sorting (multi-sort) the 2 columns "Duration" and "% Complete" (the other ones are disabled)</li>
      <li>Try hiding any columns (you use the "Column Picker" plugin by doing a right+click on the header to show the column back)</li>
    </ul>
  `;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  visibleColumns;

  constructor(private controlService: ControlAndPluginService) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
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
    for (let i = 0; i < this.columnDefinitions.length; i++) {
      this.columnDefinitions[i].header = {
        menu: {
          items: [
            {
              iconCssClass: 'fa fa-sort-asc',
              title: 'Sort Ascending',
              disabled: !this.columnDefinitions[i].sortable,
              command: 'sort-asc'
            },
            {
              iconCssClass: 'fa fa-sort-desc',
              title: 'Sort Descending',
              disabled: !this.columnDefinitions[i].sortable,
              command: 'sort-desc'
            },
            {
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
    }

    this.visibleColumns = this.columnDefinitions;

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
            // getSortColumns() only returns sortAsc & columnId, we want the entire column definition
            const oldSortColumns = this.gridObj.getSortColumns();
            const cols = $.map(oldSortColumns, (col) => {
              // get the column definition but only keep column which are not equal to our current column
              if (col.columnId !== args.column.id) {
                return { sortCol: this.columnDefinitions[this.gridObj.getColumnIndex(col.columnId)], sortAsc: col.sortAsc };
              }
              return null;
            });
            // add to the column array, the column sorted by the header menu
            const isSortedAsc = (args.command === 'sort-asc');
            cols.push({ sortAsc: isSortedAsc, sortCol: args.column });
            // update the this.gridObj sortColumns array which will at the same add the visual sort icon(s) on the UI
            const newSortColumns = $.map(cols, (col) => {
              return { columnId: col.sortCol.id, sortAsc: col.sortAsc };
            });
            this.gridObj.setSortColumns(newSortColumns);
            this.executeSort(cols);
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
    grid.onSort.subscribe((e, args) => {
      this.executeSort(args.sortCols);
    });
  }

  dataviewChanged(dataview) {
    this.dataview = dataview;
  }

  executeSort(cols) {
    this.dataview.sort((dataRow1, dataRow2) => {
      for (let i = 0, l = cols.length; i < l; i++) {
        const field = cols[i].sortCol.field;
        const sign = cols[i].sortAsc ? 1 : -1;
        const value1 = dataRow1[field];
        const value2 = dataRow2[field];
        const result = (value1 === value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;
        if (result !== 0) {
          return result;
        }
      }
      return 0;
    });
    this.gridObj.invalidate();
    this.gridObj.render();
  }
}
