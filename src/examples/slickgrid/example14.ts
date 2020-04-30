import { Column, FieldType, GridOption } from '../../aurelia-slickgrid';
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

  columnDefinitions1: Column[];
  columnDefinitions2: Column[];
  gridOptions1: GridOption;
  gridOptions2: GridOption;
  dataset1 = [];
  dataset2 = [];

  constructor() {
    this.definedGrid1();
    this.definedGrid2();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.dataset1 = this.getData(500);
    this.dataset2 = this.getData(500);
  }

  definedGrid1() {
    this.columnDefinitions1 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, columnGroup: 'Common Factor' },
      { id: 'duration', name: 'Duration', field: 'duration', columnGroup: 'Common Factor' },
      // { id: 'start', name: 'Start', field: 'start', columnGroup: 'Common Factor' },
      { id: 'start', name: 'Start', field: 'start', columnGroup: 'Period' },
      { id: 'finish', name: 'Finish', field: 'finish', columnGroup: 'Period' },
      { id: '%', name: '% Complete', field: 'percentComplete', selectable: false, columnGroup: 'Analysis' },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', type: FieldType.boolean, columnGroup: 'Analysis' },
      { id: 5, name: '5', field: '5', columnGroup: 'Dummy' },
      { id: 6, name: '6', field: '6', columnGroup: 'Dummy' },
      { id: 7, name: '7', field: '7', columnGroup: 'Dummy' },
      { id: 8, name: '8', field: '8', columnGroup: 'Dummy' },
      { id: 9, name: '9', field: '9', columnGroup: 'Dummy' },
      { id: 10, name: '10', field: '10', columnGroup: 'Dummy' },
      { id: 11, name: '11', field: '11', columnGroup: 'Dummy' },
      { id: 12, name: '12', field: '12', columnGroup: 'Dummy' },
      { id: 13, name: '13', field: '13', columnGroup: 'Dummy' },
      { id: 14, name: '14', field: '14', columnGroup: 'Dummy' },
      { id: 15, name: '15', field: '15', columnGroup: 'Dummy' },
      { id: 16, name: '16', field: '16', columnGroup: 'Dummy' },
      { id: 17, name: '17', field: '17', columnGroup: 'Misc' },
      { id: 18, name: '18', field: '18', columnGroup: 'Misc' },
      { id: 19, name: '19', field: '19', columnGroup: 'Misc' },
      { id: 20, name: '20', field: '20', columnGroup: 'Misc' },
      { id: 21, name: '21', field: '21', columnGroup: 'Misc' },
      { id: 22, name: '22', field: '22', columnGroup: 'Misc' },
      { id: 23, name: '23', field: '23', columnGroup: 'Misc' },
      { id: 24, name: '24', field: '24', columnGroup: 'Misc' },
      { id: 25, name: '25', field: '25', columnGroup: 'Misc' },
      { id: 26, name: '26', field: '26', columnGroup: 'Misc' },
      { id: 27, name: '27', field: '27', columnGroup: 'Misc' },
      { id: 28, name: '28', field: '28', columnGroup: 'Misc' },
      { id: 29, name: '29', field: '29', columnGroup: 'Misc' },
      { id: 30, name: '30', field: '30', columnGroup: 'Something' },
      { id: 30, name: '30', field: '30', columnGroup: 'Something' },
      { id: 31, name: '31', field: '31', columnGroup: 'Something' },
      { id: 32, name: '32', field: '32', columnGroup: 'Something' },
      { id: 33, name: '33', field: '33', columnGroup: 'Something' },
      { id: 34, name: '34', field: '34', columnGroup: 'Something' },
      { id: 35, name: '35', field: '35', columnGroup: 'Something' },
      { id: 36, name: '36', field: '36', columnGroup: 'Something' },
      { id: 37, name: '37', field: '37', columnGroup: 'Something' },
      { id: 38, name: '38', field: '38', columnGroup: 'Something' },
      { id: 39, name: '39', field: '39', columnGroup: 'Something' },
      { id: 40, name: '40', field: '40', columnGroup: 'Something' },
      { id: 41, name: '41', field: '41', columnGroup: 'Something' },
      { id: 42, name: '42', field: '42', columnGroup: 'Something' },
      { id: 43, name: '43', field: '43', columnGroup: 'Something' },
      { id: 44, name: '44', field: '44', columnGroup: 'Something' },
      { id: 45, name: '45', field: '45', columnGroup: 'Something' },
      { id: 46, name: '46', field: '46', columnGroup: 'Extra' },
      { id: 47, name: '47', field: '47', columnGroup: 'Extra' },
      { id: 48, name: '48', field: '48', columnGroup: 'Extra' },
      { id: 49, name: '49', field: '49', columnGroup: 'Extra' },
      { id: 50, name: '50', field: '50', columnGroup: 'Extra' },
      { id: 51, name: '51', field: '51', columnGroup: 'Extra' },
      { id: 52, name: '52', field: '52', columnGroup: 'Extra' },
      { id: 53, name: '53', field: '53', columnGroup: 'Extra' },
      { id: 54, name: '54', field: '54', columnGroup: 'Extra' },
      { id: 55, name: '55', field: '55', columnGroup: 'Extra' },
      { id: 56, name: '56', field: '56', columnGroup: 'Extra' },
      { id: 57, name: '57', field: '57', columnGroup: 'Extra' },
      { id: 58, name: '58', field: '58', columnGroup: 'Extra' },
      { id: 59, name: '59', field: '59', columnGroup: 'Extra' },
      { id: 60, name: '60', field: '60', columnGroup: 'Extra' },
    ];

    this.gridOptions1 = {
      enableAutoResize: false,
      enableCellNavigation: true,
      enableColumnReorder: false,
      enableSorting: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 28,
      explicitInitialization: true,
      colspanCallback: this.renderDifferentColspan
    };
  }

  definedGrid2() {
    this.columnDefinitions2 = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, columnGroup: 'Common Factor' },
      { id: 'duration', name: 'Duration', field: 'duration', columnGroup: 'Common Factor' },
      { id: 'start', name: 'Start', field: 'start', columnGroup: 'Period' },
      { id: 'finish', name: 'Finish', field: 'finish', columnGroup: 'Period' },
      { id: '%', name: '% Complete', field: 'percentComplete', selectable: false, columnGroup: 'Analysis' },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', type: FieldType.boolean, columnGroup: 'Analysis' }
    ];

    this.gridOptions2 = {
      alwaysShowVerticalScroll: false, // disable scroll since we don't want it to show on the left pinned columns
      enableCellNavigation: true,
      enableColumnReorder: false,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 25,
      explicitInitialization: true,
      frozenColumn: 1,
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

  /**
   * A callback to render different row column span
   * Your callback will always have the "item" argument which you can use to decide on the colspan
   * Your return must always be in the form of:: return { columns: {}}
   */
  renderDifferentColspan(item: any) {
    if (item.id % 2 === 1) {
      return {
        columns: {
          duration: {
            colspan: 3 // "duration" will span over 3 columns
          }
        }
      };
    } else {
      return {
        columns: {
          0: {
            colspan: '*' // starting at column index 0, we will span accross all column (*)
          }
        }
      };
    }
  }
}
