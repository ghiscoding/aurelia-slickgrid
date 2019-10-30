import { bootstrap } from 'aurelia-bootstrapper';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingEngine, Container } from 'aurelia-framework';
import { StageComponent } from 'aurelia-testing';
import { PLATFORM } from 'aurelia-pal';

import { AureliaSlickgridCustomElement } from './aurelia-slickgrid';
import { SlickgridConfig } from './slickgrid-config';

import {
  ExtensionUtility,
  AutoTooltipExtension,
  CellExternalCopyManagerExtension,
  CheckboxSelectorExtension,
  ColumnPickerExtension,
  DraggableGroupingExtension,
  GridMenuExtension,
  GroupItemMetaProviderExtension,
  HeaderButtonExtension,
  HeaderMenuExtension,
  RowDetailViewExtension,
  RowMoveManagerExtension,
  RowSelectionExtension,
} from './extensions';
import {
  AureliaUtilService,
  CollectionService,
  ExcelExportService,
  ExportService,
  ExtensionService,
  FilterService,
  GraphqlService,
  GridService,
  GridEventService,
  GridStateService,
  GroupingAndColspanService,
  PaginationService,
  ResizerService,
  SharedService,
  SortService,
} from './services';
import { GridOption, CurrentFilter, CurrentSorter } from './models';
import { Filters } from './filters';

declare var Slick: any;
jest.mock('flatpickr', () => { });
const sharedService = new SharedService();

const bindingEngineStub = {
  collectionObserver: () => ({
    subscribe: jest.fn(),
  })
} as unknown as BindingEngine;

const excelExportServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
} as unknown as ExcelExportService;

const exportServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
} as unknown as ExportService;

const extensionServiceStub = {
  bindDifferentExtensions: jest.fn(),
  createExtensionsBeforeGridCreation: jest.fn(),
  dispose: jest.fn(),
  renderColumnHeaders: jest.fn(),
  translateColumnHeaders: jest.fn(),
  translateColumnPicker: jest.fn(),
  translateGridMenu: jest.fn(),
  translateHeaderMenu: jest.fn(),
} as unknown as ExtensionService;

const mockExtensionUtility = {
  loadExtensionDynamically: jest.fn()
} as unknown as ExtensionUtility;
export class ExtensionUtilityStub {
  loadExtensionDynamically() { }
}

const groupingAndColspanServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
} as unknown as GroupingAndColspanService;

const mockGraphqlService = {
  getDatasetName: jest.fn(),
  updateFilters: jest.fn(),
  updateSorters: jest.fn(),
  updatePagination: jest.fn(),
} as unknown as GraphqlService;

const filterServiceStub = {
  dispose: jest.fn(),
  init: jest.fn(),
  bindBackendOnFilter: jest.fn(),
  bindLocalOnFilter: jest.fn(),
  populateColumnFilterSearchTermPresets: jest.fn(),
  getColumnFilters: jest.fn(),
} as unknown as FilterService;

const gridEventServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  bindOnCellChange: jest.fn(),
  bindOnClick: jest.fn(),
} as unknown as GridEventService;

const gridServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
} as unknown as GridService;

const gridStateServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
} as unknown as GridStateService;

const paginationServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
} as unknown as PaginationService;

const resizerServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  bindAutoResizeDataGrid: jest.fn(),
  compensateHorizontalScroll: jest.fn(),
  resizeGrid: jest.fn(),
} as unknown as ResizerService;

const sortServiceStub = {
  bindBackendOnSort: jest.fn(),
  bindLocalOnSort: jest.fn(),
  dispose: jest.fn(),
  loadLocalGridPresets: jest.fn(),
} as unknown as SortService;

const mockGroupItemMetaProvider = {
  init: jest.fn(),
  destroy: jest.fn(),
  defaultGroupCellFormatter: jest.fn(),
  defaultTotalsCellFormatter: jest.fn(),
  handleGridClick: jest.fn(),
  handleGridKeyDown: jest.fn(),
  getGroupRowMetadata: jest.fn(),
  getTotalsRowMetadata: jest.fn(),
};

const mockDataView = {
  constructor: jest.fn(),
  init: jest.fn(),
  destroy: jest.fn(),
  beginUpdate: jest.fn(),
  endUpdate: jest.fn(),
  reSort: jest.fn(),
  setItems: jest.fn(),
  syncGridSelection: jest.fn(),
};

const mockDraggableGrouping = {
  constructor: jest.fn(),
  init: jest.fn(),
  destroy: jest.fn(),
}

const mockSlickCore = {
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  unsubscribeAll: jest.fn(),
};

