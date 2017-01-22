import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import $ from 'bootstrap';
import data from './sample-data/example-data';
import {HttpClient} from 'aurelia-http-client';
import {SlickService} from 'aurelia-slickgrid';

var sampleDataRoot = 'src/modules/slickgrid/sample-data';

@inject(Router, SlickService, HttpClient)
export class List {
  heading = 'Example 9 - Server Side Pagination/Sorting';
  description = '';
  gridOptions = null;
  gridColumns = {};
  paginationOptions = {
    pageNumber: 1,
    pageSize: 25,
    sort: null
  };

  constructor(router, slickService, httpClient) {
    this.router = router;
    this.slick = slickService;
    this.http = httpClient;
  }

  activate() {
  }

  attached() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.slick.createGrid('myGrid', this.gridColumns, this.gridOptions, data);
    this.getCustomerPage();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    let self = this;
    this.gridColumns = [
      {id: 'name', name: 'Name', field: 'name', sortable: true},
      {id: 'gender', name: 'Gender', field: 'gender'},
      {id: 'company', name: 'Company', field: 'company'}
    ];
    /*
    this.gridColumns = [
      {id: 'title', name: 'Title', field: 'title', width: 120, cssClass: 'cell-title', sortable: true},
      {id: 'desc', name: 'Description', field: 'description', width: 100, editor: Editors.LongText,  sortable: true},
      {id: 'duration', name: 'Duration', field: 'duration',  sortable: true},
      {id: '%', name: '% Complete', field: 'percentComplete', width: 100, resizable: false, formatter: Formatters.PercentCompleteBar},
      {id: 'start', name: 'Start', field: 'start', minWidth: 100},
      {id: 'finish', name: 'Finish', field: 'finish', minWidth: 100},
      {id: 'effort-driven', name: 'Effort Driven', sortable: false, width: 80, cssClass: 'cell-effort-driven', field: 'effortDriven'}
    ];
    */

    this.gridOptions = {
      columns: this.gridColumns,
      enableCellNavigation: true,
      enableColumnReorder: true,
      forceFitColumns: true,
      rowHeight: 35,
      autoEdit: true,
      autoExpand: true,
      autoResize: true,
      displayTooltip: false,
      editable: true,
      gridContainerId: "slickGridContainer",
      highlightColor: "#F7EAF1",
      multiColumnSort: true,
      lang: 'en',
      paginationPageSizes: [20, 25, 30, 40, 50, 75, 100],
      paginationPageSize: 25,
      //totalItems: 100,
      onPaginationChanged: function (newPage, pageSize) {
        console.log(`onPagination changed, page: ${newPage} with size of ${pageSize}`);
        self.paginationOptions.pageNumber = newPage;
        self.paginationOptions.pageSize = pageSize;
        self.getCustomerPage();
      },
      onSortingChanged: function(event, args) {
        let sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({sortCol: args.sortCol, sortAsc: args.sortAsc});
        if (sortColumns.length == 0) {
          self.paginationOptions.sort = null;
        } else {
          self.paginationOptions.sort = sortColumns[0].sortAsc ? "ASC" : "DESC";
        }
        self.getCustomerPage();
      },
      useExternalPagination: true,
      useExternalSorting: true
    };
  }

  getCustomerPage() {
    let url;
    switch(this.paginationOptions.sort) {
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
    this.gridOptions.totalItems = 100;

    this.http.createRequest(url)
      .asGet()
      .send()
      .then(response => {
        let data = response.content;
        let firstRow = (this.paginationOptions.pageNumber - 1) * this.paginationOptions.pageSize;
        this.gridOptions.data = data.slice(firstRow, firstRow + this.paginationOptions.pageSize);
        this.gridOptions = jQuery.extend(true, {}, this.gridOptions); // make a deep clone copy for the pagination to detect the changes
        this.slick.refreshDataset(this.gridOptions.data);
       });
  }
}
