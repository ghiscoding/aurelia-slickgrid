import { I18N } from 'aurelia-i18n';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';
import { ExportService } from '../export.service';
import {
  Column,
  DelimiterType,
  FileType,
  Formatter,
  GridOption,
} from '../../models';
import { Formatters } from '../../formatters';

function removeMultipleSpaces(textS) {
  return `${textS}`.replace(/  +/g, '');
}

const DEFAULT_AURELIA_EVENT_PREFIX = 'asg';

// URL object is not supported in JSDOM, we can simply mock it
(global as any).URL.createObjectURL = jest.fn();

const myBoldHtmlFormatter: Formatter = (row, cell, value, columnDef, dataContext) => value !== null ? { text: `<b>${value}</b>` } : null;
const myUppercaseFormatter: Formatter = (row, cell, value, columnDef, dataContext) => value ? { text: value.toUpperCase() } : null;
const myCustomObjectFormatter: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid: any) => {
  let textValue = value && value.hasOwnProperty('text') ? value.text : value;
  const toolTip = value && value.hasOwnProperty('toolTip') ? value.toolTip : '';
  const cssClasses = value && value.hasOwnProperty('addClasses') ? [value.addClasses] : [''];
  if (dataContext && !isNaN(dataContext.order) && parseFloat(dataContext.order) > 10) {
    cssClasses.push('red');
    textValue = null;
  }
  return { text: textValue, addClasses: cssClasses.join(' '), toolTip };
};

const dataViewStub = {
  getGrouping: jest.fn(),
  getItem: jest.fn(),
  getLength: jest.fn(),
};

const mockGridOptions = {
  enablePagination: true,
  enableFiltering: true,
} as GridOption;

const gridStub = {
  getColumnIndex: jest.fn(),
  getOptions: () => mockGridOptions,
  getColumns: jest.fn(),
  getGrouping: jest.fn(),
};

