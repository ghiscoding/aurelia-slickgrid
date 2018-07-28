import { autoinject } from 'aurelia-framework';
import data from './sample-data/example-data';
import { HttpClient } from 'aurelia-http-client';
import { AureliaGridInstance, Column, FieldType, Filters, GridOdataService, GridOption, Statistic } from 'aurelia-slickgrid';

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
      <li>OData Service could be replaced by other Service type in the future (GraphQL or whichever you provide)</li>
      <li>You can also preload a grid with certain "presets" like Filters / Sorters / Pagination <a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grid-State-&-Preset" target="_blank">Wiki - Grid Preset</a>
    </ul>
  `;
  aureliaGrid: AureliaGridInstance;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  statistics: Statistic;

  odataQuery = '';
  processing = false;
  status = { text: '', class: '' };

  constructor(private http: HttpClient) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'name', name: 'Name', field: 'name', sortable: true, type: FieldType.string,
        filterable: true,
        filter: {
          model: Filters.compoundInput
        }
      },
      {
        id: 'gender', name: 'Gender', field: 'gender', filterable: true, sortable: true,
        filter: {
          model: Filters.singleSelect,
          collection: [{ value: '', label: '' }, { value: 'male', label: 'male' }, { value: 'female', label: 'female' }]
        }
      },
      { id: 'company', name: 'Company', field: 'company' }
    ];

    this.gridOptions = {
      enableAutoResize: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableCellNavigation: true,
      enableFiltering: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: defaultPageSize,
        totalItems: 0
      },
      backendServiceApi: {
        service: new GridOdataService(),
        preProcess: () => this.displaySpinner(true),
        process: (query) => this.getCustomerApiCall(query),
        postProcess: (response) => {
          this.statistics = response.statistics;
          this.displaySpinner(false);
          this.getCustomerCallback(response);
        }
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
    // totalItems property needs to be filled for pagination to work correctly
    // however we need to force Aurelia to do a dirty check, doing a clone object will do just that
    this.gridOptions.pagination.totalItems = data['totalRecordCount'];
    this.gridOptions = { ...{}, ...this.gridOptions };
    if (this.statistics) {
      this.statistics.totalItemCount = data['totalRecordCount'];
    }

    // once pagination totalItems is filled, we can update the dataset
    this.dataset = data['items'];
    this.odataQuery = data['query'];
  }

  getCustomerApiCall(query) {
    // in your case, you will call your WebAPI function (wich needs to return a Promise)
    // for the demo purpose, we will call a mock WebAPI function
    return this.getCustomerDataApiMock(query);
  }

  /**
   * This function is only here to mock a WebAPI call (since we are using a JSON file for the demo)
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
      const columnFilters = {};

      for (const param of queryParams) {
        if (param.indexOf('$top=') > -1) {
          top = +(param.substring('$top='.length));
        }
        if (param.indexOf('$skip=') > -1) {
          skip = +(param.substring('$skip='.length));
        }
        if (param.indexOf('$orderby=') > -1) {
          orderBy = param.substring('$orderby='.length);
        }
        if (param.indexOf('$filter=') > -1) {
          const filterBy = param.substring('$filter='.length).replace('%20', ' ');
          if (filterBy.indexOf('substringof') > -1) {
            const filterMatch = filterBy.match(/substringof\('(.*?)',([a-zA-Z ]*)/);
            const fieldName = filterMatch[2].trim();
            columnFilters[fieldName] = {
              type: 'substring',
              term: filterMatch[1].trim()
            };
          }
          if (filterBy.indexOf('eq') > -1) {
            const filterMatch = filterBy.match(/([a-zA-Z ]*) eq '(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'equal',
              term: filterMatch[2].trim()
            };
          }
          if (filterBy.indexOf('startswith') > -1) {
            const filterMatch = filterBy.match(/startswith\(([a-zA-Z ]*),\s?'(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'starts',
              term: filterMatch[2].trim()
            };
          }
          if (filterBy.indexOf('endswith') > -1) {
            const filterMatch = filterBy.match(/endswith\(([a-zA-Z ]*),\s?'(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'ends',
              term: filterMatch[2].trim()
            };
          }
        }
      }

      const sort = (orderBy.indexOf('asc') > -1)
        ? 'ASC'
        : (orderBy.indexOf('desc') > -1)
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
                  let colId = columnId;
                  if (columnId && columnId.indexOf(' ') !== -1) {
                    const splitIds = columnId.split(' ');
                    colId = splitIds[splitIds.length - 1];
                  }
                  const filterTerm = column[colId];
                  if (filterTerm) {
                    switch (filterType) {
                      case 'equal': return filterTerm.toLowerCase() === searchTerm;
                      case 'ends': return filterTerm.toLowerCase().endsWith(searchTerm);
                      case 'starts': return filterTerm.toLowerCase().startsWith(searchTerm);
                      case 'substring': return (filterTerm.toLowerCase().indexOf(searchTerm) > -1);
                    }
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
