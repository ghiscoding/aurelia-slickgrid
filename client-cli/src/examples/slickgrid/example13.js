import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Aggregators, FieldType, Formatters, GroupTotalFormatters, SortDirectionNumber, Sorters } from 'aurelia-slickgrid';

@inject(EventAggregator)
export class Example13 {
  title = 'Example 13: Grouping & Aggregators';
  subTitle = `
    <ul>
      <li>Fully dynamic and interactive multi-level grouping with filtering and aggregates over 50'000 items</li>
      <li>Each grouping level can have its own aggregates (over child rows, child groups, or all descendant rows)..</li>
      <li>Use "Aggregators" and "GroupTotalFormatters" directly from Angular-Slickgrid</li>
    </ul>
  `;

  columnDefinitions;
  gridOptions;
  dataset = [];
  dataviewObj;
  processing = false;
  subOnBeforeExport;
  subOnAfterExport;
  ea;

  constructor(eventAggregator) {
    this.ea = eventAggregator;

    // define the grid options & columns and then create the grid itself
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.loadData(500);

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
        id: 'sel', name: '#', field: 'num', width: 40,
        maxWidth: 70,
        resizable: true,
        selectable: false,
        focusable: false
      },
      {
        id: 'title', name: 'Title', field: 'title',
        width: 50,
        minWidth: 50,
        cssClass: 'cell-title',
        sortable: true
      },
      {
        id: 'duration', name: 'Duration', field: 'duration',
        minWidth: 50, width: 60,
        sortable: true,
        type: FieldType.number,
        groupTotalsFormatter: GroupTotalFormatters.sumTotals,
        params: { groupFormatterPrefix: 'Total: ' }
      },
      {
        id: '%', name: '% Complete', field: 'percentComplete',
        minWidth: 70, width: 90,
        formatter: Formatters.percentCompleteBar,
        sortable: true,
        groupTotalsFormatter: GroupTotalFormatters.avgTotalsPercentage,
        params: { groupFormatterPrefix: '<i>Avg</i>: ' }
      },
      {
        id: 'start', name: 'Start', field: 'start',
        minWidth: 60,
        sortable: true,
        formatter: Formatters.dateIso,
        exportWithFormatter: true
      },
      {
        id: 'finish', name: 'Finish', field: 'finish',
        minWidth: 60,
        sortable: true,
        formatter: Formatters.dateIso,
        exportWithFormatter: true
      },
      {
        id: 'cost', name: 'Cost', field: 'cost',
        minWidth: 70,
        width: 100,
        sortable: true,
        exportWithFormatter: true,
        formatter: Formatters.dollar,
        groupTotalsFormatter: GroupTotalFormatters.sumTotalsDollar,
        params: { groupFormatterPrefix: '<b>Total</b>: ' /*, groupFormatterSuffix: ' USD'*/ }
      },
      {
        id: 'effort-driven', name: 'Effort Driven',
        minWidth: 20, width: 80, maxWidth: 80,
        cssClass: 'cell-effort-driven',
        field: 'effortDriven',
        formatter: Formatters.checkmark, sortable: true
      }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableGrouping: true,
      exportOptions: {
        sanitizeDataExport: true
      }
    };
  }

  loadData(rowCount) {
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
        cost: Math.round(Math.random() * 10000) / 100,
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