describe('ExportService', () => {
  let ea: EventAggregator;
  let service: ExportService;
  let i18n: I18N;
  let mockColumns: Column[];
  let mockExportCsvOptions;
  let mockExportTxtOptions;
  let mockCsvBlob: Blob;
  let mockTxtBlob: Blob;

  beforeEach(() => {
    ea = new EventAggregator();
    i18n = new I18N(ea, new BindingSignaler());

    // @ts-ignore
    navigator.__defineGetter__('appName', () => 'Netscape');
    navigator.msSaveOrOpenBlob = undefined;
    mockCsvBlob = new Blob(['', ''], { type: `text/csv;charset=utf-8;` });
    mockTxtBlob = new Blob(['\uFEFF', ''], { type: `text/plain;charset=utf-8;` });

    mockExportCsvOptions = {
      delimiter: DelimiterType.comma,
      filename: 'export',
      format: FileType.csv,
      useUtf8WithBom: false,
    };

    mockExportTxtOptions = {
      delimiter: DelimiterType.tab,
      filename: 'export',
      format: FileType.txt
    };

    i18n.setup({
      resources: {
        en: {
          translation: {
            FIRST_NAME: 'First Name',
            LAST_NAME: 'Last Name',
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
            FIRST_NAME: 'Prénom',
            LAST_NAME: 'Nom de famille',
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
    delete mockGridOptions.backendServiceApi;
    jest.clearAllMocks();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should not have any output since there are no column definitions provided', (done) => {
    const eaSpy = jest.spyOn(ea, 'publish');
    const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');
    const spyDownload = jest.spyOn(service, 'startDownloadFile');

    const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
    const contentExpectation = '';

    service.init(gridStub, dataViewStub);
    service.exportToFile(mockExportCsvOptions);

    setTimeout(() => {
      expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, expect.anything());
      expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
      expect(spyDownload).toHaveBeenCalledWith({ ...optionExpectation, content: removeMultipleSpaces(contentExpectation) });
      done();
    });
  });

  describe('exportToFile method', () => {
    beforeEach(() => {
      mockColumns = [
        { id: 'id', field: 'id', excludeFromExport: true },
        { id: 'userId', field: 'userId', name: 'User Id', width: 100, exportCsvForceToKeepAsString: true },
        { id: 'firstName', field: 'firstName', width: 100, formatter: myBoldHtmlFormatter },
        { id: 'lastName', field: 'lastName', width: 100, formatter: myBoldHtmlFormatter, exportCustomFormatter: myUppercaseFormatter, sanitizeDataExport: true, exportWithFormatter: true },
        { id: 'position', field: 'position', width: 100 },
        { id: 'order', field: 'order', width: 100, exportWithFormatter: true, formatter: Formatters.multiple, params: { formatters: [myBoldHtmlFormatter, myCustomObjectFormatter] } },
      ] as Column[];

      jest.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    });

    it('should trigger an event before exporting the file', () => {
      const eaSpy = jest.spyOn(ea, 'publish');

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportTxtOptions);

      expect(eaSpy).toHaveBeenCalledWith(`${DEFAULT_AURELIA_EVENT_PREFIX}:onBeforeExportToFile`, true);
    });

    it('should trigger an event after exporting the file', (done) => {
      const eaSpy = jest.spyOn(ea, 'publish');

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportTxtOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, expect.anything());
        done();
      });
    });

    it('should call "URL.createObjectURL" with a Blob and CSV file when browser is not IE11 (basically any other browser) when exporting as CSV', (done) => {
      const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportCsvOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, optionExpectation);
        expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
        done();
      });
    });

    it('should call "msSaveOrOpenBlob" with a Blob and CSV file when browser is IE11 when exporting as CSV', (done) => {
      navigator.msSaveOrOpenBlob = jest.fn();
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyMsSave = jest.spyOn(navigator, 'msSaveOrOpenBlob');

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportCsvOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, expect.anything());
        expect(spyMsSave).toHaveBeenCalledWith(mockCsvBlob, 'export.csv');
        done();
      });
    });

    it('should call "URL.createObjectURL" with a Blob and TXT file when browser is not IE11 (basically any other browser) when exporting as TXT', (done) => {
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportTxtOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, expect.anything());
        expect(spyUrlCreate).toHaveBeenCalledWith(mockTxtBlob);
        done();
      });
    });

    it('should call "msSaveOrOpenBlob" with a Blob and TXT file when browser is IE11 when exporting as TXT', (done) => {
      navigator.msSaveOrOpenBlob = jest.fn();
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyMsSave = jest.spyOn(navigator, 'msSaveOrOpenBlob');

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportTxtOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, expect.anything());
        expect(spyMsSave).toHaveBeenCalledWith(mockTxtBlob, 'export.txt');
        done();
      });
    });

    it('should throw an error when browser is IE10 or lower', (done) => {
      // @ts-ignore
      navigator.__defineGetter__('appName', () => 'Microsoft Internet Explorer');

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportTxtOptions)
        .catch((e) => {
          expect(e.toString()).toContain('Microsoft Internet Explorer 6 to 10 do not support javascript export to CSV');
          done();
        });
    });
  });

  describe('startDownloadFile call after all private methods ran ', () => {
    let mockCollection: any[];

    it(`should have the Order exported correctly with multiple formatters which have 1 of them returning an object with a text property (instead of simple string)`, (done) => {
      mockCollection = [{ id: 0, userId: '1E06', firstName: 'John', lastName: 'Z', position: 'SALES_REP', order: 10 }];
      jest.spyOn(dataViewStub, 'getLength').mockReturnValue(mockCollection.length);
      jest.spyOn(dataViewStub, 'getItem').mockReturnValue(null).mockReturnValueOnce(mockCollection[0]);
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');
      const spyDownload = jest.spyOn(service, 'startDownloadFile');

      const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
      const contentExpectation =
        `"User Id","FirstName","LastName","Position","Order"
          ="1E06","John","Z","SALES_REP","<b>10</b>"`;

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportCsvOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, optionExpectation);
        expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
        expect(spyDownload).toHaveBeenCalledWith({ ...optionExpectation, content: removeMultipleSpaces(contentExpectation) });
        done();
      });
    });

    it(`should have the UserId escape with equal sign showing as prefix, to avoid Excel casting the value 1E06 to 1 exponential 6,
        when "exportCsvForceToKeepAsString" is enable in its column definition`, (done) => {
        mockCollection = [{ id: 0, userId: '1E06', firstName: 'John', lastName: 'Z', position: 'SALES_REP', order: 10 }];
        jest.spyOn(dataViewStub, 'getLength').mockReturnValue(mockCollection.length);
        jest.spyOn(dataViewStub, 'getItem').mockReturnValue(null).mockReturnValueOnce(mockCollection[0]);
        const eaSpy = jest.spyOn(ea, 'publish');
        const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');
        const spyDownload = jest.spyOn(service, 'startDownloadFile');

        const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
        const contentExpectation =
          `"User Id","FirstName","LastName","Position","Order"
          ="1E06","John","Z","SALES_REP","<b>10</b>"`;

        service.init(gridStub, dataViewStub);
        service.exportToFile(mockExportCsvOptions);

        setTimeout(() => {
          expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, optionExpectation);
          expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
          expect(spyDownload).toHaveBeenCalledWith({ ...optionExpectation, content: removeMultipleSpaces(contentExpectation) });
          done();
        });
      });

    it(`should have the LastName in uppercase when "formatter" is defined but also has "exportCustomFormatter" which will be used`, (done) => {
      mockCollection = [{ id: 1, userId: '2B02', firstName: 'Jane', lastName: 'Doe', position: 'FINANCE_MANAGER', order: 1 }];
      jest.spyOn(dataViewStub, 'getLength').mockReturnValue(mockCollection.length);
      jest.spyOn(dataViewStub, 'getItem').mockReturnValue(null).mockReturnValueOnce(mockCollection[0]);
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');
      const spyDownload = jest.spyOn(service, 'startDownloadFile');

      const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
      const contentExpectation =
        `"User Id","FirstName","LastName","Position","Order"
          ="2B02","Jane","DOE","FINANCE_MANAGER","<b>1</b>"`;

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportCsvOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, optionExpectation);
        expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
        expect(spyDownload).toHaveBeenCalledWith({ ...optionExpectation, content: removeMultipleSpaces(contentExpectation) });
        done();
      });
    });

    it(`should have the LastName as empty string when item LastName is NULL and column definition "formatter" is defined but also has "exportCustomFormatter" which will be used`, (done) => {
      mockCollection = [{ id: 2, userId: '3C2', firstName: 'Ava Luna', lastName: null, position: 'HUMAN_RESOURCES', order: 3 }];
      jest.spyOn(dataViewStub, 'getLength').mockReturnValue(mockCollection.length);
      jest.spyOn(dataViewStub, 'getItem').mockReturnValue(null).mockReturnValueOnce(mockCollection[0]);
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');
      const spyDownload = jest.spyOn(service, 'startDownloadFile');

      const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
      const contentExpectation =
        `"User Id","FirstName","LastName","Position","Order"
          ="3C2","Ava Luna","","HUMAN_RESOURCES","<b>3</b>"`;

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportCsvOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, optionExpectation);
        expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
        expect(spyDownload).toHaveBeenCalledWith({ ...optionExpectation, content: removeMultipleSpaces(contentExpectation) });
        done();
      });
    });

    it(`should have the Order as empty string when using multiple formatters and last one result in a null output because its value is bigger than 10`, (done) => {
      mockCollection = [{ id: 2, userId: '3C2', firstName: 'Ava', lastName: 'Luna', position: 'HUMAN_RESOURCES', order: 13 }];
      jest.spyOn(dataViewStub, 'getLength').mockReturnValue(mockCollection.length);
      jest.spyOn(dataViewStub, 'getItem').mockReturnValue(null).mockReturnValueOnce(mockCollection[0]);
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');
      const spyDownload = jest.spyOn(service, 'startDownloadFile');

      const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
      const contentExpectation =
        `"User Id","FirstName","LastName","Position","Order"
          ="3C2","Ava","LUNA","HUMAN_RESOURCES",""`;

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportCsvOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, optionExpectation);
        expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
        expect(spyDownload).toHaveBeenCalledWith({ ...optionExpectation, content: removeMultipleSpaces(contentExpectation) });
        done();
      });
    });

    it(`should have the UserId as empty string when its input value is null`, (done) => {
      mockCollection = [{ id: 3, userId: undefined, firstName: '', lastName: 'Cash', position: 'SALES_REP', order: 3 },];
      jest.spyOn(dataViewStub, 'getLength').mockReturnValue(mockCollection.length);
      jest.spyOn(dataViewStub, 'getItem').mockReturnValue(null).mockReturnValueOnce(mockCollection[0]);
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');
      const spyDownload = jest.spyOn(service, 'startDownloadFile');

      const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
      const contentExpectation =
        `"User Id","FirstName","LastName","Position","Order"
          ="","","CASH","SALES_REP","<b>3</b>"`;

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportCsvOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, optionExpectation);
        expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
        expect(spyDownload).toHaveBeenCalledWith({ ...optionExpectation, content: removeMultipleSpaces(contentExpectation) });
        done();
      });
    });

    it(`should have the Order without html tags when the grid option has "sanitizeDataExport" enabled`, (done) => {
      mockGridOptions.exportOptions = { sanitizeDataExport: true };
      mockCollection = [{ id: 1, userId: '2B02', firstName: 'Jane', lastName: 'Doe', position: 'FINANCE_MANAGER', order: 1 }];
      jest.spyOn(dataViewStub, 'getLength').mockReturnValue(mockCollection.length);
      jest.spyOn(dataViewStub, 'getItem').mockReturnValue(null).mockReturnValueOnce(mockCollection[0]);
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');
      const spyDownload = jest.spyOn(service, 'startDownloadFile');

      const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
      const contentExpectation =
        `"User Id","FirstName","LastName","Position","Order"
          ="2B02","Jane","DOE","FINANCE_MANAGER","1"`;

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportCsvOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, optionExpectation);
        expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
        expect(spyDownload).toHaveBeenCalledWith({ ...optionExpectation, content: removeMultipleSpaces(contentExpectation) });
        done();
      });
    });

    it(`should export as CSV even when the grid option format was not defined`, (done) => {
      mockGridOptions.exportOptions.format = undefined;
      mockCollection = [{ id: 1, userId: '2B02', firstName: 'Jane', lastName: 'Doe', position: 'FINANCE_MANAGER', order: 1 }];
      jest.spyOn(dataViewStub, 'getLength').mockReturnValue(mockCollection.length);
      jest.spyOn(dataViewStub, 'getItem').mockReturnValue(null).mockReturnValueOnce(mockCollection[0]);
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');
      const spyDownload = jest.spyOn(service, 'startDownloadFile');

      const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
      const contentExpectation =
        `"User Id","FirstName","LastName","Position","Order"
          ="2B02","Jane","DOE","FINANCE_MANAGER","1"`;

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportCsvOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `${DEFAULT_AURELIA_EVENT_PREFIX}:onAfterExportToFile`, optionExpectation);
        expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
        expect(spyDownload).toHaveBeenCalledWith({ ...optionExpectation, content: removeMultipleSpaces(contentExpectation) });
        done();
      });
    });
  });

  describe('with translation', () => {
    let mockCollection: any[];

    beforeEach(() => {
      mockGridOptions.defaultAureliaEventPrefix = 'asg-prefix';
      mockGridOptions.enableTranslate = true;
      mockGridOptions.i18n = i18n;

      mockColumns = [
        { id: 'id', field: 'id', excludeFromExport: true },
        { id: 'userId', field: 'userId', name: 'User Id', width: 100, exportCsvForceToKeepAsString: true },
        { id: 'firstName', field: 'firstName', headerKey: 'FIRST_NAME', width: 100, formatter: myBoldHtmlFormatter },
        { id: 'lastName', field: 'lastName', headerKey: 'LAST_NAME', width: 100, formatter: myBoldHtmlFormatter, exportCustomFormatter: myUppercaseFormatter, sanitizeDataExport: true, exportWithFormatter: true },
        { id: 'position', field: 'position', name: 'Position', width: 100, formatter: Formatters.translate, exportWithFormatter: true },
        { id: 'order', field: 'order', width: 100, exportWithFormatter: true, formatter: Formatters.multiple, params: { formatters: [myBoldHtmlFormatter, myCustomObjectFormatter] } },
      ] as Column[];

      jest.spyOn(gridStub, 'getColumns').mockReturnValue(mockColumns);
    });

    it(`should have the LastName header title translated when defined as a "headerKey" and "i18n" is set in grid option`, (done) => {
      mockCollection = [{ id: 0, userId: '1E06', firstName: 'John', lastName: 'Z', position: 'SALES_REP', order: 10 }];
      jest.spyOn(dataViewStub, 'getLength').mockReturnValue(mockCollection.length);
      jest.spyOn(dataViewStub, 'getItem').mockReturnValue(null).mockReturnValueOnce(mockCollection[0]);
      const eaSpy = jest.spyOn(ea, 'publish');
      const spyUrlCreate = jest.spyOn(URL, 'createObjectURL');
      const spyDownload = jest.spyOn(service, 'startDownloadFile');

      const optionExpectation = { filename: 'export.csv', format: 'csv', useUtf8WithBom: false };
      const contentExpectation =
        `"User Id","First Name","Last Name","Position","Order"
      ="1E06","John","Z","Sales Rep.","10"`;

      service.init(gridStub, dataViewStub);
      service.exportToFile(mockExportCsvOptions);

      setTimeout(() => {
        expect(eaSpy).toHaveBeenNthCalledWith(2, `asg-prefix:onAfterExportToFile`, optionExpectation);
        expect(spyUrlCreate).toHaveBeenCalledWith(mockCsvBlob);
        expect(spyDownload).toHaveBeenCalledWith({ ...optionExpectation, content: removeMultipleSpaces(contentExpectation) });
        done();
      });
    });
  });
});