const mockGrid = {
  autosizeColumns: jest.fn(),
  destroy: jest.fn(),
  init: jest.fn(),
  invalidate: jest.fn(),
  getScrollbarDimensions: jest.fn(),
  render: jest.fn(),
  resizeCanvas: jest.fn(),
  setHeaderRowVisibility: jest.fn(),
  onRendered: new Slick.Event(),
  onScroll: new Slick.Event(),
  onDataviewCreated: new Slick.Event(),
};

const mockSlickCoreImplementation = jest.fn().mockImplementation(() => (mockSlickCore));
const mockDataViewImplementation = jest.fn().mockImplementation(() => (mockDataView));
const mockGroupItemMetaProviderImplementation = jest.fn().mockImplementation(() => (mockGroupItemMetaProvider));
const mockGridImplementation = jest.fn().mockImplementation(() => (mockGrid));
const mockDraggableGroupingImplementation = jest.fn().mockImplementation(() => (mockDraggableGrouping));

jest.mock('slickgrid/slick.core', () => mockSlickCoreImplementation);
jest.mock('slickgrid/slick.grid', () => mockGridImplementation);
jest.mock('slickgrid/plugins/slick.draggablegrouping', () => mockDraggableGroupingImplementation);
Slick.Grid = mockGridImplementation;
Slick.EventHandler = mockSlickCoreImplementation;
Slick.Data = { DataView: mockDataViewImplementation, GroupItemMetadataProvider: mockGroupItemMetaProviderImplementation };
Slick.DraggableGrouping = mockDraggableGroupingImplementation;

const eventAggregatorStub = {
  publish: jest.fn(),
  subscribe: jest.fn()
} as unknown as EventAggregator;
// jest.mock('aurelia-event-aggregator', () => ({
//   EventAggregator: eventAggregator
// }));

const aureliaGridReady = jest.fn();

