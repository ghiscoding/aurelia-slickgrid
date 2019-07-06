import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';
import { ExportService } from '../export.service';
import {
  BackendService,
  DelimiterType,
  FileType,
  FilterChangedArgs,
  GridOption,
} from '../../models';

declare var Slick: any;
const DEFAULT_AURELIA_EVENT_PREFIX = 'asg';

// URL object is not supported in JSDOM, we can simply mock it
(global as any).URL.createObjectURL = jest.fn();

const gridOptionMock = {
  enablePagination: true,
  enableFiltering: true,
  backendServiceApi: {
    service: undefined,
    preProcess: jest.fn(),
    process: jest.fn(),
    postProcess: jest.fn(),
  }
} as GridOption;

const dataViewStub = {
  getGrouping: jest.fn(),
  getIdxById: jest.fn(),
  getLength: jest.fn(),
  refresh: jest.fn(),
  setFilter: jest.fn(),
  setFilterArgs: jest.fn(),
  sort: jest.fn(),
  reSort: jest.fn(),
};

const backendServiceStub = {
  clearFilters: jest.fn(),
  getCurrentFilters: jest.fn(),
  getCurrentPagination: jest.fn(),
  processOnFilterChanged: (event: Event, args: FilterChangedArgs) => 'backend query',
} as unknown as BackendService;

const gridStub = {
  autosizeColumns: jest.fn(),
  getColumnIndex: jest.fn(),
  getOptions: () => gridOptionMock,
  getColumns: jest.fn(),
  getHeaderRowColumn: jest.fn(),
  getSortColumns: jest.fn(),
  invalidate: jest.fn(),
  onLocalSortChanged: jest.fn(),
  onSort: new Slick.Event(),
  onHeaderRowCellRendered: new Slick.Event(),
  render: jest.fn(),
  setSortColumns: jest.fn(),
};

describe('FilterService', () => {
  let ea: EventAggregator;
  let service: ExportService;
  let i18n: I18N;

  beforeEach(() => {
    ea = new EventAggregator();
    i18n = new I18N(ea, new BindingSignaler());
    i18n.setup({
      resources: {
        en: {
          translation: {
            SALES_REP: 'Sales Rep.',
            FINANCE_MANAGER: 'Finance Manager',
            HUMAN_RESOURCES: 'Human Resources',
            IT_ADMIN: 'IT Admin',
            DEVELOPER: 'Developer',
          }
        },
        fr: {
          translation:
          {
            SALES_REP: 'Représentant des ventes',
            FINANCE_MANAGER: 'Responsable des finances',
            HUMAN_RESOURCES: 'Ressources humaines',
            IT_ADMIN: 'Administrateur IT',
            DEVELOPER: 'Développeur',
          }
        }
      },
      lng: '0',
      fallbackLng: 'en',
      debug: false
    });
    service = new ExportService(i18n, ea);
  });

  afterEach(() => {
    delete gridOptionMock.backendServiceApi;
    jest.clearAllMocks();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('exportToFile method', () => {
    let mockExportOptions;

    beforeEach(() => {
      mockExportOptions = {
        delimiter: DelimiterType.tab,
        filename: 'export',
        format: FileType.txt,
        useUtf8WithBom: true
      };
    });

    it('should trigger an event before exporting the file', () => {
      const eaSpy = jest.spyOn(ea, 'publish');

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportOptions);

      expect(eaSpy).toHaveBeenCalledWith(`${DEFAULT_AURELIA_EVENT_PREFIX}:onBeforeExportToFile`, true);
    });

    it('should trigger an event after exporting the file', (done) => {
      const optionExpectation = {
        filename: 'export.txt',
        csvContent: '',
        format: FileType.txt,
        useUtf8WithBom: true
      };
      const eaSpy = jest.spyOn(ea, 'publish');

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, optionExpectation);
        done();
      });
    });
  });
});
