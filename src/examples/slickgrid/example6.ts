import { Subscription, EventAggregator } from 'aurelia-event-aggregator';
import { autoinject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { HttpClient } from 'aurelia-http-client';
import {
  AureliaGridInstance,
  Column,
  FieldType,
  Filters,
  Formatters,
  GraphqlResult,
  GraphqlService,
  GraphqlServiceOption,
  GridOption,
  GridStateChange,
  OperatorType,
  SortDirection,
  Statistic,
} from '../../aurelia-slickgrid';

const defaultPageSize = 20;
const GRAPHQL_QUERY_DATASET_NAME = 'users';

@autoinject()
export class Example6 {
  title = 'Example 6: Grid with Backend GraphQL Service';
  subTitle = `
  Use it when you need to support Pagination with a GraphQL endpoint (for simple JSON, use a regular grid).
  <br/>Take a look at the (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/GraphQL" target="_blank">Wiki docs</a>)
    <ul class="small">
      <li><span class="red">(*) NO DATA SHOWING</span> - just change filters &amp; page and look at the "GraphQL Query" changing</li>
      <li>Only "Name" field is sortable for the demo (because we use JSON files), however "multiColumnSort: true" is also supported</li>
      <li>String column also support operator (>, >=, <, <=, <>, !=, =, ==, *)
      <ul>
        <li>The (*) can be used as startsWith (ex.: "abc*" => startsWith "abc") / endsWith (ex.: "*xyz" => endsWith "xyz")</li>
        <li>The other operators can be used on column type number for example: ">=100" (greater or equal than 100)</li>
      </ul>
      <li>You can also preload a grid with certain "presets" like Filters / Sorters / Pagination <a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grid-State-&-Preset" target="_blank">Wiki - Grid Preset</a>
    </ul>
  `;

  aureliaGrid: AureliaGridInstance;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  statistics: Statistic;

  isWithCursor = false;
  graphqlQuery = '';
  processing = false;
  selectedLanguage: string;
  status = { text: '', class: '' };
  Subscription: Subscription;

  constructor(private ea: EventAggregator, private http: HttpClient, private i18n: I18N) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.selectedLanguage = this.i18n.getLocale();
    this.Subscription = this.ea.subscribe('gridStateService:changed', (data) => console.log(data));
  }

  detached() {
    this.saveCurrentGridState();
    this.Subscription.dispose();
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'name', field: 'name', headerKey: 'NAME', filterable: true, sortable: true, type: FieldType.string, width: 60 },
      {
        id: 'gender', field: 'gender', headerKey: 'GENDER', filterable: true, sortable: true, width: 60,
        filter: {
          model: Filters.singleSelect,
          collection: [{ value: '', label: '' }, { value: 'male', label: 'male', labelKey: 'MALE' }, { value: 'female', label: 'female', labelKey: 'FEMALE' }]
        }
      },
      {
        id: 'company', field: 'company', headerKey: 'COMPANY', width: 60,
        sortable: true,
        filterable: true,
        filter: {
          model: Filters.multipleSelect,
          collection: [{ value: 'acme', label: 'Acme' }, { value: 'abc', label: 'Company ABC' }, { value: 'xyz', label: 'Company XYZ' }],
          filterOptions: {
            filter: true // adds a filter on top of the multi-select dropdown
          }
        }
      },
      { id: 'billing.address.street', field: 'billing.address.street', headerKey: 'BILLING.ADDRESS.STREET', width: 60, filterable: true, sortable: true },
      {
        id: 'billing.address.zip', field: 'billing.address.zip', headerKey: 'BILLING.ADDRESS.ZIP', width: 60,
        type: FieldType.number,
        filterable: true, sortable: true,
        filter: {
          model: Filters.compoundInput
        },
        formatter: Formatters.multiple, params: { formatters: [Formatters.complexObject, Formatters.translate] }
      },
    ];

    this.gridOptions = {
      enableAutoResize: false,
      enableFiltering: true,
      enableCellNavigation: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      enableTranslate: true,
      i18n: this.i18n,
      gridMenu: {
        resizeOnShowHeaderRow: true,
      },
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: defaultPageSize,
        totalItems: 0
      },

      presets: {
        columns: [
          { columnId: 'name', width: 120 },
          { columnId: 'gender', width: 55 },
          { columnId: 'company' },
          { columnId: 'billing.address.zip' }, // flip column position of Street/Zip to Zip/Street
          { columnId: 'billing.address.street', width: 120 },
        ],
        // you can also type operator as string, e.g.: operator: 'EQ'
        filters: [
          { columnId: 'gender', searchTerms: ['male'], operator: OperatorType.equal },
          { columnId: 'name', searchTerms: ['John Doe'], operator: OperatorType.contains },
          { columnId: 'company', searchTerms: ['xyz'], operator: 'IN' }
        ],
        sorters: [
          // direction can written as 'asc' (uppercase or lowercase) and/or use the SortDirection type
          { columnId: 'name', direction: 'asc' },
          { columnId: 'company', direction: SortDirection.DESC }
        ],
        pagination: { pageNumber: 2, pageSize: 20 }
      },

      backendServiceApi: {
        service: new GraphqlService(),
        options: this.getBackendOptions(this.isWithCursor),
        onError: (e) => console.log(e),
        // you can define the onInit callback OR enable the "executeProcessCommandOnInit" flag in the service init
        // onInit: (query) => this.getCustomerApiCall(query)
        preProcess: () => this.displaySpinner(true),
        process: (query) => this.getCustomerApiCall(query),
        postProcess: (result: GraphqlResult) => {
          this.statistics = result.statistics;
          this.displaySpinner(false);
        }
      },
    };
  }

  clearAllFiltersAndSorts() {
    if (this.aureliaGrid && this.aureliaGrid.gridService) {
      this.aureliaGrid.gridService.clearAllFiltersAndSorts();
    }
  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  getBackendOptions(withCursor: boolean): GraphqlServiceOption {
    // with cursor, paginationOptions can be: { first, last, after, before }
    // without cursor, paginationOptions can be: { first, last, offset }
    return {
      columnDefinitions: this.columnDefinitions,
      datasetName: GRAPHQL_QUERY_DATASET_NAME,
      isWithCursor: withCursor,
      addLocaleIntoQuery: true,
      extraQueryArguments: [{
        field: 'userId',
        value: 123
      }],

      // when dealing with complex objects, we want to keep our field name with double quotes
      // example with gender: query { users (orderBy:[{field:"gender",direction:ASC}]) {}
      keepArgumentFieldDoubleQuotes: true
    };
  }

  /**
   * Calling your GraphQL backend server should always return a Promise of type GraphqlResult
   *
   * @param query
   * @return Promise<GraphqlResult>
   */
  getCustomerApiCall(query: string): Promise<GraphqlResult> {
    // in your case, you will call your WebAPI function (wich needs to return a Promise)
    // for the demo purpose, we will call a mock WebAPI function
    const mockedResult = {
      // the dataset name is the only unknown property
      // will be the same defined in your GraphQL Service init, in our case GRAPHQL_QUERY_DATASET_NAME
      data: {
        [GRAPHQL_QUERY_DATASET_NAME]: {
          nodes: [],
          pageInfo: {
            hasNextPage: true
          },
          totalCount: 100
        }
      }
    };

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.graphqlQuery = this.aureliaGrid.backendService.buildQuery();
        resolve(mockedResult);
      }, 500);
    });
  }

  /** Dispatched event of a Grid State Changed event */
  gridStateChanged(gridStateChanges: GridStateChange) {
    console.log('GraphQL sample, Grid State changed:: ', gridStateChanges);
  }

  saveCurrentGridState() {
    console.log('GraphQL current grid state', this.aureliaGrid.gridStateService.getCurrentGridState());
  }

  switchLanguage() {
    this.selectedLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.setLocale(this.selectedLanguage);
  }
}
