import 'jest-extended';
import { GraphqlPaginatedResult, GraphqlService, GraphqlServiceApi, GraphqlServiceOption } from '@slickgrid-universal/graphql';
import {
  BackendService,
  BackendServiceApi,
  CollectionService,
  Column,
  CurrentFilter,
  CurrentPagination,
  CurrentSorter,
  Editors,
  ExtensionService,
  ExtensionUtility,
  Filters,
  FilterService,
  GridEventService,
  GridService,
  GridState,
  GridStateService,
  GridStateType,
  GroupingAndColspanService,
  Pagination,
  PaginationService,
  ServicePagination,
  SharedService,
  SlickNamespace,
  SortService,
  TreeDataService,
} from '@slickgrid-universal/common';
import { BindingEngine, BindingLanguage, Container, ViewCompiler, ViewResources } from 'aurelia-framework';
import { BindingSignaler } from 'aurelia-templating-resources';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DOM } from 'aurelia-pal';
import { I18N } from 'aurelia-i18n';

import { AureliaSlickgridCustomElement } from '../aurelia-slickgrid';
import { ResizerService, UniversalTranslateService } from '../../services';
import { GridOption } from '../../models';
import * as utilities from '@slickgrid-universal/common/dist/commonjs/services/backend-utilities';
import { SlickEmptyWarningComponent } from '../slick-empty-warning.component';
import { HttpStub } from '../../../../test/httpClientStub';

const mockExecuteBackendProcess = jest.fn();
const mockRefreshBackendDataset = jest.fn();
(utilities.executeBackendProcessesCallback as any) = mockExecuteBackendProcess;
(utilities.refreshBackendDataset as any) = mockRefreshBackendDataset;

const mockBackendError = jest.fn();
(utilities.onBackendError as any) = mockBackendError;

declare const Slick: SlickNamespace;
jest.mock('flatpickr', () => { });
const sharedService = new SharedService();

const bindingEngineStub = {
  collectionObserver: () => ({
    subscribe: jest.fn(),
  })
} as unknown as BindingEngine;

const collectionServiceStub = {
  filterCollection: jest.fn(),
  singleFilterCollection: jest.fn(),
  sortCollection: jest.fn(),
} as unknown as CollectionService;

const extensionServiceStub = {
  bindDifferentExtensions: jest.fn(),
  createExtensionsBeforeGridCreation: jest.fn(),
  dispose: jest.fn(),
  renderColumnHeaders: jest.fn(),
  translateCellMenu: jest.fn(),
  translateColumnHeaders: jest.fn(),
  translateColumnPicker: jest.fn(),
  translateContextMenu: jest.fn(),
  translateGridMenu: jest.fn(),
  translateHeaderMenu: jest.fn(),
} as unknown as ExtensionService;

const mockExtensionUtility = {
  loadExtensionDynamically: jest.fn(),
  translateItems: jest.fn(),
} as unknown as ExtensionUtility;

const groupingAndColspanServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  translateGroupingAndColSpan: jest.fn(),
} as unknown as GroupingAndColspanService;

const mockGraphqlService = {
  getDatasetName: jest.fn(),
  buildQuery: jest.fn(),
  init: jest.fn(),
  updateFilters: jest.fn(),
  updateSorters: jest.fn(),
  updatePagination: jest.fn(),
} as unknown as GraphqlService;

const filterServiceStub = {
  clearFilters: jest.fn(),
  dispose: jest.fn(),
  init: jest.fn(),
  bindBackendOnFilter: jest.fn(),
  bindLocalOnFilter: jest.fn(),
  bindLocalOnSort: jest.fn(),
  bindBackendOnSort: jest.fn(),
  populateColumnFilterSearchTermPresets: jest.fn(),
  getColumnFilters: jest.fn(),
} as unknown as FilterService;

const gridEventServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  bindOnBeforeEditCell: jest.fn(),
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
  getAssociatedGridColumns: jest.fn(),
  getCurrentGridState: jest.fn(),
  needToPreserveRowSelection: jest.fn(),
} as unknown as GridStateService;

const paginationServiceStub = {
  totalItems: 0,
  init: jest.fn(),
  dispose: jest.fn(),
  updateTotalItems: jest.fn(),
} as unknown as PaginationService;

const translateServiceStub = {
  getCurrentLanguage: jest.fn(),
  use: jest.fn(),
  setup: jest.fn(),
  translate: jest.fn(),
} as unknown as UniversalTranslateService;

Object.defineProperty(paginationServiceStub, 'totalItems', {
  get: jest.fn(() => 0),
  set: jest.fn()
});

const resizerServiceStub = {
  dispose: jest.fn(),
  init: jest.fn(),
  resizeGrid: jest.fn(),
} as unknown as ResizerService;

const slickEmptyWarningStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  showEmptyDataMessage: jest.fn(),
} as unknown as SlickEmptyWarningComponent;

const sortServiceStub = {
  bindBackendOnSort: jest.fn(),
  bindLocalOnSort: jest.fn(),
  dispose: jest.fn(),
  loadGridSorters: jest.fn(),
  processTreeDataInitialSort: jest.fn(),
} as unknown as SortService;

const treeDataServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  handleOnCellClick: jest.fn(),
  toggleTreeDataCollapse: jest.fn(),
} as unknown as TreeDataService;

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
  getItem: jest.fn(),
  getItems: jest.fn(),
  getItemMetadata: jest.fn(),
  getLength: jest.fn(),
  getPagingInfo: jest.fn(),
  mapIdsToRows: jest.fn(),
  mapRowsToIds: jest.fn(),
  onSetItemsCalled: jest.fn(),
  onRowsChanged: new Slick.Event(),
  reSort: jest.fn(),
  setItems: jest.fn(),
  syncGridSelection: jest.fn(),
};

const mockDraggableGrouping = {
  constructor: jest.fn(),
  init: jest.fn(),
  destroy: jest.fn(),
};

const mockSlickCore = {
  handlers: [],
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  unsubscribeAll: jest.fn(),
};

const mockGetEditorLock = {
  isActive: () => true,
  commitCurrentEdit: jest.fn(),
};

