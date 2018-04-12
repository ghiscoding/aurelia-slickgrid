import { FieldType } from '../../aurelia-slickgrid';

export class Example14 {
  title = 'Example 14: Column Span & Header Grouping';
  subTitle = `
  This example demonstrates how to easily span a row over multiple columns & how to group header titles.
  <ul>
    <li>
      Row Colspan - (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Row-Colspan" target="_blank">Wiki docs</a>) |
      Header Grouping - (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Header-Title-Grouping" target="_blank">Wiki docs</a>)
    </li>
    <li>Note that you can add Sort but remember that it will sort by the data that the row contains, even if the data is visually hidden by colspan it will still sort it</li>
    <li>
      Header Grouping spanning accross multiple columns is working but has some UI issues on window resize.
      If anyone can fix it, probably some CSS issues, please let us know.
    </li>
  </ul>
  `;
  columnDefinitions;
  gridOptions;
  dataset = [];

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, columnGroup: 'Common Factor' },
      { id: 'duration', name: 'Duration', field: 'duration', columnGroup: 'Common Factor' },
      { id: 'start', name: 'Start', field: 'start', columnGroup: 'Period' },
      { id: 'finish', name: 'Finish', field: 'finish', columnGroup: 'Period' },
      { id: '%', name: '% Complete', field: 'percentComplete', selectable: false, columnGroup: 'Analysis' },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', type: FieldType.boolean, columnGroup: 'Analysis' }
    ];

    this.gridOptions = {
      enableAutoResize: false,
      enableCellNavigation: true,
      enableColumnReorder: false,
      enableSorting: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 25,
      explicitInitialization: true,
      colspanCallback: this.renderDifferentColspan
    };
  }

  getData() {
    // Set up some test columns.
    this.dataset = [];
    for (let i = 0; i < 500; i++) {
      this.dataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: '5 days',
        percentComplete: Math.round(Math.random() * 100),
        start: '01/01/2009',
        finish: '01/05/2009',
        effortDriven: (i % 5 === 0)
      };
    }
  }

  /**
   * A callback to render different row column span
   * Your callback will always have the "item" argument which you can use to decide on the colspan
   * Your return must always be in the form of:: return { columns: {}}
   */
  renderDifferentColspan(item) {
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
