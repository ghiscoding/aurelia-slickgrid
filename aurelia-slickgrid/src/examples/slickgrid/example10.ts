import { autoinject, bindable } from 'aurelia-framework';
import { Column, FieldType, Formatter, Formatters, GridExtraService, GridExtraUtils, GridOption } from '../../aurelia-slickgrid';

@autoinject()
export class Example2 {
  @bindable() gridObj;
  title = 'Example 10: Grid with Row Selection';
  subTitle = `
    Row selection, single or multi-select (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Row-Selection" target="_blank">Wiki docs</a>).
    <ul>
      <li>Note that "enableExcelCopyBuffer" cannot be used at the same time as Row Selection because there can exist only 1 SelectionModel at a time</li>
    </ul>
  `;

  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  dataviewObj: any;
  isMultiSelect = true;
  selectedObjects: any[] = [];

  constructor(private gridExtraService: GridExtraService) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  detached() {
    // unsubscrible any Slick.Event you might have used
    // a reminder again, these are SlickGrid Event, not Event Aggregator events
    this.gridObj.onSelectedRowsChanged.unsubscribe();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number },
      { id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, sortable: true },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.dateIso },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', formatter: Formatters.checkmark, type: FieldType.number, sortable: true }
    ];
    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableAutoResize: true,
      enableCellNavigation: false,
      enableCheckboxSelector: true,
      preselectedRows: [0, 2]
    };
  }

  getData() {
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
    this.dataset = mockDataset;
  }

  gridObjChanged(grid) {
    this.gridObj = grid;

    grid.onSelectedRowsChanged.subscribe((e, args) => {
      if (Array.isArray(args.rows)) {
        this.selectedObjects = args.rows.map(idx => {
          const item = grid.getDataItem(idx);
          return item.title || '';
        });
      }
    });
  }

  onChooseMultiSelectType(isMultiSelect) {
    this.isMultiSelect = isMultiSelect;

    this.gridObj.setOptions({
      enableCellNavigation: !isMultiSelect,
      enableCheckboxSelector: isMultiSelect
    }); // change the grid option dynamically
    this.gridExtraService.setSelectedRows([]);

    return true;
  }
}
