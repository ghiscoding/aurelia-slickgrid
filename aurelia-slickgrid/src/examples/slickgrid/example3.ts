import { autoinject } from 'aurelia-framework';
import { HttpClient as FetchClient } from 'aurelia-fetch-client';
import { HttpClient } from 'aurelia-http-client';
import { I18N } from 'aurelia-i18n';
import {
  AureliaGridInstance,
  Column,
  EditorValidator,
  Editors,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  OnEventArgs,
  OperatorType
} from '../../aurelia-slickgrid';
import { CustomInputEditor } from './custom-inputEditor';

// using external non-typed js libraries
declare var Slick: any;

const NB_ITEMS = 100;
const URL_SAMPLE_COLLECTION_DATA = 'src/examples/slickgrid/sample-data/collection_100_numbers.json';

// you can create custom validator to pass to an inline editor
const myCustomTitleValidator: EditorValidator = (value) => {
  if (value == null || value === undefined || !value.length) {
    return { valid: false, msg: 'This is a required field' };
  } else if (!/^Task\s\d+$/.test(value)) {
    return { valid: false, msg: 'Your title is invalid, it must start with "Task" followed by a number' };
  } else {
    return { valid: true, msg: '' };
  }
};

@autoinject()
export class Example3 {
  title = 'Example 3: Editors / Delete';
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
    <li>Support of "collectionAsync" is possible, click on "Clear Filters/Sorting" then add/delete item(s) and look at "Prerequisites" Select Filter</li>
  </ul>
  `;
  private _commandQueue = [];
  aureliaGrid: AureliaGridInstance;
  gridObj: any;
  gridOptions: GridOption;
  columnDefinitions: Column[];
  dataset: any[];
  updatedObject: any;
  isAutoEdit: boolean = true;
  alertWarning: any;
  selectedLanguage: string;

  constructor(private http: HttpClient, private httpFetch: FetchClient, private i18n: I18N) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.selectedLanguage = this.i18n.getLocale();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.mockData(NB_ITEMS);
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
    this.gridObj = aureliaGrid && aureliaGrid.slickGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [{
      id: 'edit',
      field: 'id',
      excludeFromHeaderMenu: true,
      formatter: Formatters.editIcon,
      minWidth: 30,
      maxWidth: 30,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      onCellClick: (e: Event, args: OnEventArgs) => {
        console.log(args);
        this.alertWarning = `Editing: ${args.dataContext.title}`;
        this.aureliaGrid.gridService.highlightRow(args.row, 1500);
        this.aureliaGrid.gridService.setSelectedRow(args.row);
      }
    }, {
      id: 'delete',
      field: 'id',
      excludeFromHeaderMenu: true,
      formatter: Formatters.deleteIcon,
      minWidth: 30,
      maxWidth: 30,
      // use onCellClick OR grid.onClick.subscribe which you can see down below
      /*
      onCellClick: (e: Event, args: OnEventArgs) => {
        console.log(args);
        this.alertWarning = `Deleting: ${args.dataContext.title}`;
      }
      */
    }, {
      id: 'title',
      name: 'Title',
      field: 'title',
      filterable: true,
      sortable: true,
      type: FieldType.string,
      editor: {
        model: Editors.longText,
        validator: myCustomTitleValidator, // use a custom validator
      },
      minWidth: 100,
      onCellChange: (e: Event, args: OnEventArgs) => {
        console.log(args);
        this.alertWarning = `Updated Title: ${args.dataContext.title}`;
      }
    }, {
      id: 'title2',
      name: 'Title, Custom Editor',
      field: 'title',
      filterable: true,
      sortable: true,
      type: FieldType.string,
      editor: {
        model: CustomInputEditor,
        validator: myCustomTitleValidator, // use a custom validator
      },
      minWidth: 70
    }, {
      id: 'duration',
      name: 'Duration (days)',
      field: 'duration',
      filterable: true,
      sortable: true,
      type: FieldType.number,
      filter: { model: Filters.slider, params: { hideSliderNumber: false } },
      editor: {
        model: Editors.slider,
        minValue: 0,
        maxValue: 100,
        // params: { hideSliderNumber: true },
      },
      /*
      editor: {
        // default is 0 decimals, if no decimals is passed it will accept 0 or more decimals
        // however if you pass the "decimalPlaces", it will validate with that maximum
        model: Editors.float,
        minValue: 0,
        maxValue: 365,
        // the default validation error message is in English but you can override it by using "errorMessage"
        // errorMessage: this.i18n.tr('INVALID_FLOAT', { maxDecimal: 2 }),
        params: { decimalPlaces: 2 },
      },
      */
      minWidth: 100
    }, {
      id: 'complete',
      name: '% Complete',
      field: 'percentComplete',
      filterable: true,
      formatter: Formatters.multiple,
      type: FieldType.number,
      editor: {
        model: Editors.singleSelect,

        // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
        enableRenderHtml: true,
        collection: Array.from(Array(101).keys()).map(k => ({ value: k, label: k, symbol: '<i class="fa fa-percent" style="color:cadetblue"></i>' })),
        customStructure: {
          value: 'value',
          label: 'label',
          labelSuffix: 'symbol',
          addSpaceBetweenLabels: false
        },
        // collection: Array.from(Array(101).keys()).map(k => ({ value: k, label: k, symbol: '%' })),
        collectionSortBy: {
          property: 'label',
          sortDesc: true
        },
        collectionFilterBy: {
          property: 'value',
          value: 0,
          operator: OperatorType.notEqual
        }
      },
      minWidth: 100,
      params: {
        formatters: [Formatters.collectionEditor, Formatters.percentCompleteBar],
      }
    }, {
      id: 'start',
      name: 'Start',
      field: 'start',
      filterable: true,
      filter: { model: Filters.compoundDate },
      formatter: Formatters.dateIso,
      sortable: true,
      minWidth: 100,
      type: FieldType.date,
      editor: {
        model: Editors.date
      },
    }, {
      id: 'finish',
      name: 'Finish',
      field: 'finish',
      filterable: true,
      filter: { model: Filters.compoundDate },
      formatter: Formatters.dateIso,
      sortable: true,
      minWidth: 100,
      type: FieldType.date,
      editor: {
        model: Editors.date
      },
    }, {
      id: 'effort-driven',
      name: 'Effort Driven',
      field: 'effortDriven',
      filterable: true,
      type: FieldType.boolean,
      filter: {
        model: Filters.singleSelect,
        collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
      },
      formatter: Formatters.checkmark,
      editor: {
        model: Editors.checkbox,
      },
      minWidth: 70
    }, {
      id: 'prerequisites',
      name: 'Prerequisites',
      field: 'prerequisites',
      filterable: true,
      minWidth: 100,
      sortable: true,
      type: FieldType.string,
      editor: {
        model: Editors.multipleSelect,
        // We can load the "collection" asynchronously (on first load only, after that we will simply use "collection")
        // 3 ways are supported (aurelia-http-client, aurelia-fetch-client OR even Promise)

        // 1- USE HttpClient from "aurelia-http-client" to load collection asynchronously
        // collectionAsync: this.http.createRequest(URL_SAMPLE_COLLECTION_DATA).asGet().send(),

        // OR 2- use "aurelia-fetch-client", they are both supported
        // collectionAsync: this.httpFetch.fetch(URL_SAMPLE_COLLECTION_DATA),

        // OR 3- use a Promise
        collectionAsync: new Promise<any>((resolve) => {
          // simulate async server load
          setTimeout(() => {
            resolve(Array.from(Array(NB_ITEMS).keys()).map(k => ({ value: k, label: k, prefix: 'Task', suffix: 'days' })));
          }, 500);
        }),

        // OR a regular "collection" load
        // collection: Array.from(Array(12).keys()).map(k => ({ value: `Task ${k}`, label: `Task ${k}` })),
        collectionSortBy: {
          property: 'label',
          sortDesc: true
        },
        customStructure: {
          label: 'label',
          value: 'value',
          labelPrefix: 'prefix',
          addSpaceBetweenLabels: true,
          includePrefixSuffixToSelectedValues: true
        }
      },
      filter: {
        model: Filters.multipleSelect,
        filterOptions: {
          autoDropWidth: true
        },
        operator: OperatorType.inContains,
        collection: Array.from(Array(12).keys()).map(k => ({ value: `Task ${k}`, label: `Task ${k}` })),
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
      enableFiltering: true,
      editCommandHandler: (item, column, editCommand) => {
        this._commandQueue.push(editCommand);
        editCommand.execute();
      },
      i18n: this.i18n,
    };
  }

  /** Add a new row to the grid and refresh the Filter collection */
  addItem() {
    const lastRowIndex = this.dataset.length;
    const newRows = this.mockData(1, lastRowIndex);

    // wrap into a timer to simulate a backend async call
    setTimeout(() => {
      // at any time, we can poke the "collection" property and modify it
      const durationColumnDef = this.columnDefinitions.find((column: Column) => column.id === 'duration');
      if (durationColumnDef) {
        const collection = durationColumnDef.filter.collection;
        if (Array.isArray(collection)) {
          // add the new row to the grid
          this.aureliaGrid.gridService.addItemToDatagrid(newRows[0]);

          // then refresh the Filter "collection", we have 2 ways of doing it

          // 1- push to the "collection"
          collection.push({ value: lastRowIndex, label: lastRowIndex });

          // OR 2- replace the entire "collection" is also supported
          // durationColumnDef.filter.collection = [...collection, ...[{ value: lastRowIndex, label: lastRowIndex }]];
        }
      }
    }, 250);
  }

  /** Delete last inserted row */
  deleteItem() {
    const durationColumnDef = this.columnDefinitions.find((column: Column) => column.id === 'duration');
    if (durationColumnDef) {
      const collection = durationColumnDef.filter.collection;
      if (Array.isArray(collection)) {
        const selectCollectionObj = collection.pop();
        this.aureliaGrid.gridService.deleteDataGridItemById(selectCollectionObj.value);
      }
    }
  }

  mockData(itemCount, startingIndex = 0) {
    // mock a dataset
    const tempDataset = [];
    for (let i = startingIndex; i < (startingIndex + itemCount); i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      tempDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0),
        prerequisites: (i % 2 === 0) && i !== 0 && i < 12 ? [`Task ${i}`, `Task ${i - 1}`] : []
      };
    }
    this.dataset = tempDataset;
  }

  onCellChanged(e, args) {
    console.log('onCellChange', args);
    this.updatedObject = { ...args.item };
  }

  onCellClicked(e, args) {
    const metadata = this.aureliaGrid.gridService.getColumnFromEventArguments(args);
    console.log(metadata);

    if (metadata.columnDef.id === 'edit') {
      this.alertWarning = `open a modal window to edit: ${metadata.dataContext.title}`;

      // highlight the row, to customize the color, you can change the SASS variable $row-highlight-background-color
      this.aureliaGrid.gridService.highlightRow(args.row, 1500);

      // you could also select the row, when using "enableCellNavigation: true", it automatically selects the row
      // this.aureliaGrid.gridService.setSelectedRow(args.row);
    } else if (metadata.columnDef.id === 'delete') {
      if (confirm('Are you sure?')) {
        this.aureliaGrid.gridService.deleteDataGridItemById(metadata.dataContext.id);
        this.alertWarning = `Deleted: ${metadata.dataContext.title}`;
      }
    }
  }

  onCellValidation(e, args) {
    alert(args.validationResults.msg);
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
