import { autoinject, bindable, PLATFORM } from 'aurelia-framework';
import { Subscription } from 'aurelia-event-aggregator';
import {
  AureliaGridInstance,
  Column,
  ExtensionList,
  FieldType,
  Filters,
  Formatters,
  GridOption,
} from '../../aurelia-slickgrid';

@autoinject()
export class Example19 {
  @bindable detailViewRowCount = 9;
  title = 'Example 19: Row Detail View';
  subTitle = `
    Add functionality to show extra information with a Row Detail View, (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Row-Detail" target="_blank">Wiki docs</a>)
    <ul>
      <li>Click on the row "+" icon or anywhere on the row to open it (the latter can be changed via property "useRowClick: false")</li>
      <li>Pass a View/Model as a Template to the Row Detail</li>
      <li>You can use "expandableOverride()" callback to override logic to display expand icon on every row (for example only show it every 2nd row)</li>
    </ul>
  `;

  aureliaGrid!: AureliaGridInstance;
  gridOptions!: GridOption;
  columnDefinitions: Column[] = [];
  dataset: any[] = [];
  extensions!: ExtensionList<any, any>;
  flashAlertType = 'info';
  message = '';
  subscriptions: Subscription[] = [];

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  get rowDetailInstance(): any {
    // you can get the SlickGrid RowDetail plugin (addon) instance via 2 ways

    // option 1
    return this.extensions.rowDetailView.instance || {};

    // OR options 2
    // return this.aureliaGrid && this.aureliaGrid.extensionService.getExtensionInstanceByName(ExtensionName.rowDetailView) || {};
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string, width: 70, filterable: true },
      { id: 'duration', name: 'Duration (days)', field: 'duration', formatter: Formatters.decimal, params: { minDecimal: 1, maxDecimal: 2 }, sortable: true, type: FieldType.number, minWidth: 90, filterable: true },
      { id: 'percent2', name: '% Complete', field: 'percentComplete2', formatter: Formatters.progressBar, type: FieldType.number, sortable: true, minWidth: 100, filterable: true, filter: { model: Filters.slider, operator: '>' } },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate } },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true, filterable: true, filter: { model: Filters.compoundDate } },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven',
        minWidth: 100,
        formatter: Formatters.checkmark, type: FieldType.boolean,
        filterable: true, sortable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      enableFiltering: true,
      enableRowDetailView: true,
      rowSelectionOptions: {
        selectActiveRow: true
      },
      datasetIdPropertyName: 'rowId', // optionally use a different "id"
      rowDetailView: {
        // optionally change the column index position of the icon (defaults to 0)
        // columnIndexPosition: 1,

        // We can load the "process" asynchronously in 3 different ways (aurelia-http-client, aurelia-fetch-client OR even Promise)
        process: (item) => this.simulateServerAsyncCall(item),
        // process: (item) => this.http.get(`api/item/${item.id}`),

        // load only once and reuse the same item detail without calling process method
        loadOnce: true,

        // limit expanded row to only 1 at a time
        singleRowExpand: false,

        // false by default, clicking anywhere on the row will open the detail view
        // when set to false, only the "+" icon would open the row detail
        // if you use editor or cell navigation you would want this flag set to false (default)
        useRowClick: true,

        // how many grid rows do we want to use for the row detail panel (this is only set once and will be used for all row detail)
        // also note that the detail view adds an extra 1 row for padding purposes
        // so if you choose 4 panelRows, the display will in fact use 5 rows
        panelRows: this.detailViewRowCount,

        // you can override the logic for showing (or not) the expand icon
        // for example, display the expand icon only on every 2nd row
        // expandableOverride: (row: number, dataContext: any) => (dataContext.rowId % 2 === 1),

        // Preload View Template
        preloadView: PLATFORM.moduleName('examples/slickgrid/example19-preload.html'),

        // ViewModel Template to load when row detail data is ready
        viewModel: PLATFORM.moduleName('examples/slickgrid/example19-detail-view'),

        // Optionally pass your Parent Component reference to your Child Component (row detail component)
        parent: this
      }
    };
  }

  getData() {
    // mock a dataset
    this.dataset = [];
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      this.dataset[i] = {
        rowId: i,
        title: 'Task ' + i,
        duration: (i % 33 === 0) ? null : Math.random() * 100 + '',
        percentComplete: randomPercent,
        percentComplete2: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      };
    }
  }

  changeDetailViewRowCount() {
    const options = this.rowDetailInstance.getOptions();
    if (options && options.panelRows) {
      options.panelRows = this.detailViewRowCount; // change number of rows dynamically
      this.rowDetailInstance.setOptions(options);
    }
  }

  closeAllRowDetail() {
    this.rowDetailInstance.collapseAll();
  }

  showFlashMessage(message: string, alertType = 'info') {
    this.message = message;
    this.flashAlertType = alertType;
  }

  /** Just for demo purposes, we will simulate an async server call and return more details on the selected row item */
  simulateServerAsyncCall(item: any) {
    // random set of names to use for more item detail
    const randomNames = ['John Doe', 'Jane Doe', 'Chuck Norris', 'Bumblebee', 'Jackie Chan', 'Elvis Presley', 'Bob Marley', 'Mohammed Ali', 'Bruce Lee', 'Rocky Balboa'];

    // fill the template on async delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const itemDetail = item;

        // let's add some extra properties to our item for a better async simulation
        itemDetail.assignee = randomNames[this.randomNumber(0, 10)];
        itemDetail.reporter = randomNames[this.randomNumber(0, 10)];

        // resolve the data after delay specified
        resolve(itemDetail);
      }, 1000);
    });
  }

  private randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
