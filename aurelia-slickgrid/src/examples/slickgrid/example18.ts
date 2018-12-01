import { autoinject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import {
  Aggregators,
  Column,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  GroupTotalFormatters,
  SortDirectionNumber,
  Sorters,
} from '../../aurelia-slickgrid';

@autoinject()
export class Example18 {
  title = 'Example 18: Draggable Grouping & Aggregators';
  subTitle = `
    <ul>
      <li><a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grouping-&-Aggregators" target="_blank">Wiki docs</a></li>
      <li>Drag any Column Header to group by the column (support multi-columns grouping)</li>
      <li>Fully dynamic and interactive multi-level grouping with filtering and aggregates over 50'000 items</li>
      <li>Each grouping level can have its own aggregates (over child rows, child groups, or all descendant rows)..</li>
      <li>Use "Aggregators" and "GroupTotalFormatters" directly from Aurelia-Slickgrid</li>
    </ul>
  `;

  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  dataviewObj: any;
  processing = false;
  subOnBeforeExport: Subscription;
  subOnAfterExport: Subscription;

  constructor(private ea: EventAggregator) {
    // define the grid options & columns and then create the grid itself
    this.loadData(500);
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready

    this.subOnBeforeExport = this.ea.subscribe('asg:onBeforeExportToFile', () => this.processing = true);
    this.subOnAfterExport = this.ea.subscribe('asg:onAfterExportToFile', () => this.processing = false);
  }

  detached() {
    this.subOnAfterExport.dispose();
    this.subOnBeforeExport.dispose();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'sel', name: '#', field: 'sel', cssClass: 'cell-selection', width: 40, resizable: false, selectable: false, focusable: false,
        grouping: {}
      },
      {
        id: 'title', name: 'Title', field: 'title', width: 70, minWidth: 50, cssClass: 'cell-title', sortable: true,
        grouping: {
          getter: 'title',
          formatter: (g) => {
            return `Title:  ${g.value}  <span style="color:green">(${g.count} items)</span>`;
          },
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'duration', name: 'Duration', field: 'duration', width: 70, sortable: true, groupTotalsFormatter: GroupTotalFormatters.sumTotals,
        grouping: {
          getter: 'duration',
          formatter: (g) => {
            return `Duration:  ${g.value}  <span style="color:green">(${g.count} items)</span>`;
          },
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'start', name: 'Start', field: 'start', minWidth: 60, sortable: true,
        formatter: Formatters.dateIso, type: FieldType.dateUtc, exportWithFormatter: true,
        grouping: {
          getter: 'start',
          formatter: (g) => {
            return `Start: ${g.value}  <span style="color:green">(${g.count} items)</span>`;
          },
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'finish', name: 'Finish', field: 'finish', minWidth: 60, sortable: true,
        formatter: Formatters.dateIso, type: FieldType.dateUtc, exportWithFormatter: true,
        grouping: {
          getter: 'finish',
          formatter: (g) => {
            return `Finish: ${g.value} <span style="color:green">(${g.count} items)</span>`;
          },
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'cost', name: 'Cost', field: 'cost', width: 90, sortable: true, groupTotalsFormatter: GroupTotalFormatters.sumTotals,
        grouping: {
          getter: 'cost',
          formatter: (g) => {
            return `Cost: ${g.value} <span style="color:green">(${g.count} items)</span>`;
          },
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          aggregateCollapsed: false,
          collapsed: false
        }
      },
      {
        id: 'effortDriven', name: 'Effort Driven', field: 'effortDriven',
        width: 80, minWidth: 20, maxWidth: 80, cssClass: 'cell-effort-driven',
        formatter: Formatters.checkmark, sortable: true,
        grouping: {
          getter: 'effortDriven',
          formatter: (g) => {
            return `Effort-Driven: ${g.value ? 'True' : 'False'} <span style="color:green">(${g.count} items)</span>`;
          },
          aggregators: [
            new Aggregators.Sum('cost')
          ],
          collapsed: false
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableDraggableGrouping: true,
      createPreHeaderPanel: true,
      showPreHeaderPanel: true,
      preHeaderPanelHeight: 35,
      enableFiltering: false,
      enableSorting: false,
      enableColumnReorder: true,
      exportOptions: {
        sanitizeDataExport: true
      },
      draggableGrouping: {
        dropPlaceHolderText: 'Drop a column header here to group by the column',
        // groupIconCssClass: 'fa fa-outdent',
        deleteIconCssClass: 'fa fa-times',
      }
    };
  }

  loadData(rowCount: number) {
    // mock a dataset
    this.dataset = [];
    for (let i = 0; i < rowCount; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor((Math.random() * 29));
      const randomPercent = Math.round(Math.random() * 100);

      this.dataset[i] = {
        id: 'id_' + i,
        num: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 100) + '',
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        cost: (i % 33 === 0) ? null : Math.round(Math.random() * 10000) / 100,
        effortDriven: (i % 5 === 0)
      };
    }
  }

  onDataviewCreated(dataview) {
    this.dataviewObj = dataview;
  }

  clearGrouping() {
    this.dataviewObj.setGrouping([]);
  }

  collapseAllGroups() {
    this.dataviewObj.collapseAllGroups();
  }

  expandAllGroups() {
    this.dataviewObj.expandAllGroups();
  }

  groupByDuration() {
    this.dataviewObj.setGrouping({
      getter: 'duration',
      formatter: (g) => {
        return `Duration:  ${g.value} <span style="color:green">(${g.count} items)</span>`;
      },
      comparer: (a, b) => {
        return Sorters.numeric(a.value, b.value, SortDirectionNumber.asc);
      },
      aggregators: [
        new Aggregators.Avg('percentComplete'),
        new Aggregators.Sum('cost')
      ],
      aggregateCollapsed: false,
      lazyTotalsCalculation: true
    });
  }

  groupByDurationOrderByCount(aggregateCollapsed) {
    this.dataviewObj.setGrouping({
      getter: 'duration',
      formatter: (g) => {
        return `Duration:  ${g.value} <span style="color:green">(${g.count} items)</span>`;
      },
      comparer: (a, b) => {
        return a.count - b.count;
      },
      aggregators: [
        new Aggregators.Avg('percentComplete'),
        new Aggregators.Sum('cost')
      ],
      aggregateCollapsed,
      lazyTotalsCalculation: true
    });
  }

  groupByDurationEffortDriven() {
    this.dataviewObj.setGrouping([
      {
        getter: 'duration',
        formatter: (g) => {
          return `Duration:  ${g.value}  <span style="color:green">(${g.count} items)</span>`;
        },
        aggregators: [
          new Aggregators.Sum('duration'),
          new Aggregators.Sum('cost')
        ],
        aggregateCollapsed: true,
        lazyTotalsCalculation: true
      },
      {
        getter: 'effortDriven',
        formatter: (g) => {
          return `Effort-Driven:  ${(g.value ? 'True' : 'False')} <span style="color:green">(${g.count} items)</span>`;
        },
        aggregators: [
          new Aggregators.Avg('percentComplete'),
          new Aggregators.Sum('cost')
        ],
        collapsed: true,
        lazyTotalsCalculation: true
      }
    ]);
  }

  groupByDurationEffortDrivenPercent() {
    this.dataviewObj.setGrouping([
      {
        getter: 'duration',
        formatter: (g) => {
          return `Duration:  ${g.value}  <span style="color:green">(${g.count} items)</span>`;
        },
        aggregators: [
          new Aggregators.Sum('duration'),
          new Aggregators.Sum('cost')
        ],
        aggregateCollapsed: true,
        lazyTotalsCalculation: true
      },
      {
        getter: 'effortDriven',
        formatter: (g) => {
          return `Effort-Driven:  ${(g.value ? 'True' : 'False')}  <span style="color:green">(${g.count} items)</span>`;
        },
        aggregators: [
          new Aggregators.Sum('duration'),
          new Aggregators.Sum('cost')
        ],
        lazyTotalsCalculation: true
      },
      {
        getter: 'percentComplete',
        formatter: (g) => {
          return `% Complete:  ${g.value}  <span style="color:green">(${g.count} items)</span>`;
        },
        aggregators: [
          new Aggregators.Avg('percentComplete')
        ],
        aggregateCollapsed: true,
        collapsed: true,
        lazyTotalsCalculation: true
      }
    ]);
  }
}
