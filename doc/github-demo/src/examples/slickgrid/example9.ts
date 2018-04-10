import { autoinject, bindable } from 'aurelia-framework';
import { Column, FieldType, FilterType, FilterService, Formatter, Formatters, GridOption, SortService } from 'aurelia-slickgrid';

@autoinject()
export class Example9 {
  @bindable() gridObj: any;
  @bindable() dataviewObj: any;
  title = 'Example 9: Grid Menu Control';
  subTitle = `
    This example demonstrates using the <b>Slick.Controls.GridMenu</b> plugin to easily add a Grid Menu (aka hamburger menu) on the top right corner of the grid.<br/>
    (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grid-Menu" target="_blank">Wiki docs</a>)
    <ul>
      <li>The Grid Menu uses the following icon by default "fa-bars"&nbsp;&nbsp;<span class="fa fa-bars"></span>&nbsp;&nbsp;(which looks like a hamburger, hence the name)</li>
      <ul><li>Another icon which you could use is "fa-ellipsis-v"&nbsp;&nbsp;<span class="fa fa-ellipsis-v"></span>&nbsp;&nbsp;(which is shown in this example)</li></ul>
      <li>By default the Grid Menu shows all columns which you can show/hide</li>
      <li>You can configure multiple "commands" to show up in the Grid Menu and use the "onGridMenuCommand()" callback</li>
      <li>Doing a "right+click" over any column header will also provide a way to show/hide a column (via the Column Picker Plugin)</li>
    </ul>
  `;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  visibleColumns;

  constructor(private filterService: FilterService, private sortService: SortService) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
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
          collection: [{ value: '', label: '' }, { value: true, label: 'true' }, { value: false, label: 'false' }],
          type: FilterType.singleSelect,
          filterOptions: {
            // you can add "multiple-select" plugin options like styling the first row
            offsetLeft: 14,
            width: 100
          }
        }
      }
    ];

    this.gridOptions = {
      columnPicker: {
        hideForceFitButton: true,
        hideSyncResizeButton: true,
        onColumnsChanged: (e, args) => {
          console.log('Column selection changed from Column Picker, visible columns: ', args.columns);
        }
      },
      enableAutoResize: true,
      enableGridMenu: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableFiltering: true,
      enableCellNavigation: true,
      gridMenu: {
        customTitle: 'Custom Commands',
        columnTitle: 'Columns',
        iconCssClass: 'fa fa-ellipsis-v',
        hideForceFitButton: true,
        hideSyncResizeButton: true,
        menuWidth: 17,
        resizeOnShowHeaderRow: true,
        customItems: [
          {
            iconCssClass: 'fa fa-filter text-danger',
            title: 'Clear All Filters',
            disabled: false,
            command: 'clear-filter',
            positionOrder: 0
          },
          {
            iconCssClass: 'fa fa-unsorted text-danger',
            title: 'Clear All Sorting',
            disabled: false,
            command: 'clear-sorting',
            positionOrder: 1
          },
          {
            iconCssClass: 'fa fa-random',
            title: 'Toggle Filter Row',
            disabled: false,
            command: 'toggle-filter',
            positionOrder: 2
          },
          {
            iconCssClass: 'fa fa-random',
            title: 'Toggle Top Panel',
            disabled: false,
            command: 'toggle-toppanel',
            positionOrder: 3
          },
          {
            iconCssClass: 'fa fa-question-circle',
            title: 'Help',
            disabled: false,
            command: 'help',
            positionOrder: 99
          },
          {
            title: 'Disabled command',
            disabled: true,
            command: 'disabled-command',
            positionOrder: 98
          }
        ],
        onCommand: (e, args) => {
          if (args.command === 'toggle-filter') {
            this.gridObj.setHeaderRowVisibility(!this.gridObj.getOptions().showHeaderRow);
          } else if (args.command === 'toggle-toppanel') {
            this.gridObj.setTopPanelVisibility(!this.gridObj.getOptions().showTopPanel);
          } else if (args.command === 'clear-filter') {
            this.filterService.clearFilters();
            this.dataviewObj.refresh();
          } else if (args.command === 'clear-sorting') {
            this.sortService.clearSorting();
            this.dataviewObj.refresh();
          } else {
            alert('Command: ' + args.command);
          }
        },
        onColumnsChanged: (e, args) => {
          console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
        }
      },
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
    this.dataviewObj = dataview;
  }
}
