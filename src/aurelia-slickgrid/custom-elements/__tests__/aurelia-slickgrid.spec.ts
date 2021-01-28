import {
  BackendService, CollectionService,
  Column,
  ColumnFilters,
  CurrentFilter,
  CurrentPagination,
  CurrentSorter,
  Editors,
  ExtensionList,
  ExtensionService,
  ExtensionUtility,
  Filters,
  FilterService,
  GridEventService,
  GridOption,
  GridService,
  GridState,
  GridStateService,
  GridStateType,
  GroupingAndColspanService,
  Pagination,
  PaginationService,
  ServicePagination,
  SharedService,
  SlickGrid,
  SortService,
  TreeDataService
} from '@slickgrid-universal/common';
import * as backendUtilities from '@slickgrid-universal/common/dist/commonjs/services/backend-utilities';
import * as utilities from '@slickgrid-universal/common/dist/commonjs/services/utilities';
import * as aureliaSlickgridUtilities from '../aurelia-slickgrid-utilities';

import { SlickEmptyWarningComponent } from '@slickgrid-universal/empty-warning-component';
import { GraphqlPaginatedResult, GraphqlService, GraphqlServiceApi, GraphqlServiceOption } from '@slickgrid-universal/graphql';
import { TextExportService } from '@slickgrid-universal/text-export';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingEngine, Container } from 'aurelia-framework';
import 'jest-extended';

import { HttpStub } from '../../../../test/httpClientStub';
import { MockSlickEvent, MockSlickEventHandler } from '../../../../test/mockSlickEvent';
import { TranslaterServiceStub } from '../../../../test/translaterServiceStub';
import { AureliaUtilService, ContainerService, TranslaterService } from '../../services';
import { PubSubService } from '../../services/pubSub.service';
import { ResizerService } from '../../services/resizer.service';
import { AureliaSlickgridCustomElement } from '../aurelia-slickgrid';


const mockExecuteBackendProcess = jest.fn();
const mockRefreshBackendDataset = jest.fn();
const mockBackendError = jest.fn();
const mockConvertParentChildArray = jest.fn();
const mockAutoAddCustomEditorFormatter = jest.fn();

(backendUtilities.executeBackendProcessesCallback as any) = mockExecuteBackendProcess;
(backendUtilities.refreshBackendDataset as any) = mockRefreshBackendDataset;
(backendUtilities.onBackendError as any) = mockBackendError;
(aureliaSlickgridUtilities.autoAddEditorFormatterToColumnsWithEditor as any) = mockAutoAddCustomEditorFormatter;

declare const Slick: any;
const slickEventHandler = new MockSlickEventHandler();

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
Object.defineProperty(extensionServiceStub, 'extensionList', { get: jest.fn(() => { }), set: jest.fn(), configurable: true });

const aureliaUtilServiceStub = {
  createAureliaViewModelAddToSlot: jest.fn(),
  createAureliaViewAddToSlot: jest.fn(),
} as unknown as AureliaUtilService;

const bindingEngineStub = {
  collectionObserver: () => ({
    subscribe: jest.fn(),
  })
} as unknown as BindingEngine;

const mockExtensionUtility = {
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

const collectionServiceStub = {
  filterCollection: jest.fn(),
  singleFilterCollection: jest.fn(),
  sortCollection: jest.fn(),
} as unknown as CollectionService;

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
  getFullPagination: jest.fn(),
  updateTotalItems: jest.fn(),
} as unknown as PaginationService;

const resizerServiceStub = {
  dispose: jest.fn(),
  init: jest.fn(),
  resizeGrid: jest.fn(),
} as unknown as ResizerService;

Object.defineProperty(paginationServiceStub, 'totalItems', {
  get: jest.fn(() => 0),
  set: jest.fn()
});

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
  onRowsChanged: new MockSlickEvent(),
  onRowsOrCountChanged: new MockSlickEvent(),
  reSort: jest.fn(),
  setItems: jest.fn(),
  syncGridSelection: jest.fn(),
};

const mockDraggableGroupingExtension = {
  constructor: jest.fn(),
  init: jest.fn(),
  destroy: jest.fn(),
};

const mockEventPubSub = {
  notify: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
};

const mockSlickEventHandler = {
  handlers: [],
  notify: jest.fn(),
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
  getCellEditor: jest.fn(),
  getEditorLock: () => mockGetEditorLock,
  getUID: () => 'slickgrid_12345',
  getContainerNode: jest.fn(),
  getGridPosition: jest.fn(),
  getOptions: jest.fn(),
  getSelectionModel: jest.fn(),
  getScrollbarDimensions: jest.fn(),
  updateRow: jest.fn(),
  render: jest.fn(),
  registerPlugin: jest.fn(),
  resizeCanvas: jest.fn(),
  setColumns: jest.fn(),
  setHeaderRowVisibility: jest.fn(),
  setOptions: jest.fn(),
  setSelectedRows: jest.fn(),
  onClick: new MockSlickEvent(),
  onClicked: new MockSlickEvent(),
  onRendered: jest.fn(),
  onScroll: jest.fn(),
  onDataviewCreated: new MockSlickEvent(),
};

const mockSlickEventHandlerImplementation = jest.fn().mockImplementation(() => mockSlickEventHandler);
const mockDataViewImplementation = jest.fn().mockImplementation(() => mockDataView);
const mockGroupItemMetaProviderImplementation = jest.fn().mockImplementation(() => mockGroupItemMetaProvider);
const mockGridImplementation = jest.fn().mockImplementation(() => mockGrid);
const mockDraggableGroupingImplementation = jest.fn().mockImplementation(() => mockDraggableGroupingExtension);
const template = `<div class="demo-container"><div class="grid1"></div></div>`;