describe('Aurelia-Slickgrid Custom Component instatiated via Constructor', () => {
  let container: Container;
  let customElement: AureliaSlickgridCustomElement;

  const template = `<aurelia-slickgrid
    grid-id="grid1"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset">
  </aurelia-slickgrid>`;

  beforeEach(() => {
    const div = document.createElement('div');
    div.innerHTML = template;
    document.body.appendChild(div);

    // ea = new EventAggregator();
    // bindingEngine = new BindingEngine();
    container = new Container();
    customElement = new AureliaSlickgridCustomElement(
      bindingEngineStub,
      container,
      div,
      eventAggregatorStub,
      excelExportServiceStub,
      exportServiceStub,
      extensionServiceStub,
      mockExtensionUtility,
      filterServiceStub,
      gridEventServiceStub,
      gridServiceStub,
      gridStateServiceStub,
      groupingAndColspanServiceStub,
      paginationServiceStub,
      resizerServiceStub,
      sharedService,
      sortServiceStub
    );

    customElement.gridId = 'grid1';
    customElement.columnDefinitions = [{ id: 'name', field: 'name' }];
    customElement.dataset = [];
    customElement.gridOptions = { enableExcelExport: false } as GridOption;
    customElement.gridHeight = 600;
    customElement.gridWidth = 800;
  });

  it('should make sure Aurelia-Slickgrid is defined', () => {
    expect(customElement).toBeTruthy();
  });

  it('should create a grid and expect multiple Event Aggregator being called', () => {
    const spy = jest.spyOn(eventAggregatorStub, 'publish');

    customElement.attached();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenNthCalledWith(1, 'onBeforeGridCreate', true);
    expect(spy).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
    expect(spy).toHaveBeenNthCalledWith(3, 'onGridCreated', expect.any(Object));

    customElement.dispose();
    expect(spy).toHaveBeenNthCalledWith(4, 'onBeforeGridDestroy', expect.any(Object));
    expect(spy).toHaveBeenNthCalledWith(5, 'onAfterGridDestroyed', true);
  });

  describe('initialization method', () => {
    beforeEach(() => {
      // customElement.dispose();
    });

    describe('columns definitions changed', () => {
      it('should expect "translateColumnHeaders" being called when "enableTranslate" is set', () => {
        const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const updateSpy = jest.spyOn(customElement, 'updateColumnDefinitionsList');
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.columnDefinitions = mockColDefs;
        customElement.gridOptions.enableTranslate = true;
        customElement.bind();
        customElement.attached();
        customElement.columnDefinitionsChanged();

        expect(translateSpy).toHaveBeenCalledWith(false, mockColDefs);
        expect(autosizeSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
      });

      it('should expect "renderColumnHeaders" being called when "enableTranslate" is disabled', () => {
        const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const updateSpy = jest.spyOn(customElement, 'updateColumnDefinitionsList');
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.columnDefinitions = mockColDefs;
        customElement.bind();
        customElement.attached();
        customElement.columnDefinitionsChanged();

        expect(translateSpy).toHaveBeenCalledWith(false, mockColDefs);
        expect(autosizeSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
      });
    });

    describe('dataset changed', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should expect "autosizeColumns" being called when "autoFitColumnsOnFirstLoad" is set and we are on first page load', () => {
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];

        customElement.gridOptions.autoFitColumnsOnFirstLoad = true;
        customElement.bind();
        customElement.attached();
        customElement.datasetChanged(mockData, null);

        expect(autosizeSpy).toHaveBeenCalledTimes(3); // 1x by datasetChanged and 2x by bindResizeHook
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });

      it('should expect "autosizeColumns" NOT being called when "autoFitColumnsOnFirstLoad" is set but we are not on first page load', () => {
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];

        customElement.gridOptions.autoFitColumnsOnFirstLoad = true;
        customElement.bind();
        customElement.attached();
        customElement.datasetChanged(mockData, [{ firstName: 'Jamie' }]);

        expect(autosizeSpy).toHaveBeenCalledTimes(2); // 0x by datasetChanged and 2x by bindResizeHook
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });

      it('should expect "autosizeColumns" NOT being called when "autoFitColumnsOnFirstLoad" is not set and we are on first page load', () => {
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];

        customElement.gridOptions.autoFitColumnsOnFirstLoad = false;
        customElement.bind();
        customElement.attached();
        customElement.datasetChanged(mockData, null);

        expect(autosizeSpy).not.toHaveBeenCalled();
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });
    });

    describe('use grouping', () => {
      it('should load groupItemMetaProvider to the DataView when using "draggableGrouping" feature', () => {
        const extensionSpy = jest.spyOn(mockExtensionUtility, 'loadExtensionDynamically');
        const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
        const groupMetaSpy = jest.spyOn(mockGroupItemMetaProviderImplementation.prototype, 'constructor');
        const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');

        customElement.gridOptions.draggableGrouping = {};
        customElement.bind();
        customElement.attached();

        expect(extensionSpy).toHaveBeenCalledWith('groupItemMetaProvider');
        expect(dataviewSpy).toHaveBeenCalledWith({ groupItemMetadataProvider: expect.anything() });
        expect(groupMetaSpy).toHaveBeenCalledWith();
        expect(sharedMetaSpy).toHaveBeenCalledWith(mockGroupItemMetaProvider);

        customElement.dispose();
      });

      it('should load groupItemMetaProvider to the DataView when using "enableGrouping" feature', () => {
        const extensionSpy = jest.spyOn(mockExtensionUtility, 'loadExtensionDynamically');
        const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
        const groupMetaSpy = jest.spyOn(mockGroupItemMetaProviderImplementation.prototype, 'constructor');
        const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');

        customElement.gridOptions.enableGrouping = true;
        customElement.bind();
        customElement.attached();

        expect(extensionSpy).toHaveBeenCalledWith('groupItemMetaProvider');
        expect(dataviewSpy).toHaveBeenCalledWith({ groupItemMetadataProvider: expect.anything() });
        expect(groupMetaSpy).toHaveBeenCalledWith();
        expect(sharedMetaSpy).toHaveBeenCalledWith(mockGroupItemMetaProvider);

        customElement.dispose();
      });
    });

    describe('dataView options', () => {
      afterEach(() => {
        customElement.dispose();
        jest.clearAllMocks();
      });

      it('should call the onDataviewCreated emitter', () => {
        const spy = jest.spyOn(eventAggregatorStub, 'publish');

        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
      });

      it('should call the "executeAfterDataviewCreated" and "loadLocalGridPresets" methods and Sorter Presets are provided in the Grid Options', () => {
        const eaSpy = jest.spyOn(eventAggregatorStub, 'publish');
        const sortSpy = jest.spyOn(sortServiceStub, 'loadLocalGridPresets');

        customElement.gridOptions = { presets: { sorters: [{ columnId: 'field1', direction: 'DESC' }] } } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(eaSpy).toHaveBeenNthCalledWith(3, 'onGridCreated', expect.any(Object));
        expect(sortSpy).toHaveBeenCalled();
      });

      it('should call the DataView syncGridSelection method with 2nd argument as True when the "dataView" grid option is a boolean and is set to True', () => {
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = { dataView: { syncGridSelection: true }, enableRowSelection: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true);
      });

      it('should call the DataView syncGridSelection method with 3 arguments when the "dataView" grid option is provided as an object', () => {
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = {
          dataView: { syncGridSelection: { preserveHidden: true, preserveHiddenOnSelectionChange: false } },
          enableRowSelection: true
        } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true, false);
      });
    });

    describe('flag checks', () => {
      afterEach(() => {
        jest.clearAllMocks();
        customElement.dispose();
      });

      it('should call "showHeaderRow" method with false when its flag is disabled', () => {
        const gridSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');

        customElement.gridOptions = { showHeaderRow: false } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(gridSpy).toHaveBeenCalledWith(false);
      });

      it('should initialize groupingAndColspanService when "createPreHeaderPanel" grid option is enabled and "enableDraggableGrouping" is disabled', () => {
        const spy = jest.spyOn(groupingAndColspanServiceStub, 'init');

        customElement.gridOptions = { createPreHeaderPanel: true, enableDraggableGrouping: false } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalledWith(mockGrid, mockDataView);
      });

      it('should not initialize groupingAndColspanService when "createPreHeaderPanel" grid option is enabled and "enableDraggableGrouping" is also enabled', () => {
        const spy = jest.spyOn(groupingAndColspanServiceStub, 'init');

        customElement.gridOptions = { createPreHeaderPanel: true, enableDraggableGrouping: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(spy).not.toHaveBeenCalled();
      });

      it('should call "translateColumnHeaders" from ExtensionService when "enableTranslate" is set', () => {
        const spy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');

        customElement.gridOptions = { enableTranslate: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalled();
      });

      it('should initialize ExportService when "enableExport" is set', () => {
        const spy = jest.spyOn(exportServiceStub, 'init');

        customElement.gridOptions = { enableExport: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalled();
      });

      it('should initialize excelExportService when "enableExcelExport" is set', () => {
        const spy = jest.spyOn(excelExportServiceStub, 'init');

        customElement.gridOptions = { enableExcelExport: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalled();
      });

      it('should destroy customElement and its DOM element when requested', () => {
        const spy = jest.spyOn(customElement, 'destroyGridContainerElm');

        customElement.bind();
        customElement.attached();
        customElement.dispose(true);

        expect(spy).toHaveBeenCalledWith();
      });
    });

    describe('Backend Service API', () => {
      beforeEach(() => {
        customElement.gridOptions = {
          backendServiceApi: {
            service: mockGraphqlService,
            preProcess: () => jest.fn(),
            process: (query) => new Promise((resolve) => resolve('process resolved')),
          }
        };
      });

      afterEach(() => {
        jest.clearAllMocks();
        // customElement.dispose();
      });

      it('should call the "createBackendApiInternalPostProcessCallback" method when Backend Service API is defined with a Graphql Service', () => {
        const spy = jest.spyOn(customElement, 'createBackendApiInternalPostProcessCallback');

        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalled();
        expect(customElement.gridOptions.backendServiceApi.internalPostProcess).toEqual(expect.any(Function));
      });

      it('should invoke "updateFilters" method with filters returned from "getColumnFilters" of the Filter Service when there is no Presets defined', () => {
        const mockColumnFilter = { name: { columnId: 'name', columnDef: { id: 'name', field: 'name', filter: { model: Filters.autoComplete } }, operator: 'EQ', searchTerms: ['john'] } };
        // @ts-ignore
        jest.spyOn(filterServiceStub, 'getColumnFilters').mockReturnValue(mockColumnFilter);
        const backendSpy = jest.spyOn(mockGraphqlService, 'updateFilters');

        customElement.gridOptions.presets = undefined;
        customElement.bind();
        customElement.attached();

        expect(backendSpy).toHaveBeenCalledWith(mockColumnFilter, false);
      });

      it('should call the "updateFilters" method when filters are defined in the "presets" property', () => {
        const spy = jest.spyOn(mockGraphqlService, 'updateFilters');
        const mockFilters = [{ columnId: 'company', searchTerms: ['xyz'], operator: 'IN' }] as CurrentFilter[];
        customElement.gridOptions.presets = { filters: mockFilters };
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalledWith(mockFilters, true);
      });

      it('should call the "updateSorters" method when filters are defined in the "presets" property', () => {
        const spy = jest.spyOn(mockGraphqlService, 'updateSorters');
        const mockSorters = [{ columnId: 'name', direction: 'asc' }] as CurrentSorter[];
        customElement.gridOptions.presets = { sorters: mockSorters };
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalledWith(undefined, mockSorters);
      });

      it('should call the "updatePagination" method when filters are defined in the "presets" property', () => {
        const spy = jest.spyOn(mockGraphqlService, 'updatePagination');

        customElement.gridOptions.presets = { pagination: { pageNumber: 2, pageSize: 20 } };
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalledWith(2, 20);
      });
    });
  });
});
