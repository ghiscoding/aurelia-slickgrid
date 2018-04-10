import {
  I18N
} from 'aurelia-i18n';
import {
  autoinject,
  bindable
} from 'aurelia-framework';
import {
  Column,
  Editors,
  FieldType,
  Formatters,
  GridExtraService,
  GridExtraUtils,
  GridOption,
  OnEventArgs,
  ResizerService
} from '../../aurelia-slickgrid';

// using external non-typed js libraries
declare var Slick: any;

@autoinject()
export class Example3 {
  @bindable() gridObj: any;
  @bindable() dataview: any;
  title = 'Example 3: Editors';
  subTitle = `
  Grid with Inline Editors and onCellClick actions (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Editors" target="_blank">Wiki docs</a>).
  <ul>
    <li>When using "enableCellNavigation: true", clicking on a cell will automatically make it active &amp; selected.</li>
    <ul><li>If you don't want this behavior, then you should disable "enableCellNavigation"</li></ul>
    <li>Inline Editors requires "enableCellNavigation: true" (not sure why though)</li>
    <li>
        Support Excel Copy Buffer (SlickGrid Copy Manager Plugin), you can use it by simply enabling "enableExcelCopyBuffer" flag.
        Note that it will only evaluate Formatter when the "exportWithFormatter" flag is enabled (through "ExportOptions" or the column definition)
    </li>
  </ul>
  `;
  private _commandQueue = [];
  gridOptions: GridOption;
  columnDefinitions: Column[];
  dataset: any[];
  updatedObject: any;
  isAutoEdit: boolean = true;
  alertWarning: any;
  selectedLanguage: string;

  constructor(private gridExtraService: GridExtraService, private i18n: I18N, private resizer: ResizerService) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.selectedLanguage = this.i18n.getLocale();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  detached() {
    // unsubscrible any Slick.Event you might have used
    // a reminder again, these are SlickGrid Event, not Event Aggregator events
    this.gridObj.onCellChange.unsubscribe();
    this.gridObj.onClick.unsubscribe();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [{
      id: 'edit',
      field: 'id',
      formatter: Formatters.editIcon,
      minWidth: 30,
      maxWidth: 30,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      onCellClick: (args: OnEventArgs) => {
        console.log(args);
        this.alertWarning = `Editing: ${args.dataContext.title}`;
        this.gridExtraService.highlightRow(args.row, 1500);
        this.gridExtraService.setSelectedRow(args.row);
      }
    }, {
      id: 'delete',
      field: 'id',
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      /*
      onCellClick: (args: OnEventArgs) => {
        console.log(args);
        this.alertWarning = `Deleting: ${args.dataContext.title}`;
      }
      */
    }, {
      id: 'title',
      name: 'Title',
      field: 'title',
      sortable: true,
      type: FieldType.string,
      editor: Editors.longText,
      minWidth: 100
    }, {
      id: 'duration',
      name: 'Duration (days)',
      field: 'duration',
      sortable: true,
      type: FieldType.number,
      editor: Editors.text,
      minWidth: 100
    }, {
      id: 'complete',
      name: '% Complete',
      field: 'percentComplete',
      formatter: Formatters.multiple,
      type: FieldType.number,
      editor: Editors.singleSelect,
      minWidth: 100,
      params: {
        formatters: [Formatters.collection, Formatters.percentCompleteBar],
        collection: Array.from(Array(101).keys()).map(k => ({ value: k, label: k })),
        collectionSortBy: {
          property: 'label',
          sortDesc: true
        },
      }
    }, {
      id: 'start',
      name: 'Start',
      field: 'start',
      formatter: Formatters.dateIso,
      sortable: true,
      minWidth: 100,
      type: FieldType.date,
      editor: Editors.date
    }, {
      id: 'finish',
      name: 'Finish',
      field: 'finish',
      formatter: Formatters.dateIso,
      sortable: true,
      minWidth: 100,
      type: FieldType.date,
      editor: Editors.date
    }, {
      id: 'effort-driven',
      name: 'Effort Driven',
      field: 'effortDriven',
      formatter: Formatters.checkmark,
      type: FieldType.number,
      editor: Editors.checkbox,
      minWidth: 70
    }, {
      id: 'prerequisites',
      name: 'Prerequisites',
      field: 'prerequisites',
      minWidth: 100,
      sortable: true,
      type: FieldType.string,
      editor: Editors.multipleSelect,
      params: {
        collection: Array.from(Array(10).keys()).map(k => ({ value: `Task ${k}`, label: `Task ${k}` })),
        collectionSortBy: {
          property: 'label',
          sortDesc: true
        },
        collectionFilterBy: {
          property: 'label',
          value: 'Task 2'
        }
      }
    }];

    this.gridOptions = {
      asyncEditorLoading: false,
      autoEdit: this.isAutoEdit,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      editable: true,
      enableCellNavigation: true,
      enableExcelCopyBuffer: true,
      editCommandHandler: (item, column, editCommand) => {
        this._commandQueue.push(editCommand);
        editCommand.execute();
      },
      params: {
        i18n: this.i18n
      }
    };
  }

  dataviewChanged(dataview) {
    this.dataview = dataview;
  }

  getData() {
    // mock a dataset
    const mockedDataset = [];
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockedDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0),
        prerequisites: (i % 5 === 0) && i > 0 ? [`Task ${i}`, `Task ${i - 1}`] : []
      };
    }
    this.dataset = mockedDataset;
  }

  gridObjChanged(grid) {
    grid.onBeforeEditCell.subscribe((e, args) => {
      console.log('before edit', e);
      e.stopImmediatePropagation();
    });
    grid.onBeforeCellEditorDestroy.subscribe((e, args) => {
      console.log('before destroy');
      e.stopPropagation();
    });

    grid.onCellChange.subscribe((e, args) => {
      console.log('onCellChange', args);
      this.updatedObject = args.item;
      this.resizer.resizeGrid(100);
    });

    // You could also subscribe to grid.onClick
    // Note that if you had already setup "onCellClick" in the column definition, you cannot use grid.onClick
    grid.onClick.subscribe((e, args) => {
      const column = GridExtraUtils.getColumnDefinitionAndData(args);
      console.log('onClick', args, column);
      if (column.columnDef.id === 'edit') {
        this.alertWarning = `open a modal window to edit: ${column.dataContext.title}`;

        // highlight the row, to customize the color, you can change the SASS variable $row-highlight-background-color
        this.gridExtraService.highlightRow(args.row, 1500);

        // you could also select the row, when using "enableCellNavigation: true", it automatically selects the row
        // this.gridExtraService.setSelectedRow(args.row);
      }
      if (column.columnDef.id === 'delete') {
        if (confirm('Are you sure?')) {
          this.dataview.deleteItem(column.dataContext.id);
          this.dataview.refresh();
        }
      }
    });
  }

  setAutoEdit(isAutoEdit) {
    this.isAutoEdit = isAutoEdit;
    this.gridObj.setOptions({
      autoEdit: isAutoEdit
    });
    return true;
  }

  switchLanguage() {
    this.selectedLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.setLocale(this.selectedLanguage);
  }

  undo() {
    const command = this._commandQueue.pop();
    if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
      command.undo();
      this.gridObj.gotoCell(command.row, command.cell, false);
    }
  }
}