describe('Slick-Vanilla-Grid-Bundle Component instantiated via Constructor', () => {
  jest.mock('slickgrid/slick.grid', () => mockGridImplementation);
  jest.mock('slickgrid/plugins/slick.draggablegrouping', () => mockDraggableGroupingImplementation);
  Slick.Grid = mockGridImplementation;
  // Slick.EventHandler = slickEventHandler;
  Slick.EventHandler = mockSlickEventHandlerImplementation;
  Slick.Data = { DataView: mockDataViewImplementation, GroupItemMetadataProvider: mockGroupItemMetaProviderImplementation };
  Slick.DraggableGrouping = mockDraggableGroupingImplementation;

  let customElement: AureliaSlickgridCustomElement;
  let divContainer: HTMLDivElement;
  let cellDiv: HTMLDivElement;
  let columnDefinitions: Column[];
  let gridOptions: GridOption;
  let sharedService: SharedService;
  let globalEa: EventAggregator;
  let pluginEa: EventAggregator;
  let pubSubService: PubSubService;
  let translateService: TranslaterServiceStub;
  const container = new Container();
  const http = new HttpStub();
  const containerService = new ContainerService(container);

  beforeEach(() => {
    divContainer = document.createElement('div');
    cellDiv = document.createElement('div');
    divContainer.innerHTML = template;
    divContainer.appendChild(cellDiv);
    document.body.appendChild(divContainer);
    columnDefinitions = [{ id: 'name', field: 'name' }];
    gridOptions = {
      enableExcelExport: false,
      dataView: null,
      autoResize: {
        bottomPadding: 45,
        calculateAvailableSizeBy: 'window',
        minHeight: 180,
        minWidth: 300,
        rightPadding: 0,
      },
    } as unknown as GridOption;
    sharedService = new SharedService();
    translateService = new TranslaterServiceStub();
    jest.spyOn(mockGrid, 'getOptions').mockReturnValue(gridOptions);
    globalEa = new EventAggregator();
    pluginEa = new EventAggregator();
    pubSubService = new PubSubService(pluginEa);

    customElement = new AureliaSlickgridCustomElement(
      aureliaUtilServiceStub,
      bindingEngineStub,
      container,
      divContainer,
      globalEa,
      resizerServiceStub,
      containerService,
      pubSubService,
      translateService as unknown as TranslaterService,
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
  });

  afterEach(() => {
    customElement?.dispose();
  });

  it('should make sure AureliaSlickgridCustomElement is defined', () => {
    expect(customElement).toBeTruthy();
  });

  it('should load enable jquery mousewheel scrolling when using a frozen grid', () => {
    customElement.gridOptions = gridOptions;
    customElement.gridOptions.enableMouseWheelScrollHandler = undefined;
    customElement.gridOptions.frozenRow = 3;

    customElement.bind();
    customElement.initialization(mockSlickEventHandler);

    expect(customElement.gridOptions.enableMouseWheelScrollHandler).toBeTrue();
  });

  it('should keep frozen column index reference (via frozenVisibleColumnId) when grid is a frozen grid', () => {
    const sharedFrozenIndexSpy = jest.spyOn(SharedService.prototype, 'frozenVisibleColumnId', 'set');
    customElement.columnDefinitions = columnDefinitions;
    customElement.gridOptions = gridOptions;
    customElement.gridOptions.frozenColumn = 0;

    customElement.bind();
    customElement.initialization(slickEventHandler);

    expect(customElement.eventHandler).toBe(slickEventHandler);
    expect(sharedFrozenIndexSpy).toHaveBeenCalledWith('name');
  });

  it('should create a grid and expect multiple Event Aggregator being called', () => {
    const pubSubSpy = jest.spyOn(pubSubService, 'dispatchCustomEvent');
    const dispatchSpy = jest.spyOn(divContainer, 'dispatchEvent');

    customElement.bind();
    customElement.initialization(slickEventHandler);

    expect(pubSubService).toBeTruthy();
    expect(dispatchSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith(new CustomEvent('onBeforeGridCreate', { bubbles: true, detail: { target: true } }));
    expect(pubSubSpy).toHaveBeenCalled();
    expect(pubSubSpy).toHaveBeenNthCalledWith(1, divContainer, 'onBeforeGridCreate', true, '');
    expect(pubSubSpy).toHaveBeenNthCalledWith(2, divContainer, 'onDataviewCreated', expect.any(Object), '');
    expect(pubSubSpy).toHaveBeenNthCalledWith(3, divContainer, 'onGridCreated', expect.any(Object), '');
    expect(pubSubSpy).toHaveBeenNthCalledWith(4, divContainer, 'onAureliaGridCreated', customElement.instances, '');

    customElement.dispose();
    expect(pubSubSpy).toHaveBeenNthCalledWith(5, divContainer, 'onBeforeGridDestroy', expect.any(Object), '');
    expect(pubSubSpy).toHaveBeenNthCalledWith(6, divContainer, 'onAfterGridDestroyed', true, '');
  });

  describe('initialization method', () => {
    const customEditableInputFormatter: Formatter = (_row, _cell, value, columnDef) => {
      const isEditableLine = !!columnDef.editor;
      value = (value === null || value === undefined) ? '' : value;
      return isEditableLine ? `<div class="editing-field">${value}</div>` : value;
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should initialize the grid with a fixed height when provided in the grid options', () => {
      const fixedHeight = 100;
      const resizerSpy = jest.spyOn(resizerServiceStub, 'resizeGrid');

      customElement.gridOptions = { ...gridOptions, gridHeight: fixedHeight };
      customElement.bind();
      customElement.initialization(slickEventHandler);

      expect(resizerSpy).toHaveBeenCalledWith(0, { height: fixedHeight, width: undefined });
    });

    it('should initialize the grid with a fixed height when provided in the grid options', () => {
      const fixedHeight = 100;
      const resizerSpy = jest.spyOn(resizerServiceStub, 'resizeGrid');

      customElement.gridOptions = { ...gridOptions, gridHeight: fixedHeight };
      customElement.bind();
      customElement.initialization(slickEventHandler);

      expect(resizerSpy).toHaveBeenCalledWith(0, { height: fixedHeight, width: undefined });
    });

    it('should initialize the grid with a fixed width when provided in the grid options', () => {
      const fixedWidth = 255;
      const resizerSpy = jest.spyOn(resizerServiceStub, 'resizeGrid');

      customElement.gridOptions = { ...gridOptions, gridWidth: fixedWidth };
      customElement.bind();
      customElement.initialization(slickEventHandler);

      expect(resizerSpy).toHaveBeenCalledWith(0, { height: undefined, width: fixedWidth });
    });

    it('should initialize the grid with autoResize enabled and without height/width then expect a "gridResize" to be called for auto-resizing', () => {
      const resizerSpy = jest.spyOn(resizerServiceStub, 'resizeGrid');

      customElement.gridOptions = { ...gridOptions, enableAutoResize: true };
      customElement.bind();
      customElement.initialization(slickEventHandler);

      expect(resizerSpy).toHaveBeenCalledWith();
    });

    describe('autoAddCustomEditorFormatter grid option', () => {
      it('should initialize the grid and automatically add custom Editor Formatter when provided in the grid options', () => {
        const autoAddFormatterSpy = jest.spyOn(aureliaSlickgridUtilities, 'autoAddEditorFormatterToColumnsWithEditor');

        customElement.gridOptions = { ...gridOptions, autoAddCustomEditorFormatter: customEditableInputFormatter };
        customElement.bind();
        customElement.initialization(slickEventHandler);

        expect(autoAddFormatterSpy).toHaveBeenCalledWith([], customEditableInputFormatter);
      });
    });

    describe('columns definitions changed', () => {
      it('should expect "translateColumnHeaders" being called when "enableTranslate" is set', () => {
        const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const updateSpy = jest.spyOn(customElement, 'updateColumnDefinitionsList');
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.columnDefinitions = mockColDefs;
        customElement.gridOptions = { ...gridOptions, enableTranslate: true };
        customElement.attached();
        customElement.initialization(slickEventHandler);
        customElement.columnDefinitionsChanged();

        expect(translateService).toBeTruthy();
        expect(translateSpy).toHaveBeenCalled();
        expect(autosizeSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
      });

      it('should expect "renderColumnHeaders" being called when "enableTranslate" is disabled', () => {
        const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const updateSpy = jest.spyOn(customElement, 'updateColumnDefinitionsList');
        const renderSpy = jest.spyOn(extensionServiceStub, 'renderColumnHeaders');
        const autoAddFormatterSpy = jest.spyOn(aureliaSlickgridUtilities, 'autoAddEditorFormatterToColumnsWithEditor');
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.columnDefinitions = mockColDefs;
        customElement.gridOptions = { ...gridOptions, enableTranslate: false, autoAddCustomEditorFormatter: customEditableInputFormatter };
        customElement.attached();
        customElement.initialization(slickEventHandler);
        customElement.columnDefinitionsChanged();

        expect(translateSpy).not.toHaveBeenCalled();
        expect(autosizeSpy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
        expect(renderSpy).toHaveBeenCalledWith(mockColDefs, true);
        expect(autoAddFormatterSpy).toHaveBeenCalledWith([{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }], customEditableInputFormatter);
      });
    });

    describe('dataset changed', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        sharedService.slickGrid = mockGrid as unknown as SlickGrid;
      });

      it('should expect "autosizeColumns" being called when "autoFitColumnsOnFirstLoad" is set and we are on first page load', () => {
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

        customElement.gridOptions = { autoFitColumnsOnFirstLoad: true };
        customElement.initialization(slickEventHandler);
        customElement.datasetChanged(mockData, null);

        expect(autosizeSpy).toHaveBeenCalledTimes(3); // 1x by datasetChanged and 2x by bindResizeHook
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });

      it('should expect "autosizeColumns" NOT being called when "autoFitColumnsOnFirstLoad" is not set and we are on first page load', () => {
        const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

        customElement.gridOptions = { autoFitColumnsOnFirstLoad: false };
        customElement.initialization(slickEventHandler);
        customElement.datasetChanged(mockData, null);

        expect(autosizeSpy).not.toHaveBeenCalled();
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });
    });

    describe('options changed', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        sharedService.slickGrid = mockGrid as unknown as SlickGrid;
        sharedService.gridOptions = gridOptions;
        customElement.gridOptions = gridOptions;
      });

      afterEach(() => {
        mockGrid.getOptions = jest.fn();
        jest.spyOn(mockGrid, 'getOptions').mockReturnValue(gridOptions);
      });

      it('should merge paginationOptions when some already exist', () => {
        const mockPagination = { pageSize: 2, pageSizes: [] };
        const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');

        customElement.paginationOptionsChanged(mockPagination);

        // expect(customElement.paginationOptions).toEqual({ ...mockPagination, totalItems: 0 });
        expect(paginationSrvSpy).toHaveBeenCalledWith(0, true);
      });

      it('should set brand new paginationOptions when none previously exist', () => {
        const mockPagination = { pageSize: 2, pageSizes: [], totalItems: 1 };
        const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');

        customElement.paginationOptionsChanged(undefined);
        customElement.paginationOptionsChanged(mockPagination);

        // expect(customElement.paginationOptions).toEqual(mockPagination);
        expect(paginationSrvSpy).toHaveBeenNthCalledWith(2, 1, true);
      });
    });

    describe('with editors', () => {
      beforeEach(() => {
        customElement.gridOptions = gridOptions;
      });

      it('should display a console error when any of the column definition ids include a dot notation', () => {
        const consoleSpy = jest.spyOn(global.console, 'error').mockReturnValue();
        const mockColDefs = [{ id: 'user.gender', field: 'user.gender', editor: { model: Editors.text, collection: ['male', 'female'] } }] as Column[];

        customElement.columnDefinitions = mockColDefs;
        customElement.columnDefinitionsChanged();
        customElement.initialization(slickEventHandler);

        expect(consoleSpy).toHaveBeenCalledWith('[Slickgrid-Universal] Make sure that none of your Column Definition "id" property includes a dot in its name because that will cause some problems with the Editors. For example if your column definition "field" property is "user.firstName" then use "firstName" as the column "id".');
      });

      it('should be able to load async editors with a regular Promise', (done) => {
        const mockCollection = ['male', 'female'];
        const promise = new Promise(resolve => resolve(mockCollection));
        const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];
        const getColSpy = jest.spyOn(mockGrid, 'getColumns').mockReturnValue(mockColDefs);

        customElement.columnDefinitions = mockColDefs;
        customElement.columnDefinitionsChanged();
        customElement.initialization(slickEventHandler);

        setTimeout(() => {
          expect(getColSpy).toHaveBeenCalled();
          expect(customElement.columnDefinitions[0].editor).toBeTruthy();
          expect(customElement.columnDefinitions[0].editor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor.model).toEqual(Editors.text);
          done();
        });
      });

      it('should be able to load collectionAsync and expect Editor to be destroyed and re-render when receiving new collection from await', (done) => {
        const mockCollection = ['male', 'female'];
        const promise = new Promise(resolve => resolve(mockCollection));
        const mockEditor = {
          disable: jest.fn(),
          destroy: jest.fn(),
          renderDomElement: jest.fn(),
        };
        const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];
        const getColSpy = jest.spyOn(mockGrid, 'getColumns').mockReturnValue(mockColDefs);
        jest.spyOn(mockGrid, 'getCellEditor').mockReturnValue(mockEditor);
        const disableSpy = jest.spyOn(mockEditor, 'disable');
        const destroySpy = jest.spyOn(mockEditor, 'destroy');
        const renderSpy = jest.spyOn(mockEditor, 'renderDomElement');

        customElement.columnDefinitions = mockColDefs;
        customElement.columnDefinitionsChanged();
        customElement.initialization(slickEventHandler);

        setTimeout(() => {
          expect(getColSpy).toHaveBeenCalled();
          expect(customElement.columnDefinitions[0].editor).toBeTruthy();
          expect(customElement.columnDefinitions[0].editor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor.model).toEqual(Editors.text);
          expect(disableSpy).toHaveBeenCalledWith(false);
          expect(destroySpy).toHaveBeenCalled();
          expect(renderSpy).toHaveBeenCalledWith(mockCollection);
          done();
        });
      });

      it('should be able to load async editors with as a Promise with content to simulate http-client', (done) => {
        const mockCollection = ['male', 'female'];
        const promise = new Promise(resolve => resolve({ content: mockCollection }));
        const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];
        const getColSpy = jest.spyOn(mockGrid, 'getColumns').mockReturnValue(mockColDefs);

        customElement.columnDefinitions = mockColDefs;
        customElement.columnDefinitionsChanged();
        customElement.initialization(slickEventHandler);

        setTimeout(() => {
          expect(getColSpy).toHaveBeenCalled();
          expect(customElement.columnDefinitions[0].editor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor.model).toEqual(Editors.text);
          done();
        });
      });

      it('should be able to load async editors with a Fetch Promise', (done) => {
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
        customElement.columnDefinitionsChanged();
        customElement.initialization(slickEventHandler);

        setTimeout(() => {
          expect(getColSpy).toHaveBeenCalled();
          expect(customElement.columnDefinitions[0].editor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor.collection).toEqual(mockCollection);
          expect(customElement.columnDefinitions[0].internalColumnEditor.model).toEqual(Editors.text);
          done();
        });
      });

      it('should throw an error when Fetch Promise response bodyUsed is true', (done) => {
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
        customElement.columnDefinitionsChanged();
        customElement.initialization(slickEventHandler);

        setTimeout(() => {
          expect(consoleSpy).toHaveBeenCalledWith(expect.toInclude('[Aurelia-SlickGrid] The response body passed to collectionAsync was already read.Either pass the dataset from the Response or clone the response first using response.clone()'));
          done();
        });
      });
    });

    describe('use grouping', () => {
      it('should load groupItemMetaProvider to the DataView when using "draggableGrouping" feature', () => {
        const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
        const groupMetaSpy = jest.spyOn(mockGroupItemMetaProviderImplementation.prototype, 'constructor');
        const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');
        jest.spyOn(extensionServiceStub, 'extensionList', 'get').mockReturnValue({ draggableGrouping: { pluginName: 'DraggableGrouping' } } as unknown as ExtensionList<any, any>);

        customElement.gridOptions = { draggableGrouping: {} };
        customElement.initialization(slickEventHandler);
        const extensions = customElement.extensions;

        expect(Object.keys(extensions).length).toBe(1);
        expect(dataviewSpy).toHaveBeenCalledWith({ inlineFilters: false, groupItemMetadataProvider: expect.anything() });
        expect(groupMetaSpy).toHaveBeenCalledWith();
        expect(sharedMetaSpy).toHaveBeenCalledWith(mockGroupItemMetaProvider);

        customElement.dispose();
      });

      it('should load groupItemMetaProvider to the DataView when using "enableGrouping" feature', () => {
        const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
        const groupMetaSpy = jest.spyOn(mockGroupItemMetaProviderImplementation.prototype, 'constructor');
        const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');

        customElement.gridOptions = { enableGrouping: true };
        customElement.initialization(slickEventHandler);

        expect(dataviewSpy).toHaveBeenCalledWith({ inlineFilters: false, groupItemMetadataProvider: expect.anything() });
        expect(groupMetaSpy).toHaveBeenCalledWith();
        expect(sharedMetaSpy).toHaveBeenCalledWith(mockGroupItemMetaProvider);

        customElement.dispose();
      });
    });

    describe('dataView options', () => {
      beforeEach(() => {
        customElement.gridOptions = gridOptions;
      });

      afterEach(() => {
        customElement.dispose();
        jest.clearAllMocks();
        sharedService.slickGrid = mockGrid as unknown as SlickGrid;
      });

      it('should call the onDataviewCreated emitter', () => {
        const pubSubSpy = jest.spyOn(pubSubService, 'dispatchCustomEvent');
        customElement.initialization(slickEventHandler);
        expect(pubSubSpy).toHaveBeenNthCalledWith(2, divContainer, 'onDataviewCreated', expect.any(Object), '');
      });

      it('should call the "executeAfterDataviewCreated" and "loadGridSorters" methods and Sorter Presets are provided in the Grid Options', () => {
        const sortSpy = jest.spyOn(sortServiceStub, 'loadGridSorters');

        customElement.gridOptions = { presets: { sorters: [{ columnId: 'field1', direction: 'DESC' }] } } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(sortSpy).toHaveBeenCalled();
      });

      it('should call the DataView "syncGridSelection" method with 2nd argument as True when the "dataView.syncGridSelection" grid option is enabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = { dataView: { syncGridSelection: true }, enableRowSelection: true } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true);
      });

      it('should call the DataView "syncGridSelection" method with 2nd argument as False when the "dataView.syncGridSelection" grid option is disabled', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = { dataView: { syncGridSelection: false }, enableRowSelection: true } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
      });

      it('should call the DataView "syncGridSelection" method with 3 arguments when the "dataView" grid option is provided as an object', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

        customElement.gridOptions = {
          dataView: { syncGridSelection: { preserveHidden: true, preserveHiddenOnSelectionChange: false } },
          enableRowSelection: true
        } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true, false);
      });

      it('should call the DataView "syncGridSelection" method when using BackendServiceApi and "syncGridSelectionWithBackendService" when the "dataView.syncGridSelection" grid option is enabled as well', () => {
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
        customElement.initialization(slickEventHandler);

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true);
      });

      it('should call the DataView "syncGridSelection" method with false as 2nd argument when using BackendServiceApi and "syncGridSelectionWithBackendService" BUT the "dataView.syncGridSelection" grid option is disabled', () => {
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
        customElement.initialization(slickEventHandler);

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
      });

      it('should call the DataView "syncGridSelection" method with false as 2nd argument when using BackendServiceApi and "syncGridSelectionWithBackendService" disabled and the "dataView.syncGridSelection" grid option is enabled', () => {
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
        customElement.initialization(slickEventHandler);

        expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
      });
    });

    describe('flag checks', () => {
      beforeEach(() => {
        customElement.gridOptions = gridOptions;
      });

      afterEach(() => {
        jest.clearAllMocks();
        customElement.dispose();
        sharedService.slickGrid = mockGrid as unknown as SlickGrid;
      });

      it('should call "showHeaderRow" method with false when its flag is disabled', () => {
        const gridSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');

        customElement.gridOptions = { showHeaderRow: false } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(gridSpy).toHaveBeenCalledWith(false, false);
      });

      it('should initialize groupingAndColspanService when "createPreHeaderPanel" grid option is enabled and "enableDraggableGrouping" is disabled', () => {
        const spy = jest.spyOn(groupingAndColspanServiceStub, 'init');

        customElement.gridOptions = { createPreHeaderPanel: true, enableDraggableGrouping: false } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(spy).toHaveBeenCalledWith(mockGrid, containerService);
      });

      it('should not initialize groupingAndColspanService when "createPreHeaderPanel" grid option is enabled and "enableDraggableGrouping" is also enabled', () => {
        const spy = jest.spyOn(groupingAndColspanServiceStub, 'init');

        customElement.gridOptions = { createPreHeaderPanel: true, enableDraggableGrouping: true } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(spy).not.toHaveBeenCalled();
      });

      it('should call "translateColumnHeaders" from ExtensionService when "enableTranslate" is set', () => {
        const spy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');

        customElement.gridOptions = { enableTranslate: true } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(spy).toHaveBeenCalled();
      });

      it('should initialize ExportService when "enableTextExport" is set when using Salesforce', () => {
        const fileExportMock = new TextExportService();
        const fileExportSpy = jest.spyOn(fileExportMock, 'init');
        customElement.gridOptions = { enableTextExport: true, registerExternalResources: [fileExportMock] } as GridOption;
        customElement.initialization(slickEventHandler);

        expect(fileExportSpy).toHaveBeenCalled();
        expect(customElement.registeredResources.length).toBe(4); // TextExportService, GridService, GridStateService, SlickEmptyCompositeEditorComponent
        expect(customElement.registeredResources[0] instanceof TextExportService).toBeTrue();
      });

      it('should destroy customElement and its DOM element when requested', () => {
        const spy = jest.spyOn(customElement, 'emptyGridContainerElm');

        customElement.initialization(slickEventHandler);
        customElement.dispose(true);

        expect(spy).toHaveBeenCalledWith();
      });

      it('should bind local filter when "enableFiltering" is set', () => {
        const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');

        customElement.gridOptions = { enableFiltering: true } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });

      it('should bind local sort when "enableSorting" is set', () => {
        const bindLocalSpy = jest.spyOn(sortServiceStub, 'bindLocalOnSort');

        customElement.gridOptions = { enableSorting: true } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });

      it('should refresh a local grid and change pagination options pagination when a preset for it is defined in grid options', (done) => {
        const expectedPageNumber = 2;
        const expectedTotalItems = 2;
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');

        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        customElement.gridOptions = {
          enablePagination: true,
          presets: { pagination: { pageSize: 2, pageNumber: expectedPageNumber } }
        };
        customElement.paginationOptionsChanged(undefined);
        customElement.paginationOptionsChanged({ pageSize: 2, pageNumber: 2, pageSizes: [2, 10, 25, 50], totalItems: 100 });

        customElement.initialization(slickEventHandler);
        customElement.datasetChanged(mockData, null);

        setTimeout(() => {
          expect(customElement.gridOptions.pagination.pageSize).toBe(2);
          expect(customElement.gridOptions.pagination.pageNumber).toBe(expectedPageNumber);
          expect(customElement.gridOptions.pagination.totalItems).toBe(expectedTotalItems);
          expect(refreshSpy).toHaveBeenCalledWith(mockData);
          done();
        });
      });

      it('should refresh a local grid defined and change pagination options pagination when a preset is defined in grid options and total rows is different when Filters are applied', (done) => {
        const expectedPageNumber = 3;
        const expectedTotalItems = 15;
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');
        const getPagingSpy = jest.spyOn(mockDataView, 'getPagingInfo').mockReturnValue({ pageNum: 1, totalRows: expectedTotalItems });

        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        customElement.gridOptions = {
          enableFiltering: true,
          enablePagination: true,
          presets: { pagination: { pageSize: 10, pageNumber: expectedPageNumber } }
        };
        customElement.initialization(slickEventHandler);
        customElement.paginationOptionsChanged({ pageSize: 10, pageNumber: 2, pageSizes: [10, 25, 50], totalItems: 100 });

        customElement.datasetChanged(mockData, null);

        setTimeout(() => {
          expect(getPagingSpy).toHaveBeenCalled();
          expect(customElement.gridOptions.pagination.pageSize).toBe(10);
          expect(customElement.gridOptions.pagination.pageNumber).toBe(expectedPageNumber);
          expect(customElement.gridOptions.pagination.totalItems).toBe(expectedTotalItems);
          expect(refreshSpy).toHaveBeenCalledWith(mockData);
          expect(paginationSrvSpy).toHaveBeenCalledWith(100, true);
          done();
        });
      });
    });

    describe('Backend Service API', () => {
      beforeEach(() => {
        customElement.gridOptions = {
          backendServiceApi: {
            onInit: jest.fn(),
            service: mockGraphqlService as any,
            preProcess: jest.fn(),
            postProcess: jest.fn(),
            process: jest.fn(),
          }
        };
      });

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('should call the "createBackendApiInternalPostProcessCallback" method when Backend Service API is defined with a Graphql Service', () => {
        const spy = jest.spyOn(customElement, 'createBackendApiInternalPostProcessCallback');

        customElement.initialization(slickEventHandler);

        expect(spy).toHaveBeenCalled();
        expect(customElement.gridOptions.backendServiceApi.internalPostProcess).toEqual(expect.any(Function));
      });

      it('should execute the "internalPostProcess" callback method that was created by "createBackendApiInternalPostProcessCallback" with Pagination', () => {
        jest.spyOn(customElement.gridOptions.backendServiceApi.service, 'getDatasetName').mockReturnValue('users');
        const spy = jest.spyOn(customElement, 'refreshGridData');

        customElement.initialization(slickEventHandler);
        customElement.gridOptions.backendServiceApi.internalPostProcess({ data: { users: { nodes: [{ firstName: 'John' }], totalCount: 2 } } } as GraphqlPaginatedResult);

        expect(spy).toHaveBeenCalled();
        expect(customElement.gridOptions.backendServiceApi.internalPostProcess).toEqual(expect.any(Function));
      });

      it('should execute the "internalPostProcess" callback and expect totalItems to be updated in the PaginationService when "refreshGridData" is called on the 2nd time', () => {
        jest.spyOn(customElement.gridOptions.backendServiceApi.service, 'getDatasetName').mockReturnValue('users');
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
        const paginationSpy = jest.spyOn(paginationServiceStub, 'totalItems', 'set');
        const mockDataset = [{ firstName: 'John' }, { firstName: 'Jane' }];

        customElement.initialization(slickEventHandler);
        customElement.gridOptions.backendServiceApi.internalPostProcess({ data: { users: { nodes: mockDataset, totalCount: mockDataset.length } } } as GraphqlPaginatedResult);
        customElement.refreshGridData(mockDataset, 1);
        customElement.refreshGridData(mockDataset, 1);

        expect(refreshSpy).toHaveBeenCalledTimes(3);
        expect(paginationSpy).toHaveBeenCalledWith(2);
        expect(customElement.gridOptions.backendServiceApi.internalPostProcess).toEqual(expect.any(Function));
      });

      it('should execute the "internalPostProcess" callback method that was created by "createBackendApiInternalPostProcessCallback" without Pagination (when disabled)', () => {
        customElement.gridOptions.enablePagination = false;
        jest.spyOn(customElement.gridOptions.backendServiceApi.service, 'getDatasetName').mockReturnValue('users');
        const spy = jest.spyOn(customElement, 'refreshGridData');

        customElement.initialization(slickEventHandler);
        customElement.gridOptions.backendServiceApi.internalPostProcess({ data: { users: [{ firstName: 'John' }] } } as unknown as GraphqlPaginatedResult);

        expect(spy).toHaveBeenCalled();
        expect(customElement.gridOptions.backendServiceApi.internalPostProcess).toEqual(expect.any(Function));
      });

      it('should execute the "internalPostProcess" callback method but return an empty dataset when dataset name does not match "getDatasetName"', () => {
        customElement.gridOptions.enablePagination = true;
        jest.spyOn(customElement.gridOptions.backendServiceApi.service, 'getDatasetName').mockReturnValue('users');
        const spy = jest.spyOn(customElement, 'refreshGridData');

        customElement.initialization(slickEventHandler);
        customElement.gridOptions.backendServiceApi.internalPostProcess({ data: { notUsers: { nodes: [{ firstName: 'John' }], totalCount: 2 } } } as GraphqlPaginatedResult);

        expect(spy).not.toHaveBeenCalled();
        expect(customElement.dataset).toEqual([]);
      });

      it('should invoke "updateFilters" method with filters returned from "getColumnFilters" of the Filter Service when there is no Presets defined', () => {
        const mockColumnFilter = { name: { columnId: 'name', columnDef: { id: 'name', field: 'name', filter: { model: Filters.autoComplete } }, operator: 'EQ', searchTerms: ['john'] } };
        jest.spyOn(filterServiceStub, 'getColumnFilters').mockReturnValue(mockColumnFilter as unknown as ColumnFilters);
        const backendSpy = jest.spyOn(mockGraphqlService, 'updateFilters');

        customElement.gridOptions.presets = undefined;
        customElement.initialization(slickEventHandler);

        expect(backendSpy).toHaveBeenCalledWith(mockColumnFilter, false);
      });

      it('should call the "updateFilters" method when filters are defined in the "presets" property', () => {
        const spy = jest.spyOn(mockGraphqlService, 'updateFilters');
        const mockFilters = [{ columnId: 'company', searchTerms: ['xyz'], operator: 'IN' }] as CurrentFilter[];
        customElement.gridOptions.presets = { filters: mockFilters };
        customElement.initialization(slickEventHandler);

        expect(spy).toHaveBeenCalledWith(mockFilters, true);
      });

      it('should call the "updateSorters" method when filters are defined in the "presets" property', () => {
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        const spy = jest.spyOn(mockGraphqlService, 'updateSorters');
        const mockSorters = [{ columnId: 'name', direction: 'asc' }] as CurrentSorter[];
        customElement.gridOptions.presets = { sorters: mockSorters };
        customElement.initialization(slickEventHandler);

        expect(spy).toHaveBeenCalledWith(undefined, mockSorters);
      });

      it('should call the "updatePagination" method when filters are defined in the "presets" property', () => {
        const spy = jest.spyOn(mockGraphqlService, 'updatePagination');

        customElement.gridOptions.presets = { pagination: { pageNumber: 2, pageSize: 20 } };
        customElement.initialization(slickEventHandler);

        expect(spy).toHaveBeenCalledWith(2, 20);
      });

      it('should refresh the grid and change pagination options pagination when a preset for it is defined in grid options', () => {
        const expectedPageNumber = 3;
        const refreshSpy = jest.spyOn(customElement, 'refreshGridData');

        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        customElement.gridOptions.enablePagination = true;
        customElement.gridOptions.presets = { pagination: { pageSize: 10, pageNumber: expectedPageNumber } };
        customElement.paginationOptionsChanged({ pageSize: 10, pageNumber: 1, pageSizes: [10, 25, 50], totalItems: 100 });

        customElement.initialization(slickEventHandler);
        customElement.datasetChanged(mockData, null);

        expect(customElement.gridOptions.pagination.pageSize).toBe(10);
        expect(customElement.gridOptions.pagination.pageNumber).toBe(expectedPageNumber);
        expect(refreshSpy).toHaveBeenCalledWith(mockData);
      });

      it('should execute the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options with Pagination enabled', (done) => {
        const now = new Date();
        const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
        const processResult = {
          data: { users: { nodes: [] }, pageInfo: { hasNextPage: true }, totalCount: 0 },
          metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 }
        };
        const promise = new Promise(resolve => setTimeout(() => resolve(processResult), 1));
        const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi, 'process').mockReturnValue(promise);
        jest.spyOn(customElement.gridOptions.backendServiceApi.service, 'buildQuery').mockReturnValue(query);

        customElement.gridOptions.backendServiceApi.service.options = { executeProcessCommandOnInit: true };
        customElement.initialization(slickEventHandler);

        expect(processSpy).toHaveBeenCalled();

        setTimeout(() => {
          expect(mockExecuteBackendProcess).toHaveBeenCalledWith(expect.toBeDate(), processResult, customElement.gridOptions.backendServiceApi, 0);
          done();
        }, 5);
      });

      it('should execute the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options without Pagination (when disabled)', (done) => {
        const now = new Date();
        const query = `query { users { id,name,gender,company } }`;
        const processResult = {
          data: { users: [] },
          metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 }
        };
        const promise = new Promise(resolve => setTimeout(() => resolve(processResult), 1));
        const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi, 'process').mockReturnValue(promise);
        jest.spyOn(customElement.gridOptions.backendServiceApi.service, 'buildQuery').mockReturnValue(query);

        customElement.gridOptions.backendServiceApi.service.options = { executeProcessCommandOnInit: true };
        customElement.initialization(slickEventHandler);

        expect(processSpy).toHaveBeenCalled();

        setTimeout(() => {
          expect(mockExecuteBackendProcess).toHaveBeenCalledWith(expect.toBeDate(), processResult, customElement.gridOptions.backendServiceApi, 0);
          done();
        }, 5);
      });

      it('should throw an error when the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options', (done) => {
        const mockError = { error: '404' };
        const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
        const promise = new Promise((_resolve, reject) => setTimeout(() => reject(mockError), 1));
        const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi, 'process').mockReturnValue(promise);
        jest.spyOn(customElement.gridOptions.backendServiceApi.service, 'buildQuery').mockReturnValue(query);

        customElement.gridOptions.backendServiceApi.service.options = { executeProcessCommandOnInit: true };
        customElement.initialization(slickEventHandler);

        expect(processSpy).toHaveBeenCalled();

        promise.catch((e) => {
          expect(e).toEqual(mockError);
          done();
        });
      });
    });

    describe('commitEdit method', () => {
      it('should commit current edit when we focus out of current cell', (done) => {
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

      it('should call multiple translate methods when locale changes', (done) => {
        const transCellMenuSpy = jest.spyOn(extensionServiceStub, 'translateCellMenu');
        const transColHeaderSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const transColPickerSpy = jest.spyOn(extensionServiceStub, 'translateColumnPicker');
        const transContextMenuSpy = jest.spyOn(extensionServiceStub, 'translateContextMenu');
        const transGridMenuSpy = jest.spyOn(extensionServiceStub, 'translateGridMenu');
        const transHeaderMenuSpy = jest.spyOn(extensionServiceStub, 'translateHeaderMenu');
        const transGroupingColSpanSpy = jest.spyOn(groupingAndColspanServiceStub, 'translateGroupingAndColSpan');
        const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');

        customElement.gridOptions = { enableTranslate: true, createPreHeaderPanel: false, enableDraggableGrouping: false } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        globalEa.publish('i18n:locale:changed', { language: 'fr' });

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

      it('should call "setHeaderRowVisibility", "translateGroupingAndColSpan" and other methods when locale changes', (done) => {
        customElement.columnDefinitions = [{ id: 'firstName', field: 'firstName', filterable: true }];
        const transCellMenuSpy = jest.spyOn(extensionServiceStub, 'translateCellMenu');
        const transColHeaderSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
        const transColPickerSpy = jest.spyOn(extensionServiceStub, 'translateColumnPicker');
        const transContextMenuSpy = jest.spyOn(extensionServiceStub, 'translateContextMenu');
        const transGridMenuSpy = jest.spyOn(extensionServiceStub, 'translateGridMenu');
        const transHeaderMenuSpy = jest.spyOn(extensionServiceStub, 'translateHeaderMenu');
        const transGroupingColSpanSpy = jest.spyOn(groupingAndColspanServiceStub, 'translateGroupingAndColSpan');

        customElement.gridOptions = { enableTranslate: true, createPreHeaderPanel: true, enableDraggableGrouping: false } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

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

      it('should call "translateGroupingAndColSpan" translate methods when locale changes and Column Grouping PreHeader are enabled', (done) => {
        const groupColSpanSpy = jest.spyOn(groupingAndColspanServiceStub, 'translateGroupingAndColSpan');

        customElement.gridOptions = { enableTranslate: true, createPreHeaderPanel: true, enableDraggableGrouping: false } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        globalEa.publish('i18n:locale:changed', {});

        setTimeout(() => {
          expect(groupColSpanSpy).toHaveBeenCalled();
          done();
        });
      });

      it('should reflect columns in the grid', () => {
        const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
        const mockCols = [{ id: 'firstName', field: 'firstName' }];
        const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue(mockCols);
        const setColSpy = jest.spyOn(mockGrid, 'setColumns');

        customElement.gridOptions = { presets: { columns: mockColsPresets } } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
        expect(setColSpy).toHaveBeenCalledWith(mockCols);
      });

      it('should reflect columns with an extra checkbox selection column in the grid when "enableCheckboxSelector" is set', () => {
        const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
        const mockCol = { id: 'firstName', field: 'firstName' };
        const mockCols = [{ id: '_checkbox_selector', field: '_checkbox_selector', editor: undefined, internalColumnEditor: {} }, mockCol];
        const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue([mockCol]);
        const setColSpy = jest.spyOn(mockGrid, 'setColumns');

        customElement.columnDefinitions = mockCols;
        customElement.columnDefinitionsChanged();
        customElement.gridOptions = { ...gridOptions, enableCheckboxSelector: true, presets: { columns: mockColsPresets } } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
        expect(setColSpy).toHaveBeenCalledWith(mockCols);
      });

      it('should execute backend service "init" method when set', () => {
        const mockPagination = { pageNumber: 1, pageSizes: [10, 25, 50], pageSize: 10, totalItems: 100 };
        const mockGraphqlOptions = { datasetName: 'users', extraQueryArguments: [{ field: 'userId', value: 123 }] } as GraphqlServiceOption;
        const bindBackendSpy = jest.spyOn(sortServiceStub, 'bindBackendOnSort');
        const mockGraphqlService2 = { ...mockGraphqlService, init: jest.fn() } as unknown as GraphqlService;
        const initSpy = jest.spyOn(mockGraphqlService2, 'init');

        customElement.gridOptions = {
          // enablePagination: true,
          enableSorting: true,
          backendServiceApi: {
            service: mockGraphqlService2,
            options: mockGraphqlOptions,
            preProcess: () => jest.fn(),
            process: () => new Promise(resolve => resolve({ data: { users: { nodes: [], totalCount: 100 } } })),
          } as GraphqlServiceApi,
          pagination: mockPagination,
        } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
        expect(initSpy).toHaveBeenCalledWith(mockGraphqlOptions, mockPagination, mockGrid);
      });

      it('should call bind backend sorting when "enableSorting" is set', () => {
        const bindBackendSpy = jest.spyOn(sortServiceStub, 'bindBackendOnSort');

        customElement.gridOptions = {
          enableSorting: true,
          backendServiceApi: {
            service: mockGraphqlService,
            preProcess: () => jest.fn(),
            process: () => new Promise(resolve => resolve('process resolved')),
          }
        } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
      });

      it('should call bind local sorting when "enableSorting" is set and "useLocalSorting" is set as well', () => {
        const bindLocalSpy = jest.spyOn(sortServiceStub, 'bindLocalOnSort');

        customElement.gridOptions = {
          enableSorting: true,
          backendServiceApi: {
            service: mockGraphqlService,
            useLocalSorting: true,
            preProcess: () => jest.fn(),
            process: () => new Promise(resolve => resolve('process resolved')),
          }
        } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });

      it('should call bind backend filtering when "enableFiltering" is set', () => {
        const initSpy = jest.spyOn(filterServiceStub, 'init');
        const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');
        const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

        customElement.gridOptions = { enableFiltering: true } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(initSpy).toHaveBeenCalledWith(mockGrid);
        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
        expect(populateSpy).not.toHaveBeenCalled();
      });

      it('should call bind local filtering when "enableFiltering" is set and "useLocalFiltering" is set as well', () => {
        const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');

        customElement.gridOptions = {
          enableFiltering: true,
          backendServiceApi: {
            service: mockGraphqlService,
            useLocalFiltering: true,
            preProcess: () => jest.fn(),
            process: () => new Promise(resolve => resolve('process resolved')),
          }
        } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
      });

      it('should reflect column filters when "enableFiltering" is set', () => {
        const initSpy = jest.spyOn(filterServiceStub, 'init');
        const bindBackendSpy = jest.spyOn(filterServiceStub, 'bindBackendOnFilter');
        const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

        customElement.gridOptions = {
          enableFiltering: true,
          backendServiceApi: {
            service: mockGraphqlService,
            preProcess: () => jest.fn(),
            process: () => new Promise(resolve => resolve('process resolved')),
          }
        } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(initSpy).toHaveBeenCalledWith(mockGrid);
        expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
        expect(populateSpy).not.toHaveBeenCalled();
      });

      it('should reflect column filters and populate filter search terms when "enableFiltering" is set and preset filters are defined', () => {
        const mockPresetFilters = [{ columnId: 'firstName', operator: 'IN', searchTerms: ['John', 'Jane'] }] as CurrentFilter[];
        const initSpy = jest.spyOn(filterServiceStub, 'init');
        const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

        customElement.gridOptions = { enableFiltering: true, presets: { filters: mockPresetFilters } } as unknown as GridOption;
        customElement.initialization(slickEventHandler);

        expect(initSpy).toHaveBeenCalledWith(mockGrid);
        expect(populateSpy).toHaveBeenCalledWith(mockPresetFilters);
      });

      it('should return null when "getItemMetadata" is called without a colspan callback defined', () => {
        const itemSpy = jest.spyOn(mockDataView, 'getItem');

        customElement.gridOptions = { colspanCallback: undefined } as unknown as GridOption;
        customElement.initialization(slickEventHandler);
        mockDataView.getItemMetadata(2);

        expect(itemSpy).not.toHaveBeenCalled();
      });

      it('should execute colspan callback when defined in the grid options and "getItemMetadata" is called', () => {
        const mockCallback = jest.fn();
        const mockItem = { firstName: 'John', lastName: 'Doe' };
        const itemSpy = jest.spyOn(mockDataView, 'getItem').mockReturnValue(mockItem);

        customElement.gridOptions = { colspanCallback: mockCallback } as unknown as GridOption;
        customElement.initialization(slickEventHandler);
        mockDataView.getItemMetadata(2);

        expect(itemSpy).toHaveBeenCalledWith(2);
        expect(mockCallback).toHaveBeenCalledWith(mockItem);
      });

      it('should update each row and re-render the grid when filtering and DataView "onRowsChanged" event is triggered', () => {
        const renderSpy = jest.spyOn(mockGrid, 'render');
        const updateRowSpy = jest.spyOn(mockGrid, 'updateRow');

        customElement.gridOptions = { enableFiltering: true };
        customElement.initialization(slickEventHandler);
        mockDataView.onRowsChanged.notify({ rows: [1, 2, 3] });

        expect(customElement.eventHandler).toEqual(slickEventHandler);
        expect(renderSpy).toHaveBeenCalled();
        expect(updateRowSpy).toHaveBeenCalledTimes(3);
      });

      it('should call "dispatchCustomEvent" when event gets trigger', () => {
        // const pubSubSpy = jest.spyOn(pubSubService, 'dispatchCustomEvent');
        const dispatchSpy = jest.spyOn(divContainer, 'dispatchEvent');
        const callback = jest.fn();

        customElement.gridOptions = { ...gridOptions, enableFiltering: true };
        customElement.bind();
        customElement.initialization(slickEventHandler);
        customElement.eventHandler.subscribe(mockEventPubSub, callback);
        mockGrid.onClick.notify({ rows: [1, 2, 3] });

        // expect(pubSubSpy).toHaveBeenCalledWith(divContainer, 'onClick', { args: { rows: [1, 2, 3] } }, '');
        expect(dispatchSpy).toHaveBeenCalledWith(new CustomEvent('onClick', { bubbles: true, detail: { args: { rows: [1, 2, 3] } } }));
      });
    });

    describe('setHeaderRowVisibility grid method', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        customElement.gridOptions = gridOptions;
      });

      it('should show the header row when "showHeaderRow" is called with argument True', () => {
        const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');
        const setColumnSpy = jest.spyOn(mockGrid, 'setColumns');

        customElement.attached();
        customElement.initialization(slickEventHandler);
        customElement.showHeaderRow(true);

        expect(setHeaderRowSpy).toHaveBeenCalledWith(true, false);
        expect(setColumnSpy).toHaveBeenCalledTimes(1);
      });

      it('should show the header row when "showHeaderRow" is called with argument False', () => {
        const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');
        const setColumnSpy = jest.spyOn(mockGrid, 'setColumns');

        customElement.attached();
        customElement.initialization(slickEventHandler);
        customElement.showHeaderRow(false);

        expect(setHeaderRowSpy).toHaveBeenCalledWith(false, false);
        expect(setColumnSpy).not.toHaveBeenCalled();
      });
    });

    describe('pagination events', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        customElement.gridOptions = gridOptions;
      });

      it('should call trigger a gridStage change event when pagination change is triggered', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
        const pluginEaSpy = jest.spyOn(pubSubService, 'publish');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        customElement.initialization(slickEventHandler);
        customElement.paginationChanged(mockPagination);

        expect(pluginEaSpy).toHaveBeenCalledWith('onGridStateChanged', {
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });

      it('should call trigger a gridStage change event when "onPaginationChanged" from the Pagination Service is triggered', () => {
        const pubSubSpy = jest.spyOn(pubSubService, 'dispatchCustomEvent');
        const mockPagination = { pageNumber: 2, pageSize: 20 } as CurrentPagination;
        const mockServicePagination = {
          ...mockPagination,
          dataFrom: 5,
          dataTo: 10,
          pageCount: 1,
          pageSizes: [5, 10, 15, 20],
        } as ServicePagination;
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        customElement.gridOptions.enablePagination = true;
        customElement.initialization(slickEventHandler);
        customElement.refreshGridData([{ firstName: 'John', lastName: 'Doe' }]);
        pubSubService.publish('onPaginationChanged', mockServicePagination);

        expect(pubSubSpy).toHaveBeenCalledWith(divContainer, 'onGridStateChanged', {
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        }, '');
      });

      it('should call trigger a gridStage change and reset selected rows when pagination change is triggered and "enableRowSelection" is set', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
        const pluginEaSpy = jest.spyOn(pubSubService, 'publish');
        const setRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        customElement.gridOptions = { enableRowSelection: true } as unknown as GridOption;
        customElement.initialization(slickEventHandler);
        customElement.paginationChanged(mockPagination);

        expect(setRowSpy).toHaveBeenCalledWith([]);
        expect(pluginEaSpy).toHaveBeenCalledWith('onGridStateChanged', {
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });

      it('should call trigger a gridStage change and reset selected rows when pagination change is triggered and "enableCheckboxSelector" is set', () => {
        const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
        const pluginEaSpy = jest.spyOn(pubSubService, 'publish');
        const setRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

        customElement.gridOptions = { enableCheckboxSelector: true } as unknown as GridOption;
        customElement.initialization(slickEventHandler);
        customElement.paginationChanged(mockPagination);

        expect(setRowSpy).toHaveBeenCalledWith([]);
        expect(pluginEaSpy).toHaveBeenCalledWith('onGridStateChanged', {
          change: { newValues: mockPagination, type: GridStateType.pagination },
          gridState: { columns: [], pagination: mockPagination }
        });
      });
    });

    describe('Empty Warning Message', () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('should display an Empty Warning Message when "enableEmptyDataWarningMessage" is enabled and the dataset is empty', (done) => {
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];
        const mockGridOptions = { enableTranslate: true, enableEmptyDataWarningMessage: true, };
        jest.spyOn(mockGrid, 'getOptions').mockReturnValue(mockGridOptions);
        jest.spyOn(mockGrid, 'getGridPosition').mockReturnValue({ top: 10, left: 20 });

        customElement.gridOptions = mockGridOptions;
        customElement.initialization(slickEventHandler);
        const slickEmptyWarning = customElement.registeredResources.find(resource => resource instanceof SlickEmptyWarningComponent);
        const emptySpy = jest.spyOn(slickEmptyWarning as SlickEmptyWarningComponent, 'showEmptyDataMessage');
        customElement.columnDefinitions = mockColDefs;
        customElement.refreshGridData([]);
        mockDataView.onRowsOrCountChanged.notify({ current: 0, item: { first: 'John' } });

        setTimeout(() => {
          expect(customElement.columnDefinitions).toEqual(mockColDefs);
          expect(customElement.gridOptions.enableEmptyDataWarningMessage).toBeTrue();
          expect(slickEmptyWarning).toBeTruthy();
          expect(emptySpy).toHaveBeenCalledTimes(2);
          done();
        });
      });
    });

    describe('Custom Footer', () => {
      it('should have a Custom Footer when "showCustomFooter" is enabled and there are no Pagination used', (done) => {
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];
        const mockGridOptions = { enableTranslate: true, showCustomFooter: true, };
        jest.spyOn(mockGrid, 'getOptions').mockReturnValue(mockGridOptions);

        translateService.use('fr');
        customElement.gridOptions = mockGridOptions;
        customElement.initialization(slickEventHandler);
        customElement.columnDefinitions = mockColDefs;

        setTimeout(() => {
          expect(customElement.columnDefinitions).toEqual(mockColDefs);
          expect(customElement.gridOptions.showCustomFooter).toBeTrue();
          expect(customElement.gridOptions.customFooterOptions).toEqual({
            dateFormat: 'YYYY-MM-DD, hh:mm a',
            hideLastUpdateTimestamp: true,
            hideTotalItemCount: false,
            footerHeight: 25,
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

      it('should have a Custom Footer and custom texts when "showCustomFooter" is enabled with different metricTexts defined', (done) => {
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.gridOptions = {
          enableTranslate: false,
          showCustomFooter: true,
          customFooterOptions: {
            metricTexts: {
              items: 'some items',
              lastUpdate: 'some last update',
              of: 'some of'
            }
          }
        };
        customElement.columnDefinitions = mockColDefs;
        customElement.initialization(slickEventHandler);
        customElement.columnDefinitionsChanged();

        setTimeout(() => {
          expect(customElement.columnDefinitions).toEqual(mockColDefs);
          expect(customElement.gridOptions.showCustomFooter).toBeTrue();
          expect(customElement.gridOptions.customFooterOptions).toEqual({
            dateFormat: 'YYYY-MM-DD, hh:mm a',
            hideLastUpdateTimestamp: true,
            hideTotalItemCount: false,
            footerHeight: 25,
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

      it('should NOT have a Custom Footer when "showCustomFooter" is enabled WITH Pagination in use', (done) => {
        const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

        customElement.gridOptions = { enablePagination: true, showCustomFooter: true };
        customElement.columnDefinitions = mockColDefs;
        customElement.initialization(slickEventHandler);
        customElement.columnDefinitionsChanged();

        setTimeout(() => {
          expect(customElement.columnDefinitions).toEqual(mockColDefs);
          expect(customElement.showCustomFooter).toBeFalsy();
          done();
        });
      });

      it('should have custom footer with metrics when the DataView "onRowsOrCountChanged" event is triggered', () => {
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const expectation = {
          startTime: expect.toBeDate(),
          endTime: expect.toBeDate(),
          itemCount: 2,
          totalItemCount: 2
        };

        customElement.gridOptions = { enablePagination: false, showCustomFooter: true };
        customElement.initialization(slickEventHandler);
        customElement.datasetChanged(mockData, null);
        mockDataView.onRowsOrCountChanged.notify({ first: 'John', itemCount: 2, currentRowCount: 2, previous: 1 });

        expect(customElement.metrics).toEqual(expectation);
      });
    });

    describe('loadRowSelectionPresetWhenExists method', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        sharedService.slickGrid = mockGrid as unknown as SlickGrid;
        customElement.gridOptions = gridOptions;
      });

      it('should call the "mapIdsToRows" from the DataView then "setSelectedRows" from the Grid when there are row selection presets with "dataContextIds" array set', (done) => {
        const selectedGridRows = [2];
        const selectedRowIds = [99];
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const dataviewSpy = jest.spyOn(mockDataView, 'mapIdsToRows').mockReturnValue(selectedGridRows);
        const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);

        customElement.gridOptions.enableCheckboxSelector = true;
        customElement.gridOptions.presets = { rowSelection: { dataContextIds: selectedRowIds } };
        customElement.initialization(slickEventHandler);
        customElement.datasetChanged(mockData, null);

        setTimeout(() => {
          expect(dataviewSpy).toHaveBeenCalled();
          expect(selectRowSpy).toHaveBeenCalledWith(selectedGridRows);
          done();
        });
      });

      it('should call the "setSelectedRows" from the Grid when there are row selection presets with "dataContextIds" array set', (done) => {
        const selectedGridRows = [22];
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        jest.spyOn(mockDataView, 'getLength').mockReturnValue(mockData.length);

        customElement.gridOptions.enableRowSelection = true;
        customElement.gridOptions.presets = { rowSelection: { gridRowIndexes: selectedGridRows } };
        customElement.datasetChanged(mockData, null);
        customElement.isDatasetInitialized = false; // it won't call the preset unless we reset this flag
        customElement.initialization(slickEventHandler);

        setTimeout(() => {
          expect(customElement.isDatasetInitialized).toBe(true);
          expect(selectRowSpy).toHaveBeenCalledWith(selectedGridRows);
          done();
        });
      });

      it('should NOT call the "setSelectedRows" when the Grid has Local Pagination and there are row selection presets with "dataContextIds" array set', (done) => {
        const selectedGridRows = [22];
        const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
        const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
        jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
        jest.spyOn(mockDataView, 'getLength').mockReturnValue(mockData.length);

        customElement.gridOptions = {
          enableRowSelection: true,
          enablePagination: true,
          backendServiceApi: null,
          presets: { rowSelection: { dataContextIds: selectedGridRows } }
        };
        customElement.datasetChanged(mockData, null);
        customElement.isDatasetInitialized = false; // it won't call the preset unless we reset this flag
        customElement.initialization(slickEventHandler);

        setTimeout(() => {
          expect(customElement.isDatasetInitialized).toBe(true);
          expect(selectRowSpy).not.toHaveBeenCalled();
          done();
        }, 2);
      });
    });

    describe('onPaginationVisibilityChanged event', () => {
      beforeEach(() => {
        jest.clearAllMocks();
        sharedService.slickGrid = mockGrid as unknown as SlickGrid;
        customElement.gridOptions = gridOptions;
      });

      it('should change "showPagination" flag when "onPaginationVisibilityChanged" from the Pagination Service is triggered', (done) => {
        customElement.gridOptions.enablePagination = true;
        customElement.gridOptions.backendServiceApi = null;

        customElement.initialization(slickEventHandler);
        customElement.refreshGridData([{ firstName: 'John', lastName: 'Doe' }]);
        pubSubService.publish('onPaginationVisibilityChanged', { visible: false });

        setTimeout(() => {
          expect(customElement.showPagination).toBeFalsy();
          done();
        });
      });

      it('should call the backend service API to refresh the dataset', (done) => {
        customElement.gridOptions.enablePagination = true;
        customElement.gridOptions.backendServiceApi = {
          service: mockGraphqlService as unknown as BackendService,
          process: jest.fn(),
        };

        customElement.initialization(slickEventHandler);
        customElement.refreshGridData([{ firstName: 'John', lastName: 'Doe' }]);
        pubSubService.publish('onPaginationVisibilityChanged', { visible: false });

        setTimeout(() => {
          expect(mockRefreshBackendDataset).toHaveBeenCalled();
          expect(customElement.showPagination).toBeFalsy();
          done();
        });
      });
    });

    describe('Tree Data View', () => {
      it('should throw an error when enableTreeData is enabled with Pagination since that is not supported', (done) => {
        try {
          customElement.gridOptions = { enableTreeData: true, enablePagination: true } as GridOption;
          customElement.initialization(slickEventHandler);
        } catch (e) {
          expect(e.toString()).toContain('[Aurelia-Slickgrid] It looks like you are trying to use Tree Data with Pagination but unfortunately that is simply not supported because of its complexity.');
          customElement.dispose();
          done();
        }
      });

      it('should throw an error when enableTreeData is enabled without passing a "columnId"', (done) => {
        try {
          customElement.gridOptions = { enableTreeData: true, treeDataOptions: {} } as unknown as GridOption;
          customElement.initialization(slickEventHandler);

        } catch (e) {
          expect(e.toString()).toContain('[Aurelia-Slickgrid] When enabling tree data, you must also provide the "treeDataOption" property in your Grid Options with "childrenPropName" or "parentPropName"');
          customElement.dispose();
          done();
        }
      });

      it('should change flat dataset and expect being called with other methods', () => {
        const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
        const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
        const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');

        customElement.gridOptions = { enableTreeData: true, treeDataOptions: { columnId: 'file', parentPropName: 'parentId', childrenPropName: 'files' } } as unknown as GridOption;
        customElement.initialization(slickEventHandler);
        customElement.datasetChanged(mockFlatDataset, []);

        expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
      });

      it('should change hierarchical dataset and expect processTreeDataInitialSort being called with other methods', () => {
        const mockHierarchical = [{ file: 'documents', files: [{ file: 'vacation.txt' }] }];
        const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
        const clearFilterSpy = jest.spyOn(filterServiceStub, 'clearFilters');
        const setItemsSpy = jest.spyOn(mockDataView, 'setItems');
        const processSpy = jest.spyOn(sortServiceStub, 'processTreeDataInitialSort');

        customElement.gridOptions = { enableTreeData: true, treeDataOptions: { columnId: 'file' } } as unknown as GridOption;
        customElement.initialization(slickEventHandler);
        customElement.datasetHierarchicalChanged(mockHierarchical);

        expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
        expect(clearFilterSpy).toHaveBeenCalled();
        expect(processSpy).toHaveBeenCalled();
        expect(setItemsSpy).toHaveBeenCalledWith([], 'id');
      });

      it('should convert parent/child dataset to hierarchical dataset when Tree Data is enabled and "onRowsChanged" was triggered', () => {
        // @ts-ignore:2540
        utilities.convertParentChildArrayToHierarchicalView = mockConvertParentChildArray;

        const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
        const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
        jest.spyOn(mockDataView, 'getItems').mockReturnValue(mockFlatDataset);

        customElement.gridOptions = { enableTreeData: true, treeDataOptions: { columnId: 'file' } };
        customElement.initialization(slickEventHandler);
        customElement.datasetChanged(mockFlatDataset, []);
        customElement.isDatasetInitialized = false;
        mockDataView.onRowsChanged.notify({ rows: [1, 2, 3] });

        expect(hierarchicalSpy).toHaveBeenCalled();
        expect(mockConvertParentChildArray).toHaveBeenCalled();
      });
    });
  });
});
