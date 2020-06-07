import { autoinject } from 'aurelia-framework';
import {
  AureliaGridInstance,
  Column,
  SlickDataView,
  Editors,
  FieldType,
  Formatters,
  GridOption,
  GridService,
  OnEventArgs,
  SlickGrid
} from '../../aurelia-slickgrid';
import './example11.scss';

@autoinject()
export class Example11 {
  title = 'Example 11: Add / Update / Highlight a Datagrid Item';
  subTitle = `
  Add / Update / Hightlight an Item from the Datagrid (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Add,-Update-or-Highlight-a-Datagrid-Item" target="_blank">Wiki docs</a>).
  <ul>
    <li><b>Note:</b> this demo is <b>only</b> on the datagrid (client) side, you still need to deal with the backend yourself</li>
    <li>Adding an item, will always be showing as the 1st item in the grid because that is the best visual place to add it</li>
    <li>Add/Update an item requires a valid Slickgrid Selection Model, you have 2 choices to deal with this:</li>
    <ul><li>You can enable "enableCheckboxSelector" or "enableRowSelection" to True</li></ul>
    <li>Click on any of the buttons below to test this out</li>
    <li>You can change the highlighted color &amp; animation by changing the <a href="https://github.com/ghiscoding/aurelia-slickgrid/blob/master/aurelia-slickgrid/src/aurelia-slickgrid/styles/_variables.scss" target="_blank">SASS Variables</a></li>
    <ul>
      <li>"$row-highlight-background-color" or "$row-highlight-fade-animation"</li>
    </ul>
    <li>You can also add CSS class(es) on the fly (or on page load) on rows with certain criteria, (e.g. click on last button)
    <ul>
      <li>Example, click on button "Highlight Rows with Duration over 50" to see row styling changing. <a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Dynamically-Add-CSS-Classes-to-Item-Rows" target="_blank">Wiki doc</a></li>
    </ul>
  </ul>
  `;

