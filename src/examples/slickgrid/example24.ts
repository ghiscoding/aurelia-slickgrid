import { I18N } from 'aurelia-i18n';
import {
  AureliaGridInstance,
  Column,
  FieldType,
  Formatter,
  Formatters,
  GridOption,
} from '../../aurelia-slickgrid';
import './example24.scss'; // provide custom CSS/SASS styling
import { autoinject } from 'aurelia-framework';

const actionFormatter: Formatter = (row, cell, value, columnDef, dataContext) => {
  if (dataContext.priority === 3) { // option 3 is High
    return `<div class="fake-hyperlink">Action <i class="fa fa-caret-down"></i></div>`;
  }
  return `<div class="disabled">Action <i class="fa fa-caret-down"></i></div>`;
};

const priorityFormatter: Formatter = (row, cell, value, columnDef, dataContext) => {
  if (!value) {
    return '';
  }
  const count = +(value >= 3 ? 3 : value);
  return count === 3 ? 'High' : (count === 2 ? 'Medium' : 'Low');
};

@autoinject()
export class Example24 {
  title = 'Example 24: Cell Menu / Context Menu';
  subTitle = `
    Add Cell Menu and Context Menu
    <ul>
      <li><b>Cell Menu</b> can be used by a cell menu click, like an 'Action' cell click.</li>
      <li><b>Context Menu</b> shown after a mouse right+click.</li>
    </ul>
  `;

  aureliaGrid: AureliaGridInstance;
  gridOptions: GridOption;
  columnDefinitions: Column[];
  dataset: any[];
  selectedLanguage: string;

  constructor(private i18n: I18N) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();

    // always start with English for Cypress E2E tests to be consistent
    const defaultLang = 'en';
    this.i18n.setLocale(defaultLang);
    this.selectedLanguage = defaultLang;
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string, width: 70 },
      { id: 'percentComplete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, sortable: true, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true },
      { id: 'priority', name: 'Priority', field: 'priority', formatter: priorityFormatter },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', formatter: Formatters.checkmark },
      {
        id: 'action', name: 'Action', field: 'action',
        formatter: actionFormatter,
        cellMenu: {
          // you can override the logic of when the menu is usable
          // for example say that we want to show a menu only when then Priority is set to 'High'.
          // Note that this ONLY overrides the usability itself NOT the text displayed in the cell,
          // if you wish to change the cell text (or hide it)
          // then you SHOULD use it in combination with a custom formatter (actionFormatter) and use the same logic in that formatter
          menuUsabilityOverride: (row, dataContext, grid) => {
            return (dataContext.priority === 3); // option 3 is High
          },
          commandTitle: 'Commands',
          commandItems: [
            { command: 'command1', title: 'Command 1', cssClass: 'orange' },
            {
              command: 'command2', title: 'Command 2',
              // you can subscribe to the 'onCommand' event and/or simply use the 'action' callback, they both have the same arguments
              action: (e, args) => {
                console.log(args.dataContext, args.columnDef);
                // action callback.. do something
              },
              // only enable command when there's no Effort Driven
              itemUsabilityOverride: (row, dataContext, grid) => {
                return (!dataContext.effortDriven);
              }
            },
            {
              command: 'delete-row', title: 'Delete Row',
              iconCssClass: 'fa fa-times', cssClass: 'red', textCssClass: 'bold',
              // only show command to 'Delete Row' when there's no Effort Driven
              itemVisibilityOverride: (row, dataContext, grid) => {
                return (!dataContext.effortDriven);
              }
            },
            // you can pass divider as a string or an object with a boolean
            // 'divider',
            { divider: true, command: '' },

            {
              command: 'help',
              titleKey: 'HELP', // use "titleKey" with I18N or just "title" without translation
              iconCssClass: 'fa fa-question-circle'
            },
            { command: 'something', title: 'Disabled Command', disabled: true }
          ],
          optionTitle: 'Change Effort Driven',
          optionItems: [
            { option: true, title: 'True', iconCssClass: 'checkmark' },
            { option: false, title: 'False' },
            {
              option: null, title: 'null', cssClass: 'italic',
              // you can subscribe to the 'onOptionSelected' event and/or simply use the 'action' callback, they both have the same arguments
              action: (e, args) => {
                // action callback.. do something
              },
              // only enable command when there's no Effort Driven
              itemUsabilityOverride: (row, dataContext, grid) => {
                return (dataContext.priority === 3);
              },
              // only show command to 'Delete Row' when there's no Effort Driven
              itemVisibilityOverride: (row, dataContext, grid) => {
                return (!dataContext.effortDriven);
              }
            },
          ]
        }
      },
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableCellNavigation: true,
      enableTranslate: true,

      // when using the cellMenu, you can change some of the default options and all use some of the callback methods
      enableCellMenu: true,
      cellMenu: {
        minWidth: 200,
        onCommand: (e, args) => this.executeCommand(e, args),
        onBeforeMenuShow: ((e, args) => {
          // for example, you could select the row it was clicked by calling
          // this.aureliaGrid.gridService.setSelectedRows([args.row]);
          console.log('Before the Cell Menu is shown', args);
        }),
        onBeforeMenuClose: ((e, args) => console.log('Cell Menu is closing', args)),
      }
    };
  }

  executeCommand(e, args) {
    const columnDef = args.columnDef;
    const command = args.command;
    const dataContext = args.dataContext;

    switch (command) {
      case 'command1':
        alert('Command 1');
        break;
      case 'command2':
        alert('Command 2');
        break;
      case 'copy-text':
        this.copyCellValue(args.value);
        break;
      case 'help':
        alert('Please help!');
        break;
      case 'delete-row':
        if (confirm(`Do you really want to delete row ${args.row + 1} with ${dataContext.title}?`)) {
          this.aureliaGrid.dataView.deleteItem(dataContext.id);
        }
        break;
    }
  }

  copyCellValue(textToCopy) {
    try {
      const range = document.createRange();
      const tmpElem = $('<div>')
        .css({ position: 'absolute', left: '-1000px', top: '-1000px' })
        .text(textToCopy);
      $('body').append(tmpElem);
      range.selectNodeContents(tmpElem.get(0));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      const success = document.execCommand('copy', false, null);
      if (success) {
        tmpElem.remove();
      }
    } catch (e) { }
  }

  getData() {
    // mock a dataset
    this.dataset = [];
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));

      this.dataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.floor(Math.random() * 25) + ' days',
        percentComplete: Math.floor(Math.random() * 100),
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        priority: i % 3 ? 2 : (i % 5 ? 3 : 1),
        effortDriven: (i % 4 === 0),
      };
    }
  }

  switchLanguage() {
    this.selectedLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.setLocale(this.selectedLanguage);
  }
}
