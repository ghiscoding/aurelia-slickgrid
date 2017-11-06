import { autoinject, bindable } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { CaseType, Column, GridOption, FieldType, Formatters, FormElementType, GraphqlService } from '../../aurelia-slickgrid';

let columnsWithHighlightingById = {};

// create a custom Formatter to highlight negative values in red
const highlightingFormatter = (row, cell, value, columnDef, dataContext) => {
  if (columnsWithHighlightingById[columnDef.id] && value < 0) {
    return `<div style='color:red; font-weight:bold;'>${value}</div>`;
  } else {
    return value;
  }
};

@autoinject()
export class Example9 {
  @bindable() gridObj: any;
  @bindable() dataview: any;
  title = 'Example 9: Grid Menu Control';
  subTitle = `
    This example demonstrates using the <b>Slick.Controls.GridMenu</b> plugin to easily add a Grid Menu (aka hamburger menu) on the top right corner of the grid.<br/>
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

  constructor(private http: HttpClient, private graphqlService: GraphqlService) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    columnsWithHighlightingById = {};
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', filterable: true, type: FieldType.string },
      { id: 'duration', name: 'Duration', field: 'duration', sortable: true, filterable: true, type: FieldType.string },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true, filterable: true, type: FieldType.number },
      { id: 'start', name: 'Start', field: 'start', filterable: true, type: FieldType.string },
      { id: 'finish', name: 'Finish', field: 'finish', filterable: true, type: FieldType.string },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', maxWidth: 80, formatter: Formatters.checkmark,
        type: FieldType.boolean,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: {
          searchTerm: '', // default selection
          type: FormElementType.select,
          selectOptions: [{ value: '', label: '' }, { value: true, label: 'true' }, { value: false, label: 'false' }]
        }
      }
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
      enableGridMenu: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableFiltering: true,
      enableCellNavigation: true,
      gridMenu: {
        customTitle: 'Commands',
        columnTitle: 'Columns',
        iconCssClass: 'fa fa-bars',
        menuWidth: 17,
        resizeOnShowHeaderRow: true,
        customItems: [
          {
            iconCssClass: 'fa fa-filter text-danger',
            title: 'Clear All Filters',
            disabled: false,
            command: 'clear-filter'
          },
          {
            iconCssClass: 'fa fa-random',
            title: 'Toggle Filter Row',
            disabled: false,
            command: 'toggle-filter'
          },
          {
            iconCssClass: 'fa fa-question-circle',
            title: 'Help',
            disabled: false,
            command: 'help'
          },
          {
            title: 'Disabled command',
            disabled: true,
            command: 'disabled-command'
          }
        ]
      },
      onGridMenuCommand: (e, args) => {
        if (args.command === 'toggle-filter') {
          this.gridObj.setHeaderRowVisibility(!this.gridObj.getOptions().showHeaderRow);
        } else if (args.command === 'clear-filter') {
          $('.slick-headerrow-column').children().val('');
          // TODO aurelia-slickgrid should have a clearAllFilters function
          alert('Command: ' + args.command);
          this.dataview.refresh();
        } else {
          alert('Command: ' + args.command);
        }
      },
      onHeaderMenuCommand: (e, args) => {
        if (args.command === 'hide') {
          const columnIndex = this.gridObj.getColumnIndex(args.column.id);
          this.visibleColumns = this.removeColumnByIndex(this.visibleColumns, columnIndex);
          this.gridObj.setColumns(this.visibleColumns);
        } else if (args.command === 'sort-asc' || args.command === 'sort-desc') {
          // get previously sorted columns
          // getSortColumns() only returns sortAsc & columnId, we want the entire column definition
          const oldSortColumns = this.gridObj.getSortColumns();
          const cols = $.map(oldSortColumns, (col) => {
            // get the column definition but only keep column which are not equal to our current column
            if (col.columnId !== args.column.id) {
              return { sortCol: this.columnDefinitions[this.gridObj.getColumnIndex(col.columnId)], sortAsc: col.sortAsc };
            }
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

  removeColumnByIndex(array, index) {
    return array.filter((el, i) => {
      return index !== i;
    });
  }
}
