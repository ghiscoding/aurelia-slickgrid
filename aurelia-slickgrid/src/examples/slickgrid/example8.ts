import { I18N } from 'aurelia-i18n';
import { autoinject, bindable } from 'aurelia-framework';
import { AureliaGridInstance, Column, ColumnSort, FieldType, Formatter, Formatters, GridOption } from '../../aurelia-slickgrid';
import * as $ from 'jquery';

@autoinject()
export class Example8 {
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

  aureliaGrid: AureliaGridInstance;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  dataView: any;
  gridObj: any;
  selectedLanguage: string;
  visibleColumns;

  constructor(private i18n: I18N) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.selectedLanguage = this.i18n.getLocale();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
    this.gridObj = aureliaGrid && aureliaGrid.slickGrid;
    this.dataView = aureliaGrid && aureliaGrid.dataView;
  }

  detached() {
    // unsubscrible any Slick.Event you might have used
    // a reminder again, these are SlickGrid Event, not Event Aggregator events
    this.gridObj.onSort.unsubscribe();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', headerKey: 'TITLE' },
      { id: 'duration', name: 'Duration', field: 'duration', headerKey: 'DURATION', sortable: true },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true },
      { id: 'start', name: 'Start', field: 'start', headerKey: 'START' },
      { id: 'finish', name: 'Finish', field: 'finish', headerKey: 'FINISH' },
      { id: 'completed', name: 'Completed', field: 'completed', headerKey: 'COMPLETED', formatter: Formatters.checkmark }
    ];

    this.columnDefinitions.forEach((columnDef) => {
      columnDef.header = {
        menu: {
          items: [
            // add Custom Header Menu Item Commands at the bottom of the already existing internal custom items
            // you cannot override an internal command but you can hide them and create your own
            // also note that the internal custom commands are in the positionOrder range of 50-60,
            // if you want yours at the bottom then start with 61, below 50 will make your command(s) on top
            {
              iconCssClass: 'fa fa-question-circle',
              disabled: (columnDef.id === 'effort-driven'), // you can disable a command with certain logic
              titleKey: 'HELP', // use "title" as plain string OR "titleKey" when using a translation key
              command: 'help',
              positionOrder: 99
            },
            // you can also add divider between commands (command is a required property but you can set it to empty string)
            {
              divider: true,
              command: '',
              positionOrder: 98
            },
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
        hideSortCommands: false,
        hideColumnHideCommand: false,
        onCommand: (e, args) => {
          if (args.command === 'help') {
            alert('Please help!!!');
          }
        }
      },
      enableTranslate: true,
      i18n: this.i18n
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
        completed: (i % 5 === 0)
      };
    }
    this.dataset = mockDataset;
  }

  switchLanguage() {
    this.selectedLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.setLocale(this.selectedLanguage);
  }
}
