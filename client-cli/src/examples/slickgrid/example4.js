import { HttpClient } from 'aurelia-http-client';
import { inject } from 'aurelia-framework';
import { CustomInputFilter } from './custom-inputFilter';
import { AureliaGridInstance, Column, FieldType, Filters, Formatters, GridOption, OperatorType, Statistic } from 'aurelia-slickgrid';

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const NB_ITEMS = 500;
const URL_SAMPLE_COLLECTION_DATA = 'assets/data/collection_500_numbers.json';

@inject(HttpClient)
export class Example4 {
  title = 'Example 4: Client Side Sort/Filter';
  subTitle = `
  Sort/Filter on client side only using SlickGrid DataView (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Sorting" target="_blank">Wiki docs</a>)
  <br/>
  <ul class="small">
    <li>Support multi-sort (by default), hold "Shift" key and click on the next column to sort.</li>
    <li>All column types support the following operators: (>, >=, <, <=, <>, !=, =, ==, *)</li>
    <ul>
      <li>Example: >100 ... >=2001-01-01 ... >02/28/17</li>
      <li><b>Note:</b> For filters to work properly (default is string), make sure to provide a FieldType (type is against the dataset, not the Formatter)</li>
    </ul>
    <li>Date Filters</li>
    <ul>
      <li>FieldType of dateUtc/date (from dataset) can use an extra option of "filterSearchType" to let user filter more easily. For example, in the "UTC Date" field below, you can type "&gt;02/28/2017", also when dealing with UTC you have to take the time difference in consideration.</li>
    </ul>
    <li>On String filters, (*) can be used as startsWith (Hello* => matches "Hello Word") ... endsWith (*Doe => matches: "John Doe")</li>
    <li>Custom Filter are now possible, "Description" column below, is a customized InputFilter with different placeholder. See <a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Custom-Filter" target="_blank">Wiki - Custom Filter</a></li>
  </ul>
`;

  aureliaGrid;
  columnDefinitions = [];
  gridOptions;
  dataset = [];
  statistics;

  constructor(http) {
    this.http = http;
    this.defineGrid();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.dataset = this.mockData(NB_ITEMS);
  }

  detached() {
    this.saveCurrentGridState();
  }

