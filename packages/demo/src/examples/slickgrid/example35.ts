import {
  AureliaGridInstance,
  Column,
  Editors,
  FieldType,
  Formatters,
  GridOption,
} from 'aurelia-slickgrid';
import { I18N } from '@aurelia/i18n';
import { SlickCustomTooltip } from '@slickgrid-universal/custom-tooltip-plugin';
// import { TOptions as I18NOptions } from 'i18next';

import './example35.scss';
import { resolve } from 'aurelia';

const NB_ITEMS = 20;

export class Example35 {
  aureliaGrid!: AureliaGridInstance;
  gridOptions!: GridOption;
  columnDefinitions!: Column[];
  dataset!: any[];
  selectedLanguage: string;
  selectedLanguageFile: string;
  fetchResult = '';
  statusClass = 'alert alert-light';
  statusStyle = 'display: none';

  constructor(private readonly i18n: I18N = resolve(I18N)) {
    // define the grid options & columns and then create the grid itself
    this.defineGrid();

    // always start with English for Cypress E2E tests to be consistent
    const defaultLang = 'en';
    this.i18n.setLocale(defaultLang);
    this.selectedLanguage = defaultLang;
  }

  attached() {
    // mock some data (different in each dataset)
    this.dataset = this.getData(NB_ITEMS);
  }

  aureliaGridReady(aureliaGrid: AureliaGridInstance) {
    this.aureliaGrid = aureliaGrid;
  }

  /* Define grid Options and Columns */
  defineGrid() {
    this.columnDefinitions = [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        sortable: true,
        minWidth: 100,
        filterable: true,
        editor: { model: Editors.text },
      },
      {
        id: 'duration',
        name: 'Duration (days)',
        field: 'duration',
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.number,
        editor: { model: Editors.text },
      },
      {
        id: '%',
        name: '% Complete',
        field: 'percentComplete',
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: FieldType.number,
        editor: { model: Editors.text },
      },
      {
        id: 'start',
        name: 'Start',
        field: 'start',
        formatter: Formatters.dateIso,
        exportWithFormatter: true,
        filterable: true,
        editor: { model: Editors.date },
      },
      {
        id: 'finish',
        name: 'Finish',
        field: 'finish',
        formatter: Formatters.dateIso,
        exportWithFormatter: true,
        filterable: true,
        editor: { model: Editors.date },
      },
      {
        id: 'effort-driven',
        name: 'Effort Driven',
        field: 'effortDriven',
        sortable: true,
        minWidth: 100,
        filterable: true,
        type: 'boolean',
        editor: { model: Editors.checkbox },
      },
    ];

    this.gridOptions = {
      enableAutoResize: false,
      gridHeight: 350,
      gridWidth: 800,
      rowHeight: 33,
      enableExcelCopyBuffer: true,
      excelCopyBufferOptions: {
        onBeforePasteCell: (_e, args) => {
          // for the sake of the demo, do not allow to paste into the first column title
          // this will be overriden by the row based edit plugin to additionally only work if the row is in editmode
          return args.cell > 0;
        },
      },
      // NOTE: this will be automatically turned to true by the Row Based Edit Plugin.
      // A console warning will be shown if you omit this flag
      autoEdit: false,
      editable: true,
      enableCellNavigation: true,
      enableRowBasedEdit: true,
      enableTranslate: true,
      i18n: this.i18n,
      rowBasedEditOptions: {
        allowMultipleRows: false,
        onBeforeEditMode: () => this.clearStatus(),
        onBeforeRowUpdated: (args) => {
          const { effortDriven, percentComplete, finish, start, duration, title } = args.dataContext;

          if (duration > 40) {
            alert('Sorry, 40 is the maximum allowed duration.');
            return Promise.resolve(false);
          }

          return fakeFetch('your-backend-api/endpoint', {
            method: 'POST',
            body: JSON.stringify({ effortDriven, percentComplete, finish, start, duration, title }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            }
          }).catch(err => {
            console.error(err);
            return false;
          })
            .then((response: any) => {
              if (response === false) {
                this.statusClass = 'alert alert-danger';
                return false;
              }
              if (typeof response === 'object') {
                return response!.json();
              }
            })
            .then(json => {
              this.statusStyle = 'display: block';
              this.statusClass = 'alert alert-success';
              this.fetchResult = json.message;
              return true;
            });
        },
        actionColumnConfig: { // override the defaults of the action column
          width: 100,
          minWidth: 100,
          maxWidth: 100,
        },
        actionButtons: {
          editButtonClassName: 'button-style margin-auto px-2 me-1',
          iconEditButtonClassName: 'fa fa-pencil',
          // since no title and no titleKey is provided, it will fallback to the default text provided by the plugin
          // if the title is provided but no titleKey, it will override the default text
          // last but not least if a titleKey is provided, it will use the translation key to translate the text
          // editButtonTitle: 'Edit row',

          cancelButtonClassName: 'button-style px-2',
          cancelButtonTitle: 'Cancel row',
          cancelButtonTitleKey: 'RBE_BTN_CANCEL',
          iconCancelButtonClassName: 'fa fa-undo text-danger',
          cancelButtonPrompt: 'Are you sure you want to cancel your changes?',

          updateButtonClassName: 'button-style px-2 me-1',
          updateButtonTitle: 'Update row',
          updateButtonTitleKey: 'RBE_BTN_UPDATE',
          iconUpdateButtonClassName: 'fa fa-check text-success',
          updateButtonPrompt: 'Save changes?',

          deleteButtonClassName: 'button-style px-2',
          deleteButtonTitle: 'Delete row',
          iconDeleteButtonClassName: 'fa fa-trash-o text-danger',
          deleteButtonPrompt: 'Are you sure you want to delete this row?',
        },
      },
      externalResources: [new SlickCustomTooltip()],
    };
  }

  getData(count: number) {
    // mock a dataset
    const mockDataset: any[] = [];
    for (let i = 0; i < count; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor(Math.random() * 29);
      const randomPercent = Math.round(Math.random() * 100);

      mockDataset[i] = {
        id: i,
        title: 'Task ' + i,
        duration: Math.round(Math.random() * 40) + '',
        percentComplete: randomPercent,
        start: new Date(randomYear, randomMonth + 1, randomDay),
        finish: new Date(randomYear + 1, randomMonth + 1, randomDay),
        effortDriven: i % 5 === 0,
      };
    }

    return mockDataset;
  }

  clearStatus() {
    this.statusClass = 'alert alert-light';
    this.statusStyle = 'display: none';
    this.fetchResult = '';
  }

  toggleSingleMultiRowEdit() {
    const gridOptions = {
      ...this.gridOptions,
      ...{
        rowBasedEditOptions: {
          ...this.gridOptions.rowBasedEditOptions,
          ...{ allowMultipleRows: !this.gridOptions.rowBasedEditOptions?.allowMultipleRows },
        },
      },
    };
    this.aureliaGrid.slickGrid.setOptions(gridOptions);
    this.gridOptions = this.aureliaGrid.slickGrid.getOptions();
  }

  async switchLanguage() {
    const nextLanguage = (this.selectedLanguage === 'en') ? 'fr' : 'en';
    await this.i18n.setLocale(nextLanguage);
    this.selectedLanguage = nextLanguage;
  }
}

function fakeFetch(_input: string | URL | Request, _init?: RequestInit | undefined): Promise<Response> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(new Response(JSON.stringify({ status: 200, message: 'success' })));
      // reduces the delay for automated Cypress tests
    }, (window as any).Cypress ? 10 : 500);
  });
}
