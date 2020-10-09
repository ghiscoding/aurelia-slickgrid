import { Column, GridOption, Formatters, Formatter } from '../../aurelia-slickgrid';

const NB_ITEMS = 995;

interface DataItem {
  id: number;
  title: string;
  duration: string;
  percentComplete: number;
  start: Date;
  finish: Date;
  effortDriven: boolean;
  foo: {
    bar: string;
  }
}

const upperCaseFormatter: Formatter<DataItem> = (_, __, value, col, item) => {
  return `${col.field}, ${item.title}`;
}

export class Example1 {
  title = 'Example 1: Basic Grids';
  subTitle = `Simple Grids with Fixed Sizes (800 x 225) using "grid-height" &amp; "grid-width"`;

  gridOptions1: GridOption;
  gridOptions2: GridOption;
  columnDefinitions1: Column<DataItem>[];
  columnDefinitions2: Column[];
  dataset1: any[];
  dataset2: any[];

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrids();
  }

  attached() {
    // mock some data (different in each dataset)
    this.dataset1 = this.mockData(NB_ITEMS);
    this.dataset2 = this.mockData(NB_ITEMS);
  }

  /* Define grid Options and Columns */
  defineGrids() {
    this.columnDefinitions1 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 100, formatter: upperCaseFormatter },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, minWidth: 100 },
      { id: '%', name: '% Complete', field: 'percentComplete', sortable: true, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', sortable: true, minWidth: 100,
        formatter: (row: number, cell: number, value: any, columnDef: Column, dataContext, grid) => {
          return `<span style="margin-left: 5px">
              ${dataContext.effortDriven} ->
              <button class="btn btn-xs btn-default">
                <i class="fa ${value ? 'fa-check-circle' : 'fa-circle-thin'} fa-lg" style="color: ${value ? 'black' : 'lavender'}"></i>
              </button>
            </span>`;
        }
      }
    ];
    this.gridOptions1 = {
      enableAutoResize: false,
      enableSorting: true
    };

    // copy the same Grid Options and Column Definitions to 2nd grid
    // but also add Pagination in this grid
    this.columnDefinitions2 = this.columnDefinitions1;
    this.gridOptions2 = {
      ...this.gridOptions1,
      ...{
        enablePagination: true,
        pagination: {
          pageSizes: [5, 10, 20, 25, 50],
          pageSize: 5
        },
      }
    };
  }

  mockData(count: number) {
    // mock a dataset
    const mockDataset = [];
    for (let i = 0; i < count; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        start: new Date(randomYear, randomMonth + 1, randomDay),
        finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
        effortDriven: (i % 5 === 0)
      };
    }

    return mockDataset;
  }
}
