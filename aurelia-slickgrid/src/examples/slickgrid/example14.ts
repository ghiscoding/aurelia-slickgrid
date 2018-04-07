import { autoinject, bindable } from 'aurelia-framework';
import { Column, FieldType, Formatter, Formatters, GridOption } from '../../aurelia-slickgrid';
import * as $ from 'jquery';

@autoinject()
export class Example14 {
  title = 'Example 14: Column Span';
  subTitle = `
    This example demonstrates how to easily span a column over multiple columns.
    <ul>
      <li>However please note that for this to work properly, you need to call the "dataView.getItemMetadata"
      <b>only</b> after the "dataView" is created for it to render at the correct time (else you will face timing UI issues)
      </li>
      <li>Note that you can add Sort but remember that it will sort by the data that the row contains, even if the data is visually hidden by colspan it will still sort it</li>
    </ul>
  `;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];
  visibleColumns;

  constructor() {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  defineGrid() {
    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true },
      { id: 'duration', name: 'Duration', field: 'duration' },
      { id: '%', name: '% Complete', field: 'percentComplete', selectable: false },
      { id: 'start', name: 'Start', field: 'start' },
      { id: 'finish', name: 'Finish', field: 'finish' },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', type: FieldType.boolean }
    ];

    this.gridOptions = {
      enableAutoResize: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableCellNavigation: true,
      enableColumnReorder: false,
      enableSorting: true
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

  /** Call the "getItemMetadata" on the DataView to render different column span */
  renderDifferentColspan(dataView: any) {
    dataView.getItemMetadata = (rowNumber: number) => {
      const item = dataView.getItem(rowNumber);

      if (item.id % 2 === 1) {
        return {
          columns: {
            duration: {
              colspan: 3
            }
          }
        };
      } else {
        return {
          columns: {
            0: {
              colspan: '*'
            }
          }
        };
      }
    };
  }

  /** Execute after DataView is created and ready */
  onDataviewCreated(dataView) {
    // populate the dataset once the DataView is ready
    this.getData();

    // render different colspan right after the DataView is filled
    this.renderDifferentColspan(dataView);
  }
}
