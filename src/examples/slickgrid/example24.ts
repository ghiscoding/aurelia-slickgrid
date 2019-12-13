import { I18N } from 'aurelia-i18n';
import {
  AureliaGridInstance,
  Column,
  ContextMenu,
  ExtensionName,
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
  let output = '';
  const count = +(value >= 3 ? 3 : value);
  const color = count === 3 ? 'red' : (count === 2 ? 'orange' : 'yellow');
  const icon = `<i class="fa fa-star ${color}" aria-hidden="true"></i>`;

  for (let i = 1; i <= count; i++) {
    output += icon;
  }
  return output;
};

// create a custom translate Formatter (typically you would move that a separate file, for separation of concerns)
const taskTranslateFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any, grid: any) => {
  const gridOptions = (grid && typeof grid.getOptions === 'function') ? grid.getOptions() : {};
  const i18n = gridOptions.i18n;

  return i18n && i18n.tr && i18n.tr('TASK_X', { x: value });
};

@autoinject()
export class Example24 {
  title = 'Example 24: Cell Menu / Context Menu';
  subTitle = `Add Cell Menu and Context Menu
    <ul>
      <li>This example demonstrates 2 SlickGrid plugins
      <ol>
        <li>Using the <b>Slick.Plugins.CellMenu</b> plugin, often used for an Action Menu.</li>
        <li>Using the <b>Slick.Plugins.ContextMenu</b> plugin, shown after a mouse right+click.</li>
      </ol>
      <li>It will also "autoAdjustDrop" (bottom/top) and "autoAlignSide" (left/right) by default but could be turned off</li>
      <li>There are 2 sections, the first section can have an Options array (change value of a field) and second section can have an array of Commands (execute a command)</li>
      <li>There 2 ways to execute a Command/Option</li>
      <ol>
        <li>via onCommand/onOptionSelected (use a switch/case to parse command/option and do something with it)</li>
        <li>via action callback (must be defined on each command/option)</li>
      </ol>
      <li>Use override callback functions to change show/hide, enable/disable, use/block certain item(s) from the list</li>
      <ol>
        <li>These callbacks are: "menuUsabilityOverride", "itemVisibilityOverride", "itemUsabilityOverride"</li>
        <li>... e.g. in the demo, the "Action" menu is only available when Priority is set to "High" via "menuUsabilityOverride"</li>
      </ol>
    </ul>`;

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

  get cellMenuInstance(): any {
    return this.aureliaGrid && this.aureliaGrid.extensionService.getSlickgridAddonInstance(ExtensionName.cellMenu) || {};
  }

