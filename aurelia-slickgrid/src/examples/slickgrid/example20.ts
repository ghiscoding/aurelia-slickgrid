import { autoinject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { AureliaGridInstance, Column, Formatters, GridOption, Filters, FieldType } from '../../aurelia-slickgrid';
import './example20.scss';

@autoinject()
export class Example20 {
  title = 'Example 20: Pinned (frozen) Columns/Rows';
  subTitle = `
    This example demonstrates the use of Pinned (aka frozen) Columns and/or Rows<br/>
    <ul>
      <li>You can dynamically change the frozen columns or rows</li>
    </ul>
  `;

  aureliaGrid: AureliaGridInstance;
  columnDefinitions: Column[];
  gridObj: any;
  gridOptions: GridOption;
  frozenColumnCount = 2;
  frozenRowCount = 3;
  dataset: any[];
  selectedLanguage: string;

  constructor(private i18n: I18N) {
    this.selectedLanguage = this.i18n.getLocale();
    this.defineGrid();
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
    this.gridObj = aureliaGrid && aureliaGrid.slickGrid;
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'sel', name: '#', field: 'id',
        minWidth: 35, width: 35, maxWidth: 35,
        cannotTriggerInsert: true,
        resizable: false,
        unselectable: true,
      },
      {
        id: 'title', name: 'Title', field: 'title',
        minWidth: 100, width: 120,
        filterable: true,
        sortable: true
      },
      {
        id: 'duration', name: 'Duration', field: 'duration',
        minWidth: 100, width: 120,
        filterable: true,
        sortable: true
      },
      {
        id: 'percentComplete', name: '% Complete', field: 'percentComplete',
        resizable: false,
        minWidth: 130, width: 140,
        formatter: Formatters.percentCompleteBar,
        type: FieldType.number,
        filterable: true,
        filter: { model: Filters.slider, operator: '>=' },
        sortable: true
      },
      {
        id: 'start', name: 'Start', field: 'start',
        minWidth: 100, width: 120,
        filterable: true,
        sortable: true
      },
      {
        id: 'finish', name: 'Finish', field: 'finish',
        minWidth: 100, width: 120,
        filterable: true,
        sortable: true
      },
      {
        id: 'effortDriven', name: 'Effort Driven', field: 'effortDriven',
        minWidth: 100, width: 120,
        formatter: Formatters.checkmark,
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect
        },
        sortable: true
      },
      {
        id: 'title1', name: 'Title1', field: 'title1',
        minWidth: 100, width: 120,
        filterable: true,
        sortable: true
      },
      {
        id: 'title2', name: 'Title2', field: 'title2',
        minWidth: 100, width: 120,
        filterable: true,
        sortable: true
      },
      {
        id: 'title3', name: 'Title3', field: 'title3',
        minWidth: 100, width: 120,
        filterable: true,
        sortable: true
      },
      {
        id: 'title4', name: 'Title4', field: 'title4',
        minWidth: 100, width: 120,
        filterable: true,
        sortable: true
      }
    ];

    this.gridOptions = {
      enableAutoResize: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      alwaysShowVerticalScroll: false,
      enableCellNavigation: true,
      enableFiltering: true,
      asyncEditorLoading: true,
      forceFitColumns: false,
      autoEdit: false,
      frozenColumn: this.frozenColumnCount,
      frozenRow: this.frozenRowCount,
      showHeaderRow: true,
      syncColumnCellResize: false,
    };
  }

  getData() {
    // Set up some test columns.
    const mockDataset = [];
    for (let i = 0; i < 500; i++) {
      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 25) + ' days',
        percentComplete: Math.round(Math.random() * 100),
        start: '01/01/2009',
        finish: '01/05/2009',
        effortDriven: (i % 5 === 0),
        title1: Math.round(Math.random() * 25),
        title2: Math.round(Math.random() * 25),
        title3: Math.round(Math.random() * 25),
        title4: Math.round(Math.random() * 25),
      };
    }
    this.dataset = mockDataset;
  }

  // wire up model events to drive the grid
  onRowCountChanged(e, args) {
    this.gridObj.updateRowCount();
    this.gridObj.render();
  }

  changeFrozenColumnCount() {
    this.gridObj.setOptions({
      frozenColumn: this.frozenColumnCount
    });
  }

  changeFrozenRowCount() {
    this.gridObj.setOptions({
      frozenRow: this.frozenRowCount
    });
  }
}