const mockGrid = {
  autosizeColumns: jest.fn(),
  destroy: jest.fn(),
  init: jest.fn(),
  invalidate: jest.fn(),
  getActiveCellNode: jest.fn(),
  getColumns: jest.fn(),
  getData: () => mockDataView,
  getEditorLock: () => mockGetEditorLock,
  getOptions: jest.fn(),
  getSelectionModel: jest.fn(),
  getScrollbarDimensions: jest.fn(),
  render: jest.fn(),
  resizeCanvas: jest.fn(),
  setColumns: jest.fn(),
  setHeaderRowVisibility: jest.fn(),
  setSelectedRows: jest.fn(),
  onRendered: jest.fn(),
  onScroll: jest.fn(),
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
(Slick as any).Data = { DataView: mockDataViewImplementation, GroupItemMetadataProvider: mockGroupItemMetaProviderImplementation };
Slick.DraggableGrouping = mockDraggableGroupingImplementation;

describe('Aurelia-Slickgrid Custom Component instantiated via Constructor', () => {
  let container: Container;
  let customElement: AureliaSlickgridCustomElement;
  let divContainer: HTMLDivElement;
  let cellDiv: HTMLDivElement;
  let globalEa: EventAggregator;
  let pluginEa: EventAggregator;
  let i18n: I18N;
  const http = new HttpStub();
  let viewCompiler: ViewCompiler;
  let viewResources: ViewResources;

  const template = `
  <div id="grid1" style="height: 800px; width: 600px;">
      <div id="slickGridContainer-grid1" class="grid-pane" style="width: 100%;">
      </div>
    </div>
  <aurelia-slickgrid
    grid-id="grid1"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset">
  </aurelia-slickgrid>`;

  beforeEach(() => {
    divContainer = document.createElement('div');
    cellDiv = document.createElement('div');
    divContainer.innerHTML = template;
    divContainer.appendChild(cellDiv);
    document.body.appendChild(divContainer);
    viewResources = new ViewResources();
    viewCompiler = new ViewCompiler(new BindingLanguage(), viewResources);

    globalEa = new EventAggregator();
    pluginEa = new EventAggregator();
    i18n = new I18N(globalEa, new BindingSignaler());
    container = new Container();
    customElement = new AureliaSlickgridCustomElement(
      bindingEngineStub,
      container,
      divContainer,
      globalEa,
      pluginEa,
      resizerServiceStub,
      slickEmptyWarningStub,
      translateServiceStub,
      viewCompiler,
      viewResources,
      {
        collectionService: collectionServiceStub,
        extensionService: extensionServiceStub,
        extensionUtility: mockExtensionUtility,
        filterService: filterServiceStub,
        gridEventService: gridEventServiceStub,
        gridService: gridServiceStub,
        gridStateService: gridStateServiceStub,
        groupingAndColspanService: groupingAndColspanServiceStub,
        paginationService: paginationServiceStub,
        sharedService,
        sortService: sortServiceStub,
        treeDataService: treeDataServiceStub,
      }
    );

    i18n.setup({
      resources: {
        en: { translation: { ITEMS: 'items', OF: 'of', } },
        fr: { translation: { ITEMS: 'éléments', OF: 'de', } }
      },
      lng: 'fr',
      fallbackLng: 'en',
      debug: false
    });

    customElement.gridId = 'grid1';
    customElement.columnDefinitions = [{ id: 'name', field: 'name' }];
    customElement.dataset = [];
    customElement.gridOptions = { dataView: null, gridHeight: 600, gridWidth: 800 } as unknown as GridOption;
  });

  it('should make sure Aurelia-Slickgrid is defined', () => {
    expect(customElement).toBeTruthy();
  });

  xit('should create a grid and expect multiple Event Aggregator being called', () => {
    const spy = jest.spyOn(globalEa, 'publish');

    customElement.attached();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenNthCalledWith(1, 'onBeforeGridCreate', true);
    expect(spy).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
    expect(spy).toHaveBeenNthCalledWith(3, 'onGridCreated', expect.any(Object));

    customElement.dispose();
    expect(spy).toHaveBeenNthCalledWith(4, 'onBeforeGridDestroy', expect.any(Object));
    expect(spy).toHaveBeenNthCalledWith(5, 'onAfterGridDestroyed', true);
  });

  xit('should load enable jquery mousewheel scrolling when using a frozen grid', () => {
    customElement.gridOptions.enableMouseWheelScrollHandler = undefined;
    customElement.gridOptions.frozenRow = 3;
    customElement.initialization();

    expect(customElement.gridOptions.enableMouseWheelScrollHandler).toBeTrue();
  });


  describe('initialization method', () => {
    describe('columns definitions changed', () => {
      xit('should expect "translateColumnHeaders" being called when "enableTranslate" is set', () => {
        const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const updateSpy = jest.spyOn(customElement, 'updateColumnDefinitionsList');
        const renderSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.columnDefinitions = mockColDefs;
        customElement.gridOptions.enableTranslate = true;
        customElement.bind();
        customElement.attached();
        customElement.columnDefinitionsChanged();

        expect(translateSpy).toHaveBeenCalledWith(false, mockColDefs);
        expect(autosizeSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
        expect(renderSpy).toHaveBeenCalledWith(false, mockColDefs);
      });

      xit('should expect "renderColumnHeaders" being called when "enableTranslate" is disabled', () => {
        const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const updateSpy = jest.spyOn(customElement, 'updateColumnDefinitionsList');
        const renderSpy = jest.spyOn(extensionServiceStub, 'renderColumnHeaders');
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.columnDefinitions = mockColDefs;
        customElement.bind();
        customElement.attached();
        customElement.columnDefinitionsChanged();

        expect(translateSpy).toHaveBeenCalledWith(false, mockColDefs);
        expect(autosizeSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
        expect(renderSpy).toHaveBeenCalledWith(mockColDefs, true);
      });
    });

    describe('dataset changed', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      xit('should expect "autosizeColumns" being called when "autoFitColumnsOnFirstLoad" is set and we are on first page load', () => {
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];

        customElement.gridOptions.autoFitColumnsOnFirstLoad = true;
        customElement.bind();
        customElement.attached();
        customElement.datasetChanged(mockData, null as any);

        expect(autosizeSpy).toHaveBeenCalledTimes(3); // 1x by datasetChanged and 2x by bindResizeHook
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });

      xit('should expect "autosizeColumns" NOT being called when "autoFitColumnsOnFirstLoad" is set but we are not on first page load', () => {
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

      xit('should expect "autosizeColumns" NOT being called when "autoFitColumnsOnFirstLoad" is not set and we are on first page load', () => {
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];

        customElement.gridOptions.autoFitColumnsOnFirstLoad = false;
        customElement.bind();
        customElement.attached();
        customElement.datasetChanged(mockData, null as any);

        expect(autosizeSpy).not.toHaveBeenCalled();
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });
    });

    describe('with editors', () => {
      xit('should be able to load async editors with a regular Promise', (done) => {
        const mockCollection = ['male', 'female'];
        const promise = new Promise((resolve) => resolve(mockCollection));
        const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];
        const getColSpy = jest.spyOn(mockGrid, 'getColumns').mockReturnValue(mockColDefs);

        customElement.columnDefinitions = mockColDefs;
        customElement.bind();
        customElement.attached();

        setTimeout(() => {
          expect(getColSpy).toHaveBeenCalled();
          expect(customElement.columnDefinitions[0].editor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
          done();
        });
      });

      xit('should be able to load async editors with as a Promise with content to simulate http-client', (done) => {
        const mockCollection = ['male', 'female'];
        const promise = new Promise((resolve) => resolve({ content: mockCollection }));
        const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];
        const getColSpy = jest.spyOn(mockGrid, 'getColumns').mockReturnValue(mockColDefs);

        customElement.columnDefinitions = mockColDefs;
        customElement.bind();
        customElement.attached();

        setTimeout(() => {
          expect(getColSpy).toHaveBeenCalled();
          expect(customElement.columnDefinitions[0].editor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
          done();
        });
      });

      xit('should be able to load async editors with a Fetch Promise', (done) => {
        const mockCollection = ['male', 'female'];
        http.status = 200;
        http.object = mockCollection;
        http.returnKey = 'date';
        http.returnValue = '6/24/1984';
        http.responseHeaders = { accept: 'json' };
        const collectionAsync = http.fetch('/api', { method: 'GET' });
        const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync } }] as Column[];
        const getColSpy = jest.spyOn(mockGrid, 'getColumns').mockReturnValue(mockColDefs);

        customElement.columnDefinitions = mockColDefs;
        customElement.bind();
        customElement.attached();

        setTimeout(() => {
          expect(getColSpy).toHaveBeenCalled();
          expect(customElement.columnDefinitions[0].editor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
          done();
        });
      });

      xit('should throw an error when Fetch Promise response bodyUsed is true', (done) => {
        const consoleSpy = jest.spyOn(global.console, 'warn').mockReturnValue();
        const mockCollection = ['male', 'female'];
        http.status = 200;
        http.object = mockCollection;
        http.returnKey = 'date';
        http.returnValue = '6/24/1984';
        http.responseHeaders = { accept: 'json' };
        const collectionAsync = http.fetch('invalid-url', { method: 'GET' });
        const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync } }] as Column[];
        jest.spyOn(mockGrid, 'getColumns').mockReturnValue(mockColDefs);
        customElement.columnDefinitions = mockColDefs;

        customElement.bind();
        customElement.attached();

        setTimeout(() => {
          expect(consoleSpy).toHaveBeenCalledWith(expect.toInclude('[Aurelia-SlickGrid] The response body passed to collectionAsync was already read.'));
          done();
        });
      });
    });

    describe('use grouping', () => {
      xit('should load groupItemMetaProvider to the DataView when using "draggableGrouping" feature', () => {
        const extensionSpy = jest.spyOn(mockExtensionUtility, 'loadExtensionDynamically');
        const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
        const groupMetaSpy = jest.spyOn(mockGroupItemMetaProviderImplementation.prototype, 'constructor');
        const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');

        customElement.gridOptions.draggableGrouping = {};
        customElement.bind();
        customElement.attached();

        expect(extensionSpy).toHaveBeenCalledWith('groupItemMetaProvider');
        expect(dataviewSpy).toHaveBeenCalledWith({ groupItemMetadataProvider: expect.anything(), inlineFilters: false });
        expect(groupMetaSpy).toHaveBeenCalledWith();
        expect(sharedMetaSpy).toHaveBeenCalledWith(mockGroupItemMetaProvider);

        customElement.dispose();
      });

      xit('should load groupItemMetaProvider to the DataView when using "enableGrouping" feature', () => {
        const extensionSpy = jest.spyOn(mockExtensionUtility, 'loadExtensionDynamically');
        const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
        const groupMetaSpy = jest.spyOn(mockGroupItemMetaProviderImplementation.prototype, 'constructor');
        const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');

        customElement.gridOptions.enableGrouping = true;
        customElement.bind();
        customElement.attached();

        expect(extensionSpy).toHaveBeenCalledWith('groupItemMetaProvider');
        expect(dataviewSpy).toHaveBeenCalledWith({ groupItemMetadataProvider: expect.anything(), inlineFilters: false });
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

      xit('should call the onDataviewCreated emitter', () => {
        const spy = jest.spyOn(globalEa, 'publish');

        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
      });

      xit('should call the "executeAfterDataviewCreated" and "loadGridSorters" methods and Sorter Presets are provided in the Grid Options', () => {
        const globalEaSpy = jest.spyOn(globalEa, 'publish');
        const sortSpy = jest.spyOn(sortServiceStub, 'loadGridSorters');

        customElement.gridOptions = { presets: { sorters: [{ columnId: 'field1', direction: 'DESC' }] } } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(globalEaSpy).toHaveBeenNthCalledWith(3, 'onGridCreated', expect.any(Object));
        expect(sortSpy).toHaveBeenCalled();
      });

      xit('should call the DataView "syncGridSelection" method with 2nd argument as True when the "dataView.syncGridSelection" grid option is enabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = { dataView: { syncGridSelection: true }, enableRowSelection: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true);
      });

      xit('should call the DataView "syncGridSelection" method with 2nd argument as False when the "dataView.syncGridSelection" grid option is disabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = { dataView: { syncGridSelection: false }, enableRowSelection: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
      });

      xit('should call the DataView "syncGridSelection" method with 3 arguments when the "dataView" grid option is provided as an object', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = {
          dataView: { syncGridSelection: { preserveHidden: true, preserveHiddenOnSelectionChange: false } },
          enableRowSelection: true
        } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true, false);
      });

      xit('should call the DataView "syncGridSelection" method when using BackendServiceApi and "syncGridSelectionWithBackendService" when the "dataView.syncGridSelection" grid option is enabled as well', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = {
          backendServiceApi: {
            service: mockGraphqlService,
            process: jest.fn(),
          },
          dataView: { syncGridSelection: true, syncGridSelectionWithBackendService: true },
          enableRowSelection: true
        } as unknown as GridOption;
        customElement.bind();
        customElement.attached();

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true);
      });

      xit('should call the DataView "syncGridSelection" method with false as 2nd argument when using BackendServiceApi and "syncGridSelectionWithBackendService" BUT the "dataView.syncGridSelection" grid option is disabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = {
          backendServiceApi: {
            service: mockGraphqlService,
            process: jest.fn(),
          },
          dataView: { syncGridSelection: false, syncGridSelectionWithBackendService: true },
          enableRowSelection: true
        } as unknown as GridOption;
        customElement.bind();
        customElement.attached();

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
      });

      xit('should call the DataView "syncGridSelection" method with false as 2nd argument when using BackendServiceApi and "syncGridSelectionWithBackendService" disabled and the "dataView.syncGridSelection" grid option is enabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = {
          backendServiceApi: {
            service: mockGraphqlService,
            process: jest.fn(),
          },
          dataView: { syncGridSelection: true, syncGridSelectionWithBackendService: false },
          enableRowSelection: true
        } as unknown as GridOption;
        customElement.bind();
        customElement.attached();

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
      });

      xit('should bind local filter when "enableFiltering" is set', () => {
        const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');

        customElement.gridOptions = { enableFiltering: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });

      xit('should bind local sort when "enableSorting" is set', () => {
        const bindLocalSpy = jest.spyOn(sortServiceStub, 'bindLocalOnSort');

        customElement.gridOptions = { enableSorting: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });
    });

    describe('flag checks', () => {
      afterEach(() => {
        jest.clearAllMocks();
        customElement.dispose();
      });

      xit('should call "showHeaderRow" method with false when its flag is disabled', () => {
        const gridSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');

        customElement.gridOptions = { showHeaderRow: false } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(gridSpy).toHaveBeenCalledWith(false, false);
      });

      xit('should initialize groupingAndColspanService when "createPreHeaderPanel" grid option is enabled and "enableDraggableGrouping" is disabled', () => {
        const spy = jest.spyOn(groupingAndColspanServiceStub, 'init');

        customElement.gridOptions = { createPreHeaderPanel: true, enableDraggableGrouping: false } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalledWith(mockGrid, mockDataView);
      });

      xit('should not initialize groupingAndColspanService when "createPreHeaderPanel" grid option is enabled and "enableDraggableGrouping" is also enabled', () => {
        const spy = jest.spyOn(groupingAndColspanServiceStub, 'init');

        customElement.gridOptions = { createPreHeaderPanel: true, enableDraggableGrouping: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(spy).not.toHaveBeenCalled();
      });

      xit('should call "translateColumnHeaders" from ExtensionService when "enableTranslate" is set', () => {
        const spy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');

        customElement.gridOptions = { enableTranslate: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalled();
      });

      xit('should destroy customElement and its DOM element when requested', () => {
        const spy = jest.spyOn(customElement, 'emptyGridContainerElm');

        customElement.bind();
        customElement.attached();
        customElement.dispose(true);

        expect(spy).toHaveBeenCalledWith();
      });

      xit('should refresh a local grid and change pagination options pagination when a preset for it is defined in grid options', (done) => {
        const expectedPageNumber = 2;
        const expectedTotalItems = 2;
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');

        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        customElement.gridOptions = {
          enablePagination: true,
          presets: { pagination: { pageSize: 2, pageNumber: expectedPageNumber } }
        };
        customElement.paginationOptions = { pageSize: 2, pageNumber: 2, pageSizes: [2, 10, 25, 50], totalItems: 100 };

        customElement.bind();
        customElement.attached();
        customElement.datasetChanged(mockData, null as any);

        setTimeout(() => {
          expect(customElement.gridOptions?.pagination?.pageSize).toBe(2);
          expect(customElement.gridOptions?.pagination?.pageNumber).toBe(expectedPageNumber);
          expect(customElement.gridOptions?.pagination?.totalItems).toBe(expectedTotalItems);
          expect(refreshSpy).toHaveBeenCalledWith(mockData);
          done();
        });
      });

      xit('should refresh a local grid defined and change pagination options pagination when a preset is defined in grid options and total rows is different when Filters are applied', (done) => {
        const expectedPageNumber = 3;
        const expectedTotalItems = 15;
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const getPagingSpy = jest.spyOn(mockDataView, 'getPagingInfo').mockReturnValue({ pageNum: 1, totalRows: expectedTotalItems });

        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        customElement.gridOptions = {
          enableFiltering: true,
          enablePagination: true,
          presets: { pagination: { pageSize: 10, pageNumber: expectedPageNumber } }
        };
        customElement.paginationOptions = { pageSize: 10, pageNumber: 2, pageSizes: [10, 25, 50], totalItems: 100 };

        customElement.bind();
        customElement.attached();
        customElement.datasetChanged(mockData, null as any);

        setTimeout(() => {
          expect(getPagingSpy).toHaveBeenCalled();
          expect(customElement.gridOptions?.pagination?.pageSize).toBe(10);
          expect(customElement.gridOptions?.pagination?.pageNumber).toBe(expectedPageNumber);
          expect(customElement.gridOptions?.pagination?.totalItems).toBe(expectedTotalItems);
          expect(refreshSpy).toHaveBeenCalledWith(mockData);
          done();
        });
      });
    });

    describe('Backend Service API', () => {
      beforeEach(() => {
        customElement.gridOptions = {
          backendServiceApi: {
            onInit: jest.fn(),
            service: mockGraphqlService as unknown as BackendService,
            preProcess: jest.fn(),
            postProcess: jest.fn(),
            process: jest.fn(),
          }
        };
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      xit('should call the "createBackendApiInternalPostProcessCallback" method when Backend Service API is defined with a Graphql Service', () => {
        const spy = jest.spyOn(customElement, 'createBackendApiInternalPostProcessCallback');

        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalled();
        expect((customElement.gridOptions.backendServiceApi as BackendServiceApi).internalPostProcess).toEqual(expect.any(Function));
      });

      xit('should execute the "internalPostProcess" callback method that was created by "createBackendApiInternalPostProcessCallback" with Pagination', () => {
        jest.spyOn((customElement.gridOptions.backendServiceApi as BackendServiceApi).service, 'getDatasetName').mockReturnValue('users');
        const spy = jest.spyOn(customElement, 'refreshGridData');

        customElement.bind();
        customElement.attached();
        customElement.gridOptions.backendServiceApi!.internalPostProcess!({ data: { users: { nodes: [{ firstName: 'John' }], totalCount: 2 } } } as GraphqlPaginatedResult);

        expect(spy).toHaveBeenCalled();
        expect((customElement.gridOptions.backendServiceApi as BackendServiceApi).internalPostProcess).toEqual(expect.any(Function));
      });

      xit('should execute the "internalPostProcess" callback and expect totalItems to be updated in the PaginationService when "refreshGridData" is called on the 2nd time', () => {
        jest.spyOn((customElement.gridOptions.backendServiceApi as BackendServiceApi).service, 'getDatasetName').mockReturnValue('users');
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const paginationSpy = jest.spyOn(paginationServiceStub, 'totalItems', 'set');
        const mockDataset = [{ firstName: 'John' }, { firstName: 'Jane' }];

        customElement.bind();
        customElement.attached();
        customElement.gridOptions.backendServiceApi!.internalPostProcess!({ data: { users: { nodes: mockDataset, totalCount: mockDataset.length } } } as GraphqlPaginatedResult);
        customElement.refreshGridData(mockDataset, 1);
        customElement.refreshGridData(mockDataset, 1);

        expect(refreshSpy).toHaveBeenCalledTimes(3);
        expect(paginationSpy).toHaveBeenCalledWith(2);
        expect((customElement.gridOptions.backendServiceApi as BackendServiceApi).internalPostProcess).toEqual(expect.any(Function));
      });

      xit('should execute the "internalPostProcess" callback method that was created by "createBackendApiInternalPostProcessCallback" without Pagination (when disabled)', () => {
        customElement.gridOptions.enablePagination = false;
        jest.spyOn((customElement.gridOptions.backendServiceApi as BackendServiceApi).service, 'getDatasetName').mockReturnValue('users');
        const spy = jest.spyOn(customElement, 'refreshGridData');

        customElement.bind();
        customElement.attached();
        customElement.gridOptions.backendServiceApi!.internalPostProcess!({ data: { users: [{ firstName: 'John' }] } });

        expect(spy).toHaveBeenCalled();
        expect((customElement.gridOptions.backendServiceApi as BackendServiceApi).internalPostProcess).toEqual(expect.any(Function));
      });

      xit('should execute the "internalPostProcess" callback method but return an empty dataset when dataset name does not match "getDatasetName"', () => {
        customElement.gridOptions.enablePagination = true;
        jest.spyOn((customElement.gridOptions.backendServiceApi as BackendServiceApi).service, 'getDatasetName').mockReturnValue('users');
        const spy = jest.spyOn(customElement, 'refreshGridData');

        customElement.bind();
        customElement.attached();
        customElement.gridOptions.backendServiceApi!.internalPostProcess!({ data: { notUsers: { nodes: [{ firstName: 'John' }], totalCount: 2 } } } as GraphqlPaginatedResult);

        expect(spy).not.toHaveBeenCalled();
        expect(customElement.dataset).toEqual([]);
      });

      xit('should invoke "updateFilters" method with filters returned from "getColumnFilters" of the Filter Service when there is no Presets defined', () => {
        const mockColumnFilter = { name: { columnId: 'name', columnDef: { id: 'name', field: 'name', filter: { model: Filters.autoComplete } }, operator: 'EQ', searchTerms: ['john'] } };
        // @ts-expect-error
        jest.spyOn(filterServiceStub, 'getColumnFilters').mockReturnValue(mockColumnFilter);
        const backendSpy = jest.spyOn(mockGraphqlService, 'updateFilters');

        customElement.gridOptions.presets = undefined;
        customElement.bind();
        customElement.attached();

        expect(backendSpy).toHaveBeenCalledWith(mockColumnFilter, false);
      });

      xit('should call the "updateFilters" method when filters are defined in the "presets" property', () => {
        const spy = jest.spyOn(mockGraphqlService, 'updateFilters');
        const mockFilters = [{ columnId: 'company', searchTerms: ['xyz'], operator: 'IN' }] as CurrentFilter[];
        customElement.gridOptions.presets = { filters: mockFilters };
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalledWith(mockFilters, true);
      });

      xit('should call the "updateSorters" method when filters are defined in the "presets" property', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const spy = jest.spyOn(mockGraphqlService, 'updateSorters');
        const mockSorters = [{ columnId: 'name', direction: 'asc' }] as CurrentSorter[];
        customElement.gridOptions.presets = { sorters: mockSorters };
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalledWith(undefined, mockSorters);
      });

      xit('should call the "updatePagination" method when filters are defined in the "presets" property', () => {
        const spy = jest.spyOn(mockGraphqlService, 'updatePagination');

        customElement.gridOptions.presets = { pagination: { pageNumber: 2, pageSize: 20 } };
        customElement.bind();
        customElement.attached();

        expect(spy).toHaveBeenCalledWith(2, 20);
      });

      xit('should refresh the grid and change pagination options pagination when a preset for it is defined in grid options', () => {
        const expectedPageNumber = 3;
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');

        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        customElement.gridOptions.enablePagination = true;
        customElement.gridOptions.presets = { pagination: { pageSize: 10, pageNumber: expectedPageNumber } };
        customElement.paginationOptions = { pageSize: 10, pageNumber: 1, pageSizes: [10, 25, 50], totalItems: 100 };

        customElement.bind();
        customElement.attached();
        customElement.datasetChanged(mockData, null as any);

        expect(customElement.gridOptions?.pagination?.pageSize).toBe(10);
        expect(customElement.gridOptions?.pagination?.pageNumber).toBe(expectedPageNumber);
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });

      xit('should execute the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options with Pagination enabled', (done) => {
        const now = new Date();
        const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
        const processResult = {
          data: { users: { nodes: [] }, pageInfo: { hasNextPage: true }, totalCount: 0 },
          metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 }
        };
        const promise = new Promise((resolve) => setTimeout(() => resolve(processResult), 1));
        const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi as BackendServiceApi, 'process').mockReturnValue(promise);
        jest.spyOn((customElement.gridOptions.backendServiceApi as BackendServiceApi).service, 'buildQuery').mockReturnValue(query);

        (customElement.gridOptions.backendServiceApi as BackendServiceApi).service.options = { executeProcessCommandOnInit: true };
        customElement.bind();
        customElement.attached();

        expect(processSpy).toHaveBeenCalled();

        setTimeout(() => {
          expect(mockExecuteBackendProcess).toHaveBeenCalledWith(expect.toBeDate(), processResult, customElement.gridOptions.backendServiceApi, 0);
          done();
        }, 5);
      });

      xit('should execute the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options without Pagination (when disabled)', (done) => {
        const now = new Date();
        const query = `query { users { id,name,gender,company } }`;
        const processResult = {
          data: { users: [] },
          metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 }
        };
        const promise = new Promise((resolve) => setTimeout(() => resolve(processResult), 1));
        const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi as BackendServiceApi, 'process').mockReturnValue(promise);
        jest.spyOn((customElement.gridOptions.backendServiceApi as BackendServiceApi).service, 'buildQuery').mockReturnValue(query);

        (customElement.gridOptions.backendServiceApi as BackendServiceApi).service.options = { executeProcessCommandOnInit: true };
        customElement.bind();
        customElement.attached();

        expect(processSpy).toHaveBeenCalled();

        setTimeout(() => {
          expect(mockExecuteBackendProcess).toHaveBeenCalledWith(expect.toBeDate(), processResult, customElement.gridOptions.backendServiceApi, 0);
          done();
        }, 5);
      });

      xit('should throw an error when the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options', (done) => {
        const mockError = { error: '404' };
        const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
        const promise = new Promise((_resolve, reject) => setTimeout(() => reject(mockError), 1));
        const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi as BackendServiceApi, 'process').mockReturnValue(promise);
        jest.spyOn((customElement.gridOptions.backendServiceApi as BackendServiceApi).service, 'buildQuery').mockReturnValue(query);

        (customElement.gridOptions.backendServiceApi as BackendServiceApi).service.options = { executeProcessCommandOnInit: true };
        customElement.bind();
        customElement.attached();

        expect(processSpy).toHaveBeenCalled();

        promise.catch((e) => {
          expect(e).toBe(mockError);
          done();
        });
      });
    });

    describe('commitEdit method', () => {
      xit('should commit current edit when we focus out of current cell', (done) => {
        jest.spyOn(mockGrid, 'getOptions').mockReturnValue({ autoCommitEdit: true });
        jest.spyOn(mockGrid, 'getActiveCellNode').mockReturnValue(divContainer);
        const spy = jest.spyOn(mockGrid, 'getEditorLock');

        customElement.bind();
        customElement.attached();
        customElement.commitEdit(cellDiv);

        setTimeout(() => {
          expect(spy).toHaveBeenCalled();
          done();
        });
      });
    });

    describe('bindDifferentHooks private method called by "attached"', () => {
      beforeEach(() => {
        customElement.columnDefinitions = [{ id: 'firstName', field: 'firstName' }];
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      xit('should call multiple translate methods when locale changes', (done) => {
        const transCellMenuSpy = jest.spyOn(extensionServiceStub, 'translateCellMenu');
        const transColHeaderSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const transColPickerSpy = jest.spyOn(extensionServiceStub, 'translateColumnPicker');
        const transContextMenuSpy = jest.spyOn(extensionServiceStub, 'translateContextMenu');
        const transGridMenuSpy = jest.spyOn(extensionServiceStub, 'translateGridMenu');
        const transHeaderMenuSpy = jest.spyOn(extensionServiceStub, 'translateHeaderMenu');
        const transGroupingColSpanSpy = jest.spyOn(groupingAndColspanServiceStub, 'translateGroupingAndColSpan');
        const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');

        customElement.gridOptions = { enableTranslate: true, createPreHeaderPanel: false, enableDraggableGrouping: false } as GridOption;
        customElement.bind();
        customElement.attached();

        globalEa.publish('i18n:locale:changed', {});

        setTimeout(() => {
          expect(setHeaderRowSpy).not.toHaveBeenCalled();
          expect(transGroupingColSpanSpy).not.toHaveBeenCalled();
          expect(transCellMenuSpy).toHaveBeenCalled();
          expect(transColHeaderSpy).toHaveBeenCalled();
          expect(transColPickerSpy).toHaveBeenCalled();
          expect(transContextMenuSpy).toHaveBeenCalled();
          expect(transGridMenuSpy).toHaveBeenCalled();
          expect(transHeaderMenuSpy).toHaveBeenCalled();
          done();
        });
      });

      xit('should call "setHeaderRowVisibility", "translateGroupingAndColSpan" and other methods when locale changes', (done) => {
        customElement.columnDefinitions = [{ id: 'firstName', field: 'firstName', filterable: true }];
        const transCellMenuSpy = jest.spyOn(extensionServiceStub, 'translateCellMenu');
        const transColHeaderSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const transColPickerSpy = jest.spyOn(extensionServiceStub, 'translateColumnPicker');
        const transContextMenuSpy = jest.spyOn(extensionServiceStub, 'translateContextMenu');
        const transGridMenuSpy = jest.spyOn(extensionServiceStub, 'translateGridMenu');
        const transHeaderMenuSpy = jest.spyOn(extensionServiceStub, 'translateHeaderMenu');
        const transGroupingColSpanSpy = jest.spyOn(groupingAndColspanServiceStub, 'translateGroupingAndColSpan');

        customElement.gridOptions = { enableTranslate: true, createPreHeaderPanel: true, enableDraggableGrouping: false } as GridOption;
        customElement.bind();
        customElement.attached();

        globalEa.publish('i18n:locale:changed', {});

        setTimeout(() => {
          expect(transGroupingColSpanSpy).toHaveBeenCalled();
          expect(transCellMenuSpy).toHaveBeenCalled();
          expect(transColHeaderSpy).toHaveBeenCalled();
          expect(transColPickerSpy).toHaveBeenCalled();
          expect(transContextMenuSpy).toHaveBeenCalled();
          expect(transGridMenuSpy).toHaveBeenCalled();
          expect(transHeaderMenuSpy).toHaveBeenCalled();
          done();
        });
      });

      xit('should call "translateGroupingAndColSpan" translate methods when locale changes and Column Grouping PreHeader are enabled', (done) => {
        const groupColSpanSpy = jest.spyOn(groupingAndColspanServiceStub, 'translateGroupingAndColSpan');

        customElement.gridOptions = { enableTranslate: true, createPreHeaderPanel: true, enableDraggableGrouping: false } as GridOption;
        customElement.bind();
        customElement.attached();

        globalEa.publish('i18n:locale:changed', {});

        setTimeout(() => {
          expect(groupColSpanSpy).toHaveBeenCalled();
          done();
        });
      });

      xit('should trigger a DOM element dispatch event when a SlickGrid onX event is triggered', () => {
        const eventSpy = jest.spyOn(divContainer, 'dispatchEvent');
        const gridElm = divContainer.querySelector('div#grid1');
        const mockEvent = () => 'blah';

        customElement.bind();
        customElement.attached();
        // @ts-ignore
        const handlerSpy = jest.spyOn(customElement.eventHandler, 'subscribe').mockReturnValueOnce('onRendered', mockEvent);
        mockEvent();
        mockGrid.onRendered();
        mockGrid.onScroll();

        gridElm?.dispatchEvent(DOM.createCustomEvent('onRendered'));
        expect(eventSpy).toHaveBeenCalledWith(DOM.createCustomEvent('onRendered', expect.anything()));
        expect(handlerSpy).toHaveBeenCalled();
      });

      xit('should reflect columns in the grid', () => {
        const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
        const mockCols = [{ id: 'firstName', field: 'firstName' }];
        const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue(mockCols);
        const setColSpy = jest.spyOn(mockGrid, 'setColumns');

        customElement.gridOptions = { presets: { columns: mockColsPresets } } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
        expect(setColSpy).toHaveBeenCalledWith(mockCols);
      });

      xit('should reflect columns with an extra checkbox selection column in the grid when "enableCheckboxSelector" is set', () => {
        const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
        const mockCol = { id: 'firstName', field: 'firstName' };
        const mockCols = [{ id: '_checkbox_selector', field: '_checkbox_selector', editor: undefined, internalColumnEditor: {} }, mockCol];
        const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue([mockCol]);
        const setColSpy = jest.spyOn(mockGrid, 'setColumns');

        customElement.columnDefinitions = mockCols;
        customElement.gridOptions = { enableCheckboxSelector: true, presets: { columns: mockColsPresets } } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
        expect(setColSpy).toHaveBeenCalledWith(mockCols);
      });

      xit('should execute backend service "init" method when set', () => {
        const mockPagination = { pageNumber: 1, pageSizes: [10, 25, 50], pageSize: 10, totalItems: 100 };
        const mockGraphqlOptions = { datasetName: 'users', extraQueryArguments: [{ field: 'userId', value: 123 }] } as GraphqlServiceOption;
        const bindBackendSpy = jest.spyOn(sortServiceStub, 'bindBackendOnSort');
        const mockGraphqlService2 = { ...mockGraphqlService, init: jest.fn() } as unknown as GraphqlService;
        const initSpy = jest.spyOn(mockGraphqlService2, 'init');

        customElement.gridOptions = {
          enableSorting: true,
          backendServiceApi: {
            service: mockGraphqlService2,
            options: mockGraphqlOptions,
            preProcess: () => jest.fn(),
            process: () => new Promise((resolve) => resolve({ data: { users: { nodes: [], totalCount: 100 } } })),
          } as unknown as GraphqlServiceApi,
          pagination: mockPagination,
        } as unknown as GridOption;
        customElement.bind();
        customElement.attached();

        expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
        expect(initSpy).toHaveBeenCalledWith(mockGraphqlOptions, mockPagination, mockGrid);
      });

      xit('should call bind backend sorting when "enableSorting" is set', () => {
        const bindBackendSpy = jest.spyOn(sortServiceStub, 'bindBackendOnSort');

        customElement.gridOptions = {
          enableSorting: true,
          backendServiceApi: {
            service: mockGraphqlService,
            preProcess: () => jest.fn(),
            process: () => new Promise((resolve) => resolve('process resolved')),
          }
        } as unknown as GridOption;
        customElement.bind();
        customElement.attached();

        expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
      });

      xit('should call bind local sorting when "enableSorting" is set and "useLocalSorting" is set as well', () => {
        const bindLocalSpy = jest.spyOn(sortServiceStub, 'bindLocalOnSort');

        customElement.gridOptions = {
          enableSorting: true,
          backendServiceApi: {
            service: mockGraphqlService,
            useLocalSorting: true,
            preProcess: () => jest.fn(),
            process: () => new Promise((resolve) => resolve('process resolved')),
          }
        } as unknown as GridOption;
        customElement.bind();
        customElement.attached();

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });

      xit('should call bind backend filtering when "enableFiltering" is set', () => {
        const initSpy = jest.spyOn(filterServiceStub, 'init');
        const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');
        const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

        customElement.gridOptions = { enableFiltering: true } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(initSpy).toHaveBeenCalledWith(mockGrid);
        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
        expect(populateSpy).not.toHaveBeenCalled();
      });

      xit('should call bind local filtering when "enableFiltering" is set and "useLocalFiltering" is set as well', () => {
        const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');

        customElement.gridOptions = {
          enableFiltering: true,
          backendServiceApi: {
            service: mockGraphqlService,
            useLocalFiltering: true,
            preProcess: () => jest.fn(),
            process: () => new Promise((resolve) => resolve('process resolved')),
          }
        } as unknown as GridOption;
        customElement.bind();
        customElement.attached();

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });

      xit('should reflect column filters when "enableFiltering" is set', () => {
        const initSpy = jest.spyOn(filterServiceStub, 'init');
        const bindBackendSpy = jest.spyOn(filterServiceStub, 'bindBackendOnFilter');
        const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

        customElement.gridOptions = {
          enableFiltering: true,
          backendServiceApi: {
            service: mockGraphqlService,
            preProcess: () => jest.fn(),
            process: () => new Promise((resolve) => resolve('process resolved')),
          }
        } as unknown as GridOption;
        customElement.bind();
        customElement.attached();

        expect(initSpy).toHaveBeenCalledWith(mockGrid);
        expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
        expect(populateSpy).not.toHaveBeenCalled();
      });

      xit('should reflect column filters and populate filter search terms when "enableFiltering" is set and preset filters are defined', () => {
        const mockPresetFilters = [{ columnId: 'firstName', operator: 'IN', searchTerms: ['John', 'Jane'] }] as CurrentFilter[];
        const initSpy = jest.spyOn(filterServiceStub, 'init');
        const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

        customElement.gridOptions = { enableFiltering: true, presets: { filters: mockPresetFilters } } as GridOption;
        customElement.bind();
        customElement.attached();

        expect(initSpy).toHaveBeenCalledWith(mockGrid);
        expect(populateSpy).toHaveBeenCalledWith(mockPresetFilters);
      });

      xit('should return null when "getItemMetadata" is called without a colspan callback defined', () => {
        const itemSpy = jest.spyOn(mockDataView, 'getItem');

        customElement.gridOptions = { colspanCallback: undefined } as GridOption;
        customElement.bind();
        customElement.attached();
        mockDataView.getItemMetadata(2);

        expect(itemSpy).not.toHaveBeenCalled();
      });

      xit('should execute colspan callback when defined in the grid options and "getItemMetadata" is called', () => {
        const mockCallback = jest.fn();
        const mockItem = { firstName: 'John', lastName: 'Doe' };
        const itemSpy = jest.spyOn(mockDataView, 'getItem').mockReturnValue(mockItem);

        customElement.gridOptions = { colspanCallback: mockCallback } as GridOption;
        customElement.bind();
        customElement.attached();
        mockDataView.getItemMetadata(2);

        expect(itemSpy).toHaveBeenCalledWith(2);
        expect(mockCallback).toHaveBeenCalledWith(mockItem);
      });

    });

    describe('setHeaderRowVisibility grid method', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      xit('should show the header row when "showHeaderRow" is called with argument True', () => {
        const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');
        const setColumnSpy = jest.spyOn(mockGrid, 'setColumns');

        customElement.bind();
        customElement.attached();
        customElement.showHeaderRow(true);

        expect(setHeaderRowSpy).toHaveBeenCalledWith(true, false);
        expect(setColumnSpy).toHaveBeenCalledTimes(1);
      });

      xit('should show the header row when "showHeaderRow" is called with argument False', () => {
        const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');
        const setColumnSpy = jest.spyOn(mockGrid, 'setColumns');

        customElement.bind();
        customElement.attached();
        customElement.showHeaderRow(false);

        expect(setHeaderRowSpy).toHaveBeenCalledWith(false, false);
        expect(setColumnSpy).not.toHaveBeenCalled();
      });
    });

    describe('pagination events', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      xit('should merge paginationOptions when some already exist', () => {
        const mockPagination = { pageSize: 2, pageSizes: [] };
        const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');

        customElement.bind();
        customElement.attached();
        customElement.paginationOptionsChanged(mockPagination);

        expect(customElement.gridOptions?.pagination).toEqual({ ...mockPagination, totalItems: 0 });
        expect(paginationSrvSpy).toHaveBeenCalledWith(0, true);
      });

      xit('should set brand new paginationOptions when none previously exist', () => {
        const mockPagination = { pageSize: 2, pageSizes: [], totalItems: 1 };
        const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');

        customElement.bind();
        customElement.attached();
        customElement.paginationOptionsChanged(undefined as any);
        customElement.paginationOptionsChanged(mockPagination);

        expect(customElement.gridOptions?.pagination).toEqual(mockPagination);
        expect(paginationSrvSpy).toHaveBeenNthCalledWith(2, 1, true);
      });

      xit('should call trigger a gridStage change event when pagination change is triggered', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
        const pluginEaSpy = jest.spyOn(pluginEa, 'publish');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        customElement.bind();
        customElement.attached();
        customElement.paginationChanged(mockPagination);

        expect(pluginEaSpy).toHaveBeenCalledWith('gridStateService:changed', {
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });

      xit('should call trigger a gridStage change event when "onPaginationChanged" from the Pagination Service is triggered', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as CurrentPagination;
        const mockServicePagination = {
          ...mockPagination,
          dataFrom: 5,
          dataTo: 10,
          pageCount: 1,
          pageSizes: [5, 10, 15, 20],
        } as ServicePagination;
        const pluginEaSpy = jest.spyOn(pluginEa, 'publish');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        customElement.gridOptions.enablePagination = true;
        customElement.bind();
        customElement.attached();
        customElement.refreshGridData([{ firstName: 'John', lastName: 'Doe' }]);
        pluginEa.publish('paginationService:onPaginationChanged', mockServicePagination);

        expect(pluginEaSpy).toHaveBeenCalledWith('gridStateService:changed', {
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });

      xit('should call trigger a gridStage change and reset selected rows when pagination change is triggered and "enableRowSelection" is set', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
        const pluginEaSpy = jest.spyOn(pluginEa, 'publish');
        const setRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        customElement.gridOptions = { enableRowSelection: true } as GridOption;
        customElement.bind();
        customElement.attached();
        customElement.paginationChanged(mockPagination);

        expect(setRowSpy).toHaveBeenCalledWith([]);
        expect(pluginEaSpy).toHaveBeenCalledWith('gridStateService:changed', {
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });

      xit('should call trigger a gridStage change and reset selected rows when pagination change is triggered and "enableCheckboxSelector" is set', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
        const pluginEaSpy = jest.spyOn(pluginEa, 'publish');
        const setRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        customElement.gridOptions = { enableCheckboxSelector: true } as GridOption;
        customElement.bind();
        customElement.attached();
        customElement.paginationChanged(mockPagination);

        expect(setRowSpy).toHaveBeenCalledWith([]);
        expect(pluginEaSpy).toHaveBeenCalledWith('gridStateService:changed', {
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });
    });

    describe('Custom Footer', () => {
      xit('should have a Custom Footer when "showCustomFooter" is enabled and there are no Pagination used', (done) => {
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.gridOptions.enableTranslate = true;
        customElement.gridOptions.showCustomFooter = true;
        customElement.bind();
        customElement.attached();
        customElement.columnDefinitions = mockColDefs;

        setTimeout(() => {
          expect(customElement.columnDefinitions).toEqual(mockColDefs);
          expect(customElement.showCustomFooter).toBeTrue();
          expect(customElement.customFooterOptions).toEqual({
            dateFormat: 'YYYY-MM-DD, hh:mm a',
            hideLastUpdateTimestamp: true,
            hideTotalItemCount: false,
            footerHeight: 20,
            leftContainerClass: 'col-xs-12 col-sm-5',
            metricSeparator: '|',
            metricTexts: {
              items: 'éléments',
              itemsKey: 'ITEMS',
              of: 'de',
              ofKey: 'OF',
            },
            rightContainerClass: 'col-xs-6 col-sm-7',
          });
          done();
        });
      });

      xit('should have a Custom Footer and custom texts when "showCustomFooter" is enabled with different metricTexts defined', (done) => {
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.gridOptions.enableTranslate = false;
        customElement.gridOptions.showCustomFooter = true;
        customElement.gridOptions.customFooterOptions = {
          metricTexts: {
            items: 'some items',
            lastUpdate: 'some last update',
            of: 'some of'
          }
        };
        customElement.bind();
        customElement.attached();
        customElement.columnDefinitions = mockColDefs;

        setTimeout(() => {
          expect(customElement.columnDefinitions).toEqual(mockColDefs);
          expect(customElement.showCustomFooter).toBeTrue();
          expect(customElement.customFooterOptions).toEqual({
            dateFormat: 'YYYY-MM-DD, hh:mm a',
            hideLastUpdateTimestamp: true,
            hideTotalItemCount: false,
            footerHeight: 20,
            leftContainerClass: 'col-xs-12 col-sm-5',
            metricSeparator: '|',
            metricTexts: {
              items: 'some items',
              itemsKey: 'ITEMS',
              lastUpdate: 'some last update',
              of: 'some of',
              ofKey: 'OF',
            },
            rightContainerClass: 'col-xs-6 col-sm-7',
          });
          done();
        });
      });

      xit('should NOT have a Custom Footer when "showCustomFooter" is enabled WITH Pagination in use', (done) => {
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.gridOptions.enablePagination = true;
        customElement.gridOptions.showCustomFooter = true;
        customElement.bind();
        customElement.attached();
        customElement.columnDefinitions = mockColDefs;

        setTimeout(() => {
          expect(customElement.columnDefinitions).toEqual(mockColDefs);
          expect(customElement.showCustomFooter).toBeFalse();
          done();
        });
      });
    });

    describe('loadRowSelectionPresetWhenExists method', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      xit('should call the "mapIdsToRows" from the DataView then "setSelectedRows" from the Grid when there are row selection presets with "dataContextIds" array set', (done) => {
        const selectedGridRows = [2];
        const selectedRowIds = [99];
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const dataviewSpy = jest.spyOn(mockDataView, 'mapIdsToRows').mockReturnValue(selectedGridRows);
        const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);

        customElement.gridOptions.enableCheckboxSelector = true;
        customElement.gridOptions.presets = { rowSelection: { dataContextIds: selectedRowIds } };
        customElement.bind();
        customElement.attached();
        customElement.datasetChanged(mockData, null as any);

        setTimeout(() => {
          expect(dataviewSpy).toHaveBeenCalled();
          expect(selectRowSpy).toHaveBeenCalledWith(selectedGridRows);
          done();
        });
      });

      xit('should call the "setSelectedRows" from the Grid when there are row selection presets with "dataContextIds" array set', (done) => {
        const selectedGridRows = [22];
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);

        customElement.gridOptions.enableRowSelection = true;
        customElement.gridOptions.presets = { rowSelection: { gridRowIndexes: selectedGridRows } };
        customElement.datasetChanged(mockData, null as any);
        customElement.bind();
        customElement.attached();

        setTimeout(() => {
          expect(selectRowSpy).toHaveBeenCalledWith(selectedGridRows);
          done();
        });
      });

      xit('should NOT call the "setSelectedRows" when the Grid has Local Pagination and there are row selection presets with "dataContextIds" array set', (done) => {
        const selectedGridRows = [22];
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);

        customElement.gridOptions.enableRowSelection = true;
        customElement.gridOptions.enablePagination = true;
        customElement.gridOptions.backendServiceApi = null as any;
        customElement.gridOptions.presets = { rowSelection: { dataContextIds: selectedGridRows } };
        customElement.dataset = mockData;
        customElement.bind();
        customElement.attached();

        setTimeout(() => {
          expect(selectRowSpy).not.toHaveBeenCalled();
          done();
        }, 2);
      });
    });

    describe('onPaginationVisibilityChanged event', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      xit('should change "showPagination" flag when "onPaginationVisibilityChanged" from the Pagination Service is triggered', (done) => {
        customElement.gridOptions.enablePagination = true;
        customElement.gridOptions.backendServiceApi = null as any;

        customElement.bind();
        customElement.attached();
        customElement.refreshGridData([{ firstName: 'John', lastName: 'Doe' }]);
        pluginEa.publish('paginationService:onPaginationVisibilityChanged', { visible: false });

        setTimeout(() => {
          expect(customElement.showPagination).toBeFalsy();
          done();
        });
      });

      xit('should call the backend service API to refresh the dataset', (done) => {
        customElement.gridOptions.enablePagination = true;
        customElement.gridOptions.backendServiceApi = {
          service: mockGraphqlService as unknown as BackendService,
          process: jest.fn(),
        };

        customElement.bind();
        customElement.attached();
        customElement.refreshGridData([{ firstName: 'John', lastName: 'Doe' }]);
        pluginEa.publish('paginationService:onPaginationVisibilityChanged', { visible: false });

        setTimeout(() => {
          expect(mockRefreshBackendDataset).toHaveBeenCalled();
          expect(customElement.showPagination).toBeFalsy();
          done();
        });
      });
    });

    describe('Tree Data View', () => {
      xit('should throw an error when enableTreeData is enabled without passing a "columnId"', (done) => {
        try {
          customElement.gridOptions = { enableTreeData: true, treeDataOptions: {} } as GridOption;
          customElement.bind();
          customElement.attached();

        } catch (e) {
          expect(e.toString()).toContain('[Aurelia-Slickgrid] When enabling tree data, you must also provide the "treeDataOption" property in your Grid Options with "childrenPropName" or "parentPropName"');
          customElement.dispose();
          done();
        }
      });

      xit('should change flat dataset and expect  being called with other methods', () => {
        const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
        const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
        const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');

        customElement.gridOptions = { enableTreeData: true, treeDataOptions: { columnId: 'file', parentPropName: 'parentId', childrenPropName: 'files' } } as GridOption;
        customElement.bind();
        customElement.attached();
        customElement.datasetChanged(mockFlatDataset, null as any);

        expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
      });

      xit('should change hierarchical dataset and expect processTreeDataInitialSort being called with other methods', () => {
        const mockHierarchical = [{ file: 'documents', files: [{ file: 'vacation.txt' }] }];
        const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
        const clearFilterSpy = jest.spyOn(filterServiceStub, 'clearFilters');
        const setItemsSpy = jest.spyOn(mockDataView, 'setItems');
        const processSpy = jest.spyOn(sortServiceStub, 'processTreeDataInitialSort');

        customElement.gridOptions = { enableTreeData: true, treeDataOptions: { columnId: 'file' } } as GridOption;
        customElement.bind();
        customElement.attached();
        customElement.datasetHierarchicalChanged(mockHierarchical);

        expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
        expect(clearFilterSpy).toHaveBeenCalled();
        expect(processSpy).toHaveBeenCalled();
        expect(setItemsSpy).toHaveBeenCalledWith([], 'id');
      });
    });
  });
});
