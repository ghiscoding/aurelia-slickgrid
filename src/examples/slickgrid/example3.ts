import { autoinject } from 'aurelia-framework';
import { HttpClient as FetchClient } from 'aurelia-fetch-client';
import { HttpClient } from 'aurelia-http-client';
import { I18N } from 'aurelia-i18n';
import {
  AureliaGridInstance,
  AutocompleteOption,
  Column,
  Editors,
  EditorArgs,
  EditorValidator,
  FieldType,
  Filters,
  FlatpickrOption,
  Formatters,
  GridOption,
  OnEventArgs,
  OperatorType,
  Sorters,
  SlickGrid,
} from '../../aurelia-slickgrid';
import { CustomInputEditor } from './custom-inputEditor';
import { CustomInputFilter } from './custom-inputFilter';
import * as $ from 'jquery';

// using external non-typed js libraries
declare const Slick: any;

const NB_ITEMS = 100;
const URL_SAMPLE_COLLECTION_DATA = 'assets/data/collection_100_numbers.json';
const URL_COUNTRIES_COLLECTION = 'assets/data/countries.json';
const URL_COUNTRY_NAMES = 'assets/data/country_names.json';

// you can create custom validator to pass to an inline editor
const myCustomTitleValidator: EditorValidator = (value: any, args: EditorArgs) => {
  // you can get the Editor Args which can be helpful, e.g. we can get the Translate Service from it
  const grid = args && args.grid;
  const gridOptions = (grid && grid.getOptions) ? grid.getOptions() : {};
  const i18n = gridOptions.i18n;

  // to get the editor object, you'll need to use "internalColumnEditor"
  // don't use "editor" property since that one is what SlickGrid uses internally by it's editor factory
  const columnEditor = args && args.column && args.column.internalColumnEditor;

  if (value === null || value === undefined || !value.length) {
    return { valid: false, msg: 'This is a required field' };
  } else if (!/^Task\s\d+$/.test(value)) {
    return { valid: false, msg: 'Your title is invalid, it must start with "Task" followed by a number' };
    // OR use the Translate Service with your custom message
    // return { valid: false, msg: i18n.tr('YOUR_ERROR', { x: value }) };
  }
  return { valid: true, msg: '' };
};