  get contextMenuInstance(): any {
    return this.aureliaGrid && this.aureliaGrid.extensionService.getSlickgridAddonInstance(ExtensionName.contextMenu) || {};
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  attached() {
    // populate the dataset once the grid is ready
    this.dataset = this.getData(1000);
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      { id: 'id', name: '#', field: 'id', maxWidth: 45 },
      {
        id: 'title', name: 'Title', field: 'id', headerKey: 'TITLE', minWidth: 100,
        formatter: taskTranslateFormatter,
        sortable: true, type: FieldType.string
      },
      { id: 'percentComplete', headerKey: 'PERCENT_COMPLETE', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, sortable: true, minWidth: 100 },
      { id: 'start', headerKey: 'START', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true },
      { id: 'finish', headerKey: 'FINISH', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true },
      { id: 'priority', headerKey: 'PRIORITY', field: 'priority', formatter: priorityFormatter },
      { id: 'completed', headerKey: 'COMPLETED', field: 'completed', formatter: Formatters.checkmark },
      {
        id: 'action', name: 'Action', field: 'action', width: 110, maxWidth: 200,
        formatter: actionFormatter,
        cellMenu: {
          width: 200,
          // you can override the logic of when the menu is usable
          // for example say that we want to show a menu only when then Priority is set to 'High'.
          // Note that this ONLY overrides the usability itself NOT the text displayed in the cell,
          // if you wish to change the cell text (or hide it)
          // then you SHOULD use it in combination with a custom formatter (actionFormatter) and use the same logic in that formatter
          menuUsabilityOverride: (row, dataContext, grid) => {
            return (dataContext.priority === 3); // option 3 is High
          },

          // when using Translate Service, every translation will have the suffix "Key"
          // else use title without the suffix, for example "commandTitle" (no translations) or "commandTitleKey" (with translations)
          commandTitleKey: 'COMMANDS',
          commandItems: [
            { command: 'command1', title: 'Command 1', cssClass: 'orange' },
            {
              command: 'command2', title: 'Command 2',
              // you can use the "action" callback and/or use "onCallback" callback from the grid options, they both have the same arguments
              action: (e, args) => {
                console.log(args.dataContext, args.columnDef);
                // action callback.. do something
              },
              // only enable command when the task is not completed
              itemUsabilityOverride: (row, dataContext, grid) => {
                return !dataContext.completed;
              }
            },
            {
              command: 'delete-row', titleKey: 'DELETE_ROW',
              iconCssClass: 'fa fa-times', cssClass: 'red', textCssClass: 'bold',
              // only show command to 'Delete Row' when the task is not completed
              itemVisibilityOverride: (row, dataContext, grid) => {
                return !dataContext.completed;
              }
            },
            // you can pass divider as a string or an object with a boolean
            'divider',
            // { divider: true, command: '' },

            {
              command: 'help',
              titleKey: 'HELP', // use "title" without translation and "titleKey" with TranslateService
              iconCssClass: 'fa fa-question-circle'
            },
            { command: 'something', titleKey: 'DISABLED_COMMAND', disabled: true }
          ],
          optionTitleKey: 'CHANGE_COMPLETED_FLAG',
          optionItems: [
            { option: true, titleKey: 'TRUE', iconCssClass: 'fa fa-check-square-o' },
            { option: false, titleKey: 'FALSE', iconCssClass: 'fa fa-square-o' },
            {
              option: null, title: 'null', cssClass: 'italic',
              // you can use the "action" callback and/or use "onCallback" callback from the grid options, they both have the same arguments
              action: (e, args) => {
                // action callback.. do something
              },
              // only enable Action menu when the Priority is set to High
              itemUsabilityOverride: (row, dataContext, grid) => {
                return (dataContext.priority === 3);
              },
              // only show command to 'Delete Row' when the task is not completed
              itemVisibilityOverride: (row, dataContext, grid) => {
                return !dataContext.completed;
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
      i18n: this.i18n,

      enableContextMenu: true,
      enableCellMenu: true,

      // when using the cellMenu, you can change some of the default options and all use some of the callback methods
      cellMenu: {
        // all the Cell Menu callback methods (except the action callback)
        // are available under the grid options as shown below
        onCommand: (e, args) => this.executeCommand(e, args),
        onOptionSelected: (e, args) => {
          // change "Completed" property with new option selected from the Cell Menu
          const dataContext = args && args.dataContext;
          if (dataContext && dataContext.hasOwnProperty('completed')) {
            dataContext.completed = args.item.option;
            this.aureliaGrid.gridService.updateItem(dataContext);
          }
        },
        onBeforeMenuShow: ((e, args) => {
          // for example, you could select the row that the click originated
          // this.angularGrid.gridService.setSelectedRows([args.row]);
          console.log('Before the Cell Menu is shown', args);
        }),
        onBeforeMenuClose: ((e, args) => console.log('Cell Menu is closing', args)),
      },

      // load Context Menu structure
      contextMenu: this.getContextMenuOptions(),
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

  getData(count: number): any[] {
    // mock a dataset
    const tmpData = [];
    for (let i = 0; i < count; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));

      tmpData[i] = {
        id: i,
        duration: Math.floor(Math.random() * 25) + ' days',
        percentComplete: Math.floor(Math.random() * 100),
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        priority: i % 3 ? 2 : (i % 5 ? 3 : 1),
        completed: (i % 4 === 0),
      };
    }
    return tmpData;
  }

  getContextMenuOptions(): ContextMenu {
    return {
      // optionally and conditionally define when the the menu is usable,
      // this should be used with a custom formatter to show/hide/disable the menu
      menuUsabilityOverride: (row, dataContext, grid) => {
        return (dataContext.id < 21); // say we want to display the menu only from Task 0 to 20
      },
      commandTitleKey: 'COMMANDS',
      // which column to show the command list? when not defined it will be shown over all columns
      commandShownOverColumnIds: ['id', 'title', 'percentComplete', 'start', 'finish', 'effortDriven' /*, 'priority'*/],
      commandItems: [
        { command: 'copy-text', titleKey: 'COPY', iconCssClass: 'fa fa-clone' },
        { command: 'delete-row', titleKey: 'DELETE_ROW', iconCssClass: 'fa fa-times', cssClass: 'red', textCssClass: 'bold', },
        'divider',
        // { divider: true },
        {
          command: 'help', titleKey: 'HELP', iconCssClass: 'fa fa-question-circle',
          // you can use the 'action' callback and/or subscribe to the 'onCallback' event, they both have the same arguments
          action: (e, args) => {
            // action callback.. do something
          },
          // only show command to 'Help' when there's no Effort Driven
          itemVisibilityOverride: (row, dataContext, grid) => {
            return (!dataContext.effortDriven);
          }
        },
        { command: 'something', title: 'Command (disabled)', disabled: true },
      ],

      // Options allows you to edit a column from an option chose a list
      // for example, changing the Priority value
      // you can also optionally define an array of column ids that you wish to display this option list (when not defined it will show over all columns)
      optionTitleKey: 'CHANGE_PRIORITY',
      optionShownOverColumnIds: ['priority'], // optional, when defined it will only show over the columns (column id) defined in the array
      optionItems: [
        {
          option: 0, title: 'n/a', textCssClass: 'italic',
          // only enable this option when there's no Effort Driven
          itemUsabilityOverride: (row, dataContext, grid) => {
            return (!dataContext.effortDriven);
          },
          // you can use the 'action' callback and/or subscribe to the 'onCallback' event, they both have the same arguments
          action: (e, args) => {
            // action callback.. do something
          },
        },
        { option: 1, iconCssClass: 'fa fa-star-o yellow', titleKey: 'LOW' },
        { option: 2, iconCssClass: 'fa fa-star-half-o orange', titleKey: 'MEDIUM' },
        { option: 3, iconCssClass: 'fa fa-star red', titleKey: 'HIGH' },
        // you can pass divider as a string or an object with a boolean
        // 'divider',
        { divider: true, option: '' },
        {
          option: 4, title: 'Extreme', iconCssClass: 'fa fa-thermometer-full', disabled: true,
          // only shown when there's no Effort Driven
          itemVisibilityOverride: (row, dataContext, grid) => {
            return (!dataContext.effortDriven);
          }
        },
      ],
      // subscribe to Context Menu
      onBeforeMenuShow: ((e, args) => {
        // for example, you could select the row it was clicked with
        // grid.setSelectedRows([args.row]); // select the entire row
        this.aureliaGrid.slickGrid.setActiveCell(args.row, args.cell, false); // select the cell that the click originated
        console.log('Before the global Context Menu is shown', args);
      }),
      onBeforeMenuClose: ((e, args) => console.log('Global Context Menu is closing', args)),

      // subscribe to Context Menu onCommand event (or use the action callback on each command)
      onCommand: ((e, args) => this.executeCommand(e, args)),

      // subscribe to Context Menu onOptionSelected event (or use the action callback on each option)
      onOptionSelected: ((e, args) => {
        // change Priority
        const dataContext = args && args.dataContext;
        if (dataContext && dataContext.hasOwnProperty('priority')) {
          dataContext.priority = args.item.option;
          this.aureliaGrid.slickGrid.updateRow(args.row);
        }
      }),
    };
  }

  showContextCommandsAndOptions(showBothList: boolean) {
    // when showing both Commands/Options, we can just pass an empty array to show over all columns
    // else show on all columns except Priority
    const showOverColumnIds = showBothList ? [] : ['id', 'title', 'complete', 'start', 'finish', 'effortDriven'];
    this.contextMenuInstance.setOptions({
      commandShownOverColumnIds: showOverColumnIds,
      // hideCommandSection: !showBothList
    });
  }

  showCellMenuCommandsAndOptions(showBothList) {
    // change via the plugin setOptions
    this.cellMenuInstance.setOptions({
      hideOptionSection: !showBothList
    });

    // OR find the column, then change the same hide property
    // var actionColumn = columns.find(function (column) { return column.id === 'action' });
    // actionColumn.cellMenu.hideOptionSection = !showBothList;
  }

  switchLanguage() {
    this.selectedLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.setLocale(this.selectedLanguage);
  }
}