  aureliaGrid: AureliaGridInstance;
  grid: SlickGrid;
  gridService: GridService;
  dataView: SlickDataView;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  updatedObject: any;

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
    this.mockData(1000);
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
    this.dataView = aureliaGrid.dataView;
    this.grid = aureliaGrid.slickGrid;
    this.gridService = aureliaGrid.gridService;
    // if you want to change background color of Duration over 50 right after page load,
    // you would put the code here, also make sure to re-render the grid for the styling to be applied right away
    /*
    this.dataView.getItemMetadata = this.updateItemMetadataForDurationOver50(this.dataView.getItemMetadata);
    this.grid.invalidate();
    this.grid.render();
    */
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'delete',
        field: 'id',
        excludeFromHeaderMenu: true,
        formatter: Formatters.deleteIcon,
        minWidth: 30,
        maxWidth: 30,
        // use onCellClick OR grid.onClick.subscribe which you can see down below
        onCellClick: (e: Event, args: OnEventArgs) => {
          console.log(args);
          if (confirm('Are you sure?')) {
            this.aureliaGrid.gridService.deleteDataGridItemById(args.dataContext.id);
          }
        }
      },
      {
        id: 'title', name: 'Title', field: 'title',
        sortable: true,
        type: FieldType.string,
        editor: {
          model: Editors.longText
        }
      },
      {
        id: 'duration', name: 'Duration (days)', field: 'duration',
        sortable: true,
        type: FieldType.number,
        editor: {
          model: Editors.text
        },
        onCellChange: (e: Event, args: OnEventArgs) => {
          alert('onCellChange directly attached to the column definition');
          console.log(args);
        }
      },
      {
        id: 'complete', name: '% Complete', field: 'percentComplete',
        formatter: Formatters.percentCompleteBar,
        type: FieldType.number,
        editor: {
          model: Editors.integer
        }
      },
      {
        id: 'start', name: 'Start', field: 'start',
        formatter: Formatters.dateIso,
        sortable: true,
        type: FieldType.date,
        /*
        editor: {
          model: Editors.date
        }
        */
      },
      {
        id: 'finish', name: 'Finish', field: 'finish',
        formatter: Formatters.dateIso, sortable: true,
        type: FieldType.date
      },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven',
        formatter: Formatters.checkmark,
        type: FieldType.number,
        editor: {
          model: Editors.checkbox
        }
      }
    ];

    this.gridOptions = {
      asyncEditorLoading: false,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 10
      },
      editable: true,
      enableColumnPicker: true,
      enableCellNavigation: true,
      enableRowSelection: true
    };
  }

  mockData(itemCount: number) {
    // mock a dataset
    const mockedDataset = [];
    for (let i = 0; i < itemCount; i++) {
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

  addNewItem(insertPosition?: 'top' | 'bottom') {
    const newId = this.dataset.length;
    const randomYear = 2000 + Math.floor(Math.random() * 10);
    const randomMonth = Math.floor(Math.random() * 11);
    const randomDay = Math.floor((Math.random() * 29));
    const randomPercent = Math.round(Math.random() * 100);

    const newItem = {
      id: newId,
      title: 'Task ' + newId,
      duration: Math.round(Math.random() * 100) + '',
      percentComplete: randomPercent,
      percentCompleteNumber: randomPercent,
      start: new Date(randomYear, randomMonth, randomDay),
      finish: new Date(randomYear, (randomMonth + 2), randomDay),
      effortDriven: true
    };
    this.aureliaGrid.gridService.addItem(newItem, { position: insertPosition });
  }

  /** Change the Duration Rows Background Color */
  changeDurationBackgroundColor() {
    this.dataView.getItemMetadata = this.updateItemMetadataForDurationOver50(this.dataView.getItemMetadata);
    // also re-render the grid for the styling to be applied right away
    this.grid.invalidate();
    this.grid.render();
    // or use the Aurelia-SlickGrid GridService
    // this.gridService.renderGrid();
  }

  /** Highlight the 5th row using the Aurelia-Slickgrid GridService */
  highlighFifthRow() {
    this.scrollGridTop();
    this.aureliaGrid.gridService.highlightRow(4, 1500);
  }

  /**
   * Change the SlickGrid Item Metadata, we will add a CSS class on all rows with a Duration over 50
   * For more info, you can see this SO https://stackoverflow.com/a/19985148/1212166
   */
  updateItemMetadataForDurationOver50(previousItemMetadata: any) {
    const newCssClass = 'duration-bg';
    return (rowNumber: number) => {
      const item = this.dataView.getItem(rowNumber);
      let meta = {
        cssClasses: ''
      };
      if (typeof previousItemMetadata === 'object') {
        meta = previousItemMetadata(rowNumber);
      }
      if (meta && item && item.duration) {
        const duration = +item.duration; // convert to number
        if (duration > 50) {
          meta.cssClasses = (meta.cssClasses || '') + ' ' + newCssClass;
        }
      }
      return meta;
    };
  }

  updateSecondItem() {
    this.scrollGridTop();
    const updatedItem = this.aureliaGrid.gridService.getDataItemByRowNumber(1);
    updatedItem.duration = Math.round(Math.random() * 100);
    this.aureliaGrid.gridService.updateItem(updatedItem);

    // OR by id
    // this.aureliaGrid.gridService.updateItemById(updatedItem.id, updatedItem);

    // OR multiple changes
    /*
    const updatedItem1 = this.aureliaGrid.gridService.getDataItemByRowNumber(1);
    const updatedItem2 = this.aureliaGrid.gridService.getDataItemByRowNumber(2);
    updatedItem1.duration = Math.round(Math.random() * 100);
    updatedItem2.duration = Math.round(Math.random() * 100);
    this.aureliaGrid.gridService.updateItems([updatedItem1, updatedItem2], true);
    */
  }

  scrollGridBottom() {
    this.aureliaGrid.slickGrid.navigateBottom();
  }

  scrollGridTop() {
    this.aureliaGrid.slickGrid.navigateTop();
  }
}
