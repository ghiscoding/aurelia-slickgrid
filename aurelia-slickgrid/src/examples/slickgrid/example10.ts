import { autoinject, bindable } from 'aurelia-framework';
import { Column, FieldType, Formatter, Formatters, GridOption } from '../../aurelia-slickgrid';

@autoinject()
export class Example2 {
  title = 'Example 10: Grid with Row Selection';
  subTitle = `
    Row selection, single or multi-select (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Row-Selection" target="_blank">Wiki docs</a>).
    <ul>
      <li>Note that "enableExcelCopyBuffer" cannot be used at the same time as Row Selection because there can exist only 1 SelectionModel at a time</li>
    </ul>
  `;

  columnDefinitions1: Column[];
  columnDefinitions2: Column[];
  gridOptions1: GridOption;
  gridOptions2: GridOption;
  dataset1: any[];
  dataset2: any[];
  selectedTitles: any[];
  selectedTitle: any;

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrids();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.dataset1 = this.prepareData();
    this.dataset2 = this.prepareData();
  }

  /* Define grid Options and Columns */
  defineGrids() {
    this.columnDefinitions1 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number },
      { id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, sortable: true },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.dateIso },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', formatter: Formatters.checkmark, type: FieldType.number, sortable: true }
    ];
    this.columnDefinitions2 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number },
      { id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, sortable: true },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.dateIso },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', formatter: Formatters.checkmark, type: FieldType.number, sortable: true }
    ];
    this.gridOptions1 = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableAutoResize: true,
      enableCellNavigation: false,
      enableCheckboxSelector: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: true
      },
    };
    this.gridOptions2 = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableAutoResize: true,
      enableCellNavigation: false,
      enableCheckboxSelector: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false
      },
      preselectedRows: [0, 2]
    };
  }

  prepareData() {
    // mock a dataset
    const mockDataset = [];
    for (let i = 0; i < 500; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      };
    }
    return mockDataset;
  }

  onGrid1SelectedRowsChanged(e, args) {
    const grid = args && args.grid;
    if (Array.isArray(args.rows)) {
      this.selectedTitle = args.rows.map(idx => {
        const item = grid.getDataItem(idx);
        return item.title || '';
      });
    }
  }

  onGrid2SelectedRowsChanged(e, args) {
    const grid = args && args.grid;
    if (grid && Array.isArray(args.rows)) {
      this.selectedTitles = args.rows.map(idx => {
        const item = grid.getDataItem(idx);
        return item.title || '';
      });
    }
  }
}