  aureliaGridReady(aureliaGrid) {
    this.aureliaGrid = aureliaGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        filterable: true,
        sortable: true,
        type: FieldType.string,
        minWidth: 45,
        filter: {
          model: Filters.compoundInputText
        }
      },
      {
        id: 'description', name: 'Description', field: 'description', filterable: true, sortable: true, minWidth: 80,
        type: FieldType.string,
        filter: {
          model: new CustomInputFilter() // create a new instance to make each Filter independent from each other customFilter
        }
      },
      {
        id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number, exportCsvForceToKeepAsString: true,
        minWidth: 55,
        filterable: true,
        filter: {
          model: Filters.multipleSelect,
          // We can load the "collection" asynchronously (on first load only, after that we will simply use "collection")
          // 3 ways are supported (aurelia-http-client, aurelia-fetch-client OR even Promise)

          // 1- USE HttpClient from "aurelia-http-client" to load collection asynchronously
          collectionAsync: this.http.createRequest(URL_SAMPLE_COLLECTION_DATA).asGet().send(),

          // OR 2- use "aurelia-fetch-client", they are both supported
          // collectionAsync: this.httpFetch.fetch(URL_SAMPLE_COLLECTION_DATA),

          // collectionFilterBy & collectionSortBy accept a single or multiple options
          // we can exclude certains values 365 & 360 from the dropdown filter
          collectionFilterBy: [{
            property: 'value',
            operator: OperatorType.notEqual,
            value: 360
          }, {
            property: 'value',
            operator: OperatorType.notEqual,
            value: 365
          }],

          // sort the select dropdown in a descending order
          collectionSortBy: {
            property: 'value',
            sortDesc: true,
            fieldType: FieldType.number
          },
          customStructure: {
            value: 'value',
            label: 'label',
            optionLabel: 'value', // if selected text is too long, we can use option labels instead
            labelSuffix: 'text'
          },
          collectionOptions: {
            separatorBetweenTextLabels: ' ',
            filterResultAfterEachPass: 'chain' // options are "merge" or "chain" (defaults to "chain")
          },
          // we could add certain option(s) to the "multiple-select" plugin
          filterOptions: {
            maxHeight: 250,
            width: 175,

            // if we want to display shorter text as the selected text (on the select filter itself, parent element)
            // we can use "useSelectOptionLabel" or "useSelectOptionLabelToHtml" the latter will parse html
            useSelectOptionLabelToHtml: true
          }
        }
      },
      {
        id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, minWidth: 70, type: FieldType.number, sortable: true,
        filterable: true, filter: { model: Filters.compoundInputNumber }
      },
      {
        id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, minWidth: 75, exportWithFormatter: true,
        type: FieldType.date, filterable: true, filter: { model: Filters.compoundDate }
      },
      {
        id: 'usDateShort', name: 'US Date Short', field: 'usDateShort', sortable: true, minWidth: 70, width: 70,
        type: FieldType.dateUsShort, filterable: true, filter: { model: Filters.compoundDate }
      },
      {
        id: 'utcDate', name: 'UTC Date', field: 'utcDate', formatter: Formatters.dateTimeIsoAmPm, sortable: true, minWidth: 115,
        type: FieldType.dateUtc, outputType: FieldType.dateTimeIsoAmPm, filterable: true, filter: { model: Filters.compoundDate }
      },
      {
        id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven.isEffort', minWidth: 85, maxWidth: 95,
        type: FieldType.boolean,
        sortable: true,

        // to pass multiple formatters, use the params property
        // also these formatters are executed in sequence, so if you want the checkmark to work correctly, it has to be the last formatter defined
        formatter: Formatters.multiple,
        params: { formatters: [Formatters.complexObject, Formatters.checkmark] },

        // when the "field" string includes the dot "." notation, the library will consider this to be a complex object and Filter accordingly
        filterable: true,
        filter: {
          // We can also add HTML text to be rendered (any bad script will be sanitized) but we have to opt-in, else it will be sanitized
          // enableRenderHtml: true,
          // collection: [{ value: '', label: '' }, { value: true, label: 'True', labelPrefix: `<i class="fa fa-check"></i> ` }, { value: false, label: 'False' }],

          collection: [{ isEffort: '', label: '' }, { isEffort: true, label: 'True' }, { isEffort: false, label: 'False' }],
          customStructure: {
            value: 'isEffort',
            label: 'label'
          },
          model: Filters.singleSelect,

          // we could add certain option(s) to the "multiple-select" plugin
          filterOptions: {
            maxHeight: 250
          }
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableFiltering: true,

      // use columnDef searchTerms OR use presets as shown below
      presets: {
        filters: [
          { columnId: 'duration', searchTerms: [10, 220] },
          // { columnId: 'complete', searchTerms: ['5'], operator: '>' },
          { columnId: 'usDateShort', operator: '<', searchTerms: ['4/20/25'] }
          // { columnId: 'effort-driven', searchTerms: [true] }
        ],
        sorters: [
          { columnId: 'duration', direction: 'DESC' },
          { columnId: 'complete', direction: 'ASC' }
        ]
      }
    };
  }

  mockData(itemCount, startingIndex = 0) {
    // mock a dataset
    const tempDataset = [];
    for (let i = startingIndex; i < (startingIndex + itemCount); i++) {
      const randomDuration = Math.round(Math.random() * 100);
      const randomYear = randomBetween(2000, 2025);
      const randomYearShort = randomBetween(10, 25);
      const randomMonth = randomBetween(1, 12);
      const randomMonthStr = (randomMonth < 10) ? `0${randomMonth}` : randomMonth;
      const randomDay = randomBetween(10, 28);
      const randomPercent = randomBetween(0, 100);
      const randomHour = randomBetween(10, 23);
      const randomTime = randomBetween(10, 59);
      const randomIsEffort = (i % 3 === 0);

      tempDataset.push({
        id: i,
        title: 'Task ' + i,
        description: (i % 5) ? 'desc ' + i : null, // also add some random to test NULL field
        duration: randomDuration,
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: (i % 4) ? null : new Date(randomYear, randomMonth, randomDay),          // provide a Date format
        usDateShort: `${randomMonth}/${randomDay}/${randomYearShort}`, // provide a date US Short in the dataset
        utcDate: `${randomYear}-${randomMonthStr}-${randomDay}T${randomHour}:${randomTime}:${randomTime}Z`,
        effortDriven: {
          isEffort: randomIsEffort,
          label: randomIsEffort ? 'Effort' : 'NoEffort'
        }
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
}
