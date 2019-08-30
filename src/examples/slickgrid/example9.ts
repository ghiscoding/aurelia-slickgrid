import { I18N } from 'aurelia-i18n';
import { autoinject } from 'aurelia-framework';
import {
  AureliaGridInstance,
  Column,
  ExtensionName,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  OperatorType
} from '../../aurelia-slickgrid';

@autoinject()
export class Example9 {
  title = 'Example 9: Grid Menu Control';
  subTitle = `
    This example demonstrates using the <b>Slick.Controls.GridMenu</b> plugin to easily add a Grid Menu (aka hamburger menu) on the top right corner of the grid.<br/>
    (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grid-Menu" target="_blank">Wiki docs</a>)
    <ul>
    <li>You can change the Grid Menu icon, for example "fa-ellipsis-v"&nbsp;&nbsp;<span class="fa fa-ellipsis-v"></span>&nbsp;&nbsp;(which is shown in this example)</li>
    <li>By default the Grid Menu shows all columns which you can show/hide them</li>
    <li>You can configure multiple custom "commands" to show up in the Grid Menu and use the "onGridMenuCommand()" callback</li>
    <li>Doing a "right+click" over any column header will also provide a way to show/hide a column (via the Column Picker Plugin)</li>
    <li><i class="fa fa-arrow-down"></i> You can also show the Grid Menu anywhere on your page</li>
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

    // always start with English for Cypress E2E tests to be consistent
    const defaultLang = 'en';
    this.i18n.setLocale(defaultLang);
    this.selectedLanguage = defaultLang;
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

  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', headerKey: 'TITLE', filterable: true, type: FieldType.string },
      { id: 'duration', name: 'Duration', field: 'duration', headerKey: 'DURATION', sortable: true, filterable: true, type: FieldType.string },
      {
        id: 'percentComplete', name: '% Complete', field: 'percentComplete', headerKey: 'PERCENT_COMPLETE', sortable: true, filterable: true,
        type: FieldType.number,
        formatter: Formatters.percentCompleteBar,
        filter: { model: Filters.compoundSlider, params: { hideSliderNumber: false } }
      },
      { id: 'start', name: 'Start', field: 'start', headerKey: 'START', filterable: true, type: FieldType.dateUs, filter: { model: Filters.compoundDate } },
      { id: 'finish', name: 'Finish', field: 'finish', headerKey: 'FINISH', filterable: true, type: FieldType.dateUs, filter: { model: Filters.compoundDate } },
      {
        id: 'completed', name: 'Completed', field: 'completed', headerKey: 'COMPLETED', maxWidth: 80, formatter: Formatters.checkmark,
        type: FieldType.boolean,
        minWidth: 100,
        sortable: true,
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'true' }, { value: false, label: 'false' }],
          model: Filters.singleSelect,
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
        // all titles optionally support translation keys, if you wish to use that feature then use the title properties finishing by 'Key'
        // example "customTitle" for a plain string OR "customTitleKey" to use a translation key
        customTitleKey: 'CUSTOM_COMMANDS',
        iconCssClass: 'fa fa-ellipsis-v',
        hideForceFitButton: true,
        hideSyncResizeButton: true,
        hideToggleFilterCommand: false, // show/hide internal custom commands
        menuWidth: 17,
        resizeOnShowHeaderRow: true,
        customItems: [
          // add Custom Items Commands at the bottom of the already existing internal custom items
          // you cannot override an internal items but you can hide them and create your own
          // also note that the internal custom commands are in the positionOrder range of 50-60,
          // if you want yours at the bottom then start with 61, below 50 will make your command(s) on top
          {
            iconCssClass: 'fa fa-question-circle',
            titleKey: 'HELP',
            disabled: false,
            command: 'help',
            positionOrder: 99
          },
          // you can also add divider between commands (command is a required property but you can set it to empty string)
          {
            divider: true,
            command: '',
            positionOrder: 98
          },
          {
            title: 'Disabled command',
            disabled: true,
            command: 'disabled-command',
            positionOrder: 98
          }
        ],
        onCommand: (e, args) => {
          if (args.command === 'help') {
            alert('Command: ' + args.command);
          }
        },
        onColumnsChanged: (e, args) => {
          console.log('Column selection changed from Grid Menu, visible columns: ', args.columns);
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
        phone: this.generatePhoneNumber(),
        duration: Math.round(Math.random() * 25) + ' days',
        percentComplete: Math.round(Math.random() * 100),
        start: '01/01/2009',
        finish: '01/05/2009',
        completed: (i % 5 === 0)
      };
    }
    this.dataset = mockDataset;
  }

  generatePhoneNumber() {
    let phone = '';
    for (let i = 0; i < 10; i++) {
      phone += Math.round(Math.random() * 9) + '';
    }
    return phone;
  }

  switchLanguage() {
    const nextLocale = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.setLocale(nextLocale).then(() => this.selectedLanguage = nextLocale);
  }

  toggleGridMenu(e) {
    if (this.aureliaGrid && this.aureliaGrid.extensionService) {
      const gridMenuInstance = this.aureliaGrid.extensionService.getSlickgridAddonInstance(ExtensionName.gridMenu);
      gridMenuInstance.showGridMenu(e);
    }
  }
}
