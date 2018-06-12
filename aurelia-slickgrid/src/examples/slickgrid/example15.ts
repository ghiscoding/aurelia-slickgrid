import { I18N } from 'aurelia-i18n';
import { autoinject } from 'aurelia-framework';
import { AureliaGridInstance, Column, FieldType, Filters, Formatters, GridOption, GridState, GridStateChange } from '../../aurelia-slickgrid';

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const LOCAL_STORAGE_KEY = 'gridState';
const NB_ITEMS = 500;

@autoinject()
export class Example15 {
  title = 'Example 15: Grid State & Presets using Local Storage';
  subTitle = `
  Grid State & Preset (<a href="https://github.com/ghiscoding/aurelia-slickgrid/wiki/Grid-State-&-Preset" target="_blank">Wiki docs</a>)
  <br/>
  <ul class="small">
    <li>Uses Local Storage to persist the Grid State and uses Grid Options "presets" to put the grid back to it's previous state</li>
    <ul>
       <li>to demo this, simply change any columns (position reorder, visibility, size, filter, sort), then refresh your browser with (F5)</li>
    </ul>
    <li>Local Storage is just one option, you can use whichever is more convenient for you (Local Storage, Session Storage, DB, ...)</li>
  </ul>
`;

  aureliaGrid: AureliaGridInstance;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];
  selectedLanguage: string;

  constructor(private i18n: I18N) {
    const presets = JSON.parse(localStorage[LOCAL_STORAGE_KEY] || null);

    // use some Grid State preset defaults if you wish
    // presets = presets || this.useDefaultPresets();

    this.defineGrid(presets);
    this.selectedLanguage = this.i18n.getLocale();
  }

  attached() {
    // populate the dataset once the grid is ready
    this.getData();
  }

  detached() {
    this.saveCurrentGridState();
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  /** Clear the Grid State from Local Storage and reset the grid to it's original state */
  clearGridStateFromLocalStorage() {
    localStorage[LOCAL_STORAGE_KEY] = null;
    this.aureliaGrid.gridService.resetGrid(this.columnDefinitions);
  }

  /* Define grid Options and Columns */
  defineGrid(gridStatePresets?: GridState) {
    // prepare a multiple-select array to filter with
    const multiSelectFilterArray = [];
    for (let i = 0; i < NB_ITEMS; i++) {
      multiSelectFilterArray.push({ value: i, label: i });
    }

    this.columnDefinitions = [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        headerKey: 'TITLE',
        filterable: true,
        sortable: true,
        type: FieldType.string,
        minWidth: 45, width: 100,
        filter: {
          model: Filters.compoundInput
        }
      },
      {
        id: 'description', name: 'Description', field: 'description', filterable: true, sortable: true, minWidth: 80, width: 100,
        type: FieldType.string,
        filter: {
          model: Filters.input
        }
      },
      {
        id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number, exportCsvForceToKeepAsString: true,
        minWidth: 55, width: 100,
        headerKey: 'DURATION',
        filterable: true,
        filter: {
          collection: multiSelectFilterArray,
          model: Filters.multipleSelect,
          searchTerms: [1, 33, 44, 50, 66], // default selection
          // we could add certain option(s) to the "multiple-select" plugin
          filterOptions: {
            maxHeight: 250,
            width: 175
          }
        }
      },
      {
        id: 'complete', name: '% Complete', field: 'percentComplete', minWidth: 70, type: FieldType.number, sortable: true, width: 100,
        formatter: Formatters.percentCompleteBar, filterable: true, filter: { model: Filters.slider, operator: '>' }
      },
      {
        id: 'start', name: 'Start', field: 'start', headerKey: 'START', formatter: Formatters.dateIso, sortable: true, minWidth: 75, exportWithFormatter: true, width: 100,
        type: FieldType.date, filterable: true, filter: { model: Filters.compoundDate }
      },
      {
        id: 'completed', field: 'completed', headerKey: 'COMPLETED', minWidth: 85, maxWidth: 85, formatter: Formatters.checkmark, width: 100,
        type: FieldType.boolean,
        sortable: true,
        filterable: true,
        filter: {
          collection: [{ value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' }],
          model: Filters.singleSelect,

          // we could add certain option(s) to the "multiple-select" plugin
          filterOptions: {
            autoDropWidth: true
          },
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableCheckboxSelector: true,
      enableFiltering: true,
      enableTranslate: true,
      i18n: this.i18n
    };

    // reload the Grid State with the grid options presets
    // but make sure the colums array is part of the Grid State before using them as presets
    if (gridStatePresets) {
      this.gridOptions.presets = gridStatePresets;
    }
  }

  getData() {
    // mock a dataset
    this.dataset = [];
    for (let i = 0; i < NB_ITEMS; i++) {
      const randomDuration = Math.round(Math.random() * 100);
      const randomYear = randomBetween(2000, 2025);
      const randomYearShort = randomBetween(10, 25);
      const randomMonth = randomBetween(1, 12);
      const randomMonthStr = (randomMonth < 10) ? `0${randomMonth}` : randomMonth;
      const randomDay = randomBetween(10, 28);
      const randomPercent = randomBetween(0, 100);
      const randomHour = randomBetween(10, 23);
      const randomTime = randomBetween(10, 59);

      this.dataset[i] = {
        id: i,
        title: 'Task ' + i,
        description: (i % 5) ? 'desc ' + i : null, // also add some random to test NULL field
        duration: randomDuration,
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: new Date(randomYear, randomMonth, randomDay),          // provide a Date format
        usDateShort: `${randomMonth}/${randomDay}/${randomYearShort}`, // provide a date US Short in the dataset
        utcDate: `${randomYear}-${randomMonthStr}-${randomDay}T${randomHour}:${randomTime}:${randomTime}Z`,
        effortDriven: (i % 3 === 0)
      };
    }
  }

  /** Dispatched event of a Grid State Changed event (which contain a "change" and the "gridState") */
  gridStateChanged(gridStateChanges: GridStateChange) {
    console.log('Client sample, Grid State changed:: ', gridStateChanges);
    localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(gridStateChanges.gridState);
  }

  /** Save Grid State in LocaleStorage */
  saveCurrentGridState() {
    const gridState: GridState = this.aureliaGrid.gridStateService.getCurrentGridState();
    console.log('Client sample, current Grid State:: ', gridState);
    localStorage[LOCAL_STORAGE_KEY] = JSON.stringify(gridState);
  }

  switchLanguage() {
    this.selectedLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    this.i18n.setLocale(this.selectedLanguage);
  }

  useDefaultPresets() {
    // use columnDef searchTerms OR use presets as shown below
    return {
      columns: [
        { columnId: 'description', width: 170 }, // flip column position of Title/Description to Description/Title
        { columnId: 'title', width: 55 },
        { columnId: 'duration' },
        { columnId: 'complete' },
        { columnId: 'start' },
        { columnId: 'usDateShort' },
        { columnId: 'utcDate' },
        // { columnId: 'effort-driven' }, // to HIDE a column, simply ommit it from the preset array
      ],
      filters: [
        { columnId: 'duration', searchTerms: [2, 22, 44] },
        // { columnId: 'complete', searchTerms: ['5'], operator: '>' },
        { columnId: 'usDateShort', operator: '<', searchTerms: ['4/20/25'] },
        // { columnId: 'effort-driven', searchTerms: [true] }
      ],
      sorters: [
        { columnId: 'duration', direction: 'DESC' },
        { columnId: 'complete', direction: 'ASC' }
      ],
    };
  }
}
