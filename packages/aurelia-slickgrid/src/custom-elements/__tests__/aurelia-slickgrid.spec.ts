import 'jest-extended';
import { DI, EventAggregator, IObserverLocator } from 'aurelia';
import { of, throwError } from 'rxjs';
import type {
  BackendServiceApi,
  Column,
  CurrentFilter,
  CurrentPagination,
  CurrentPinning,
  CurrentSorter,
  ExtensionList,
  GridOption,
  GridState,
  Pagination,
  ServicePagination,
  SlickEventHandler,
  SlickGrid,
} from '@slickgrid-universal/common';

import {
  autoAddEditorFormatterToColumnsWithEditor,
  BackendService,
  BackendUtilityService,
  CollectionService,
  ColumnFilters,
  Editors,
  ExtensionService,
  ExtensionUtility,
  Filters,
  FilterService,
  Formatter,
  GridEventService,
  GridService,
  GridStateService,
  GridStateType,
  HeaderGroupingService,
  OnRowCountChangedEventArgs,
  OnRowsChangedEventArgs,
  OnSetItemsCalledEventArgs,
  PaginationService,
  ResizerService,
  SharedService,
  SlickGroupItemMetadataProvider,
  SortService,
  TreeDataService
} from '@slickgrid-universal/common';
import { EventPubSubService } from '@slickgrid-universal/event-pub-sub';

// import { SlickEmptyWarningComponent } from '@slickgrid-universal/empty-warning-component';
import { GraphqlPaginatedResult, GraphqlService, GraphqlServiceApi, GraphqlServiceOption } from '@slickgrid-universal/graphql';

// import { RxJsResourceStub } from '../../../../test/rxjsResourceStub';
// import { HttpStub } from '../../../../test/httpClientStub';
import { MockSlickEvent, MockSlickEventHandler } from '../../../../../test/mockSlickEvent';
import { TranslaterServiceStub } from '../../../../../test/translaterServiceStub';
import { AureliaUtilService, ContainerService, TranslaterService } from '../../services';
import { AureliaSlickgridCustomElement } from '../aurelia-slickgrid';
// import { SlickRowDetailView } from '../../extensions/slickRowDetailView';

import { BrowserPlatform } from '@aurelia/platform-browser';
import { assert, createFixture, setPlatform } from '@aurelia/testing';

const platform = new BrowserPlatform(window);
setPlatform(platform);
BrowserPlatform.set(globalThis, platform);

jest.mock('@slickgrid-universal/common', () => ({
  ...(jest.requireActual('@slickgrid-universal/common') as any),
  autoAddEditorFormatterToColumnsWithEditor: jest.fn(),
}));

// const mockSlickRowDetailView = {
//   create: jest.fn(),
//   init: jest.fn(),
// } as unknown as SlickRowDetailView;

// jest.mock('../../extensions/slickRowDetailView', () => ({
//   SlickRowDetailView: jest.fn().mockImplementation(() => mockSlickRowDetailView),
// }));

const aureliaUtilServiceStub = {
  createAureliaViewModelAddToSlot: jest.fn(),
} as unknown as AureliaUtilService;

const extensionServiceStub = {
  addExtensionToList: jest.fn(),
  boundDifferentExtensions: jest.fn(),
  createExtensionsBeforeGridCreation: jest.fn(),
  dispose: jest.fn(),
  renderColumnHeaders: jest.fn(),
  translateAllExtensions: jest.fn(),
  translateColumnHeaders: jest.fn(),
} as unknown as ExtensionService;
Object.defineProperty(extensionServiceStub, 'extensionList', { get: jest.fn(() => { }), set: jest.fn(), configurable: true });

const observerLocatorStub = {
  getArrayObserver: () => ({
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  })
} as unknown as IObserverLocator;

const mockExtensionUtility = {
  translateItems: jest.fn(),
} as unknown as ExtensionUtility;

const HeaderGroupingServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  translateHeaderGrouping: jest.fn(),
} as unknown as HeaderGroupingService;

const mockGraphqlService = {
  getDatasetName: jest.fn(),
  buildQuery: jest.fn(),
  init: jest.fn(),
  updateFilters: jest.fn(),
  updateSorters: jest.fn(),
  updatePagination: jest.fn(),
} as unknown as GraphqlService;

const backendUtilityServiceStub = {
  addRxJsResource: jest.fn(),
  executeBackendProcessesCallback: jest.fn(),
  executeBackendCallback: jest.fn(),
  onBackendError: jest.fn(),
  refreshBackendDataset: jest.fn(),
} as unknown as BackendUtilityService;

const collectionServiceStub = {
  filterCollection: jest.fn(),
  singleFilterCollection: jest.fn(),
  sortCollection: jest.fn(),
} as unknown as CollectionService;

const filterServiceStub = {
  addRxJsResource: jest.fn(),
  clearFilters: jest.fn(),
  dispose: jest.fn(),
  init: jest.fn(),
  boundBackendOnFilter: jest.fn(),
  boundLocalOnFilter: jest.fn(),
  boundLocalOnSort: jest.fn(),
  boundBackendOnSort: jest.fn(),
  populateColumnFilterSearchTermPresets: jest.fn(),
  refreshTreeDataFilters: jest.fn(),
  getColumnFilters: jest.fn(),
} as unknown as FilterService;

const gridEventServiceStub = {
  init: jest.fn(),
  dispose: jest.fn(),
  boundOnBeforeEditCell: jest.fn(),
  boundOnCellChange: jest.fn(),
  boundOnClick: jest.fn(),
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
  addRxJsResource: jest.fn(),
  init: jest.fn(),
  dispose: jest.fn(),
  getFullPagination: jest.fn(),
  updateTotalItems: jest.fn(),
} as unknown as PaginationService;

const resizerServiceStub = {
  dispose: jest.fn(),
  init: jest.fn(),
  resizeGrid: jest.fn(),
  resizeColumnsByCellContent: jest.fn(),
} as unknown as ResizerService;

Object.defineProperty(paginationServiceStub, 'totalItems', {
  get: jest.fn(() => 0),
  set: jest.fn()
});

const sortServiceStub = {
  addRxJsResource: jest.fn(),
  boundBackendOnSort: jest.fn(),
  boundLocalOnSort: jest.fn(),
  dispose: jest.fn(),
  loadGridSorters: jest.fn(),
  processTreeDataInitialSort: jest.fn(),
  sortHierarchicalDataset: jest.fn(),
} as unknown as SortService;

const treeDataServiceStub = {
  init: jest.fn(),
  convertFlatParentChildToTreeDataset: jest.fn(),
  convertFlatParentChildToTreeDatasetAndSort: jest.fn(),
  dispose: jest.fn(),
  handleOnCellClick: jest.fn(),
  sortHierarchicalDataset: jest.fn(),
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
  getFilteredItemCount: jest.fn(),
  getItem: jest.fn(),
  getItems: jest.fn(),
  getItemCount: jest.fn(),
  getItemMetadata: jest.fn(),
  getLength: jest.fn(),
  getPagingInfo: jest.fn(),
  mapIdsToRows: jest.fn(),
  mapRowsToIds: jest.fn(),
  onRowsChanged: new MockSlickEvent<OnRowsChangedEventArgs>(),
  onRowCountChanged: new MockSlickEvent<OnRowCountChangedEventArgs>(),
  onSetItemsCalled: new MockSlickEvent<OnSetItemsCalledEventArgs>(),
  reSort: jest.fn(),
  setItems: jest.fn(),
  setSelectedIds: jest.fn(),
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
} as unknown as SlickEventHandler;

const mockGetEditorLock = {
  isActive: () => true,
  commitCurrentEdit: jest.fn(),
};

const mockGrid = {
  applyHtmlCode: (elm: HTMLElement, val: string) => elm.innerHTML = val || '',
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
  reRenderColumns: jest.fn(),
  resizeCanvas: jest.fn(),
  setColumns: jest.fn(),
  setHeaderRowVisibility: jest.fn(),
  setOptions: jest.fn(),
  setSelectedRows: jest.fn(),
  onClick: new MockSlickEvent(),
  onClicked: new MockSlickEvent(),
  onColumnsReordered: new MockSlickEvent(),
  onRendered: jest.fn(),
  onScroll: jest.fn(),
  onSelectedRowsChanged: new MockSlickEvent(),
  onDataviewCreated: new MockSlickEvent(),
} as unknown as SlickGrid;

const slickEventHandler = new MockSlickEventHandler() as unknown as SlickEventHandler;
jest.mock('@slickgrid-universal/common', () => ({
  ...(jest.requireActual('@slickgrid-universal/common') as any),
  autoAddEditorFormatterToColumnsWithEditor: jest.fn(),
  SlickGrid: jest.fn().mockImplementation(() => mockGrid),
  SlickEventHandler: jest.fn().mockImplementation(() => mockSlickEventHandler),
  SlickDataView: jest.fn().mockImplementation(() => mockDataView),
}));
const template = `<div class="demo-container"><div class="grid1"></div></div>`;

