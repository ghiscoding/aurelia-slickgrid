import {
  Column,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  OperatorType,
} from '../../aurelia-slickgrid';

// create my custom Formatter with the Formatter type
const myCustomCheckmarkFormatter = (row, cell, value, columnDef, dataContext) =>
  value ? `<i class="fa fa-fire" aria-hidden="true"></i>` : '<i class="fa fa-snowflake-o" aria-hidden="true"></i>';

export class Example2 {
  title = 'Example 2: Formatters';
  subTitle = `
    Grid with Custom and/or included Slickgrid Formatters (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Formatters" target="_blank">Wiki docs</a>).
    <ul>
      <li>Last column is a Custom Formatter</li>
      <li>
        Support Excel Copy Buffer (SlickGrid Copy Manager Plugin), you can use it by simply enabling "enableExcelCopyBuffer" flag.
        Note that it will only evaluate Formatter when the "exportWithFormatter" flag is enabled (through "ExportOptions" or the column definition)
      </li>
    </ul>
  `;

  gridOptions: GridOption;
  columnDefinitions: Column[];
  dataset: any[];

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string, width: 70 },
      {
        id: 'phone', name: 'Phone Number using mask', field: 'phone',
        filterable: true, sortable: true, minWidth: 100,
        type: FieldType.string, // because we use a mask filter, we should always assume the value is a string for it to behave correctly
        formatter: Formatters.mask, params: { mask: '(000) 000-0000' },
        filter: {
          model: Filters.inputMask,
          operator: OperatorType.startsWith
        }
      },
      { id: 'duration', name: 'Duration (days)', field: 'duration', formatter: Formatters.decimal, params: { minDecimalPlaces: 1, maxDecimalPlaces: 2 }, sortable: true, type: FieldType.number, minWidth: 90 },
      { id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, sortable: true, minWidth: 100 },
      { id: 'percent2', name: '% Complete', field: 'percentComplete2', formatter: Formatters.progressBar, type: FieldType.number, sortable: true, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 90, exportWithFormatter: true },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', formatter: myCustomCheckmarkFormatter, type: FieldType.number, sortable: true, minWidth: 100 }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableExcelCopyBuffer: true,
      enableFiltering: true,
    };
  }

  getData() {
    // mock a dataset
    this.dataset = [];
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      this.dataset[i] = {
        id: i,
        title: 'Task ' + i,
        phone: this.generatePhoneNumber(),
        duration: (i % 33 === 0) ? null : Math.random() * 100 + '',
        percentComplete: randomPercent,
        percentComplete2: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0)
      };
    }
  }

  generatePhoneNumber() {
    let phone = '';
    for (let i = 0; i < 10; i++) {
      phone += Math.round(Math.random() * 9) + '';
    }
    return phone;
  }
}
