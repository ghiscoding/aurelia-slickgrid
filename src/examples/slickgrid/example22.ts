import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { AureliaGridInstance, Column, Filters, GridOption } from '../../aurelia-slickgrid';

const URL_CUSTOMERS = 'assets/data/customers_100.json';

@autoinject()
export class Example22 {
  title = 'Example 22: Grids in Bootstrap Tabs';
  subTitle = `This example demonstrate the creation of multiple grids in Bootstrap Tabs
   <ol>
    <li>Regular mocked data with javascript</li>
    <li>Load dataset through Fetch-Client. Also note we need to call a "resizeGrid()" after focusing on this tab</li>
  </ol>`;

  aureliaGrid2: AureliaGridInstance;
  gridOptions1: GridOption;
  gridOptions2: GridOption;
  columnDefinitions1: Column[];
  columnDefinitions2: Column[];
  dataset1: any[];
  dataset2: any[];

  constructor(private http: HttpClient) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid1();
    this.defineGrid2();
  }

  aureliaGrid2Ready(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid2 = aureliaGrid;
  }

  async attached() {
    // mock some data with JavaScript
    this.dataset1 = this.mockData();

    // load data with Fetch-Client
    const response2 = await this.http.fetch(URL_CUSTOMERS);
    this.dataset2 = await response2['json']();
  }

  // Grid2 definition
  defineGrid1() {
    this.columnDefinitions1 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100 },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, minWidth: 100 },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', minWidth: 100 },
      { id: 'finish', name: 'Finish', field: 'finish', minWidth: 100 },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100 }
    ];
    this.gridOptions1 = {
      enableAutoResize: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 10
      },
      enableSorting: true
    };

  }

  // Grid2 definition
  defineGrid2() {
    this.columnDefinitions2 = [
      { id: 'name', name: 'Name', field: 'name', filterable: true, sortable: true, },
      {
        id: 'gender', name: 'Gender', field: 'gender', filterable: true, sortable: true,
        filter: {
          model: Filters.singleSelect,
          collection: [{ value: '', label: '' }, { value: 'male', label: 'male' }, { value: 'female', label: 'female' }]
        }
      },
      { id: 'company', name: 'Company', field: 'company', filterable: true, sortable: true }
    ];

    this.gridOptions2 = {
      enableAutoResize: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 10
      },
      enableFiltering: true,
      enableSorting: true
    };

  }

  mockData() {
    // mock a dataset
    const mockDataset = [];
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        start: `${randomMonth}/${randomDay}/${randomYear}`,
        finish: `${randomMonth}/${randomDay}/${randomYear}`,
        effortDriven: (i % 5 === 0)
      };
    }

    return mockDataset;
  }

  resizeGrid2() {
    this.aureliaGrid2.resizerService.resizeGrid();
  }
}