describe('Aurelia-Slickgrid Component instantiated via Constructor', () => {
  let customElement: AureliaSlickgridCustomElement;
  let divContainer: HTMLDivElement;
  let cellDiv: HTMLDivElement;
  let columnDefinitions: Column[] = [];
  let eventPubSubService: EventPubSubService;
  let gridOptions!: GridOption;
  let sharedService: SharedService;
  let globalEa: EventAggregator;
  let translaterService: TranslaterServiceStub;
  const container = DI.createContainer();
  // const http = new HttpStub();
  const containerService = new ContainerService(container);

  beforeEach(() => {
    // bootstrapTestEnvironment();
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
    eventPubSubService = new EventPubSubService(divContainer);
    sharedService = new SharedService();
    translaterService = new TranslaterServiceStub();
    jest.spyOn(mockGrid, 'getOptions').mockReturnValue(gridOptions);
    globalEa = new EventAggregator();

    // customElement = new AureliaSlickgridCustomElement(
    //   aureliaUtilServiceStub,
    //   observerLocatorStub,
    //   container,
    //   divContainer,
    //   globalEa,
    //   containerService,
    //   translaterService as unknown as TranslaterService
    //   // {
    //   //   backendUtilityService: backendUtilityServiceStub,
    //   //   collectionService: collectionServiceStub,
    //   //   eventPubSubService,
    //   //   extensionService: extensionServiceStub,
    //   //   extensionUtility: mockExtensionUtility,
    //   //   filterService: filterServiceStub,
    //   //   gridEventService: gridEventServiceStub,
    //   //   gridService: gridServiceStub,
    //   //   gridStateService: gridStateServiceStub,
    //   //   HeaderGroupingService: HeaderGroupingServiceStub,
    //   //   resizerService: resizerServiceStub,
    //   //   paginationService: paginationServiceStub,
    //   //   sharedService,
    //   //   sortService: sortServiceStub,
    //   //   treeDataService: treeDataServiceStub,
    //   // }
    // );
  });

  afterEach(() => {
    customElement?.detaching();
  });

  it('should have a test', () => {
    expect(true).toBeTruthy();
  });

  // it.skip('should mock dependencies', async () => {
  //   // AureliaSlickgridCustomElement();
  //   // const { startPromise, appHost, tearDown, component, ctx, container } = createFixture(
  //   //   `<aurelia-slickgrid></aurelia-slickgrid>`,
  //   //   AureliaSlickgridCustomElement
  //   //   // [
  //   //   //   aureliaUtilServiceStub,
  //   //   //   observerLocatorStub,
  //   //   //   container,
  //   //   //   divContainer,
  //   //   //   globalEa,
  //   //   //   containerService,
  //   //   //   translaterService as unknown as TranslaterService
  //   //   // ]
  //   // );

  //   // await startPromise;

  //   // // The router property is private, so get the router instance
  //   // // from the container
  //   // const router = container.get(IRouter);

  //   // // Stub load and return first argument
  //   // sinon.stub(router, 'load').returnsArg(0);

  //   // assert.strictEqual(component.navigate('nowhere'), 'nowhere');

  //   // await tearDown();
  // });

  // it('should throw an error when `gridOptions` and/or `columnDefinitions` is undefined', (done) => {
  //   try {
  //     customElement.gridOptions = undefined as any;
  //     customElement.dataset = [];
  //     customElement.initialization(mockSlickEventHandler);
  //   } catch (e: any) {
  //     expect(e.toString()).toContain('Using `<aurelia-slickgrid>` requires `column-definitions.bind="columnDefinitions"` and `grid-options.bind="gridOptions"`');
  //     customElement.detaching();
  //     done();
  //   }
  // });

  // it('should keep frozen column index reference (via frozenVisibleColumnId) when grid is a frozen grid', () => {
  //   const sharedFrozenIndexSpy = jest.spyOn(SharedService.prototype, 'frozenVisibleColumnId', 'set');
  //   customElement.columnDefinitions = columnDefinitions;
  //   customElement.gridOptions = gridOptions;
  //   customElement.gridOptions.frozenColumn = 0;

  //   customElement.bind();
  //   customElement.initialization(slickEventHandler);

  //   expect(customElement.eventHandler).toBe(slickEventHandler);
  //   expect(sharedFrozenIndexSpy).toHaveBeenCalledWith('name');
  // });

  // it('should update "visibleColumns" in the Shared Service when "onColumnsReordered" event is triggered', () => {
  //   const sharedHasColumnsReorderedSpy = jest.spyOn(SharedService.prototype, 'hasColumnsReordered', 'set');
  //   const sharedVisibleColumnsSpy = jest.spyOn(SharedService.prototype, 'visibleColumns', 'set');
  //   const newVisibleColumns = [{ id: 'lastName', field: 'lastName' }, { id: 'fristName', field: 'fristName' }];
  //   customElement.gridOptions = gridOptions;
  //   customElement.gridOptions.enableFiltering = true;

  //   customElement.bind();
  //   customElement.initialization(slickEventHandler);
  //   mockGrid.onColumnsReordered.notify({ impactedColumns: newVisibleColumns, grid: mockGrid });

  //   expect(customElement.eventHandler).toEqual(slickEventHandler);
  //   expect(sharedHasColumnsReorderedSpy).toHaveBeenCalledWith(true);
  //   expect(sharedVisibleColumnsSpy).toHaveBeenCalledWith(newVisibleColumns);
  // });

  // it('should create a grid and expect multiple event published', () => {
  //   const pubSubSpy = jest.spyOn(eventPubSubService, 'publish');

  //   customElement.bind();
  //   customElement.initialization(slickEventHandler);

  //   expect(eventPubSubService).toBeTruthy();
  //   expect(pubSubSpy).toHaveBeenNthCalledWith(1, 'onBeforeGridCreate', true);
  //   expect(pubSubSpy).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
  //   expect(pubSubSpy).toHaveBeenNthCalledWith(3, 'onGridCreated', expect.any(Object));
  //   expect(pubSubSpy).toHaveBeenNthCalledWith(4, 'onAureliaGridCreated', expect.any(Object));

  //   customElement.dispose();
  //   expect(pubSubSpy).toHaveBeenNthCalledWith(5, 'onBeforeGridDestroy', expect.any(Object));
  //   expect(pubSubSpy).toHaveBeenNthCalledWith(6, 'onAfterGridDestroyed', true);
  // });

  // describe('initialization method', () => {
  //   const customEditableInputFormatter: Formatter = (_row, _cell, value, columnDef) => {
  //     const isEditableLine = !!columnDef.editor;
  //     value = (value === null || value === undefined) ? '' : value;
  //     return isEditableLine ? `<div class="editing-field">${value}</div>` : value;
  //   };

  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it('should initialize the grid with a fixed height when provided in the grid options', () => {
  //     const fixedHeight = 100;
  //     const resizerSpy = jest.spyOn(resizerServiceStub, 'resizeGrid');

  //     customElement.gridOptions = { ...gridOptions, gridHeight: fixedHeight };
  //     customElement.bind();
  //     customElement.initialization(slickEventHandler);

  //     expect(resizerSpy).toHaveBeenCalledWith(0, { height: fixedHeight, width: undefined });
  //   });

  //   it('should initialize the grid with a fixed width when provided in the grid options', () => {
  //     const fixedWidth = 255;
  //     const resizerSpy = jest.spyOn(resizerServiceStub, 'resizeGrid');

  //     customElement.gridOptions = { ...gridOptions, gridWidth: fixedWidth };
  //     customElement.bind();
  //     customElement.initialization(slickEventHandler);

  //     expect(resizerSpy).toHaveBeenCalledWith(0, { height: undefined, width: fixedWidth });
  //   });

  //   it('should initialize the grid with autoResize enabled and without height/width then expect a "gridResize" to be called for auto-resizing', () => {
  //     const resizerSpy = jest.spyOn(resizerServiceStub, 'resizeGrid');

  //     customElement.gridOptions = { ...gridOptions, enableAutoResize: true };
  //     customElement.bind();
  //     customElement.initialization(slickEventHandler);

  //     expect(resizerSpy).toHaveBeenCalledWith();
  //   });

  //   describe('autoAddCustomEditorFormatter grid option', () => {
  //     it('should initialize the grid and automatically add custom Editor Formatter when provided in the grid options', () => {
  //       customElement.gridOptions = { ...gridOptions, autoAddCustomEditorFormatter: customEditableInputFormatter };
  //       customElement.bind();
  //       customElement.initialization(slickEventHandler);

  //       expect(autoAddEditorFormatterToColumnsWithEditor).toHaveBeenCalledWith([], customEditableInputFormatter);
  //     });
  //   });

  //   describe('columns definitions changed', () => {
  //     it('should expect "translateColumnHeaders" being called when "enableTranslate" is set', () => {
  //       const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
  //       const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
  //       const updateSpy = jest.spyOn(customElement, 'updateColumnDefinitionsList');
  //       const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

  //       customElement.columnDefinitions = mockColDefs;
  //       customElement.gridOptions = { ...gridOptions, enableTranslate: true };
  //       customElement.attached();
  //       customElement.initialization(slickEventHandler);
  //       customElement.columnDefinitionsChanged();

  //       expect(translaterService).toBeTruthy();
  //       expect(translateSpy).toHaveBeenCalled();
  //       expect(autosizeSpy).toHaveBeenCalled();
  //       expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
  //     });

  //     it('should expect "renderColumnHeaders" being called when "enableTranslate" is disabled', () => {
  //       const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
  //       const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
  //       const updateSpy = jest.spyOn(customElement, 'updateColumnDefinitionsList');
  //       const renderSpy = jest.spyOn(extensionServiceStub, 'renderColumnHeaders');
  //       const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

  //       customElement.columnDefinitions = mockColDefs;
  //       customElement.gridOptions = { ...gridOptions, enableTranslate: false, autoAddCustomEditorFormatter: customEditableInputFormatter };
  //       customElement.attached();
  //       customElement.initialization(slickEventHandler);
  //       customElement.columnDefinitionsChanged();

  //       expect(translateSpy).not.toHaveBeenCalled();
  //       expect(autosizeSpy).toHaveBeenCalled();
  //       expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
  //       expect(renderSpy).toHaveBeenCalledWith(mockColDefs, true);
  //       expect(autoAddEditorFormatterToColumnsWithEditor).toHaveBeenCalledWith([{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }], customEditableInputFormatter);
  //     });
  //   });

  //   describe('dataset changed', () => {
  //     beforeEach(() => {
  //       jest.clearAllMocks();
  //       sharedService.slickGrid = mockGrid as unknown as SlickGrid;
  //     });

  //     it('should expect "autosizeColumns" being called when "autoFitColumnsOnFirstLoad" is set and we are on first page load', () => {
  //       const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
  //       const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
  //       const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //       jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

  //       customElement.gridOptions = { autoFitColumnsOnFirstLoad: true };
  //       customElement.initialization(slickEventHandler);
  //       customElement.datasetChanged(mockData, null as any);

  //       expect(autosizeSpy).toHaveBeenCalledTimes(3); // 1x by datasetChanged and 2x by bindResizeHook
  //       expect(refreshSpy).toHaveBeenCalledWith(mockData);
  //     });

  //     it('should expect "autosizeColumns" NOT being called when "autoFitColumnsOnFirstLoad" is not set and we are on first page load', () => {
  //       const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
  //       const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
  //       const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //       jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

  //       customElement.gridOptions = { autoFitColumnsOnFirstLoad: false };
  //       customElement.initialization(slickEventHandler);
  //       customElement.datasetChanged(mockData, null as any);

  //       expect(autosizeSpy).not.toHaveBeenCalled();
  //       expect(refreshSpy).toHaveBeenCalledWith(mockData);
  //     });

  //     it('should expect "resizeColumnsByCellContent" being called when "enableAutoResizeColumnsByCellContent" is set and we changing column definitions via its SETTER', () => {
  //       const resizeContentSpy = jest.spyOn(resizerServiceStub, 'resizeColumnsByCellContent');
  //       const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
  //       const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collection: ['male', 'female'] } }] as Column[];
  //       jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

  //       customElement.gridOptions = { autoFitColumnsOnFirstLoad: false, enableAutoSizeColumns: false, autosizeColumnsByCellContentOnFirstLoad: true, enableAutoResizeColumnsByCellContent: true };
  //       customElement.columnDefinitions = mockColDefs;
  //       customElement.attached();
  //       customElement.initialization(slickEventHandler);
  //       customElement.columnDefinitionsChanged();
  //       customElement.datasetChanged(mockData, null as any);
  //       customElement.columnDefinitions = mockColDefs;

  //       expect(resizeContentSpy).toHaveBeenCalledTimes(1);
  //       expect(refreshSpy).toHaveBeenCalledWith(mockData);
  //     });

  //     it('should throw an error if we try to enable both auto resize type at same time with "autoFitColumnsOnFirstLoad" and "autosizeColumnsByCellContentOnFirstLoad"', (done) => {
  //       const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //       jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

  //       customElement.gridOptions = { autoFitColumnsOnFirstLoad: true, autosizeColumnsByCellContentOnFirstLoad: true };

  //       try {
  //         customElement.initialization(slickEventHandler);
  //         customElement.datasetChanged(mockData, null as any);
  //       } catch (e) {
  //         expect(e.toString()).toContain('[Aurelia-Slickgrid] You cannot enable both autosize/fit viewport & resize by content, you must choose which resize technique to use.');
  //         customElement.dispose();
  //         done();
  //       }
  //     });

  //     it('should throw an error if we try to enable both auto resize type at same time with "enableAutoSizeColumns" and "enableAutoResizeColumnsByCellContent"', (done) => {
  //       const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //       jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

  //       customElement.gridOptions = { enableAutoSizeColumns: true, enableAutoResizeColumnsByCellContent: true };

  //       try {
  //         customElement.initialization(slickEventHandler);
  //         customElement.datasetChanged(mockData, null as any);
  //       } catch (e) {
  //         expect(e.toString()).toContain('[Aurelia-Slickgrid] You cannot enable both autosize/fit viewport & resize by content, you must choose which resize technique to use.');
  //         customElement.dispose();
  //         done();
  //       }
  //     });
  //   });

  //   describe('options changed', () => {
  //     beforeEach(() => {
  //       jest.clearAllMocks();
  //       sharedService.slickGrid = mockGrid as unknown as SlickGrid;
  //       sharedService.gridOptions = gridOptions;
  //       customElement.gridOptions = gridOptions;
  //     });

  //     afterEach(() => {
  //       mockGrid.getOptions = jest.fn();
  //       jest.spyOn(mockGrid, 'getOptions').mockReturnValue(gridOptions);
  //     });

  //     it('should merge paginationOptions when some already exist', () => {
  //       const mockPagination = { pageSize: 2, pageSizes: [] };
  //       const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');

  //       customElement.paginationOptionsChanged(mockPagination);

  //       // expect(customElement.paginationOptions).toEqual({ ...mockPagination, totalItems: 0 });
  //       expect(paginationSrvSpy).toHaveBeenCalledWith(0, true);
  //     });

  //     it('should set brand new paginationOptions when none previously exist', () => {
  //       const mockPagination = { pageSize: 2, pageSizes: [], totalItems: 1 };
  //       const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');

  //       customElement.paginationOptionsChanged(undefined as any);
  //       customElement.paginationOptionsChanged(mockPagination);

  //       // expect(customElement.paginationOptions).toEqual(mockPagination);
  //       expect(paginationSrvSpy).toHaveBeenNthCalledWith(2, 1, true);
  //     });
  //   });

  //   describe('with editors', () => {
  //     beforeEach(() => {
  //       customElement.gridOptions = gridOptions;
  //     });

  //     it('should display a console error when any of the column definition ids include a dot notation', () => {
  //       const consoleSpy = jest.spyOn(global.console, 'error').mockReturnValue();
  //       const mockColDefs = [{ id: 'user.gender', field: 'user.gender', editor: { model: Editors.text, collection: ['male', 'female'] } }] as Column[];

  //       customElement.columnDefinitions = mockColDefs;
  //       customElement.columnDefinitionsChanged();
  //       customElement.initialization(slickEventHandler);

  //       expect(consoleSpy).toHaveBeenCalledWith('[Aurelia-Slickgrid] Make sure that none of your Column Definition "id" property includes a dot in its name because that will cause some problems with the Editors. For example if your column definition "field" property is "user.firstName" then use "firstName" as the column "id".');
  //     });

  //     it('should be able to load async editors with a regular Promise', (done) => {
  //       const mockCollection = ['male', 'female'];
  //       const promise = new Promise(resolve => resolve(mockCollection));
  //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];

  //       customElement.columnDefinitions = mockColDefs;
  //       customElement.columnDefinitionsChanged();
  //       customElement.initialization(slickEventHandler);
  //       customElement.columnDefinitionsChanged();

  //       setTimeout(() => {
  //         expect(customElement.columnDefinitions[0].editor).toBeTruthy();
  //         expect(customElement.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
  //         expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
  //         expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
  //         done();
  //       });
  //     });

  //     it('should be able to load collectionAsync and expect Editor to be destroyed and re-render when receiving new collection from await', (done) => {
  //       const mockCollection = ['male', 'female'];
  //       const promise = new Promise(resolve => resolve(mockCollection));
  //       const mockEditor = {
  //         disable: jest.fn(),
  //         destroy: jest.fn(),
  //         renderDomElement: jest.fn(),
  //       };
  //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];
  //       jest.spyOn(mockGrid, 'getCellEditor').mockReturnValue(mockEditor);
  //       const disableSpy = jest.spyOn(mockEditor, 'disable');
  //       const destroySpy = jest.spyOn(mockEditor, 'destroy');
  //       const renderSpy = jest.spyOn(mockEditor, 'renderDomElement');

  //       customElement.columnDefinitions = mockColDefs;
  //       customElement.columnDefinitionsChanged();
  //       customElement.initialization(slickEventHandler);
  //       customElement.columnDefinitionsChanged();

  //       setTimeout(() => {
  //         expect(customElement.columnDefinitions[0].editor).toBeTruthy();
  //         expect(customElement.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
  //         expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
  //         expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
  //         expect(disableSpy).toHaveBeenCalledWith(false);
  //         expect(destroySpy).toHaveBeenCalled();
  //         expect(renderSpy).toHaveBeenCalledWith(mockCollection);
  //         done();
  //       });
  //     });

  //     it('should be able to load async editors with as a Promise with content to simulate http-client', (done) => {
  //       const mockCollection = ['male', 'female'];
  //       const promise = new Promise(resolve => resolve({ content: mockCollection }));
  //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];

  //       customElement.columnDefinitions = mockColDefs;
  //       customElement.columnDefinitionsChanged();
  //       customElement.initialization(slickEventHandler);
  //       customElement.columnDefinitionsChanged();

  //       setTimeout(() => {
  //         expect(customElement.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
  //         expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
  //         expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
  //         done();
  //       });
  //     });

  //     it('should be able to load async editors with a Fetch Promise', (done) => {
  //       const mockCollection = ['male', 'female'];
  //       http.status = 200;
  //       http.object = mockCollection;
  //       http.returnKey = 'date';
  //       http.returnValue = '6/24/1984';
  //       http.responseHeaders = { accept: 'json' };
  //       const collectionAsync = http.fetch('http://localhost/api', { method: 'GET' });
  //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync } }] as Column[];

  //       customElement.columnDefinitions = mockColDefs;
  //       customElement.columnDefinitionsChanged();
  //       customElement.initialization(slickEventHandler);
  //       customElement.columnDefinitionsChanged();

  //       setTimeout(() => {
  //         expect(customElement.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
  //         expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
  //         expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
  //         done();
  //       });
  //     });

  //     it('should be able to load async editors with an Observable', (done) => {
  //       const mockCollection = ['male', 'female'];
  //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: of(mockCollection) } }] as Column[];

  //       const rxjsMock = new RxJsResourceStub();
  //       customElement.gridOptions = { externalResources: [rxjsMock] } as unknown as GridOption;
  //       customElement.registerExternalResources([rxjsMock], true);
  //       customElement.columnDefinitions = mockColDefs;
  //       customElement.columnDefinitionsChanged();
  //       customElement.initialization(slickEventHandler);
  //       customElement.columnDefinitionsChanged();

  //       setTimeout(() => {
  //         expect(customElement.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
  //         expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
  //         expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
  //         done();
  //       });
  //     });

  //     it('should throw an error when Fetch Promise response bodyUsed is true', (done) => {
  //       const consoleSpy = jest.spyOn(global.console, 'warn').mockReturnValue();
  //       const mockCollection = ['male', 'female'];
  //       http.status = 200;
  //       http.object = mockCollection;
  //       http.returnKey = 'date';
  //       http.returnValue = '6/24/1984';
  //       http.responseHeaders = { accept: 'json' };
  //       const collectionAsync = http.fetch('http://localhost/invalid-url', { method: 'GET' });
  //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync } }] as Column[];
  //       jest.spyOn(mockGrid, 'getColumns').mockReturnValue(mockColDefs);

  //       customElement.columnDefinitions = mockColDefs;
  //       customElement.columnDefinitionsChanged();
  //       customElement.initialization(slickEventHandler);

  //       setTimeout(() => {
  //         expect(consoleSpy).toHaveBeenCalledWith(expect.toInclude('[Aurelia-SlickGrid] The response body passed to collectionAsync was already read. Either pass the dataset from the Response or clone the response first using response.clone()'));
  //         done();
  //       });
  //     });
  //   });

  //   describe('use grouping', () => {
  //     it('should load groupItemMetaProvider to the DataView when using "draggableGrouping" feature', () => {
  //       const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
  //       const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');
  //       jest.spyOn(extensionServiceStub, 'extensionList', 'get').mockReturnValue({ draggableGrouping: { pluginName: 'DraggableGrouping' } } as unknown as ExtensionList<any>);

  //       customElement.gridOptions = { draggableGrouping: {} };
  //       customElement.initialization(slickEventHandler);

  //       expect(dataviewSpy).toHaveBeenCalledWith({ inlineFilters: false, groupItemMetadataProvider: expect.anything() });
  //       expect(sharedService.groupItemMetadataProvider instanceof SlickGroupItemMetadataProvider).toBeTruthy();
  //       expect(sharedMetaSpy).toHaveBeenCalledWith(expect.toBeObject());

  //       customElement.dispose();
  //     });

  //     it('should load groupItemMetaProvider to the DataView when using "enableGrouping" feature', () => {
  //       const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
  //       const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');

  //       customElement.gridOptions = { enableGrouping: true };
  //       customElement.initialization(slickEventHandler);

  //       expect(dataviewSpy).toHaveBeenCalledWith({ inlineFilters: false, groupItemMetadataProvider: expect.anything() });
  //       expect(sharedMetaSpy).toHaveBeenCalledWith(expect.toBeObject());
  //       expect(sharedService.groupItemMetadataProvider instanceof SlickGroupItemMetadataProvider).toBeTruthy();

  //       customElement.dispose();
  //     });
  //   });

  //   describe('dataView options', () => {
  //     beforeEach(() => {
  //       customElement.gridOptions = gridOptions;
  //     });

  //     afterEach(() => {
  //       customElement.dispose();
  //       jest.clearAllMocks();
  //       sharedService.slickGrid = mockGrid as unknown as SlickGrid;
  //     });

  //     it('should call the onDataviewCreated emitter', () => {
  //       const pubSubSpy = jest.spyOn(eventPubSubService, 'publish');
  //       customElement.initialization(slickEventHandler);
  //       expect(pubSubSpy).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
  //     });

  //     it('should call the "executeAfterDataviewCreated" and "loadGridSorters" methods and Sorter Presets are provided in the Grid Options', () => {
  //       const sortSpy = jest.spyOn(sortServiceStub, 'loadGridSorters');

  //       customElement.gridOptions = { presets: { sorters: [{ columnId: 'field1', direction: 'DESC' }] } } as unknown as GridOption;
  //       customElement.initialization(slickEventHandler);

  //       expect(sortSpy).toHaveBeenCalled();
  //     });

  //     it('should call the DataView "syncGridSelection" method with 2nd argument as True when the "dataView.syncGridSelection" grid option is enabled', () => {
  //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //       customElement.gridOptions = { dataView: { syncGridSelection: true }, enableRowSelection: true } as unknown as GridOption;
  //       customElement.initialization(slickEventHandler);

  //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true);
  //     });

  //     it('should call the DataView "syncGridSelection" method with 2nd argument as False when the "dataView.syncGridSelection" grid option is disabled', () => {
  //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //       customElement.gridOptions = { dataView: { syncGridSelection: false }, enableRowSelection: true } as unknown as GridOption;
  //       customElement.initialization(slickEventHandler);

  //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
  //     });

  //     it('should call the DataView "syncGridSelection" method with 3 arguments when the "dataView" grid option is provided as an object', () => {
  //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //       customElement.gridOptions = {
  //         dataView: { syncGridSelection: { preserveHidden: true, preserveHiddenOnSelectionChange: false } },
  //         enableRowSelection: true
  //       } as unknown as GridOption;
  //       customElement.initialization(slickEventHandler);

  //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true, false);
  //     });

  //     it('should call the DataView "syncGridSelection" method when using BackendServiceApi and "syncGridSelectionWithBackendService" when the "dataView.syncGridSelection" grid option is enabled as well', () => {
  //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //       customElement.gridOptions = {
  //         backendServiceApi: {
  //           service: mockGraphqlService,
  //           process: jest.fn(),
  //         },
  //         dataView: { syncGridSelection: true, syncGridSelectionWithBackendService: true },
  //         enableRowSelection: true
  //       } as unknown as GridOption;
  //       customElement.initialization(slickEventHandler);

  //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true);
  //     });

  //     it('should call the DataView "syncGridSelection" method with false as 2nd argument when using BackendServiceApi and "syncGridSelectionWithBackendService" BUT the "dataView.syncGridSelection" grid option is disabled', () => {
  //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //       customElement.gridOptions = {
  //         backendServiceApi: {
  //           service: mockGraphqlService,
  //           process: jest.fn(),
  //         },
  //         dataView: { syncGridSelection: false, syncGridSelectionWithBackendService: true },
  //         enableRowSelection: true
  //       } as unknown as GridOption;
  //       customElement.initialization(slickEventHandler);

  //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
  //     });

  //     it('should call the DataView "syncGridSelection" method with false as 2nd argument when using BackendServiceApi and "syncGridSelectionWithBackendService" disabled and the "dataView.syncGridSelection" grid option is enabled', () => {
  //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //       customElement.gridOptions = {
  //         backendServiceApi: {
  //           service: mockGraphqlService,
  //           process: jest.fn(),
  //         },
  //         dataView: { syncGridSelection: true, syncGridSelectionWithBackendService: false },
  //         enableRowSelection: true
  //       } as unknown as GridOption;
  //       customElement.initialization(slickEventHandler);

  //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
  //     });
  //   });

  //   //   it('should make sure AureliaSlickgridCustomElement is defined', () => {
  //   //     expect(customElement).toBeTruthy();
  //   //   });

  //   //   // it('should load enable mousewheel event scrolling when using a frozen grid', () => {
  //   //   //   customElement.gridOptions = gridOptions;
  //   //   //   customElement.gridOptions.enableMouseWheelScrollHandler = undefined;
  //   //   //   customElement.gridOptions.frozenRow = 3;

  //   //   //   customElement.bound();
  //   //   //   customElement.initialization(mockSlickEventHandler);

  //   //   //   expect(customElement.gridOptions.enableMouseWheelScrollHandler).toBeTrue();
  //   //   // });

  //   //   // it('should throw an error when `gridOptions` and/or `columnDefinitions` is undefined', (done) => {
  //   //   //   try {
  //   //   //     customElement.gridOptions = undefined as any;
  //   //   //     customElement.dataset = [];
  //   //   //     customElement.initialization(mockSlickEventHandler);
  //   //   //   } catch (e: any) {
  //   //   //     expect(e.toString()).toContain('Using `<aurelia-slickgrid>` requires `column-definitions.bound="columnDefinitions"` and `grid-options.bound="gridOptions"`');
  //   //   //     customElement.detached();
  //   //   //     done();
  //   //   //   }
  //   //   // });

  //   //   // it('should keep frozen column index reference (via frozenVisibleColumnId) when grid is a frozen grid', () => {
  //   //   //   const sharedFrozenIndexSpy = jest.spyOn(SharedService.prototype, 'frozenVisibleColumnId', 'set');
  //   //   //   customElement.columnDefinitions = columnDefinitions;
  //   //   //   customElement.gridOptions = gridOptions;
  //   //   //   customElement.gridOptions.frozenColumn = 0;

  //   //   //   customElement.bound();
  //   //   //   customElement.initialization(slickEventHandler);

  //   //   //   expect(customElement.eventHandler).toBe(slickEventHandler);
  //   //   //   expect(sharedFrozenIndexSpy).toHaveBeenCalledWith('name');
  //   //   // });

  //   //   // it('should update "visibleColumns" in the Shared Service when "onColumnsReordered" event is triggered', () => {
  //   //   //   const sharedHasColumnsReorderedSpy = jest.spyOn(SharedService.prototype, 'hasColumnsReordered', 'set');
  //   //   //   const sharedVisibleColumnsSpy = jest.spyOn(SharedService.prototype, 'visibleColumns', 'set');
  //   //   //   const newVisibleColumns = [{ id: 'lastName', field: 'lastName' }, { id: 'fristName', field: 'fristName' }];
  //   //   //   customElement.gridOptions = gridOptions;
  //   //   //   customElement.gridOptions.enableFiltering = true;

  //   //   //   customElement.bound();
  //   //   //   customElement.initialization(slickEventHandler);
  //   //   //   mockGrid.onColumnsReordered.notify({ impactedColumns: newVisibleColumns, grid: mockGrid });

  //   //   //   expect(customElement.eventHandler).toEqual(slickEventHandler);
  //   //   //   expect(sharedHasColumnsReorderedSpy).toHaveBeenCalledWith(true);
  //   //   //   expect(sharedVisibleColumnsSpy).toHaveBeenCalledWith(newVisibleColumns);
  //   //   // });

  //   //   // it('should create a grid and expect multiple event published', () => {
  //   //   //   const pubSubSpy = jest.spyOn(eventPubSubService, 'publish');

  //   //   //   customElement.bound();
  //   //   //   customElement.initialization(slickEventHandler);

  //   //   //   expect(eventPubSubService).toBeTruthy();
  //   //   //   expect(pubSubSpy).toHaveBeenNthCalledWith(1, 'onBeforeGridCreate', true);
  //   //   //   expect(pubSubSpy).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
  //   //   //   expect(pubSubSpy).toHaveBeenNthCalledWith(3, 'onGridCreated', expect.any(Object));
  //   //   //   expect(pubSubSpy).toHaveBeenNthCalledWith(4, 'onAureliaGridCreated', expect.any(Object));

  //   //   //   customElement.detached();
  //   //   //   expect(pubSubSpy).toHaveBeenNthCalledWith(5, 'onBeforeGridDestroy', expect.any(Object));
  //   //   //   expect(pubSubSpy).toHaveBeenNthCalledWith(6, 'onAfterGridDestroyed', true);
  //   //   // });

  //   //   // describe('initialization method', () => {
  //   //   //   const customEditableInputFormatter: Formatter = (_row, _cell, value, columnDef) => {
  //   //   //     const isEditableLine = !!columnDef.editor;
  //   //   //     value = (value === null || value === undefined) ? '' : value;
  //   //   //     return isEditableLine ? `<div class="editing-field">${value}</div>` : value;
  //   //   //   };

  //   //   //   afterEach(() => {
  //   //   //     jest.clearAllMocks();
  //   //   //   });

  //   //   //   it('should initialize the grid with a fixed height when provided in the grid options', () => {
  //   //   //     const fixedHeight = 100;
  //   //   //     const resizerSpy = jest.spyOn(resizerServiceStub, 'resizeGrid');

  //   //   //     customElement.gridOptions = { ...gridOptions, gridHeight: fixedHeight };
  //   //   //     customElement.bound();
  //   //   //     customElement.initialization(slickEventHandler);

  //   //   //     expect(resizerSpy).toHaveBeenCalledWith(0, { height: fixedHeight, width: undefined });
  //   //   //   });

  //   //   //   it('should initialize the grid with a fixed width when provided in the grid options', () => {
  //   //   //     const fixedWidth = 255;
  //   //   //     const resizerSpy = jest.spyOn(resizerServiceStub, 'resizeGrid');

  //   //   //     customElement.gridOptions = { ...gridOptions, gridWidth: fixedWidth };
  //   //   //     customElement.bound();
  //   //   //     customElement.initialization(slickEventHandler);

  //   //   //     expect(resizerSpy).toHaveBeenCalledWith(0, { height: undefined, width: fixedWidth });
  //   //   //   });

  //   //   //   it('should initialize the grid with autoResize enabled and without height/width then expect a "gridResize" to be called for auto-resizing', () => {
  //   //   //     const resizerSpy = jest.spyOn(resizerServiceStub, 'resizeGrid');

  //   //   //     customElement.gridOptions = { ...gridOptions, enableAutoResize: true };
  //   //   //     customElement.bound();
  //   //   //     customElement.initialization(slickEventHandler);

  //   //   //     expect(resizerSpy).toHaveBeenCalledWith();
  //   //   //   });

  //   //   //   describe('autoAddCustomEditorFormatter grid option', () => {
  //   //   //     it('should initialize the grid and automatically add custom Editor Formatter when provided in the grid options', () => {
  //   //   //       const autoAddFormatterSpy = jest.spyOn(formatterUtilities, 'autoAddEditorFormatterToColumnsWithEditor');

  //   //   //       customElement.gridOptions = { ...gridOptions, autoAddCustomEditorFormatter: customEditableInputFormatter };
  //   //   //       customElement.bound();
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(autoAddFormatterSpy).toHaveBeenCalledWith([], customEditableInputFormatter);
  //   //   //     });
  //   //   //   });

  //   //   //   describe('columns definitions changed', () => {
  //   //   //     it('should expect "translateColumnHeaders" being called when "enableTranslate" is set', () => {
  //   //   //       const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
  //   //   //       const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
  //   //   //       const updateSpy = jest.spyOn(customElement, 'updateColumnDefinitionsList');
  //   //   //       const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

  //   //   //       customElement.columnDefinitions = mockColDefs;
  //   //   //       customElement.gridOptions = { ...gridOptions, enableTranslate: true };
  //   //   //       customElement.attaching();
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       customElement.columnDefinitionsChanged();

  //   //   //       expect(translaterService).toBeTruthy();
  //   //   //       expect(translateSpy).toHaveBeenCalled();
  //   //   //       expect(autosizeSpy).toHaveBeenCalled();
  //   //   //       expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
  //   //   //     });

  //   //   //     it('should expect "renderColumnHeaders" being called when "enableTranslate" is disabled', () => {
  //   //   //       const translateSpy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');
  //   //   //       const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
  //   //   //       const updateSpy = jest.spyOn(customElement, 'updateColumnDefinitionsList');
  //   //   //       const renderSpy = jest.spyOn(extensionServiceStub, 'renderColumnHeaders');
  //   //   //       const autoAddFormatterSpy = jest.spyOn(formatterUtilities, 'autoAddEditorFormatterToColumnsWithEditor');
  //   //   //       const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

  //   //   //       customElement.columnDefinitions = mockColDefs;
  //   //   //       customElement.gridOptions = { ...gridOptions, enableTranslate: false, autoAddCustomEditorFormatter: customEditableInputFormatter };
  //   //   //       customElement.attaching();
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       customElement.columnDefinitionsChanged();

  //   //   //       expect(translateSpy).not.toHaveBeenCalled();
  //   //   //       expect(autosizeSpy).toHaveBeenCalled();
  //   //   //       expect(updateSpy).toHaveBeenCalledWith(mockColDefs);
  //   //   //       expect(renderSpy).toHaveBeenCalledWith(mockColDefs, true);
  //   //   //       expect(autoAddFormatterSpy).toHaveBeenCalledWith([{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }], customEditableInputFormatter);
  //   //   //     });
  //   //   //   });

  //   //   //   describe('dataset changed', () => {
  //   //   //     beforeEach(() => {
  //   //   //       jest.clearAllMocks();
  //   //   //       sharedService.slickGrid = mockGrid as unknown as SlickGrid;
  //   //   //     });

  //   //   //     it('should expect "autosizeColumns" being called when "autoFitColumnsOnFirstLoad" is set and we are on first page load', () => {
  //   //   //       const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
  //   //   //       const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
  //   //   //       const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //   //   //       jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

  //   //   //       customElement.gridOptions = { autoFitColumnsOnFirstLoad: true };
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       customElement.datasetChanged(mockData, null as any);

  //   //   //       expect(autosizeSpy).toHaveBeenCalledTimes(3); // 1x by datasetChanged and 2x by boundResizeHook
  //   //   //       expect(refreshSpy).toHaveBeenCalledWith(mockData);
  //   //   //     });

  //   //   //     it('should expect "autosizeColumns" NOT being called when "autoFitColumnsOnFirstLoad" is not set and we are on first page load', () => {
  //   //   //       const autosizeSpy = jest.spyOn(mockGrid, 'autosizeColumns');
  //   //   //       const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
  //   //   //       const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //   //   //       jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

  //   //   //       customElement.gridOptions = { autoFitColumnsOnFirstLoad: false };
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       customElement.datasetChanged(mockData, null as any);

  //   //   //       expect(autosizeSpy).not.toHaveBeenCalled();
  //   //   //       expect(refreshSpy).toHaveBeenCalledWith(mockData);
  //   //   //     });

  //   //   //     it('should expect "resizeColumnsByCellContent" being called when "enableAutoResizeColumnsByCellContent" is set and we changing column definitions via its SETTER', () => {
  //   //   //       const resizeContentSpy = jest.spyOn(resizerServiceStub, 'resizeColumnsByCellContent');
  //   //   //       const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
  //   //   //       const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //   //   //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collection: ['male', 'female'] } }] as Column[];
  //   //   //       jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

  //   //   //       customElement.gridOptions = { autoFitColumnsOnFirstLoad: false, enableAutoSizeColumns: false, autosizeColumnsByCellContentOnFirstLoad: true, enableAutoResizeColumnsByCellContent: true };
  //   //   //       customElement.columnDefinitions = mockColDefs;
  //   //   //       customElement.attaching();
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       customElement.columnDefinitionsChanged();
  //   //   //       customElement.datasetChanged(mockData, null as any);
  //   //   //       customElement.columnDefinitions = mockColDefs;

  //   //   //       expect(resizeContentSpy).toHaveBeenCalledTimes(1);
  //   //   //       expect(refreshSpy).toHaveBeenCalledWith(mockData);
  //   //   //     });

  //   //   //     it('should throw an error if we try to enable both auto resize type at same time with "autoFitColumnsOnFirstLoad" and "autosizeColumnsByCellContentOnFirstLoad"', (done) => {
  //   //   //       const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //   //   //       jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

  //   //   //       customElement.gridOptions = { autoFitColumnsOnFirstLoad: true, autosizeColumnsByCellContentOnFirstLoad: true };

  //   //   //       try {
  //   //   //         customElement.initialization(slickEventHandler);
  //   //   //         customElement.datasetChanged(mockData, null as any);
  //   //   //       } catch (e) {
  //   //   //         expect(e.toString()).toContain('[Aurelia-Slickgrid] You cannot enable both autosize/fit viewport & resize by content, you must choose which resize technique to use.');
  //   //   //         customElement.dispose();
  //   //   //         done();
  //   //   //       }
  //   //   //     });

  //   //   //     it('should throw an error if we try to enable both auto resize type at same time with "enableAutoSizeColumns" and "enableAutoResizeColumnsByCellContent"', (done) => {
  //   //   //       const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //   //   //       jest.spyOn(mockDataView, 'getLength').mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(mockData.length);

  //   //   //       customElement.gridOptions = { enableAutoSizeColumns: true, enableAutoResizeColumnsByCellContent: true };

  //   //   //       try {
  //   //   //         customElement.initialization(slickEventHandler);
  //   //   //         customElement.datasetChanged(mockData, null as any);
  //   //   //       } catch (e) {
  //   //   //         expect(e.toString()).toContain('[Aurelia-Slickgrid] You cannot enable both autosize/fit viewport & resize by content, you must choose which resize technique to use.');
  //   //   //         customElement.dispose();
  //   //   //         done();
  //   //   //       }
  //   //   //     });
  //   //   //   });

  //   //   //   describe('options changed', () => {
  //   //   //     beforeEach(() => {
  //   //   //       jest.clearAllMocks();
  //   //   //       sharedService.slickGrid = mockGrid as unknown as SlickGrid;
  //   //   //       sharedService.gridOptions = gridOptions;
  //   //   //       customElement.gridOptions = gridOptions;
  //   //   //     });

  //   //   //     afterEach(() => {
  //   //   //       mockGrid.getOptions = jest.fn();
  //   //   //       jest.spyOn(mockGrid, 'getOptions').mockReturnValue(gridOptions);
  //   //   //     });

  //   //   //     it('should merge paginationOptions when some already exist', () => {
  //   //   //       const mockPagination = { pageSize: 2, pageSizes: [] };
  //   //   //       const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');

  //   //   //       customElement.paginationOptionsChanged(mockPagination);

  //   //   //       // expect(customElement.paginationOptions).toEqual({ ...mockPagination, totalItems: 0 });
  //   //   //       expect(paginationSrvSpy).toHaveBeenCalledWith(0, true);
  //   //   //     });

  //   //   //     it('should set brand new paginationOptions when none previously exist', () => {
  //   //   //       const mockPagination = { pageSize: 2, pageSizes: [], totalItems: 1 };
  //   //   //       const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');

  //   //   //       customElement.paginationOptionsChanged(undefined as any);
  //   //   //       customElement.paginationOptionsChanged(mockPagination);

  //   //   //       // expect(customElement.paginationOptions).toEqual(mockPagination);
  //   //   //       expect(paginationSrvSpy).toHaveBeenNthCalledWith(2, 1, true);
  //   //   //     });
  //   //   //   });

  //   //   //   describe('with editors', () => {
  //   //   //     beforeEach(() => {
  //   //   //       customElement.gridOptions = gridOptions;
  //   //   //     });

  //   //   //     it('should display a console error when any of the column definition ids include a dot notation', () => {
  //   //   //       const consoleSpy = jest.spyOn(global.console, 'error').mockReturnValue();
  //   //   //       const mockColDefs = [{ id: 'user.gender', field: 'user.gender', editor: { model: Editors.text, collection: ['male', 'female'] } }] as Column[];

  //   //   //       customElement.columnDefinitions = mockColDefs;
  //   //   //       customElement.columnDefinitionsChanged();
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(consoleSpy).toHaveBeenCalledWith('[Aurelia-Slickgrid] Make sure that none of your Column Definition "id" property includes a dot in its name because that will cause some problems with the Editors. For example if your column definition "field" property is "user.firstName" then use "firstName" as the column "id".');
  //   //   //     });

  //   //   //     it('should be able to load async editors with a regular Promise', (done) => {
  //   //   //       const mockCollection = ['male', 'female'];
  //   //   //       const promise = new Promise(resolve => resolve(mockCollection));
  //   //   //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];

  //   //   //       customElement.columnDefinitions = mockColDefs;
  //   //   //       customElement.columnDefinitionsChanged();
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       customElement.columnDefinitionsChanged();

  //   //   //       setTimeout(() => {
  //   //   //         expect(customElement.columnDefinitions[0].editor).toBeTruthy();
  //   //   //         expect(customElement.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
  //   //   //         expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
  //   //   //         expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
  //   //   //         done();
  //   //   //       });
  //   //   //     });

  //   //   //     it('should be able to load collectionAsync and expect Editor to be destroyed and re-render when receiving new collection from await', (done) => {
  //   //   //       const mockCollection = ['male', 'female'];
  //   //   //       const promise = new Promise(resolve => resolve(mockCollection));
  //   //   //       const mockEditor = {
  //   //   //         disable: jest.fn(),
  //   //   //         destroy: jest.fn(),
  //   //   //         renderDomElement: jest.fn(),
  //   //   //       };
  //   //   //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];
  //   //   //       jest.spyOn(mockGrid, 'getCellEditor').mockReturnValue(mockEditor);
  //   //   //       const disableSpy = jest.spyOn(mockEditor, 'disable');
  //   //   //       const destroySpy = jest.spyOn(mockEditor, 'destroy');
  //   //   //       const renderSpy = jest.spyOn(mockEditor, 'renderDomElement');

  //   //   //       customElement.columnDefinitions = mockColDefs;
  //   //   //       customElement.columnDefinitionsChanged();
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       customElement.columnDefinitionsChanged();

  //   //   //       setTimeout(() => {
  //   //   //         expect(customElement.columnDefinitions[0].editor).toBeTruthy();
  //   //   //         expect(customElement.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
  //   //   //         expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
  //   //   //         expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
  //   //   //         expect(disableSpy).toHaveBeenCalledWith(false);
  //   //   //         expect(destroySpy).toHaveBeenCalled();
  //   //   //         expect(renderSpy).toHaveBeenCalledWith(mockCollection);
  //   //   //         done();
  //   //   //       });
  //   //   //     });

  //   //   //     it('should be able to load async editors with as a Promise with content to simulate http-client', (done) => {
  //   //   //       const mockCollection = ['male', 'female'];
  //   //   //       const promise = new Promise(resolve => resolve({ content: mockCollection }));
  //   //   //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: promise } }] as Column[];

  //   //   //       customElement.columnDefinitions = mockColDefs;
  //   //   //       customElement.columnDefinitionsChanged();
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       customElement.columnDefinitionsChanged();

  //   //   //       setTimeout(() => {
  //   //   //         expect(customElement.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
  //   //   //         expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
  //   //   //         expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
  //   //   //         done();
  //   //   //       });
  //   //   //     });

  //   //   //     it('should be able to load async editors with a Fetch Promise', (done) => {
  //   //   //       const mockCollection = ['male', 'female'];
  //   //   //       http.status = 200;
  //   //   //       http.object = mockCollection;
  //   //   //       http.returnKey = 'date';
  //   //   //       http.returnValue = '6/24/1984';
  //   //   //       http.responseHeaders = { accept: 'json' };
  //   //   //       const collectionAsync = http.fetch('http://localhost/api', { method: 'GET' });
  //   //   //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync } }] as Column[];

  //   //   //       customElement.columnDefinitions = mockColDefs;
  //   //   //       customElement.columnDefinitionsChanged();
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       customElement.columnDefinitionsChanged();

  //   //   //       setTimeout(() => {
  //   //   //         expect(customElement.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
  //   //   //         expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
  //   //   //         expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
  //   //   //         done();
  //   //   //       });
  //   //   //     });

  //   //   //     it('should be able to load async editors with an Observable', (done) => {
  //   //   //       const mockCollection = ['male', 'female'];
  //   //   //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync: of(mockCollection) } }] as Column[];

  //   //   //       const rxjsMock = new RxJsResourceStub();
  //   //   //       customElement.gridOptions = { registerExternalResources: [rxjsMock] } as unknown as GridOption;
  //   //   //       customElement.columnDefinitions = mockColDefs;
  //   //   //       customElement.columnDefinitionsChanged();
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       customElement.columnDefinitionsChanged();

  //   //   //       setTimeout(() => {
  //   //   //         expect(customElement.columnDefinitions[0].editor!.collection).toEqual(mockCollection);
  //   //   //         expect(customElement.columnDefinitions[0].internalColumnEditor!.collection).toEqual(mockCollection);
  //   //   //         expect(customElement.columnDefinitions[0].internalColumnEditor!.model).toEqual(Editors.text);
  //   //   //         done();
  //   //   //       });
  //   //   //     });

  //   //   //     it('should throw an error when Fetch Promise response bodyUsed is true', (done) => {
  //   //   //       const consoleSpy = jest.spyOn(global.console, 'warn').mockReturnValue();
  //   //   //       const mockCollection = ['male', 'female'];
  //   //   //       http.status = 200;
  //   //   //       http.object = mockCollection;
  //   //   //       http.returnKey = 'date';
  //   //   //       http.returnValue = '6/24/1984';
  //   //   //       http.responseHeaders = { accept: 'json' };
  //   //   //       const collectionAsync = http.fetch('http://localhost/invalid-url', { method: 'GET' });
  //   //   //       const mockColDefs = [{ id: 'gender', field: 'gender', editor: { model: Editors.text, collectionAsync } }] as Column[];
  //   //   //       jest.spyOn(mockGrid, 'getColumns').mockReturnValue(mockColDefs);

  //   //   //       customElement.columnDefinitions = mockColDefs;
  //   //   //       customElement.columnDefinitionsChanged();
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       setTimeout(() => {
  //   //   //         expect(consoleSpy).toHaveBeenCalledWith(expect.toInclude('[Aurelia-SlickGrid] The response body passed to collectionAsync was already read. Either pass the dataset from the Response or clone the response first using response.clone()'));
  //   //   //         done();
  //   //   //       });
  //   //   //     });
  //   //   //   });

  //   //   //   describe('use grouping', () => {
  //   //   //     it('should load groupItemMetaProvider to the DataView when using "draggableGrouping" feature', () => {
  //   //   //       const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
  //   //   //       const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');
  //   //   //       jest.spyOn(extensionServiceStub, 'extensionList', 'get').mockReturnValue({ draggableGrouping: { pluginName: 'DraggableGrouping' } } as unknown as ExtensionList<any>);

  //   //   //       customElement.gridOptions = { draggableGrouping: {} };
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(dataviewSpy).toHaveBeenCalledWith({ inlineFilters: false, groupItemMetadataProvider: expect.anything() });
  //   //   //       expect(sharedService.groupItemMetadataProvider instanceof SlickGroupItemMetadataProvider).toBeTruthy();
  //   //   //       expect(sharedMetaSpy).toHaveBeenCalledWith(expect.toBeObject());

  //   //   //       customElement.dispose();
  //   //   //     });

  //   //   //     it('should load groupItemMetaProvider to the DataView when using "enableGrouping" feature', () => {
  //   //   //       const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
  //   //   //       const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');

  //   //   //       customElement.gridOptions = { enableGrouping: true };
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(dataviewSpy).toHaveBeenCalledWith({ inlineFilters: false, groupItemMetadataProvider: expect.anything() });
  //   //   //       expect(sharedMetaSpy).toHaveBeenCalledWith(expect.toBeObject());
  //   //   //       expect(sharedService.groupItemMetadataProvider instanceof SlickGroupItemMetadataProvider).toBeTruthy();

  //   //   //       customElement.dispose();
  //   //   //     });
  //   //   //   });

  //   //   //   describe('dataView options', () => {
  //   //   //     beforeEach(() => {
  //   //   //       customElement.gridOptions = gridOptions;
  //   //   //     });

  //   //   //     afterEach(() => {
  //   //   //       customElement.dispose();
  //   //   //       jest.clearAllMocks();
  //   //   //       sharedService.slickGrid = mockGrid as unknown as SlickGrid;
  //   //   //     });

  //   //   //     it('should call the onDataviewCreated emitter', () => {
  //   //   //       const pubSubSpy = jest.spyOn(eventPubSubService, 'publish');
  //   //   //       customElement.initialization(slickEventHandler);
  //   //   //       expect(pubSubSpy).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
  //   //   //     });

  //   //   //     it('should call the "executeAfterDataviewCreated" and "loadGridSorters" methods and Sorter Presets are provided in the Grid Options', () => {
  //   //   //       const sortSpy = jest.spyOn(sortServiceStub, 'loadGridSorters');

  //   //   //       customElement.gridOptions = { presets: { sorters: [{ columnId: 'field1', direction: 'DESC' }] } } as unknown as GridOption;
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(sortSpy).toHaveBeenCalled();
  //   //   //     });

  //   //   //     it('should call the DataView "syncGridSelection" method with 2nd argument as True when the "dataView.syncGridSelection" grid option is enabled', () => {
  //   //   //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //   //   //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //   //   //       customElement.gridOptions = { dataView: { syncGridSelection: true }, enableRowSelection: true } as unknown as GridOption;
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true);
  //   //   //     });

  //   //   //     it('should call the DataView "syncGridSelection" method with 2nd argument as False when the "dataView.syncGridSelection" grid option is disabled', () => {
  //   //   //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //   //   //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //   //   //       customElement.gridOptions = { dataView: { syncGridSelection: false }, enableRowSelection: true } as unknown as GridOption;
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
  //   //   //     });

  //   //   //     it('should call the DataView "syncGridSelection" method with 3 arguments when the "dataView" grid option is provided as an object', () => {
  //   //   //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //   //   //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //   //   //       customElement.gridOptions = {
  //   //   //         dataView: { syncGridSelection: { preserveHidden: true, preserveHiddenOnSelectionChange: false } },
  //   //   //         enableRowSelection: true
  //   //   //       } as unknown as GridOption;
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true, false);
  //   //   //     });

  //   //   //     it('should call the DataView "syncGridSelection" method when using BackendServiceApi and "syncGridSelectionWithBackendService" when the "dataView.syncGridSelection" grid option is enabled as well', () => {
  //   //   //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //   //   //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //   //   //       customElement.gridOptions = {
  //   //   //         backendServiceApi: {
  //   //   //           service: mockGraphqlService,
  //   //   //           process: jest.fn(),
  //   //   //         },
  //   //   //         dataView: { syncGridSelection: true, syncGridSelectionWithBackendService: true },
  //   //   //         enableRowSelection: true
  //   //   //       } as unknown as GridOption;
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, true);
  //   //   //     });

  //   //   //     it('should call the DataView "syncGridSelection" method with false as 2nd argument when using BackendServiceApi and "syncGridSelectionWithBackendService" BUT the "dataView.syncGridSelection" grid option is disabled', () => {
  //   //   //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //   //   //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //   //   //       customElement.gridOptions = {
  //   //   //         backendServiceApi: {
  //   //   //           service: mockGraphqlService,
  //   //   //           process: jest.fn(),
  //   //   //         },
  //   //   //         dataView: { syncGridSelection: false, syncGridSelectionWithBackendService: true },
  //   //   //         enableRowSelection: true
  //   //   //       } as unknown as GridOption;
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
  //   //   //     });

  //   //   //     it('should call the DataView "syncGridSelection" method with false as 2nd argument when using BackendServiceApi and "syncGridSelectionWithBackendService" disabled and the "dataView.syncGridSelection" grid option is enabled', () => {
  //   //   //       jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //   //   //       const syncSpy = jest.spyOn(mockDataView, 'syncGridSelection');

  //   //   //       customElement.gridOptions = {
  //   //   //         backendServiceApi: {
  //   //   //           service: mockGraphqlService,
  //   //   //           process: jest.fn(),
  //   //   //         },
  //   //   //         dataView: { syncGridSelection: true, syncGridSelectionWithBackendService: false },
  //   //   //         enableRowSelection: true
  //   //   //       } as unknown as GridOption;
  //   //   //       customElement.initialization(slickEventHandler);

  //   //   //       expect(syncSpy).toHaveBeenCalledWith(customElement.grid, false);
  //   //   //     });
  //   //   //   });

  //   //   //   describe('flag checks', () => {
  //   //   //     beforeEach(() => {
  //   //   //       customElement.gridOptions = gridOptions;
  //   //   //     });

  //   it('should call "showHeaderRow" method with false when its flag is disabled', () => {
  //     const gridSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');

  //     customElement.gridOptions = { showHeaderRow: false } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(gridSpy).toHaveBeenCalledWith(false, false);
  //   });

  //   it('should initialize HeaderGroupingService when "createPreHeaderPanel" grid option is enabled and "enableDraggableGrouping" is disabled', () => {
  //     const spy = jest.spyOn(HeaderGroupingServiceStub, 'init');

  //     customElement.gridOptions = { createPreHeaderPanel: true, enableDraggableGrouping: false } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(spy).toHaveBeenCalledWith(mockGrid, containerService);
  //   });

  //   it('should not initialize HeaderGroupingService when "createPreHeaderPanel" grid option is enabled and "enableDraggableGrouping" is also enabled', () => {
  //     const spy = jest.spyOn(HeaderGroupingServiceStub, 'init');

  //     customElement.gridOptions = { createPreHeaderPanel: true, enableDraggableGrouping: true } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(spy).not.toHaveBeenCalled();
  //   });

  //   it('should create the Row Detail View plugin when "enableRowDetailView" is enabled', () => {
  //     const initSpy = jest.spyOn(mockSlickRowDetailView, 'init');
  //     const createSpy = jest.spyOn(mockSlickRowDetailView, 'create');

  //     customElement.gridOptions = { enableRowDetailView: true } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(customElement.registeredResources.length).toBe(4);
  //     expect(createSpy).toHaveBeenCalled();
  //     expect(initSpy).toHaveBeenCalled();
  //   });

  //   it('should call "translateColumnHeaders" from ExtensionService when "enableTranslate" is set', () => {
  //     const spy = jest.spyOn(extensionServiceStub, 'translateColumnHeaders');

  //     customElement.gridOptions = { enableTranslate: true } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(spy).toHaveBeenCalled();
  //   });

  //   it('should add RxJS resource to all necessary Services when RxJS external resource is registered', () => {
  //     const rxjsMock = new RxJsResourceStub();
  //     const backendUtilitySpy = jest.spyOn(backendUtilityServiceStub, 'addRxJsResource');
  //     const filterServiceSpy = jest.spyOn(filterServiceStub, 'addRxJsResource');
  //     const sortServiceSpy = jest.spyOn(sortServiceStub, 'addRxJsResource');
  //     const paginationServiceSpy = jest.spyOn(paginationServiceStub, 'addRxJsResource');

  //     customElement.gridOptions = { externalResources: [rxjsMock] } as unknown as GridOption;
  //     customElement.registerExternalResources([rxjsMock], true);
  //     customElement.initialization(slickEventHandler);

  //     expect(backendUtilitySpy).toHaveBeenCalled();
  //     expect(filterServiceSpy).toHaveBeenCalled();
  //     expect(sortServiceSpy).toHaveBeenCalled();
  //     expect(paginationServiceSpy).toHaveBeenCalled();
  //     expect(customElement.registeredResources.length).toBe(4); // RxJsResourceStub, GridService, GridStateService, SlickEmptyCompositeEditorComponent
  //     expect(customElement.registeredResources[0] instanceof RxJsResourceStub).toBeTrue();
  //   });

  //   it('should destroy customElement and its DOM element when requested', () => {
  //     const spy = jest.spyOn(customElement, 'emptyGridContainerElm');

  //     customElement.initialization(slickEventHandler);
  //     customElement.dispose(true);

  //     expect(spy).toHaveBeenCalledWith();
  //   });

  //   it('should bind local filter when "enableFiltering" is set', () => {
  //     const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');

  //     customElement.gridOptions = { enableFiltering: true } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
  //   });

  //   it('should bind local sort when "enableSorting" is set', () => {
  //     const bindLocalSpy = jest.spyOn(sortServiceStub, 'bindLocalOnSort');

  //     customElement.gridOptions = { enableSorting: true } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
  //   });

  //   it('should refresh a local grid and change pagination options pagination when a preset for it is defined in grid options', (done) => {
  //     const expectedPageNumber = 2;
  //     const expectedTotalItems = 2;
  //     const refreshSpy = jest.spyOn(customElement, 'refreshGridData');

  //     const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //     customElement.gridOptions = {
  //       enablePagination: true,
  //       presets: { pagination: { pageSize: 2, pageNumber: expectedPageNumber } }
  //     };
  //     customElement.paginationOptionsChanged(undefined as any);
  //     customElement.paginationOptionsChanged({ pageSize: 2, pageNumber: 2, pageSizes: [2, 10, 25, 50], totalItems: 100 });

  //     customElement.initialization(slickEventHandler);
  //     customElement.datasetChanged(mockData, null as any);

  //     setTimeout(() => {
  //       expect(customElement.gridOptions.pagination!.pageSize).toBe(2);
  //       expect(customElement.gridOptions.pagination!.pageNumber).toBe(expectedPageNumber);
  //       expect(customElement.gridOptions.pagination!.totalItems).toBe(expectedTotalItems);
  //       expect(refreshSpy).toHaveBeenCalledWith(mockData);
  //       done();
  //     });
  //   });

  //   it('should refresh a local grid defined and change pagination options pagination when a preset is defined in grid options and total rows is different when Filters are applied', (done) => {
  //     const expectedPageNumber = 3;
  //     const expectedTotalItems = 15;
  //     const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
  //     const paginationSrvSpy = jest.spyOn(paginationServiceStub, 'updateTotalItems');
  //     const getPagingSpy = jest.spyOn(mockDataView, 'getPagingInfo').mockReturnValue({ pageNum: 1, totalRows: expectedTotalItems });

  //     const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //     customElement.gridOptions = {
  //       enableFiltering: true,
  //       enablePagination: true,
  //       presets: { pagination: { pageSize: 10, pageNumber: expectedPageNumber } }
  //     };
  //     customElement.initialization(slickEventHandler);
  //     customElement.paginationOptionsChanged({ pageSize: 10, pageNumber: 2, pageSizes: [10, 25, 50], totalItems: 100 });

  //     customElement.datasetChanged(mockData, null as any);

  //     setTimeout(() => {
  //       expect(getPagingSpy).toHaveBeenCalled();
  //       expect(customElement.gridOptions.pagination!.pageSize).toBe(10);
  //       expect(customElement.gridOptions.pagination!.pageNumber).toBe(expectedPageNumber);
  //       expect(customElement.gridOptions.pagination!.totalItems).toBe(expectedTotalItems);
  //       expect(refreshSpy).toHaveBeenCalledWith(mockData);
  //       expect(paginationSrvSpy).toHaveBeenCalledWith(100, true);
  //       done();
  //     });
  //   });
  // });

  // describe('Backend Service API', () => {
  //   beforeEach(() => {
  //     customElement.gridOptions = {
  //       backendServiceApi: {
  //         onInit: jest.fn(),
  //         service: mockGraphqlService as any,
  //         preProcess: jest.fn(),
  //         postProcess: jest.fn(),
  //         process: jest.fn(),
  //       }
  //     };
  //   });

  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it('should call the "createBackendApiInternalPostProcessCallback" method when Backend Service API is defined with a Graphql Service', () => {
  //     const spy = jest.spyOn(customElement, 'createBackendApiInternalPostProcessCallback');

  //     customElement.initialization(slickEventHandler);

  //     expect(spy).toHaveBeenCalled();
  //     expect(customElement.gridOptions.backendServiceApi!.internalPostProcess).toEqual(expect.any(Function));
  //   });

  //   it('should execute the "internalPostProcess" callback method that was created by "createBackendApiInternalPostProcessCallback" with Pagination', () => {
  //     jest.spyOn(customElement.gridOptions.backendServiceApi!.service, 'getDatasetName').mockReturnValue('users');
  //     const spy = jest.spyOn(customElement, 'refreshGridData');

  //     customElement.initialization(slickEventHandler);
  //     customElement.gridOptions.backendServiceApi!.internalPostProcess!({ data: { users: { nodes: [{ firstName: 'John' }], totalCount: 2 } } } as GraphqlPaginatedResult);

  //     expect(spy).toHaveBeenCalled();
  //     expect(customElement.gridOptions.backendServiceApi!.internalPostProcess).toEqual(expect.any(Function));
  //   });

  //   it('should execute the "internalPostProcess" callback and expect totalItems to be updated in the PaginationService when "refreshGridData" is called on the 2nd time', () => {
  //     jest.spyOn(customElement.gridOptions.backendServiceApi!.service, 'getDatasetName').mockReturnValue('users');
  //     const refreshSpy = jest.spyOn(customElement, 'refreshGridData');
  //     const paginationSpy = jest.spyOn(paginationServiceStub, 'totalItems', 'set');
  //     const mockDataset = [{ firstName: 'John' }, { firstName: 'Jane' }];

  //     customElement.initialization(slickEventHandler);
  //     customElement.gridOptions.backendServiceApi!.internalPostProcess!({ data: { users: { nodes: mockDataset, totalCount: mockDataset.length } } } as GraphqlPaginatedResult);
  //     customElement.refreshGridData(mockDataset, 1);
  //     customElement.refreshGridData(mockDataset, 1);

  //     expect(refreshSpy).toHaveBeenCalledTimes(3);
  //     expect(paginationSpy).toHaveBeenCalledWith(2);
  //     expect(customElement.gridOptions.backendServiceApi!.internalPostProcess).toEqual(expect.any(Function));
  //   });

  //   it('should execute the "internalPostProcess" callback method that was created by "createBackendApiInternalPostProcessCallback" without Pagination (when disabled)', () => {
  //     customElement.gridOptions.enablePagination = false;
  //     jest.spyOn(customElement.gridOptions.backendServiceApi!.service, 'getDatasetName').mockReturnValue('users');
  //     const spy = jest.spyOn(customElement, 'refreshGridData');

  //     customElement.initialization(slickEventHandler);
  //     customElement.gridOptions.backendServiceApi!.internalPostProcess!({ data: { users: [{ firstName: 'John' }] } } as unknown as GraphqlPaginatedResult);

  //     expect(spy).toHaveBeenCalled();
  //     expect(customElement.gridOptions.backendServiceApi!.internalPostProcess).toEqual(expect.any(Function));
  //   });

  //   it('should execute the "internalPostProcess" callback method but return an empty dataset when dataset name does not match "getDatasetName"', () => {
  //     customElement.gridOptions.enablePagination = true;
  //     jest.spyOn(customElement.gridOptions.backendServiceApi!.service, 'getDatasetName').mockReturnValue('users');
  //     const spy = jest.spyOn(customElement, 'refreshGridData');

  //     customElement.initialization(slickEventHandler);
  //     customElement.gridOptions.backendServiceApi!.internalPostProcess!({ data: { notUsers: { nodes: [{ firstName: 'John' }], totalCount: 2 } } } as GraphqlPaginatedResult);

  //     expect(spy).not.toHaveBeenCalled();
  //     expect(customElement.dataset).toEqual([]);
  //   });

  //   it('should invoke "updateFilters" method with filters returned from "getColumnFilters" of the Filter Service when there is no Presets defined', () => {
  //     const mockColumnFilter = { name: { columnId: 'name', columnDef: { id: 'name', field: 'name', filter: { model: Filters.autocompleter } }, operator: 'EQ', searchTerms: ['john'] } };
  //     jest.spyOn(filterServiceStub, 'getColumnFilters').mockReturnValue(mockColumnFilter as unknown as ColumnFilters);
  //     const backendSpy = jest.spyOn(mockGraphqlService, 'updateFilters');

  //     customElement.gridOptions.presets = undefined;
  //     customElement.initialization(slickEventHandler);

  //     expect(backendSpy).toHaveBeenCalledWith(mockColumnFilter, false);
  //   });

  //   it('should override frozen grid options when "pinning" is defined in the "presets" property', () => {
  //     const pinningMock = { frozenBottom: false, frozenColumn: -1, frozenRow: -1 } as CurrentPinning;

  //     customElement.gridOptions.presets = { pinning: pinningMock };
  //     customElement.initialization(slickEventHandler);

  //     expect(customElement.gridOptions).toEqual({ ...customElement.gridOptions, ...pinningMock });
  //   });

  //   it('should call the "updateFilters" method when filters are defined in the "presets" property', () => {
  //     const spy = jest.spyOn(mockGraphqlService, 'updateFilters');
  //     const mockFilters = [{ columnId: 'company', searchTerms: ['xyz'], operator: 'IN' }] as CurrentFilter[];
  //     customElement.gridOptions.presets = { filters: mockFilters };
  //     customElement.initialization(slickEventHandler);

  //     expect(spy).toHaveBeenCalledWith(mockFilters, true);
  //   });

  //   it('should call the "updateSorters" method when sorters are defined in the "presets" property with multi-column sort enabled', () => {
  //     jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //     const spy = jest.spyOn(mockGraphqlService, 'updateSorters');
  //     const mockSorters = [{ columnId: 'firstName', direction: 'asc' }, { columnId: 'lastName', direction: 'desc' }] as CurrentSorter[];
  //     customElement.gridOptions.presets = { sorters: mockSorters };
  //     customElement.initialization(slickEventHandler);

  //     expect(spy).toHaveBeenCalledWith(undefined, mockSorters);
  //   });

  //   it('should call the "updateSorters" method with ONLY 1 column sort when multi-column sort is disabled and user provided multiple sorters in the "presets" property', () => {
  //     jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true as any);
  //     const spy = jest.spyOn(mockGraphqlService, 'updateSorters');
  //     const mockSorters = [{ columnId: 'firstName', direction: 'asc' }, { columnId: 'lastName', direction: 'desc' }] as CurrentSorter[];

  //     customElement.gridOptions.multiColumnSort = false;
  //     customElement.gridOptions.presets = { sorters: mockSorters };
  //     customElement.initialization(slickEventHandler);

  //     expect(spy).toHaveBeenCalledWith(undefined, [mockSorters[0]]);
  //   });

  //   it('should call the "updatePagination" method when filters are defined in the "presets" property', () => {
  //     const spy = jest.spyOn(mockGraphqlService, 'updatePagination');

  //     customElement.gridOptions.presets = { pagination: { pageNumber: 2, pageSize: 20 } };
  //     customElement.initialization(slickEventHandler);

  //     expect(spy).toHaveBeenCalledWith(2, 20);
  //   });

  //   it('should refresh the grid and change pagination options pagination when a preset for it is defined in grid options', () => {
  //     const expectedPageNumber = 3;
  //     const refreshSpy = jest.spyOn(customElement, 'refreshGridData');

  //     const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //     customElement.gridOptions.enablePagination = true;
  //     customElement.gridOptions.presets = { pagination: { pageSize: 10, pageNumber: expectedPageNumber } };
  //     customElement.paginationOptionsChanged({ pageSize: 10, pageNumber: 1, pageSizes: [10, 25, 50], totalItems: 100 });

  //     customElement.initialization(slickEventHandler);
  //     customElement.datasetChanged(mockData, null as any);

  //     expect(customElement.gridOptions.pagination!.pageSize).toBe(10);
  //     expect(customElement.gridOptions.pagination!.pageNumber).toBe(expectedPageNumber);
  //     expect(refreshSpy).toHaveBeenCalledWith(mockData);
  //   });

  //   it('should execute the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options with a Promise and Pagination enabled', (done) => {
  //     const now = new Date();
  //     const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
  //     const processResult = {
  //       data: { users: { nodes: [] }, pageInfo: { hasNextPage: true }, totalCount: 0 },
  //       metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 }
  //     };
  //     const promise = new Promise(resolve => setTimeout(() => resolve(processResult), 1));
  //     const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi as BackendServiceApi, 'process').mockReturnValue(promise);
  //     jest.spyOn(customElement.gridOptions.backendServiceApi!.service, 'buildQuery').mockReturnValue(query);
  //     const backendExecuteSpy = jest.spyOn(backendUtilityServiceStub, 'executeBackendProcessesCallback');

  //     customElement.gridOptions.backendServiceApi!.service.options = { executeProcessCommandOnInit: true };
  //     customElement.initialization(slickEventHandler);

  //     expect(processSpy).toHaveBeenCalled();

  //     setTimeout(() => {
  //       expect(backendExecuteSpy).toHaveBeenCalledWith(expect.toBeDate(), processResult, customElement.gridOptions.backendServiceApi, 0);
  //       done();
  //     }, 5);
  //   });

  //   it('should execute the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options with an Observable and Pagination enabled', (done) => {
  //     const now = new Date();
  //     const rxjsMock = new RxJsResourceStub();
  //     const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
  //     const processResult = {
  //       data: { users: { nodes: [] }, pageInfo: { hasNextPage: true }, totalCount: 0 },
  //       metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 }
  //     };
  //     const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi as BackendServiceApi, 'process').mockReturnValue(of(processResult));
  //     jest.spyOn((customElement.gridOptions as any).backendServiceApi.service, 'buildQuery').mockReturnValue(query);
  //     const backendExecuteSpy = jest.spyOn(backendUtilityServiceStub, 'executeBackendProcessesCallback');

  //     customElement.gridOptions.externalResources = [rxjsMock];
  //     customElement.registerExternalResources([rxjsMock], true);
  //     customElement.gridOptions.backendServiceApi!.service.options = { executeProcessCommandOnInit: true };
  //     customElement.initialization(slickEventHandler);

  //     expect(processSpy).toHaveBeenCalled();

  //     setTimeout(() => {
  //       expect(backendExecuteSpy).toHaveBeenCalledWith(expect.toBeDate(), processResult, customElement.gridOptions.backendServiceApi, 0);
  //       done();
  //     }, 5);
  //   });

  //   it('should execute the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options without Pagination (when disabled)', (done) => {
  //     const now = new Date();
  //     const query = `query { users { id,name,gender,company } }`;
  //     const processResult = {
  //       data: { users: [] },
  //       metrics: { startTime: now, endTime: now, executionTime: 0, totalItemCount: 0 }
  //     };
  //     const promise = new Promise(resolve => setTimeout(() => resolve(processResult), 1));
  //     const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi as BackendServiceApi, 'process').mockReturnValue(promise);
  //     jest.spyOn(customElement.gridOptions.backendServiceApi!.service, 'buildQuery').mockReturnValue(query);
  //     const backendExecuteSpy = jest.spyOn(backendUtilityServiceStub, 'executeBackendProcessesCallback');

  //     customElement.gridOptions.backendServiceApi!.service.options = { executeProcessCommandOnInit: true };
  //     customElement.initialization(slickEventHandler);

  //     expect(processSpy).toHaveBeenCalled();

  //     setTimeout(() => {
  //       expect(backendExecuteSpy).toHaveBeenCalledWith(expect.toBeDate(), processResult, customElement.gridOptions.backendServiceApi, 0);
  //       done();
  //     }, 5);
  //   });

  //   it('should throw an error when the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options', (done) => {
  //     const mockError = { error: '404' };
  //     const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
  //     const promise = new Promise((_resolve, reject) => setTimeout(() => reject(mockError), 1));
  //     const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi as BackendServiceApi, 'process').mockReturnValue(promise);
  //     jest.spyOn(customElement.gridOptions.backendServiceApi!.service, 'buildQuery').mockReturnValue(query);

  //     customElement.gridOptions.backendServiceApi!.service.options = { executeProcessCommandOnInit: true };
  //     customElement.initialization(slickEventHandler);

  //     expect(processSpy).toHaveBeenCalled();

  //     promise.catch((e) => {
  //       expect(e).toEqual(mockError);
  //       done();
  //     });
  //   });
  // });

  // describe('commitEdit method', () => {
  //   beforeEach(() => {
  //     customElement.gridOptions = {
  //       backendServiceApi: {
  //         onInit: jest.fn(),
  //         service: mockGraphqlService as any,
  //         preProcess: jest.fn(),
  //         postProcess: jest.fn(),
  //         process: jest.fn(),
  //       }
  //     };
  //   });

  //   it('should commit current edit when we focus out of current cell', (done) => {
  //     jest.spyOn(mockGrid, 'getOptions').mockReturnValue({ autoCommitEdit: true });
  //     jest.spyOn(mockGrid, 'getActiveCellNode').mockReturnValue(divContainer);
  //     const spy = jest.spyOn(mockGrid, 'getEditorLock');

  //     customElement.bind();
  //     customElement.attached();
  //     customElement.commitEdit(cellDiv);

  //     setTimeout(() => {
  //       expect(spy).toHaveBeenCalled();
  //       done();
  //     });
  //   });

  //   it('should throw an error when the process method on initialization when "executeProcessCommandOnInit" is set as a backend service options from an Observable', (done) => {
  //     const mockError = { error: '404' };
  //     const rxjsMock = new RxJsResourceStub();
  //     const query = `query { users (first:20,offset:0) { totalCount, nodes { id,name,gender,company } } }`;
  //     const processSpy = jest.spyOn(customElement.gridOptions.backendServiceApi as BackendServiceApi, 'process').mockReturnValue(throwError(mockError));
  //     jest.spyOn(customElement.gridOptions.backendServiceApi!.service, 'buildQuery').mockReturnValue(query);
  //     const backendErrorSpy = jest.spyOn(backendUtilityServiceStub, 'onBackendError');

  //     customElement.gridOptions.externalResources = [rxjsMock];
  //     customElement.resetExternalResources();
  //     customElement.registerExternalResources([rxjsMock], true);
  //     customElement.gridOptions.backendServiceApi!.service.options = { executeProcessCommandOnInit: true };
  //     customElement.initialization(slickEventHandler);

  //     expect(processSpy).toHaveBeenCalled();

  //     setTimeout(() => {
  //       expect(backendErrorSpy).toHaveBeenCalledWith(mockError, customElement.gridOptions.backendServiceApi);
  //       done();
  //     });
  //   });
  // });

  // describe('bindDifferentHooks private method called by "attached"', () => {
  //   beforeEach(() => {
  //     customElement.columnDefinitions = [{ id: 'firstName', field: 'firstName' }];
  //   });

  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it('should call multiple translate methods when locale changes', (done) => {
  //     const transAllExtSpy = jest.spyOn(extensionServiceStub, 'translateAllExtensions');
  //     const transGroupingColSpanSpy = jest.spyOn(HeaderGroupingServiceStub, 'translateHeaderGrouping');
  //     const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');

  //     customElement.gridOptions = { enableTranslate: true, createPreHeaderPanel: false, enableDraggableGrouping: false, showCustomFooter: true } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     globalEa.publish('i18n:locale:changed', { language: 'fr' });

  //     setTimeout(() => {
  //       expect(setHeaderRowSpy).not.toHaveBeenCalled();
  //       expect(transGroupingColSpanSpy).not.toHaveBeenCalled();
  //       expect(transAllExtSpy).toHaveBeenCalled();
  //       done();
  //     });
  //   });

  //   it('should call "setHeaderRowVisibility", "translateHeaderGrouping" and other methods when locale changes', (done) => {
  //     customElement.columnDefinitions = [{ id: 'firstName', field: 'firstName', filterable: true }];
  //     const transAllExtSpy = jest.spyOn(extensionServiceStub, 'translateAllExtensions');
  //     const transGroupingColSpanSpy = jest.spyOn(HeaderGroupingServiceStub, 'translateHeaderGrouping');

  //     customElement.gridOptions = { enableTranslate: true, createPreHeaderPanel: true, enableDraggableGrouping: false } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     globalEa.publish('i18n:locale:changed', {});

  //     setTimeout(() => {
  //       expect(transGroupingColSpanSpy).toHaveBeenCalled();
  //       expect(transAllExtSpy).toHaveBeenCalled();
  //       done();
  //     });
  //   });

  //   it('should call "translateHeaderGrouping" translate methods when locale changes and Column Grouping PreHeader are enabled', (done) => {
  //     const groupColSpanSpy = jest.spyOn(HeaderGroupingServiceStub, 'translateHeaderGrouping');

  //     customElement.gridOptions = { enableTranslate: true, createPreHeaderPanel: true, enableDraggableGrouping: false } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     globalEa.publish('i18n:locale:changed', {});

  //     setTimeout(() => {
  //       expect(groupColSpanSpy).toHaveBeenCalled();
  //       done();
  //     });
  //   });

  //   it('should reflect columns in the grid', () => {
  //     const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
  //     const mockCols = [{ id: 'firstName', field: 'firstName' }];
  //     const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue(mockCols);
  //     const setColSpy = jest.spyOn(mockGrid, 'setColumns');

  //     customElement.gridOptions = { presets: { columns: mockColsPresets } } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
  //     expect(setColSpy).toHaveBeenCalledWith(mockCols);
  //   });

  //   it('should reflect columns with an extra checkbox selection column in the grid when "enableCheckboxSelector" is set', () => {
  //     const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
  //     const mockCol = { id: 'firstName', field: 'firstName' };
  //     const mockCols = [{ id: '_checkbox_selector', field: '_checkbox_selector', editor: undefined, internalColumnEditor: {} }, mockCol];
  //     const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue([mockCol]);
  //     const setColSpy = jest.spyOn(mockGrid, 'setColumns');

  //     customElement.columnDefinitions = mockCols;
  //     customElement.columnDefinitionsChanged();
  //     customElement.gridOptions = { ...gridOptions, enableCheckboxSelector: true, presets: { columns: mockColsPresets } } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
  //     expect(setColSpy).toHaveBeenCalledWith(mockCols);
  //   });

  //   it('should reflect columns with an extra row detail column in the grid when "enableRowDetailView" is set', () => {
  //     const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
  //     const mockCol = { id: 'firstName', field: 'firstName' };
  //     const mockCols = [{ id: '_detail_selector', field: '_detail_selector', editor: undefined, internalColumnEditor: {} }, mockCol];
  //     const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue([mockCol]);
  //     const setColSpy = jest.spyOn(mockGrid, 'setColumns');

  //     customElement.columnDefinitions = mockCols;
  //     customElement.columnDefinitionsChanged();
  //     customElement.gridOptions = { ...gridOptions, enableRowDetailView: true, presets: { columns: mockColsPresets } } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
  //     expect(setColSpy).toHaveBeenCalledWith(mockCols);
  //   });

  //   it('should reflect columns with an extra row move column in the grid when "enableRowMoveManager" is set', () => {
  //     const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
  //     const mockCol = { id: 'firstName', field: 'firstName' };
  //     const mockCols = [{ id: '_move', field: '_move', editor: undefined, internalColumnEditor: {} }, mockCol];
  //     const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue([mockCol]);
  //     const setColSpy = jest.spyOn(mockGrid, 'setColumns');

  //     customElement.columnDefinitions = mockCols;
  //     customElement.columnDefinitionsChanged();
  //     customElement.gridOptions = { ...gridOptions, enableRowMoveManager: true, presets: { columns: mockColsPresets } } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
  //     expect(setColSpy).toHaveBeenCalledWith(mockCols);
  //   });

  //   it('should reflect 3 dynamic columns (1-RowMove, 2-RowSelection, 3-RowDetail) when all associated extension flags are enabled', () => {
  //     const mockColsPresets = [{ columnId: 'firstName', width: 100 }];
  //     const mockCol = { id: 'firstName', field: 'firstName' };
  //     const mockCols = [
  //       { id: '_move', field: '_move', editor: undefined, internalColumnEditor: {} },
  //       { id: '_checkbox_selector', field: '_checkbox_selector', editor: undefined, internalColumnEditor: {} },
  //       { id: '_detail_selector', field: '_detail_selector', editor: undefined, internalColumnEditor: {} },
  //       mockCol
  //     ];
  //     const getAssocColSpy = jest.spyOn(gridStateServiceStub, 'getAssociatedGridColumns').mockReturnValue([mockCol]);
  //     const setColSpy = jest.spyOn(mockGrid, 'setColumns');

  //     customElement.columnDefinitions = mockCols;
  //     customElement.columnDefinitionsChanged();
  //     customElement.gridOptions = { ...gridOptions, enableCheckboxSelector: true, enableRowDetailView: true, enableRowMoveManager: true, presets: { columns: mockColsPresets } } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(getAssocColSpy).toHaveBeenCalledWith(mockGrid, mockColsPresets);
  //     expect(setColSpy).toHaveBeenCalledWith(mockCols);
  //   });

  //   it('should execute backend service "init" method when set', () => {
  //     const mockPagination = { pageNumber: 1, pageSizes: [10, 25, 50], pageSize: 10, totalItems: 100 };
  //     const mockGraphqlOptions = { datasetName: 'users', extraQueryArguments: [{ field: 'userId', value: 123 }] } as GraphqlServiceOption;
  //     const bindBackendSpy = jest.spyOn(sortServiceStub, 'bindBackendOnSort');
  //     const mockGraphqlService2 = { ...mockGraphqlService, init: jest.fn() } as unknown as GraphqlService;
  //     const initSpy = jest.spyOn(mockGraphqlService2, 'init');

  //     customElement.gridOptions = {
  //       backendServiceApi: {
  //         service: mockGraphqlService2,
  //         options: mockGraphqlOptions,
  //         preProcess: () => jest.fn(),
  //         process: () => new Promise(resolve => resolve({ data: { users: { nodes: [], totalCount: 100 } } })),
  //       } as GraphqlServiceApi,
  //       pagination: mockPagination,
  //     } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
  //     expect(initSpy).toHaveBeenCalledWith(mockGraphqlOptions, mockPagination, mockGrid, sharedService);
  //   });

  //   it('should call bind backend sorting when "enableSorting" is set', () => {
  //     const bindBackendSpy = jest.spyOn(sortServiceStub, 'bindBackendOnSort');

  //     customElement.gridOptions = {
  //       enableSorting: true,
  //       backendServiceApi: {
  //         service: mockGraphqlService,
  //         preProcess: () => jest.fn(),
  //         process: () => new Promise(resolve => resolve('process resolved')),
  //       }
  //     } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
  //   });

  //   it('should call bind local sorting when "enableSorting" is set and "useLocalSorting" is set as well', () => {
  //     const bindLocalSpy = jest.spyOn(sortServiceStub, 'bindLocalOnSort');

  //     customElement.gridOptions = {
  //       enableSorting: true,
  //       backendServiceApi: {
  //         service: mockGraphqlService,
  //         useLocalSorting: true,
  //         preProcess: () => jest.fn(),
  //         process: () => new Promise(resolve => resolve('process resolved')),
  //       }
  //     } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
  //   });

  //   it('should call bind backend filtering when "enableFiltering" is set', () => {
  //     const initSpy = jest.spyOn(filterServiceStub, 'init');
  //     const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');
  //     const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

  //     customElement.gridOptions = { enableFiltering: true } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(initSpy).toHaveBeenCalledWith(mockGrid);
  //     expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
  //     expect(populateSpy).not.toHaveBeenCalled();
  //   });

  //   it('should call bind local filtering when "enableFiltering" is set and "useLocalFiltering" is set as well', () => {
  //     const bindLocalSpy = jest.spyOn(filterServiceStub, 'bindLocalOnFilter');

  //     customElement.gridOptions = {
  //       enableFiltering: true,
  //       backendServiceApi: {
  //         service: mockGraphqlService,
  //         useLocalFiltering: true,
  //         preProcess: () => jest.fn(),
  //         process: () => new Promise(resolve => resolve('process resolved')),
  //       }
  //     } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(bindLocalSpy).toHaveBeenCalledWith(mockGrid);
  //   });

  //   it('should reflect column filters when "enableFiltering" is set', () => {
  //     const initSpy = jest.spyOn(filterServiceStub, 'init');
  //     const bindBackendSpy = jest.spyOn(filterServiceStub, 'bindBackendOnFilter');
  //     const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

  //     customElement.gridOptions = {
  //       enableFiltering: true,
  //       backendServiceApi: {
  //         service: mockGraphqlService,
  //         preProcess: () => jest.fn(),
  //         process: () => new Promise(resolve => resolve('process resolved')),
  //       }
  //     } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(initSpy).toHaveBeenCalledWith(mockGrid);
  //     expect(bindBackendSpy).toHaveBeenCalledWith(mockGrid);
  //     expect(populateSpy).not.toHaveBeenCalled();
  //   });

  //   it('should reflect column filters and populate filter search terms when "enableFiltering" is set and preset filters are defined', () => {
  //     const mockPresetFilters = [{ columnId: 'firstName', operator: 'IN', searchTerms: ['John', 'Jane'] }] as CurrentFilter[];
  //     const initSpy = jest.spyOn(filterServiceStub, 'init');
  //     const populateSpy = jest.spyOn(filterServiceStub, 'populateColumnFilterSearchTermPresets');

  //     customElement.gridOptions = { enableFiltering: true, presets: { filters: mockPresetFilters } } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);

  //     expect(initSpy).toHaveBeenCalledWith(mockGrid);
  //     expect(populateSpy).toHaveBeenCalledWith(mockPresetFilters);
  //   });

  //   it('should return null when "getItemMetadata" is called without a colspan callback defined', () => {
  //     const itemSpy = jest.spyOn(mockDataView, 'getItem');

  //     customElement.gridOptions = { colspanCallback: undefined } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);
  //     mockDataView.getItemMetadata(2);

  //     expect(itemSpy).not.toHaveBeenCalled();
  //   });

  //   it('should execute colspan callback when defined in the grid options and "getItemMetadata" is called', () => {
  //     const mockCallback = jest.fn();
  //     const mockItem = { firstName: 'John', lastName: 'Doe' };
  //     const itemSpy = jest.spyOn(mockDataView, 'getItem').mockReturnValue(mockItem);

  //     customElement.gridOptions = { colspanCallback: mockCallback } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);
  //     mockDataView.getItemMetadata(2);

  //     expect(itemSpy).toHaveBeenCalledWith(2);
  //     expect(mockCallback).toHaveBeenCalledWith(mockItem);
  //   });

  //   it('should update each row and re-render the grid when filtering and DataView "onRowsChanged" event is triggered', () => {
  //     const renderSpy = jest.spyOn(mockGrid, 'render');
  //     const updateRowSpy = jest.spyOn(mockGrid, 'updateRow');

  //     customElement.gridOptions = { enableFiltering: true };
  //     customElement.initialization(slickEventHandler);
  //     mockDataView.onRowsChanged.notify({ rows: [1, 2, 3] });

  //     expect(customElement.eventHandler).toEqual(slickEventHandler);
  //     expect(renderSpy).toHaveBeenCalled();
  //     expect(updateRowSpy).toHaveBeenCalledTimes(3);
  //   });

  //   it('should call "dispatchCustomEvent" when event gets trigger', () => {
  //     // const pubSubSpy = jest.spyOn(eventPubSubService, 'publish');
  //     const dispatchSpy = jest.spyOn(divContainer, 'dispatchEvent');
  //     const callback = jest.fn();

  //     customElement.gridOptions = { ...gridOptions, enableFiltering: true };
  //     customElement.bind();
  //     customElement.initialization(slickEventHandler);
  //     customElement.eventHandler.subscribe(mockEventPubSub, callback);
  //     mockGrid.onClick.notify({ rows: [1, 2, 3] });

  //     // expect(pubSubSpy).toHaveBeenCalledWith(divContainer, 'onClick', { args: { rows: [1, 2, 3] } }, '');
  //     expect(dispatchSpy).toHaveBeenCalledWith(new CustomEvent('onClick', { bubbles: true, detail: { args: { rows: [1, 2, 3] } } }));
  //   });
  // });

  // describe('setHeaderRowVisibility grid method', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //     customElement.gridOptions = gridOptions;
  //   });

  //   it('should show the header row when "showHeaderRow" is called with argument True', () => {
  //     const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');
  //     const setColumnSpy = jest.spyOn(mockGrid, 'setColumns');

  //     customElement.attached();
  //     customElement.initialization(slickEventHandler);
  //     customElement.showHeaderRow(true);

  //     expect(setHeaderRowSpy).toHaveBeenCalledWith(true, false);
  //     expect(setColumnSpy).toHaveBeenCalledTimes(1);
  //   });

  //   it('should show the header row when "showHeaderRow" is called with argument False', () => {
  //     const setHeaderRowSpy = jest.spyOn(mockGrid, 'setHeaderRowVisibility');
  //     const setColumnSpy = jest.spyOn(mockGrid, 'setColumns');

  //     customElement.attached();
  //     customElement.initialization(slickEventHandler);
  //     customElement.showHeaderRow(false);

  //     expect(setHeaderRowSpy).toHaveBeenCalledWith(false, false);
  //     expect(setColumnSpy).not.toHaveBeenCalled();
  //   });
  // });

  // describe('pagination events', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //     customElement.gridOptions = gridOptions;
  //   });

  //   it('should call trigger a gridStage change event when pagination change is triggered', () => {
  //     const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
  //     const pubSubSpy = jest.spyOn(eventPubSubService, 'publish');
  //     jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

  //     customElement.initialization(slickEventHandler);
  //     customElement.paginationChanged(mockPagination);

  //     expect(pubSubSpy).toHaveBeenCalledWith('onGridStateChanged', {
  //       change: { newValues: mockPagination, type: GridStateType.pagination },
  //       gridState: { columns: [], pagination: mockPagination }
  //     });
  //   });

  //   it('should call trigger a gridStage change event when "onPaginationChanged" from the Pagination Service is triggered', () => {
  //     const pubSubSpy = jest.spyOn(eventPubSubService, 'publish');
  //     const mockPagination = { pageNumber: 2, pageSize: 20 } as CurrentPagination;
  //     const mockServicePagination = {
  //       ...mockPagination,
  //       dataFrom: 5,
  //       dataTo: 10,
  //       pageCount: 1,
  //       pageSizes: [5, 10, 15, 20],
  //     } as ServicePagination;
  //     jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

  //     customElement.gridOptions.enablePagination = true;
  //     customElement.initialization(slickEventHandler);
  //     customElement.refreshGridData([{ firstName: 'John', lastName: 'Doe' }]);
  //     eventPubSubService.publish('onPaginationChanged', mockServicePagination);

  //     expect(pubSubSpy).toHaveBeenCalledWith('onGridStateChanged', {
  //       change: { newValues: mockPagination, type: GridStateType.pagination },
  //       gridState: { columns: [], pagination: mockPagination }
  //     });
  //   });

  //   it('should trigger a gridStage change and reset selected rows when pagination change is triggered and "enableRowSelection" is set', () => {
  //     const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
  //     const pubSubSpy = jest.spyOn(eventPubSubService, 'publish');
  //     const setRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
  //     jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

  //     customElement.gridOptions = {
  //       enableRowSelection: true,
  //       backendServiceApi: { service: mockGraphqlService as any }
  //     } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);
  //     customElement.paginationChanged(mockPagination);

  //     expect(setRowSpy).toHaveBeenCalledWith([]);
  //     expect(pubSubSpy).toHaveBeenCalledWith('onGridStateChanged', {
  //       change: { newValues: mockPagination, type: GridStateType.pagination },
  //       gridState: { columns: [], pagination: mockPagination }
  //     });
  //   });

  //   it('should call trigger a gridStage change and reset selected rows when pagination change is triggered and "enableCheckboxSelector" is set', () => {
  //     const mockPagination = { pageNumber: 2, pageSize: 20 } as Pagination;
  //     const pubSubSpy = jest.spyOn(eventPubSubService, 'publish');
  //     const setRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
  //     jest.spyOn(gridStateServiceStub, 'getCurrentGridState').mockReturnValue({ columns: [], pagination: mockPagination } as GridState);

  //     customElement.gridOptions = {
  //       enableCheckboxSelector: true,
  //       backendServiceApi: { service: mockGraphqlService as any }
  //     } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);
  //     customElement.paginationChanged(mockPagination);

  //     expect(setRowSpy).toHaveBeenCalledWith([]);
  //     expect(pubSubSpy).toHaveBeenCalledWith('onGridStateChanged', {
  //       change: { newValues: mockPagination, type: GridStateType.pagination },
  //       gridState: { columns: [], pagination: mockPagination }
  //     });
  //   });
  // });

  // describe('Empty Warning Message', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it('should display an Empty Warning Message when "enableEmptyDataWarningMessage" is enabled and the dataset is empty', (done) => {
  //     const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];
  //     const mockGridOptions = { enableTranslate: true, enableEmptyDataWarningMessage: true, };
  //     jest.spyOn(mockGrid, 'getOptions').mockReturnValue(mockGridOptions);
  //     jest.spyOn(mockGrid, 'getGridPosition').mockReturnValue({ top: 10, left: 20 });

  //     customElement.gridOptions = mockGridOptions;
  //     customElement.initialization(slickEventHandler);
  //     const slickEmptyWarning = customElement.registeredResources.find(resource => resource instanceof SlickEmptyWarningComponent);
  //     const emptySpy = jest.spyOn(slickEmptyWarning as SlickEmptyWarningComponent, 'showEmptyDataMessage');
  //     customElement.columnDefinitions = mockColDefs;
  //     customElement.refreshGridData([]);
  //     mockDataView.onRowCountChanged.notify({ current: 0, previous: 0, dataView: mockDataView, itemCount: 0, callingOnRowsChanged: false });

  //     setTimeout(() => {
  //       expect(customElement.columnDefinitions).toEqual(mockColDefs);
  //       expect(customElement.gridOptions.enableEmptyDataWarningMessage).toBeTrue();
  //       expect(slickEmptyWarning).toBeTruthy();
  //       expect(emptySpy).toHaveBeenCalledTimes(2);
  //       done();
  //     });
  //   });
  // });

  // describe('resizeColumnsByCellContent method', () => {
  //   it('should call "resizeColumnsByCellContent" when the DataView "onSetItemsCalled" event is triggered and "enableAutoResizeColumnsByCellContent" is set', () => {
  //     const resizeContentSpy = jest.spyOn(resizerServiceStub, 'resizeColumnsByCellContent');
  //     jest.spyOn(mockDataView, 'getLength').mockReturnValue(1);

  //     customElement.gridOptions = { enablePagination: false, resizeByContentOnlyOnFirstLoad: false, showCustomFooter: true, autoFitColumnsOnFirstLoad: false, enableAutoSizeColumns: false, enableAutoResizeColumnsByCellContent: true };
  //     customElement.initialization(slickEventHandler);
  //     mockDataView.onSetItemsCalled.notify({ idProperty: 'id', itemCount: 1 });

  //     expect(resizeContentSpy).toHaveBeenCalledWith(true);
  //   });

  //   it('should call "resizeColumnsByCellContent" when the DataView "onSetItemsCalled" event is triggered and "enableAutoResizeColumnsByCellContent" and "resizeColumnsByCellContent" are both set', (done) => {
  //     const resizeContentSpy = jest.spyOn(resizerServiceStub, 'resizeColumnsByCellContent');
  //     jest.spyOn(mockDataView, 'getLength').mockReturnValue(1);

  //     customElement.gridOptions = { enablePagination: false, resizeByContentOnlyOnFirstLoad: true, showCustomFooter: true, autoFitColumnsOnFirstLoad: false, enableAutoSizeColumns: false, enableAutoResizeColumnsByCellContent: true };
  //     customElement.initialization(slickEventHandler);
  //     mockDataView.onSetItemsCalled.notify({ idProperty: 'id', itemCount: 1 });

  //     setTimeout(() => {
  //       expect(resizeContentSpy).toHaveBeenCalledWith(false);
  //       done();
  //     }, 10);
  //   });
  // });

  // describe('Custom Footer', () => {
  //   afterEach(() => {
  //     jest.clearAllMocks();
  //   });

  //   it('should have a Custom Footer when "showCustomFooter" is enabled and there are no Pagination used', (done) => {
  //     const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];
  //     const mockGridOptions = { enableTranslate: true, showCustomFooter: true, customFooterOptions: { hideRowSelectionCount: false, } } as GridOption;
  //     jest.spyOn(mockGrid, 'getOptions').mockReturnValue(mockGridOptions);

  //     translaterService.use('fr');
  //     customElement.gridOptions = mockGridOptions;
  //     customElement.initialization(slickEventHandler);
  //     customElement.columnDefinitions = mockColDefs;

  //     setTimeout(() => {
  //       expect(customElement.columnDefinitions).toEqual(mockColDefs);
  //       expect(customElement.gridOptions.showCustomFooter).toBeTrue();
  //       expect(customElement.gridOptions.customFooterOptions).toEqual({
  //         dateFormat: 'YYYY-MM-DD, hh:mm a',
  //         hideRowSelectionCount: false,
  //         hideLastUpdateTimestamp: true,
  //         hideTotalItemCount: false,
  //         footerHeight: 25,
  //         leftContainerClass: 'col-xs-12 col-sm-5',
  //         metricSeparator: '|',
  //         metricTexts: {
  //           items: 'éléments',
  //           itemsKey: 'ITEMS',
  //           itemsSelected: 'éléments sélectionnés',
  //           itemsSelectedKey: 'ITEMS_SELECTED',
  //           of: 'de',
  //           ofKey: 'OF',
  //         },
  //         rightContainerClass: 'col-xs-6 col-sm-7',
  //       });
  //       done();
  //     });
  //   });

  //   it('should have a Custom Footer and custom texts when "showCustomFooter" is enabled with different metricTexts defined', (done) => {
  //     const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

  //     customElement.gridOptions = {
  //       enableTranslate: false,
  //       showCustomFooter: true,
  //       customFooterOptions: {
  //         metricTexts: {
  //           items: 'some items',
  //           lastUpdate: 'some last update',
  //           of: 'some of'
  //         }
  //       }
  //     };
  //     customElement.columnDefinitions = mockColDefs;
  //     customElement.initialization(slickEventHandler);
  //     customElement.columnDefinitionsChanged();

  //     setTimeout(() => {
  //       expect(customElement.columnDefinitions).toEqual(mockColDefs);
  //       expect(customElement.gridOptions.showCustomFooter).toBeTrue();
  //       expect(customElement.gridOptions.customFooterOptions).toEqual({
  //         dateFormat: 'YYYY-MM-DD, hh:mm a',
  //         hideRowSelectionCount: false,
  //         hideLastUpdateTimestamp: true,
  //         hideTotalItemCount: false,
  //         footerHeight: 25,
  //         leftContainerClass: 'col-xs-12 col-sm-5',
  //         metricSeparator: '|',
  //         metricTexts: {
  //           items: 'some items',
  //           itemsKey: 'ITEMS',
  //           itemsSelected: 'items selected',
  //           itemsSelectedKey: 'ITEMS_SELECTED',
  //           lastUpdate: 'some last update',
  //           of: 'some of',
  //           ofKey: 'OF',
  //         },
  //         rightContainerClass: 'col-xs-6 col-sm-7',
  //       });
  //       done();
  //     });
  //   });

  //   it('should NOT have a Custom Footer when "showCustomFooter" is enabled WITH Pagination in use', (done) => {
  //     const mockColDefs = [{ id: 'name', field: 'name', editor: undefined, internalColumnEditor: {} }];

  //     customElement.gridOptions = { enablePagination: true, showCustomFooter: true };
  //     customElement.columnDefinitions = mockColDefs;
  //     customElement.initialization(slickEventHandler);
  //     customElement.columnDefinitionsChanged();

  //     setTimeout(() => {
  //       expect(customElement.columnDefinitions).toEqual(mockColDefs);
  //       expect(customElement.slickFooter).toBeFalsy();
  //       done();
  //     });
  //   });

  //   it('should have custom footer with metrics when the DataView "onRowCountChanged" event is triggered', () => {
  //     const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //     const invalidateSpy = jest.spyOn(mockGrid, 'invalidate');
  //     const expectation = {
  //       startTime: expect.toBeDate(),
  //       endTime: expect.toBeDate(),
  //       itemCount: 2,
  //       totalItemCount: 2
  //     };
  //     jest.spyOn(mockDataView, 'getItemCount').mockReturnValue(mockData.length);
  //     jest.spyOn(mockDataView, 'getFilteredItemCount').mockReturnValue(mockData.length);

  //     customElement.gridOptions = { enablePagination: false, showCustomFooter: true };
  //     customElement.initialization(slickEventHandler);
  //     const footerSpy = jest.spyOn(customElement.slickFooter!, 'metrics', 'set');
  //     mockDataView.onRowCountChanged.notify({ current: 2, previous: 0, dataView: mockDataView, itemCount: 2, callingOnRowsChanged: false });

  //     expect(invalidateSpy).toHaveBeenCalled();
  //     expect(customElement.metrics).toEqual(expectation);
  //     expect(footerSpy).toHaveBeenCalledWith(expectation);
  //   });

  //   it('should have custom footer with metrics when the DataView "onSetItemsCalled" event is triggered', () => {
  //     const expectation = {
  //       startTime: expect.toBeDate(),
  //       endTime: expect.toBeDate(),
  //       itemCount: 0,
  //       totalItemCount: 0
  //     };
  //     jest.spyOn(mockDataView, 'getFilteredItemCount').mockReturnValue(0);

  //     customElement.gridOptions = { enablePagination: false, showCustomFooter: true };
  //     customElement.initialization(slickEventHandler);
  //     mockDataView.onSetItemsCalled.notify({ idProperty: 'id', itemCount: 0 });

  //     expect(customElement.metrics).toEqual(expectation);
  //   });
  // });

  // describe('loadRowSelectionPresetWhenExists method', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //     sharedService.slickGrid = mockGrid as unknown as SlickGrid;
  //     customElement.gridOptions = gridOptions;
  //   });

  //   it('should call the "mapIdsToRows" from the DataView then "setSelectedRows" from the Grid when there are row selection presets with "dataContextIds" array set', (done) => {
  //     const selectedGridRows = [2];
  //     const selectedRowIds = [99];
  //     const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //     const dataviewSpy = jest.spyOn(mockDataView, 'mapIdsToRows').mockReturnValue(selectedGridRows);
  //     const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
  //     jest.spyOn(mockDataView, 'getLength').mockReturnValue(0);
  //     jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);

  //     customElement.gridOptions.enableCheckboxSelector = true;
  //     customElement.gridOptions.presets = { rowSelection: { dataContextIds: selectedRowIds } };
  //     customElement.isDatasetInitialized = false;
  //     customElement.initialization(slickEventHandler);
  //     customElement.datasetChanged(mockData, null as any);

  //     setTimeout(() => {
  //       expect(dataviewSpy).toHaveBeenCalled();
  //       expect(selectRowSpy).toHaveBeenCalledWith(selectedGridRows);
  //       done();
  //     });
  //   });

  //   it('should call the "setSelectedRows" from the Grid when there are row selection presets with "dataContextIds" array set', (done) => {
  //     const selectedGridRows = [22];
  //     const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //     const selectRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
  //     jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //     jest.spyOn(mockDataView, 'getLength').mockReturnValue(mockData.length);

  //     customElement.gridOptions.enableRowSelection = true;
  //     customElement.gridOptions.presets = { rowSelection: { gridRowIndexes: selectedGridRows } };
  //     customElement.datasetChanged(mockData, null as any);
  //     customElement.isDatasetInitialized = false; // it won't call the preset unless we reset this flag
  //     customElement.initialization(slickEventHandler);

  //     setTimeout(() => {
  //       expect(customElement.isDatasetInitialized).toBe(true);
  //       expect(selectRowSpy).toHaveBeenCalledWith(selectedGridRows);
  //       done();
  //     });
  //   });

  //   it('should call the "setSelectedRows" and "setSelectedIds" when the Grid has Local Pagination and there are row selection presets with "dataContextIds" array set', () => {
  //     const selectedGridRows = [22];
  //     const mockData = [{ firstName: 'John', lastName: 'Doe' }, { firstName: 'Jane', lastName: 'Smith' }];
  //     const gridSelectedRowSpy = jest.spyOn(mockGrid, 'setSelectedRows');
  //     const dvSetSelectedIdSpy = jest.spyOn(mockDataView, 'setSelectedIds');
  //     jest.spyOn(mockGrid, 'getSelectionModel').mockReturnValue(true);
  //     jest.spyOn(mockDataView, 'getLength').mockReturnValue(mockData.length);

  //     customElement.gridOptions = {
  //       enableRowSelection: true,
  //       enablePagination: true,
  //       backendServiceApi: undefined,
  //       presets: { rowSelection: { dataContextIds: selectedGridRows } }
  //     };
  //     customElement.datasetChanged(mockData, null as any);
  //     customElement.isDatasetInitialized = false; // it won't call the preset unless we reset this flag
  //     customElement.initialization(slickEventHandler);

  //     expect(customElement.isDatasetInitialized).toBe(true);
  //     expect(gridSelectedRowSpy).toHaveBeenCalledWith([2]);
  //     expect(dvSetSelectedIdSpy).toHaveBeenCalledWith([22], { applyRowSelectionToGrid: true, isRowBeingAdded: true, shouldTriggerEvent: false });
  //   });
  // });

  // describe('onPaginationVisibilityChanged event', () => {
  //   beforeEach(() => {
  //     jest.clearAllMocks();
  //     sharedService.slickGrid = mockGrid as unknown as SlickGrid;
  //     customElement.gridOptions = gridOptions;
  //   });

  //   it('should change "showPagination" flag when "onPaginationVisibilityChanged" from the Pagination Service is triggered', (done) => {
  //     customElement.gridOptions.enablePagination = true;
  //     customElement.gridOptions.backendServiceApi = null as any;

  //     customElement.initialization(slickEventHandler);
  //     customElement.refreshGridData([{ firstName: 'John', lastName: 'Doe' }]);
  //     eventPubSubService.publish('onPaginationVisibilityChanged', { visible: false });

  //     setTimeout(() => {
  //       expect(customElement.showPagination).toBeFalsy();
  //       done();
  //     });
  //   });

  //   it('should call the backend service API to refresh the dataset', (done) => {
  //     const backendRefreshSpy = jest.spyOn(backendUtilityServiceStub, 'refreshBackendDataset');
  //     customElement.gridOptions.enablePagination = true;
  //     customElement.gridOptions.backendServiceApi = {
  //       service: mockGraphqlService as unknown as BackendService,
  //       process: jest.fn(),
  //     };

  //     customElement.initialization(slickEventHandler);
  //     customElement.refreshGridData([{ firstName: 'John', lastName: 'Doe' }]);
  //     eventPubSubService.publish('onPaginationVisibilityChanged', { visible: false });

  //     setTimeout(() => {
  //       expect(backendRefreshSpy).toHaveBeenCalled();
  //       expect(customElement.showPagination).toBeFalsy();
  //       done();
  //     });
  //   });
  // });

  // describe('Tree Data View', () => {
  //   afterEach(() => {
  //     customElement.dispose();
  //     jest.clearAllMocks();
  //   });

  //   it('should change flat dataset and expect "convertFlatParentChildToTreeDatasetAndSort" being called with other methods', () => {
  //     const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
  //     const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
  //     const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
  //     const treeConvertAndSortSpy = jest.spyOn(treeDataServiceStub, 'convertFlatParentChildToTreeDatasetAndSort').mockReturnValue({ hierarchical: mockHierarchical as any[], flat: mockFlatDataset as any[] });
  //     const refreshTreeSpy = jest.spyOn(filterServiceStub, 'refreshTreeDataFilters');

  //     customElement.gridOptions = {
  //       enableTreeData: true, treeDataOptions: {
  //         columnId: 'file', parentPropName: 'parentId', childrenPropName: 'files',
  //         initialSort: { columndId: 'file', direction: 'ASC' }
  //       }
  //     } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);
  //     customElement.dataset = mockFlatDataset;
  //     customElement.datasetChanged(mockFlatDataset, []);

  //     expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
  //     expect(refreshTreeSpy).toHaveBeenCalled();
  //     expect(treeConvertAndSortSpy).toHaveBeenCalled();
  //   });

  //   it('should change flat dataset and expect "convertFlatParentChildToTreeDataset" being called (without sorting) and other methods as well', () => {
  //     const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
  //     const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
  //     const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
  //     const treeConvertSpy = jest.spyOn(treeDataServiceStub, 'convertFlatParentChildToTreeDataset').mockReturnValue(mockHierarchical as any[]);
  //     const refreshTreeSpy = jest.spyOn(filterServiceStub, 'refreshTreeDataFilters');

  //     customElement.gridOptions = {
  //       enableTreeData: true, treeDataOptions: {
  //         columnId: 'file', parentPropName: 'parentId', childrenPropName: 'files'
  //       }
  //     } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);
  //     customElement.dataset = mockFlatDataset;
  //     customElement.datasetChanged(mockFlatDataset, []);

  //     expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
  //     expect(refreshTreeSpy).toHaveBeenCalled();
  //     expect(treeConvertSpy).toHaveBeenCalled();
  //   });

  //   it('should change hierarchical dataset and expect processTreeDataInitialSort being called with other methods', (done) => {
  //     const mockHierarchical = [{ file: 'documents', files: [{ file: 'vacation.txt' }] }];
  //     const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
  //     const clearFilterSpy = jest.spyOn(filterServiceStub, 'clearFilters');
  //     const refreshFilterSpy = jest.spyOn(filterServiceStub, 'refreshTreeDataFilters');
  //     const setItemsSpy = jest.spyOn(mockDataView, 'setItems');
  //     const processSpy = jest.spyOn(sortServiceStub, 'processTreeDataInitialSort');

  //     customElement.gridOptions = { enableTreeData: true, treeDataOptions: { columnId: 'file' } } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);
  //     customElement.datasetHierarchical = mockHierarchical;
  //     customElement.datasetHierarchicalChanged(mockHierarchical);

  //     expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
  //     expect(clearFilterSpy).toHaveBeenCalled();
  //     expect(processSpy).toHaveBeenCalled();
  //     expect(setItemsSpy).toHaveBeenCalledWith([], 'id');
  //     setTimeout(() => {
  //       expect(refreshFilterSpy).toHaveBeenCalled();
  //       done();
  //     });
  //   });

  //   it('should preset hierarchical dataset before the initialization and expect sortHierarchicalDataset to be called', () => {
  //     const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
  //     const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
  //     const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
  //     const clearFilterSpy = jest.spyOn(filterServiceStub, 'clearFilters');
  //     const setItemsSpy = jest.spyOn(mockDataView, 'setItems');
  //     const processSpy = jest.spyOn(sortServiceStub, 'processTreeDataInitialSort');
  //     const sortHierarchicalSpy = jest.spyOn(treeDataServiceStub, 'sortHierarchicalDataset').mockReturnValue({ hierarchical: mockHierarchical as any[], flat: mockFlatDataset as any[] });

  //     customElement.dispose();
  //     customElement.gridOptions = { enableTreeData: true, treeDataOptions: { columnId: 'file', initialSort: { columndId: 'file', direction: 'ASC' } } } as unknown as GridOption;
  //     customElement.datasetHierarchical = mockHierarchical;
  //     customElement.datasetHierarchicalChanged(mockHierarchical);
  //     customElement.isDatasetHierarchicalInitialized = true;
  //     customElement.initialization(slickEventHandler);

  //     expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
  //     expect(clearFilterSpy).toHaveBeenCalled();
  //     expect(processSpy).not.toHaveBeenCalled();
  //     expect(setItemsSpy).toHaveBeenCalledWith(mockFlatDataset, 'id');
  //     expect(sortHierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
  //   });

  //   it('should expect "refreshTreeDataFilters" method to be called when our flat dataset was already set and it just got changed a 2nd time', () => {
  //     const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'vacation.txt', parentId: 0 }];
  //     const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
  //     const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
  //     jest.spyOn(treeDataServiceStub, 'convertFlatParentChildToTreeDatasetAndSort').mockReturnValue({ hierarchical: mockHierarchical as any[], flat: mockFlatDataset as any[] });
  //     const refreshTreeSpy = jest.spyOn(filterServiceStub, 'refreshTreeDataFilters');

  //     customElement.dataset = [{ id: 0, file: 'documents' }];
  //     customElement.gridOptions = { enableTreeData: true, treeDataOptions: { columnId: 'file', parentPropName: 'parentId', childrenPropName: 'files', initialSort: { columndId: 'file', direction: 'ASC' } } } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);
  //     customElement.dataset = mockFlatDataset;
  //     customElement.datasetChanged(mockFlatDataset, []);

  //     expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
  //     expect(refreshTreeSpy).toHaveBeenCalled();
  //   });

  //   it('should also expect "refreshTreeDataFilters" method to be called even when the dataset length is the same but still has different properties (e.g. different filename)', () => {
  //     const mockFlatDataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'new-vacation.txt', parentId: 0 }];
  //     const mockHierarchical = [{ id: 0, file: 'documents', files: [{ id: 1, file: 'vacation.txt' }] }];
  //     const hierarchicalSpy = jest.spyOn(SharedService.prototype, 'hierarchicalDataset', 'set');
  //     jest.spyOn(treeDataServiceStub, 'convertFlatParentChildToTreeDatasetAndSort').mockReturnValue({ hierarchical: mockHierarchical as any[], flat: mockFlatDataset as any[] });
  //     const refreshTreeSpy = jest.spyOn(filterServiceStub, 'refreshTreeDataFilters');

  //     customElement.dataset = [{ id: 0, file: 'documents' }, { id: 1, file: 'old-vacation.txt', parentId: 0 }];
  //     customElement.gridOptions = { enableTreeData: true, treeDataOptions: { columnId: 'file', parentPropName: 'parentId', childrenPropName: 'files', initialSort: { columndId: 'file', direction: 'ASC' } } } as unknown as GridOption;
  //     customElement.initialization(slickEventHandler);
  //     customElement.dataset = mockFlatDataset;
  //     customElement.datasetChanged(mockFlatDataset, []);

  //     expect(hierarchicalSpy).toHaveBeenCalledWith(mockHierarchical);
  //     expect(refreshTreeSpy).toHaveBeenCalled();
  //   });
  // });
});
