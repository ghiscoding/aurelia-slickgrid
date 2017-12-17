import { autoinject } from 'aurelia-framework';
import data from './sample-data/example-data';
import { I18N } from 'aurelia-i18n';
import { HttpClient } from 'aurelia-http-client';
import { CaseType, Column, GridOption, FieldType, Formatters, FormElementType, GraphqlService } from 'aurelia-slickgrid';

const defaultPageSize = 20;
const sampleDataRoot = 'src/examples/slickgrid/sample-data';

@autoinject()
export class Example6 {
  title = 'Example 6: Grid with Backend GraphQL Service';
  subTitle = `
    Use it when you need to support Pagination with a GraphQL endpoint (for simple JSON, use a regular grid)
    <br/>
    <ul class="small">
      <li><span class="red">(*) NO DATA SHOWING</span> - just change filters &amp; page and look at the "GraphQL Query" changing</li>
      <li>Only "Name" field is sortable for the demo (because we use JSON files), however "multiColumnSort: true" is also supported</li>
      <li>String column also support operator (>, >=, <, <=, <>, !=, =, ==, *)
      <ul>
        <li>The (*) can be used as startsWith (ex.: "abc*" => startsWith "abc") / endsWith (ex.: "*xyz" => endsWith "xyz")</li>
        <li>The other operators can be used on column type number for example: ">=100" (greater or equal than 100)</li>
      </ul>
    </ul>
  `;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];

  isWithCursor = false;
  graphqlQuery = '';
  processing = false;
  selectedLanguage: string;
  status = { text: '', class: '' };

  constructor(private http: HttpClient, private graphqlService: GraphqlService, private i18n: I18N) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.selectedLanguage = this.i18n.getLocale();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'name', name: 'Name', field: 'name', headerKey: 'NAME', filterable: true, sortable: true, type: FieldType.string, minWidth: 80 },
      {
        id: 'gender', name: 'Gender', field: 'gender', headerKey: 'GENDER', filterable: true, sortable: true, minWidth: 80,
        filter: {
          searchTerm: '', // default selection
          type: FormElementType.select,
          selectOptions: [{ value: '', label: '' }, { value: 'male', label: 'male' }, { value: 'female', label: 'female' }]
        }
      },
      { id: 'company', name: 'Company', headerKey: 'COMPANY', field: 'company', filterable: true }
    ];

    this.gridOptions = {
      enableAutoResize: false,
      enableFiltering: true,
      enablePagination: true,
      enableTranslate: true,
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: defaultPageSize,
        totalItems: 0
      },
      onBackendEventApi: {
        onInit: (query) => this.getCustomerApiCall(query),
        preProcess: () => this.displaySpinner(true),
        process: (query) => this.getCustomerApiCall(query),
        postProcess: (response) => {
          this.displaySpinner(false);
          this.getCustomerCallback(response);
        },
        filterTypingDebounce: 700,
        service: this.graphqlService
      }
    };

    const paginationOption = this.getGraphqlInitOption(this.isWithCursor);
    this.graphqlService.initOptions(paginationOption);

  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  getGraphqlInitOption(isWithCursor: boolean) {
    let initOptions;

    if (isWithCursor) {
      // with cursor, paginationOptions can be: { first, last, after, before }
      initOptions = {
        datasetName: 'users',
        columnDefinitions: this.columnDefinitions,
        isWithCursor: true,
        paginationOptions: {
          first: defaultPageSize
        }
      };
    } else {
      // without cursor, paginationOptions can be: { first, last, offset }
      initOptions = {
        datasetName: 'users',
        columnDefinitions: this.columnDefinitions,
        isWithCursor: false,
        paginationOptions: {
          first: defaultPageSize,
          offset: 0
        }
      };
    }
    return initOptions;
  }

  getCustomerCallback(data) {
    this.displaySpinner(false);

    this.dataset = data['items'];
    this.graphqlQuery = data['query'];

    // totalItems property needs to be filled for pagination to work correctly
    this.gridOptions.pagination.totalItems = data['totalRecordCount'];
  }

  getCustomerApiCall(query) {
    // in your case, you will call your WebAPI function (wich needs to return a Promise)
    // for the demo purpose, we will call a mock WebAPI function
    return new Promise((resolve, reject) => {
      this.graphqlQuery = this.graphqlService.buildQuery();
      setTimeout(() => {
        resolve({ items: [], totalRecordCount: 100, query });
      }, 500);
    });
  }

  onWithCursorChange(isWithCursor) {
    this.isWithCursor = isWithCursor;
    const paginationOption = this.getGraphqlInitOption(isWithCursor);
    this.graphqlService.initOptions(paginationOption);
    this.graphqlQuery = this.graphqlService.buildQuery();
  }

  switchLanguage() {
    this.selectedLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.setLocale(this.selectedLanguage);
  }
}
