import { ExcelExportService } from '@slickgrid-universal/excel-export';
import { AureliaGridInstance, Column, FieldType, GridOption, ItemMetadata } from '../../aurelia-slickgrid';
import './example14.scss'; // provide custom CSS/SASS styling

export class Example14 {
  title = 'Example 14: Column Span & Header Grouping';
  subTitle = `
  This example demonstrates how to easily span a row over multiple columns & how to group header titles.
  <ul>
    <li>
      Row Colspan - (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Row-Colspan" target="_blank">Wiki docs</a>) /
      Header Grouping - (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Header-Title-Grouping" target="_blank">Wiki docs</a>)
    </li>
    <li>Note that you can add Sort but remember that it will sort by the data which the row contains, even if the data is visually hidden by colspan it will still sort it</li>
  </ul>
  `;

  aureliaGrid2!: AureliaGridInstance;
  gridObj2: any;
  columnDefinitions1: Column[] = [];
  columnDefinitions2: Column[] = [];
  gridOptions1!: GridOption;
  gridOptions2!: GridOption;
  dataset1: any[] = [];
  dataset2: any[] = [];

  constructor() {
    this.definedGrid1();
    this.definedGrid2();
  }

  attaching() {
    // populate the dataset once the grid is ready
    this.dataset1 = this.getData(500);
    this.dataset2 = this.getData(500);
  }

  aureliaGridReady2(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid2 = aureliaGrid;
    this.gridObj2 = aureliaGrid.slickGrid;
  }

  definedGrid1() {
    this.columnDefinitions1 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, columnGroup: 'Common Factor' },
      { id: 'duration', name: 'Duration', field: 'duration', columnGroup: 'Common Factor' },
      { id: 'start', name: 'Start', field: 'start', columnGroup: 'Period' },
      { id: 'finish', name: 'Finish', field: 'finish', columnGroup: 'Period' },
      { id: '%', name: '% Complete', field: 'percentComplete', selectable: false, columnGroup: 'Analysis' },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', type: FieldType.boolean, columnGroup: 'Analysis' }
    ];

    this.gridOptions1 = {
      enableAutoResize: false,
      enableCellNavigation: true,
      enableColumnReorder: false,
      enableSorting: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 28,
      gridHeight: 275,
      gridWidth: 800,
      enableExcelExport: true,
      excelExportOptions: {
        exportWithFormatter: false
      },
      registerExternalResources: [new ExcelExportService()],
      explicitInitialization: true,
      colspanCallback: this.renderDifferentColspan
    };
  }

  definedGrid2() {
    this.columnDefinitions2 = [
      { id: 'sel', name: '#', field: 'num', behavior: 'select', cssClass: 'cell-selection', width: 40, resizable: false, selectable: false },
      { id: 'title', name: 'Title', field: 'title', sortable: true, columnGroup: 'Common Factor' },
      { id: 'duration', name: 'Duration', field: 'duration', columnGroup: 'Common Factor' },
      { id: 'start', name: 'Start', field: 'start', columnGroup: 'Period' },
      { id: 'finish', name: 'Finish', field: 'finish', columnGroup: 'Period' },
      { id: '%', name: '% Complete', field: 'percentComplete', selectable: false, columnGroup: 'Analysis' },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', type: FieldType.boolean, columnGroup: 'Analysis' }
    ];

    this.gridOptions2 = {
      enableCellNavigation: true,
      enableColumnReorder: false,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 25,
      explicitInitialization: true,
      gridHeight: 275,
      gridWidth: 800,
      frozenColumn: 2,
      enableExcelExport: true,
      excelExportOptions: {
        exportWithFormatter: false
      },
      registerExternalResources: [new ExcelExportService()],
      gridMenu: { hideClearFrozenColumnsCommand: false },
      headerMenu: { hideFreezeColumnsCommand: false }
    };
  }

  getData(count: number) {
    // Set up some test columns.
    const mockDataset = [];
    for (let i = 0; i < count; i++) {
      mockDataset[i] = {
        id: i,
        num: i,
        title: 'Task ' + i,
        duration: '5 days',
        percentComplete: Math.round(Math.random() * 100),
        start: '01/01/2009',
        finish: '01/05/2009',
        effortDriven: (i % 5 === 0)
      };
    }
    return mockDataset;
  }

  setFrozenColumns2(frozenCols: number) {
    this.gridObj2.setOptions({ frozenColumn: frozenCols });
    this.gridOptions2 = this.gridObj2.getOptions();
  }

  /**
   * A callback to render different row column span
   * Your callback will always have the "item" argument which you can use to decide on the colspan
   * Your return must always be in the form of:: return { columns: {}}
   */
  renderDifferentColspan(item: any): ItemMetadata {
    if (item.id % 2 === 1) {
      return {
        columns: {
          duration: {
            colspan: 3 // "duration" will span over 3 columns
          }
        }
      };
    }
    return {
      columns: {
        0: {
          colspan: '*' // starting at column index 0, we will span accross all column (*)
        }
      }
    };
  }
}
