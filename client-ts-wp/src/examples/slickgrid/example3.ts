import { autoinject } from 'aurelia-framework';
import data from './sample-data/example-data';
import { HttpClient } from 'aurelia-http-client';
import { Column, GridOption, Formatters } from 'aurelia-slickgrid';

const defaultPageSize = 20;
const sampleDataRoot = 'src/examples/slickgrid/sample-data';

@autoinject()
export class List {
  title = 'Example 3: Backend';
  subTitle = 'Sorting/Paging connected to a Backend Service (the demo only has "Name" field sortable)';
  processing = false;
  status = { text: '', class: '' };

  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  paginationOptions = {
    pageNumber: 1,
    pageSize: defaultPageSize,
    sort: null
  };

  constructor(private http: HttpClient) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready
    // this.getData();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'name', name: 'Name', field: 'name', sortable: true },
      { id: 'gender', name: 'Gender', field: 'gender' },
      { id: 'company', name: 'Company', field: 'company' }
    ];
    this.gridOptions = {
      enableAutoResize: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableCellNavigation: true,
      enablePagination: true,
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: defaultPageSize,
        totalItems: 0
      },
      onPaginationChanged: (event, args) => {
        console.log(`onPagination changed, page: ${args.newPage} with size of ${args.pageSize}`);
        this.paginationOptions.pageNumber = args.newPage;
        this.paginationOptions.pageSize = args.pageSize;
        this.getCustomerData();
      },
      onSortChanged: (event, args) => {
        const sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortCol: args.sortCol, sortAsc: args.sortAsc });
        if (sortColumns.length === 0) {
          this.paginationOptions.sort = null;
        } else {
          this.paginationOptions.sort = sortColumns[0].sortAsc ? 'ASC' : 'DESC';
        }
        this.getCustomerData();
      }
    };

    // get the data from backend
    this.getCustomerData();
  }

  getCustomerData() {
    let url;
    switch (this.paginationOptions.sort) {
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

    this.processing = true;
    this.status = {
      text: 'loading...',
      class: 'alert alert-danger'
    };
    this.http.createRequest(url)
      .asGet()
      .send()
      .then(response => {
        const dataArray = response.content as any[];

        // Read the result field from the JSON response.
        const firstRow = (this.paginationOptions.pageNumber - 1) * this.paginationOptions.pageSize;
        const updatedData = dataArray.slice(firstRow, firstRow + this.paginationOptions.pageSize);

        setTimeout(() => {
          this.dataset = updatedData;
          this.gridOptions.pagination.totalItems = 100; // this is required for pagination to work
          this.processing = false;
          this.status = {
            text: 'done',
            class: 'alert alert-success'
          };
        }, 500);
      });
  }
}
