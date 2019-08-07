import { autoinject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { CustomInputFilter } from './custom-inputFilter';
import { AureliaGridInstance, Column, FieldType, Filters, Formatter, Formatters, GridOption, OperatorType, Statistic } from '../../aurelia-slickgrid';
import * as moment from 'moment-mini';

const NB_ITEMS = 1000;

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// create a custom translate Formatter (typically you would move that a separate file, for separation of concerns)
const taskTranslateFormatter: Formatter = (row: number, cell: number, value: any, columnDef: any, dataContext: any, grid: any) => {
  const gridOptions = (grid && typeof grid.getOptions === 'function') ? grid.getOptions() : {};
  const i18n = gridOptions.i18n;

  return i18n && i18n.tr && i18n.tr('TASK_X', { x: value });
};

@autoinject()
export class Example23 {
  title = 'Example 23: Filtering from Range of Search Values';
  subTitle = `
    This demo shows how to use Filters with Range of Search Values (for example, shown below, filters by duration of 1 to 5 days)
    <br/>
    <ul class="small">
      <li>All input filters support the following operators: (>, >=, <, <=, <>, !=, =, ==, a*, *z)
      <li>All input filters also support range search by using the 2 dots (..) to represent a range, even for dates to be consistent when using the "presets"</li>
      <ul>
        <li>For the range in a text input filters, you can use 2 dots (..) to represent a range</li>
        <li>example: type "5..10" to filter between 5 and 10 (non-inclusive)</li>
      </ul>
      <ul>
        <li>by default the range are not inclusive but if you wish to be inclusive, you can see the Operator to "operator: 'RangeInclusive'" or "operator: OperatoryType.rangeIncluside"</li>
        <li>you can also set the inverse (and default) to "operator: 'RangeExclusive'" or "operator: OperatoryType.rangeExclusive"</li>
      </ul>
      <li>Date Range with Flatpickr Date Picker</li>
    </ul>
  `;

  aureliaGrid: AureliaGridInstance;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  selectedLanguage: string;
  statistics: Statistic;

  constructor(private i18n: I18N) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();

    // always start with English for Cypress E2E tests to be consistent
    const defaultLang = 'en';
    this.i18n.setLocale(defaultLang);
    this.selectedLanguage = defaultLang;
  }

  attached() {
    // populate the dataset once the grid is ready
    this.dataset = this.mockData(NB_ITEMS);
  }

  detached() {
    this.saveCurrentGridState();
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'title', name: 'Title', field: 'id', headerKey: 'TITLE', minWidth: 100,
        formatter: taskTranslateFormatter,
        sortable: true,
        filterable: true,
        params: { useFormatterOuputToFilter: true }
      },
      {
        id: 'description', name: 'Description', field: 'description', filterable: true, sortable: true, minWidth: 80,
        type: FieldType.string,
        filter: {
          model: new CustomInputFilter(), // create a new instance to make each Filter independent from each other
          enableTrimWhiteSpace: true // or use global "enableFilterTrimWhiteSpace" to trim on all Filters
        }
      },
      {
        id: 'complete', name: '% Complete', field: 'percentComplete', headerKey: 'PERCENT_COMPLETE', minWidth: 70,
        type: FieldType.number,
        sortable: true,
        filterable: true, filter: {
          model: Filters.input,
          operator: OperatorType.rangeExclusive // defaults to exclusive
        }
      },
      {
        id: 'duration', field: 'duration', headerKey: 'DURATION', sortable: true,
        formatter: Formatters.percentCompleteBar, minWidth: 100,
        type: FieldType.number,
        filterable: true,
        filter: {
          model: Filters.sliderRange,
          minValue: 0,
          maxValue: 100,
          operator: OperatorType.rangeInclusive, // defaults to exclusive
          params: { valueStep: 5 } // you can provide an optional value step, 1 is the default
        }
      },
      {
        id: 'start', name: 'Start', field: 'start', headerKey: 'START', formatter: Formatters.dateIso, sortable: true, minWidth: 75, exportWithFormatter: true,
        type: FieldType.date, filterable: true, filter: { model: Filters.compoundDate }
      },
      {
        id: 'finish', name: 'Finish', field: 'finish', headerKey: 'FINISH', formatter: Formatters.dateIso, sortable: true, minWidth: 75, exportWithFormatter: true,
        type: FieldType.date,
        filterable: true,
        filter: {
          model: Filters.dateRange,
        }
      },
      {
        id: 'completed', name: 'Completed', field: 'completed', headerKey: 'COMPLETED', minWidth: 85, maxWidth: 85,
        formatter: Formatters.checkmark,
        exportWithFormatter: true, // you can set this property in the column definition OR in the grid options, column def has priority over grid options
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect,
          filterOptions: {
            autoDropWidth: true
          }
        }
      }
    ];

    const presetLowestDay = moment().add(-2, 'days').format('YYYY-MM-DD');
    const presetHighestDay = moment().add(20, 'days').format('YYYY-MM-DD');

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      enableTranslate: true,
      i18n: this.i18n,

      // use columnDef searchTerms OR use presets as shown below
      presets: {
        filters: [
          { columnId: 'duration', searchTerms: ['15..75'] },
          { columnId: 'complete', searchTerms: ['15..75'] },
          { columnId: 'finish', operator: 'RangeInclusive', searchTerms: [`${presetLowestDay}..${presetHighestDay}`] },
          // { columnId: 'effort-driven', searchTerms: [true] }
        ],
        sorters: [
          { columnId: 'complete', direction: 'ASC' },
          { columnId: 'duration', direction: 'DESC' },
        ],
      }
    };
  }

  mockData(itemCount, startingIndex = 0): any[] {
    // mock a dataset
    const tempDataset = [];
    for (let i = startingIndex; i < (startingIndex + itemCount); i++) {
      const randomDuration = Math.round(Math.random() * 100);
      const randomYear = randomBetween(moment().year(), moment().year() + 1);
      const randomMonth = randomBetween(1, 12);
      const randomDay = randomBetween(10, 28);
      const randomPercent = randomBetween(0, 100);

      tempDataset.push({
        id: i,
        title: 'Task ' + i,
        description: (i % 5) ? 'desc ' + i : null, // also add some random to test NULL field
        duration: randomDuration,
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: (i % 4) ? null : new Date(randomYear, randomMonth, randomDay),          // provide a Date format
        finish: new Date(randomYear, (randomMonth + 1), randomDay),
        effortDriven: (i % 5 === 0) ? true : false,
      });
    }

    return tempDataset;
  }

  /** Dispatched event of a Grid State Changed event */
  gridStateChanged(gridState) {
    console.log('Client sample, Grid State changed:: ', gridState);
  }

  /** Save current Filters, Sorters in LocaleStorage or DB */
  saveCurrentGridState() {
    console.log('Client sample, current Grid State:: ', this.aureliaGrid.gridStateService.getCurrentGridState());
  }

  refreshStatistics(e, args) {
    if (args && args.current > 0) {
      setTimeout(() => {
        this.statistics = {
          startTime: new Date(),
          itemCount: args && args.current,
          totalItemCount: this.dataset.length
        };
      });
    }
  }

  switchLanguage() {
    const nextLocale = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.setLocale(nextLocale).then(() => this.selectedLanguage = nextLocale);
  }
}