// create a custom Formatter to show the Task + value
const taskFormatter = (row, cell, value, columnDef, dataContext) => {
  if (value && Array.isArray(value)) {
    const taskValues = value.map((val) => `Task ${val}`);
    const values = taskValues.join(', ');
    return `<span title="${values}">${values}</span>`;
  }
  return '';
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
  gridObj: SlickGrid;
  gridOptions: GridOption;
  columnDefinitions: Column[];
  dataset: any[];
  updatedObject: any;
  isAutoEdit: boolean = true;
  alertWarning: any;
  selectedLanguage: string;
  duplicateTitleHeaderCount = 1;

  constructor(private http: HttpClient, private httpFetch: FetchClient, private i18n: I18N) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.selectedLanguage = this.i18n.getLocale();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.dataset = this.mockData(NB_ITEMS);
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
    this.gridObj = aureliaGrid && aureliaGrid.slickGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'edit',
        field: 'id',
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
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
        excludeFromColumnPicker: true,
        excludeFromGridMenu: true,
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
          placeholder: 'something',
          title: 'some title',
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
          placeholder: 'custom',
          validator: myCustomTitleValidator, // use a custom validator
        },
        filter: {
          model: CustomInputFilter,
          placeholder: '&#128269; custom',
        },
        minWidth: 70
      }, {
        id: 'duration',
        name: 'Duration (days)',
        field: 'duration',
        filterable: true,
        minWidth: 100,
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
      }, {
        id: 'complete',
        name: '% Complete',
        field: 'percentComplete',
        filterable: true,
        formatter: Formatters.multiple,
        type: FieldType.number,
        editor: {
          // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
          enableRenderHtml: true,
          collection: Array.from(Array(101).keys()).map(k => ({ value: k, label: k, symbol: '<i class="fa fa-percent" style="color:cadetblue"></i>' })),
          customStructure: {
            value: 'value',
            label: 'label',
            labelSuffix: 'symbol'
          },
          collectionSortBy: {
            property: 'label',
            sortDesc: true
          },
          collectionFilterBy: {
            property: 'value',
            value: 0,
            operator: OperatorType.notEqual
          },
          model: Editors.singleSelect,
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
          model: Editors.date,
          // override any of the Flatpickr options through "filterOptions"
          // please note that there's no TSlint on this property since it's generic for any filter, so make sure you entered the correct filter option(s)
          editorOptions: { minDate: 'today' } as FlatpickrOption
        },
      }, {
        id: 'cityOfOrigin', name: 'City of Origin', field: 'cityOfOrigin',
        filterable: true,
        sortable: true,
        minWidth: 100,
        editor: {
          model: Editors.autoComplete,
          placeholder: '&#128269; search city',

          // We can use the autocomplete through 3 ways "collection", "collectionAsync" or with your own autocomplete options
          // use your own autocomplete options, instead of $.ajax, use Aurelia HttpClient or FetchClient
          // here we use $.ajax just because I'm not sure how to configure Aurelia HttpClient with JSONP and CORS
          editorOptions: {
            minLength: 3,
            forceUserInput: true,
            source: (request, response) => {
              $.ajax({
                url: 'http://gd.geobytes.com/AutoCompleteCity',
                dataType: 'jsonp',
                data: {
                  q: request.term
                },
                success: (data) => {
                  response(data);
                }
              });
            }
          } as AutocompleteOption,
        },
        filter: {
          model: Filters.autoComplete,
          // placeholder: '&#128269; search city',

          // We can use the autocomplete through 3 ways "collection", "collectionAsync" or with your own autocomplete options
          // collectionAsync: this.httpFetch.fetch(URL_COUNTRIES_COLLECTION),

          // OR use your own autocomplete options, instead of $.ajax, use Aurelia HttpClient or FetchClient
          // here we use $.ajax just because I'm not sure how to configure Aurelia HttpClient with JSONP and CORS
          filterOptions: {
            minLength: 3,
            source: (request, response) => {
              $.ajax({
                url: 'http://gd.geobytes.com/AutoCompleteCity',
                dataType: 'jsonp',
                data: {
                  q: request.term
                },
                success: (data) => {
                  response(data);
                }
              });
            }
          } as AutocompleteOption,
        }
      }, {
        id: 'countryOfOrigin', name: 'Country of Origin', field: 'countryOfOrigin',
        formatter: Formatters.complexObject,
        dataKey: 'code',
        labelKey: 'name',
        type: FieldType.object,
        sorter: Sorters.objectString,
        filterable: true,
        sortable: true,
        minWidth: 100,
        editor: {
          model: Editors.autoComplete,
          customStructure: { label: 'name', value: 'code' },
          collectionAsync: this.httpFetch.fetch(URL_COUNTRIES_COLLECTION),
        },
        filter: {
          model: Filters.autoComplete,
          customStructure: { label: 'name', value: 'code' },
          collectionAsync: this.httpFetch.fetch(URL_COUNTRIES_COLLECTION),
        }
      }, {
        id: 'countryOfOriginName', name: 'Country of Origin Name', field: 'countryOfOriginName',
        filterable: true,
        sortable: true,
        minWidth: 100,
        editor: {
          model: Editors.autoComplete,
          collectionAsync: this.httpFetch.fetch(URL_COUNTRY_NAMES),
        },
        filter: {
          model: Filters.autoComplete,
          collectionAsync: this.httpFetch.fetch(URL_COUNTRY_NAMES),
        }
      }, {
        id: 'effort-driven',
        name: 'Effort Driven',
        field: 'effortDriven',
        filterable: true,
        type: FieldType.boolean,
        filter: {
          model: Filters.singleSelect,
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }]
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
        formatter: taskFormatter,
        exportWithFormatter: true,
        sanitizeDataExport: true,
        minWidth: 100,
        sortable: true,
        type: FieldType.string,
        editor: {
          // We can load the "collection" asynchronously (on first load only, after that we will simply use "collection")
          // 3 ways are supported (aurelia-http-client, aurelia-fetch-client OR even Promise)

          // 1- USE HttpClient from "aurelia-http-client" to load collection asynchronously
          // collectionAsync: this.http.createRequest(URL_SAMPLE_COLLECTION_DATA).asGet().send(),

          // OR 2- use "aurelia-fetch-client", they are both supported
          collectionAsync: this.httpFetch.fetch(URL_SAMPLE_COLLECTION_DATA),

          // OR 3- use a Promise
          // collectionAsync: new Promise<any>((resolve) => {
          //   setTimeout(() => {
          //     resolve(Array.from(Array(NB_ITEMS).keys()).map(k => ({ value: k, label: k, prefix: 'Task', suffix: 'days' })));
          //   }, 500);
          // }),

          // OR a regular "collection" load
          // collection: Array.from(Array(NB_ITEMS).keys()).map(k => ({ value: k, label: k, prefix: 'Task', suffix: 'days' })),
          collectionSortBy: {
            property: 'value',
            sortDesc: true,
            fieldType: FieldType.number
          },
          customStructure: {
            label: 'label',
            value: 'value',
            labelPrefix: 'prefix',
          },
          collectionOptions: {
            separatorBetweenTextLabels: ' '
          },
          model: Editors.multipleSelect,
        },
        filter: {
          collectionAsync: this.httpFetch.fetch(URL_SAMPLE_COLLECTION_DATA),
          // OR a regular collection load
          // collection: Array.from(Array(NB_ITEMS).keys()).map(k => ({ value: k, label: k, prefix: 'Task', suffix: 'days' })),
          collectionSortBy: {
            property: 'value',
            sortDesc: true,
            fieldType: FieldType.number
          },
          customStructure: {
            label: 'label',
            value: 'value',
            labelPrefix: 'prefix',
          },
          collectionOptions: {
            separatorBetweenTextLabels: ''
          },
          model: Filters.multipleSelect,
          operator: OperatorType.inContains,
        },
      }
    ];

    this.gridOptions = {
      autoEdit: this.isAutoEdit,
      autoCommitEdit: false,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 10
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
      const requisiteColumnDef = this.columnDefinitions.find((column: Column) => column.id === 'prerequisites');
      if (requisiteColumnDef) {
        const collectionEditor = requisiteColumnDef.editor.collection;
        const collectionFilter = requisiteColumnDef.filter.collection;

        if (Array.isArray(collectionEditor) && Array.isArray(collectionFilter)) {
          // add the new row to the grid
          this.aureliaGrid.gridService.addItemToDatagrid(newRows[0]);

          // then refresh the Editor/Filter "collection", we have 2 ways of doing it

          // 1- push to the "collection"
          collectionEditor.push({ value: lastRowIndex, label: lastRowIndex, prefix: 'Task', suffix: 'days' });
          collectionFilter.push({ value: lastRowIndex, label: lastRowIndex, prefix: 'Task', suffix: 'days' });

          // OR 2- replace the entire "collection" is also supported
          // requisiteColumnDef.filter.collection = [...collection, ...[{ value: lastRowIndex, label: lastRowIndex }]];
          // requisiteColumnDef.editor.collection = [...collection, ...[{ value: lastRowIndex, label: lastRowIndex }]];
        }
      }
    }, 250);
  }

  /** Delete last inserted row */
  deleteItem() {
    const requisiteColumnDef = this.columnDefinitions.find((column: Column) => column.id === 'prerequisites');
    if (requisiteColumnDef) {
      const collectionEditor = requisiteColumnDef.editor.collection;
      const collectionFilter = requisiteColumnDef.filter.collection;

      if (Array.isArray(collectionEditor) && Array.isArray(collectionFilter)) {
        // sort collection in descending order and take out last option from the collection
        const selectCollectionObj = this.sortCollectionDescending(collectionEditor).pop();
        this.sortCollectionDescending(collectionFilter).pop();
        this.aureliaGrid.gridService.deleteDataGridItemById(selectCollectionObj.value);
      }
    }
  }

  sortCollectionDescending(collection) {
    return collection.sort((item1, item2) => item1.value - item2.value);
  }

  mockData(itemCount, startingIndex = 0) {
    // mock a dataset
    const tempDataset = [];
    for (let i = startingIndex; i < (startingIndex + itemCount); i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomFinishYear = (new Date().getFullYear() - 3) + Math.floor(Math.random() * 10); // use only years not lower than 3 years ago
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);
      const randomFinish = new Date(randomFinishYear, (randomMonth + 1), randomDay);

      tempDataset.push({
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: randomFinish < new Date() ? '' : randomFinish, // make sure the random date is earlier than today
        effortDriven: (i % 5 === 0),
        prerequisites: (i % 2 === 0) && i !== 0 && i < 12 ? [i, i - 1] : [],
        countryOfOrigin: (i % 2) ? { code: 'CA', name: 'Canada' } : { code: 'US', name: 'United States' },
        countryOfOriginName: (i % 2) ? 'Canada' : 'United States',
        cityOfOrigin: (i % 2) ? 'Vancouver, BC, Canada' : 'Boston, MA, United States',
      });
    }
    return tempDataset;
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

  onCellValidationError(e, args) {
    alert(args.validationResults.msg);
  }

  changeAutoCommit() {
    this.gridOptions.autoCommitEdit = !this.gridOptions.autoCommitEdit;
    this.gridObj.setOptions({
      autoCommitEdit: this.gridOptions.autoCommitEdit
    });
    return true;
  }

  dynamicallyAddTitleHeader() {
    const newCol = {
      id: `title${this.duplicateTitleHeaderCount++}`,
      name: 'Title',
      field: 'title',
      editor: {
        model: Editors.text,
        required: true,
        validator: myCustomTitleValidator, // use a custom validator
      },
      sortable: true, minWidth: 100, filterable: true, params: { useFormatterOuputToFilter: true }
    };

    // you can dynamically add your column to your column definitions
    // and then use the spread operator [...cols] OR slice to force Aurelia to review the changes
    this.columnDefinitions.push(newCol);
    this.columnDefinitions = this.columnDefinitions.slice(); // or use spread operator [...cols]

    // NOTE if you use an Extensions (Checkbox Selector, Row Detail, ...) that modifies the column definitions in any way
    // you MUST use "getAllColumnDefinitions()" from the GridService, using this will be ALL columns including the 1st column that is created internally
    // for example if you use the Checkbox Selector (row selection), you MUST use the code below
    /*
    const allColumns = this.aureliaGrid.gridService.getAllColumnDefinitions();
    allColumns.push(newCol);
    this.columnDefinitions = [...allColumns]; // (or use slice) reassign to column definitions for Aurelia to do dirty checking
    */
  }

  dynamicallyRemoveLastColumn() {
    this.columnDefinitions.pop();
    this.columnDefinitions = this.columnDefinitions.slice();

    // NOTE if you use an Extensions (Checkbox Selector, Row Detail, ...) that modifies the column definitions in any way
    // you MUST use the code below, first you must reassign the Editor facade (from the internalColumnEditor back to the editor)
    // in other words, SlickGrid is not using the same as Aurelia-Slickgrid uses (editor with a "model" and other properties are a facade, SlickGrid only uses what is inside the model)
    /*
    const allColumns = this.aureliaGrid.gridService.getAllColumnDefinitions();
    const allOriginalColumns = allColumns.map((column) => {
      column.editor = column.internalColumnEditor;
      return column;
    });
    // remove your column the full set of columns
    // and use slice or spread [...] to trigger an Aurelia dirty change
    allOriginalColumns.pop();
    this.columnDefinitions = allOriginalColumns.slice();
    */
  }

  setAutoEdit(isAutoEdit) {
    this.isAutoEdit = isAutoEdit;
    this.gridObj.setOptions({
      autoEdit: isAutoEdit
    });
    return true;
  }

  async switchLanguage() {
    const nextLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    await this.i18n.setLocale(nextLanguage);
    this.selectedLanguage = nextLanguage;
  }

  undo() {
    const command = this._commandQueue.pop();
    if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
      command.undo();
      this.gridObj.gotoCell(command.row, command.cell, false);
    }
  }
}
