import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';
import { CaseType, Column, GridOption, FieldType, Formatters, FormElementType, GridOdataService } from 'aurelia-slickgrid';

const defaultPageSize = 20;
const sampleDataRoot = 'assets/data';

@autoinject()
export class Example5 {
  title = 'Example 5: Grid with Backend OData Service';
  subTitle = `
    Use it when you need to support Pagination with a OData endpoint (for simple JSON, use a regular grid)<br/>
    Take a look at the (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/OData" target="_blank">Wiki documentation</a>)
    <br/>
    <ul class="small">
      <li>Only "Name" field is sortable for the demo (because we use JSON files), however "multiColumnSort: true" is also supported</li>
      <li>String column also support operator (>, >=, <, <=, <>, !=, =, ==, *)
      <ul>
        <li>The (*) can be used as startsWith (ex.: "abc*" => startsWith "abc") / endsWith (ex.: "*xyz" => endsWith "xyz")</li>
        <li>The other operators can be used on column type number for example: ">=100" (greater than or equal to 100)</li>
      </ul>
    </ul>
  `;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];

  odataQuery = '';
  processing = false;
  status = { text: '', class: '' };

  constructor(private http: HttpClient, private odataService: GridOdataService) {
    odataService.initOptions({
      caseType: CaseType.pascalCase,
      top: defaultPageSize
    });

    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready
    // this.getData();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'name', name: 'Name', field: 'name', filterable: true, sortable: true, type: FieldType.string, minWidth: 100 },
      {
        id: 'gender', name: 'Gender', field: 'gender', filterable: true, sortable: true, minWidth: 100,
        filter: {
          searchTerm: '', // default selection
          type: FormElementType.select,
          selectOptions: [{ value: '', label: '' }, { value: 'male', label: 'male' }, { value: 'female', label: 'female' }]
        }
      },
      { id: 'company', name: 'Company', field: 'company', minWidth: 100 }
    ];

    this.gridOptions = {
      enableAutoResize: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableFiltering: true,
      enableCellNavigation: true,
      enablePagination: true,
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
          console.log(response);
          this.displaySpinner(false);
          this.getCustomerCallback(response);
        },
        filterTypingDebounce: 700,
        service: this.odataService
      }
    };
  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  getCustomerCallback(data) {
    this.displaySpinner(false);

    this.dataset = data['items'];
    this.odataQuery = data['query'];

    // totalItems property needs to be filled for pagination to work correctly
    this.gridOptions.pagination.totalItems = data['totalRecordCount'];
  }

  getCustomerApiCall(query) {
    // in your case, you will call your WebAPI function (wich needs to return a Promise)
    // for the demo purpose, we will call a mock WebAPI function
    return this.getCustomerDataApiMock(query);
  }

  /** This function is only here to mock a WebAPI call (since we are using a JSON file for the demo)
   *  in your case the getCustomer() should be a WebAPI function returning a Promise
   */
  getCustomerDataApiMock(query) {
    // the mock is returning a Promise, just like a WebAPI typically does
    return new Promise((resolve, reject) => {
      const queryParams = query.toLowerCase().split('&');
      let top: number;
      let skip = 0;
      let orderBy = '';
      let countTotalItems = 100;
      let columnFilters = {};

      for (const param of queryParams) {
        if (param.includes('$top=')) {
          top = +(param.substring('$top='.length));
        }
        if (param.includes('$skip=')) {
          skip = +(param.substring('$skip='.length));
        }
        if (param.includes('$orderby=')) {
          orderBy = param.substring('$orderby='.length);
        }
        if (param.includes('$filter=')) {
          const filterBy = param.substring('$filter='.length);
          if (filterBy.includes('substringof')) {
            const filterMatch = filterBy.match(/substringof\('(.*?)',([a-zA-Z ]*)/);
            const fieldName = filterMatch[2].trim();
            columnFilters[fieldName] = {
              type: 'substring',
              term: filterMatch[1].trim()
            };
          }
          if (filterBy.includes('eq')) {
            const filterMatch = filterBy.match(/([a-zA-Z ]*) eq '(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'equal',
              term: filterMatch[2].trim()
            };
          }
          if (filterBy.includes('startswith')) {
            const filterMatch = filterBy.match(/startswith\(([a-zA-Z ]*),\s?'(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'starts',
              term: filterMatch[2].trim()
            };
          }
          if (filterBy.includes('endswith')) {
            const filterMatch = filterBy.match(/endswith\(([a-zA-Z ]*),\s?'(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'ends',
              term: filterMatch[2].trim()
            };
          }
        }
      }

      const sort = orderBy.includes('asc')
        ? 'ASC'
        : orderBy.includes('desc')
          ? 'DESC'
          : '';

      let url;
      switch (sort) {
        case 'ASC':
          url = `${sampleDataRoot}/customers_100_ASC.json`;
          break;
        case 'DESC':
          url = `${sampleDataRoot}/customers_100_DESC.json`;
          break;
        default:
          url = `${sampleDataRoot}/customers_100.json`;
          break;
      }

      this.http.createRequest(url)
        .asGet()
        .send()
        .then(response => {
          const dataArray = response.content as any[];

          // Read the result field from the JSON response.
          const firstRow = skip;
          let filteredData = dataArray;
          if (columnFilters) {
            for (const columnId in columnFilters) {
              if (columnFilters.hasOwnProperty(columnId)) {
                filteredData = filteredData.filter(column => {
                  const filterType = columnFilters[columnId].type;
                  const searchTerm = columnFilters[columnId].term;
                  switch (filterType) {
                    case 'equal': return column[columnId] === searchTerm;
                    case 'ends': return column[columnId].toLowerCase().endsWith(searchTerm);
                    case 'starts': return column[columnId].toLowerCase().startsWith(searchTerm);
                    case 'substring': return column[columnId].toLowerCase().includes(searchTerm);
                  }
                });
              }
            }
            countTotalItems = filteredData.length;
          }
          const updatedData = filteredData.slice(firstRow, firstRow + top);

          setTimeout(() => {
            resolve({ items: updatedData, totalRecordCount: countTotalItems, query });
          }, 500);
        });
    });
  }
}
