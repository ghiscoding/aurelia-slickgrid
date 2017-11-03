import { autoinject, bindable } from 'aurelia-framework';
import data from './sample-data/example-data';
import { Column, Editors, FieldType, Formatters, GridExtraUtils, GridOption, OnCellClickArgs, ResizerService } from 'aurelia-slickgrid';

// create my custom Formatter with the Formatter type
const myCustomCheckboxFormatter = (row, cell, value, columnDef, dataContext) =>
  value ? `<i class="fa fa-pencil" aria-hidden="true"></i>` : '<i class="fa fa-snowflake-o" aria-hidden="true"></i>';

@autoinject()
export class Example3 {
  @bindable() gridObj: any;
  @bindable() dataview: any;
  title = 'Example 3: Editors';
  subTitle = 'Grid with Inline Editors and onCellClick actions (for example, open a modal window on edit)';
  gridOptions: GridOption;
  columnDefinitions: Column[];
  dataset: any[];
  updatedObject: any;
  isAutoEdit: boolean = true;

  constructor(private resizer: ResizerService) {
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
      {
        id: 'edit', field: 'id',
        formatter: Formatters.editIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (args: OnCellClickArgs) => {
          console.log(args);
          console.log(this);
        }
      },
      {
        id: 'delete', field: 'id',
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        onCellClick: (args: OnCellClickArgs) => {
          console.log(args);
          console.log(this);
        }
      },
      { id: 'title', name: 'Title', field: 'title', sortable: true, type: FieldType.string, editor: Editors.longText, minWidth: 100 },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number, editor: Editors.text, minWidth: 100 },
      { id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, type: FieldType.number, editor: Editors.integer, minWidth: 100 },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, editor: Editors.date, minWidth: 100 },
      { id: 'finish', name: 'Finish', field: 'finish', formatter: Formatters.dateIso, sortable: true, type: FieldType.date, minWidth: 100 },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', formatter: Formatters.checkmark, type: FieldType.number, editor: Editors.checkbox, minWidth: 100 }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      editable: true,
      enableCellNavigation: true,
      asyncEditorLoading: false,
      autoEdit: this.isAutoEdit
    };
  }

  dataviewChanged(newValue, oldValue) {
    console.log(newValue);
  }

  getData() {
    // mock a dataset
    let mockedDataset = [];
    for (let i = 0; i < 1000; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      mockedDataset[i] = {
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
    this.dataset = mockedDataset;
  }

  gridObjChanged(grid) {
    grid.onCellChange.subscribe((e, args) => {
      console.log('onCellChange', args);
      this.updatedObject = args.item;
      this.resizer.resizeGrid(this.gridObj, this.gridOptions, 100);
    });
    grid.onClick.subscribe((e, args) => {
      const column = GridExtraUtils.getColumnDefinitionAndData(args);
      console.log('onClick', args, column);
      if (column.columnDef.id === 'edit') {
        alert(`Call a modal window to edit: ${column.dataContext.title}`);
      }
      if (column.columnDef.id === 'delete') {
        if (confirm('Are you sure?')) {
          this.dataview.deleteItem(column.dataContext.id);
          this.dataview.refresh();
        }
      }
    });
  }

  setAutoEdit(isAutoEdit) {
    this.isAutoEdit = isAutoEdit;
    this.gridObj.setOptions({ autoEdit: isAutoEdit });
    return true;
  }
}
