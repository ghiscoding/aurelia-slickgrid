import { Column, ExtensionUtility, SharedService, SlickDataView, SlickGrid, SlickNamespace } from '@slickgrid-universal/common';
import { EventAggregator } from 'aurelia-event-aggregator';
import { GridOption } from '../../models/gridOption.interface';
import { RowDetailViewExtension } from '../rowDetailViewExtension';
import { AureliaUtilService, PubSubService, TranslaterService } from '../../services';
import { RowDetailView } from '../../models';
import { HttpStub } from '../../../../test/httpClientStub';

declare const Slick: SlickNamespace;
const ROW_DETAIL_CONTAINER_PREFIX = 'container_';
const PRELOAD_CONTAINER_PREFIX = 'container_loading';

const aureliaUtilServiceStub = {
  createAureliaViewModelAddToSlot: jest.fn(),
  createAureliaViewAddToSlot: jest.fn(),
} as unknown as AureliaUtilService;

const dataViewStub = {
  refresh: jest.fn(),
} as unknown as SlickDataView;

const gridStub = {
  getOptions: jest.fn(),
  getSelectionModel: jest.fn(),
  registerPlugin: jest.fn(),
  setSelectionModel: jest.fn(),
  onColumnsReordered: new Slick.Event(),
  onSort: new Slick.Event(),
} as unknown as SlickGrid;

const translaterServiceStub = {
  getCurrentLanguage: jest.fn(),
  use: jest.fn(),
  setup: jest.fn(),
  translate: jest.fn(),
} as unknown as TranslaterService;

const mockAddon = jest.fn().mockImplementation(() => ({
  init: jest.fn(),
  destroy: jest.fn(),
  getColumnDefinition: jest.fn(),
  onAsyncResponse: new Slick.Event(),
  onAsyncEndUpdate: new Slick.Event(),
  onAfterRowDetailToggle: new Slick.Event(),
  onBeforeRowDetailToggle: new Slick.Event(),
  onRowOutOfViewportRange: new Slick.Event(),
  onRowBackToViewportRange: new Slick.Event()
}));

const mockSelectionModel = jest.fn().mockImplementation(() => ({
  init: jest.fn(),
  destroy: jest.fn()
}));

jest.mock('slickgrid/plugins/slick.rowdetailview', () => mockAddon);
Slick.Plugins = {
  RowDetailView: mockAddon
} as any;

jest.mock('slickgrid/plugins/slick.rowselectionmodel', () => mockSelectionModel);
Slick.RowSelectionModel = mockSelectionModel;

describe('rowDetailViewExtension', () => {
  let pluginEa: EventAggregator;
  let pubSubService: PubSubService;
  let extensionUtility: ExtensionUtility;
  let extension: RowDetailViewExtension;
  let sharedService: SharedService;

  const div = document.createElement('div');
  div.innerHTML = `<div class="container_loading"></div><div class="container_field1"></div>`;
  document.body.appendChild(div);

  const gridOptionsMock = {
    enableRowDetailView: true,
    rowDetailView: {
      cssClass: 'detail-view-toggle',
      panelRows: 1,
      keyPrefix: '__',
      useRowClick: true,
      useSimpleViewportCalc: true,
      saveDetailViewOnScroll: false,
      process: () => new Promise((resolve) => resolve('process resolved')),
      viewComponent: null,
      viewModel: '',
      onExtensionRegistered: jest.fn(),
      onAsyncResponse: () => { },
      onAsyncEndUpdate: () => { },
      onAfterRowDetailToggle: () => { },
      onBeforeRowDetailToggle: () => { },
      onRowOutOfViewportRange: () => { },
      onRowBackToViewportRange: () => { },
    }
  } as GridOption;

  beforeEach(() => {
    pluginEa = new EventAggregator();
    pubSubService = new PubSubService(pluginEa);
    sharedService = new SharedService();
    extensionUtility = new ExtensionUtility(sharedService, translaterServiceStub);
    extension = new RowDetailViewExtension(aureliaUtilServiceStub, pubSubService, extensionUtility, sharedService);
  });

  it('should return null after calling "create" method when either the column definitions or the grid options is missing', () => {
    const output = extension.create([] as Column[], null as any);
    expect(output).toBeNull();
  });

  it('should return null after calling "register" method when either the grid object or the grid options is missing', () => {
    const output = extension.register();
    expect(output).toBeNull();
  });

  describe('create method', () => {
    let columnsMock: Column[];

    beforeEach(() => {
      gridOptionsMock.datasetIdPropertyName = 'id';
      columnsMock = [
        { id: 'field1', field: 'field1', width: 100, cssClass: 'red' },
        { id: 'field2', field: 'field2', width: 50 }
      ];
      jest.spyOn(SharedService.prototype, 'slickGrid', 'get').mockReturnValue(gridStub);
      jest.spyOn(SharedService.prototype, 'dataView', 'get').mockReturnValue(dataViewStub);
      jest.spyOn(SharedService.prototype, 'gridOptions', 'get').mockReturnValue(gridOptionsMock);
      jest.clearAllMocks();
    });

    it('should create the addon', () => {
      extension.create(columnsMock, gridOptionsMock);

      expect(mockAddon).toHaveBeenCalledWith({
        cssClass: 'detail-view-toggle',
        keyPrefix: '__',
        panelRows: 1,
        postTemplate: expect.anything(),
        preTemplate: expect.anything(),
        process: expect.anything(),
        saveDetailViewOnScroll: false,
        useRowClick: true,
        useSimpleViewportCalc: true,
        viewComponent: null,
        viewModel: '',
        onExtensionRegistered: expect.anything(),
        onAsyncResponse: expect.anything(),
        onAsyncEndUpdate: expect.anything(),
        onAfterRowDetailToggle: expect.anything(),
        onBeforeRowDetailToggle: expect.anything(),
        onRowOutOfViewportRange: expect.anything(),
        onRowBackToViewportRange: expect.anything(),
      });
    });

    it('should run the "process" method when defined', async () => {
      gridOptionsMock.rowDetailView!.process = () => new Promise((resolve) => resolve('process resolved'));
      const output = await gridOptionsMock.rowDetailView!.process({ id: 'field1', field: 'field1' });
      expect(output).toBe('process resolved');
    });

    it('should provide a sanitized "preTemplate" when only a "preloadComponent" is provided (meaning no "preTemplate" is originally provided)', async () => {
      gridOptionsMock.rowDetailView!.preloadView = 'some-preload-view';
      const output = await gridOptionsMock.rowDetailView!.preTemplate!();
      expect(output).toEqual(`<div class="${PRELOAD_CONTAINER_PREFIX}"></div>`);
    });

    it('should provide a sanitized "postTemplate" when only a "viewComponent" is provided (meaning no "postTemplate" is originally provided)', async () => {
      gridOptionsMock.rowDetailView!.viewModel = 'some-view-model';
      const output = await gridOptionsMock.rowDetailView!.postTemplate!({ id: 'field1', field: 'field1' });
      expect(output).toEqual(`<div class="${ROW_DETAIL_CONTAINER_PREFIX}field1"></div>`);
    });

    it('should define "datasetIdPropertyName" with different "id" and provide a sanitized "postTemplate" when only a "viewComponent" is provided (meaning no "postTemplate" is originally provided)', async () => {
      gridOptionsMock.rowDetailView!.viewModel = 'some-view-model';
      gridOptionsMock.datasetIdPropertyName = 'rowId';
      const output = await gridOptionsMock.rowDetailView!.postTemplate!({ rowId: 'field1', field: 'field1' });
      expect(output).toEqual(`<div class="${ROW_DETAIL_CONTAINER_PREFIX}field1"></div>`);
    });

    it('should add a reserved column for icons in 1st column index', () => {
      const instance = extension.create(columnsMock, gridOptionsMock);
      const spy = jest.spyOn(instance, 'getColumnDefinition').mockReturnValue({ id: '_detail_selector', field: 'sel' });
      extension.create(columnsMock, gridOptionsMock);

      expect(spy).toHaveBeenCalled();
      expect(columnsMock).toEqual([
        {
          excludeFromColumnPicker: true,
          excludeFromExport: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          excludeFromQuery: true,
          field: 'sel',
          id: '_detail_selector'
        },
        { id: 'field1', field: 'field1', width: 100, cssClass: 'red' },
        { id: 'field2', field: 'field2', width: 50 },
      ]);
    });

    it('should expect the column to be at a different column index position when "columnIndexPosition" is defined', () => {
      gridOptionsMock.rowDetailView!.columnIndexPosition = 2;
      const instance = extension.create(columnsMock, gridOptionsMock);
      const spy = jest.spyOn(instance, 'getColumnDefinition').mockReturnValue({ id: '_detail_selector', field: 'sel' });
      extension.create(columnsMock, gridOptionsMock);

      expect(spy).toHaveBeenCalled();
      expect(columnsMock).toEqual([
        { id: 'field1', field: 'field1', width: 100, cssClass: 'red' },
        { id: 'field2', field: 'field2', width: 50 },
        {
          excludeFromColumnPicker: true,
          excludeFromExport: true,
          excludeFromGridMenu: true,
          excludeFromHeaderMenu: true,
          excludeFromQuery: true,
          field: 'sel',
          id: '_detail_selector'
        },
      ]);
    });
  });

  describe('registered addon', () => {
    let columnsMock: Column[];
    const http = new HttpStub();

    beforeEach(() => {
      gridOptionsMock.datasetIdPropertyName = 'id';
      gridOptionsMock.rowDetailView!.preloadView = 'some-preload-view';
      gridOptionsMock.rowDetailView!.viewModel = 'some-view';
      columnsMock = [{ id: 'field1', field: 'field1', width: 100, cssClass: 'red' }];
      jest.spyOn(SharedService.prototype, 'slickGrid', 'get').mockReturnValue(gridStub);
      jest.spyOn(SharedService.prototype, 'gridOptions', 'get').mockReturnValue(gridOptionsMock);
      jest.clearAllMocks();
      gridStub.onColumnsReordered = new Slick.Event();
      gridStub.onSort = new Slick.Event();
    });

    it('should register the addon', () => {
      const onRegisteredSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onExtensionRegistered');
      const pluginSpy = jest.spyOn(SharedService.prototype.slickGrid, 'registerPlugin');

      const instance = extension.create(columnsMock, gridOptionsMock);
      extension.register();
      const addonInstance = extension.getAddonInstance();

      expect(instance).toBeTruthy();
      expect(instance).toEqual(addonInstance);
      expect(onRegisteredSpy).toHaveBeenCalledWith(instance);
      expect(mockSelectionModel).toHaveBeenCalledWith({ selectActiveRow: true });
      expect(pluginSpy).toHaveBeenCalledWith(instance);
    });

    it('should call internal event handler subscribe and expect the "onAsyncResponse" option to be called when addon notify is called', () => {
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');

      const onAsyncRespSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      const instance = extension.create(columnsMock, gridOptionsMock);
      extension.register();
      instance.onAsyncResponse.notify({ item: columnsMock[0], detailView: {} }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      expect(handlerSpy).toHaveBeenCalledWith(
        { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
        expect.anything()
      );
      expect(onAsyncRespSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], detailView: {} });
      expect(onAsyncEndSpy).not.toHaveBeenCalled();
      expect(onAfterRowSpy).not.toHaveBeenCalled();
      expect(onBeforeRowSpy).not.toHaveBeenCalled();
      expect(onRowOutViewSpy).not.toHaveBeenCalled();
      expect(onRowBackViewSpy).not.toHaveBeenCalled();
    });

    it('should call internal event handler subscribe and expect the "onAsyncEndUpdate" option to be called when addon notify is called', () => {
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
      const renderSpy = jest.spyOn(extension, 'renderViewModel');

      const onAsyncRespSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      const instance = extension.create(columnsMock, gridOptionsMock);
      extension.register();
      instance.onAsyncEndUpdate.notify({ item: columnsMock[0], grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      expect(handlerSpy).toHaveBeenCalledWith(
        { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
        expect.anything()
      );
      expect(onAsyncRespSpy).not.toHaveBeenCalled();
      expect(onAsyncEndSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], grid: gridStub });
      expect(renderSpy).toHaveBeenCalledWith({ cssClass: 'red', field: 'field1', id: 'field1', width: 100, });
      expect(onAfterRowSpy).not.toHaveBeenCalled();
      expect(onBeforeRowSpy).not.toHaveBeenCalled();
      expect(onRowOutViewSpy).not.toHaveBeenCalled();
      expect(onRowBackViewSpy).not.toHaveBeenCalled();
    });

    it('should call internal event handler subscribe and expect the "onAfterRowDetailToggle" option to be called when addon notify is called', () => {
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');

      const onAsyncRespSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      const instance = extension.create(columnsMock, gridOptionsMock);
      extension.register();
      instance.onAfterRowDetailToggle.notify({ item: columnsMock[0], expandedRows: [columnsMock[0] as any], grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      expect(handlerSpy).toHaveBeenCalledWith(
        { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
        expect.anything()
      );
      expect(onAsyncRespSpy).not.toHaveBeenCalled();
      expect(onAsyncEndSpy).not.toHaveBeenCalled();
      expect(onAfterRowSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], expandedRows: [columnsMock[0] as any], grid: gridStub });
      expect(onBeforeRowSpy).not.toHaveBeenCalled();
      expect(onRowOutViewSpy).not.toHaveBeenCalled();
      expect(onRowBackViewSpy).not.toHaveBeenCalled();
    });

    it('should call internal event handler subscribe and expect the "onBeforeRowDetailToggle" option to be called when addon notify is called', () => {
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');

      const onAsyncRespSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      const instance = extension.create(columnsMock, gridOptionsMock);
      extension.register();
      instance.onBeforeRowDetailToggle.notify({ item: columnsMock[0], grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      expect(handlerSpy).toHaveBeenCalledWith(
        { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
        expect.anything()
      );
      expect(onAsyncRespSpy).not.toHaveBeenCalled();
      expect(onAsyncEndSpy).not.toHaveBeenCalled();
      expect(onAfterRowSpy).not.toHaveBeenCalled();
      expect(onBeforeRowSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], grid: gridStub });
      expect(onRowOutViewSpy).not.toHaveBeenCalled();
      expect(onRowBackViewSpy).not.toHaveBeenCalled();
    });

    it('should call internal event handler subscribe and expect the "onRowOutOfViewportRange" option to be called when addon notify is called', () => {
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');

      const onAsyncRespSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      const instance = extension.create(columnsMock, gridOptionsMock);
      extension.register();
      instance.onRowOutOfViewportRange.notify(
        { item: columnsMock[0], rowId: 0, rowIndex: 0, expandedRows: [columnsMock[0] as any], rowIdsOutOfViewport: [], grid: gridStub },
        new Slick.EventData(),
        gridStub
      );

      expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      expect(handlerSpy).toHaveBeenCalledWith(
        { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
        expect.anything()
      );
      expect(onAsyncRespSpy).not.toHaveBeenCalled();
      expect(onAsyncEndSpy).not.toHaveBeenCalled();
      expect(onAfterRowSpy).not.toHaveBeenCalled();
      expect(onBeforeRowSpy).not.toHaveBeenCalled();
      expect(onRowOutViewSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], rowId: 0, rowIndex: 0, expandedRows: [columnsMock[0] as any], rowIdsOutOfViewport: [], grid: gridStub });
      expect(onRowBackViewSpy).not.toHaveBeenCalled();
    });

    it('should call internal event handler subscribe and expect the "onRowBackToViewportRange" option to be called when addon notify is called', () => {
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');

      const onAsyncRespSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn((SharedService.prototype.gridOptions as GridOption).rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      const instance = extension.create(columnsMock, gridOptionsMock);
      extension.register();
      instance.onRowBackToViewportRange.notify(
        { item: columnsMock[0], rowId: 0, rowIndex: 0, expandedRows: [columnsMock[0] as any], rowIdsOutOfViewport: [], grid: gridStub },
        new Slick.EventData(),
        gridStub
      );

      expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      expect(handlerSpy).toHaveBeenCalledWith(
        { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
        expect.anything()
      );
      expect(onAsyncRespSpy).not.toHaveBeenCalled();
      expect(onAsyncEndSpy).not.toHaveBeenCalled();
      expect(onAfterRowSpy).not.toHaveBeenCalled();
      expect(onBeforeRowSpy).not.toHaveBeenCalled();
      expect(onRowOutViewSpy).not.toHaveBeenCalled();
      expect(onRowBackViewSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], rowId: 0, rowIndex: 0, expandedRows: [columnsMock[0] as any], rowIdsOutOfViewport: [], grid: gridStub });
    });

    it('should call Aurelia Util "createAureliaViewModelAddToSlot" when grid "onColumnsReordered" is triggered', (done) => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
      // @ts-ignore:2345
      const appendSpy = jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ view: {}, viewSlot: {} });

      const instance = extension.create(columnsMock, gridOptionsMock);
      extension.register();
      instance.onBeforeRowDetailToggle.subscribe(() => {
        gridStub.onColumnsReordered.notify({ impactedColumns: mockColumn } as any, new Slick.EventData(), gridStub);
        expect(appendSpy).toHaveBeenCalledWith(
          undefined,
          expect.objectContaining({ model: mockColumn, addon: expect.anything(), grid: gridStub, dataView: dataViewStub }),
          expect.objectContaining({ className: 'container_field1' }),
          true
        );
        done();
      });
      instance.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
    });

    it('should call "redrawAllViewSlots" when event "filterChanged" is triggered', (done) => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
      // @ts-ignore:2345
      const appendSpy = jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ view: { unbind: jest.fn() }, viewSlot: { remove: jest.fn() } });

      const instance = extension.create(columnsMock, gridOptionsMock);

      extension.register();
      instance.onBeforeRowDetailToggle.subscribe(() => {
        pubSubService.publish('onFilterChanged', { columnId: 'field1', operator: '=', searchTerms: [] });
        expect(appendSpy).toHaveBeenCalledWith(
          undefined,
          expect.objectContaining({ model: mockColumn, addon: expect.anything(), grid: gridStub, dataView: dataViewStub }),
          expect.objectContaining({ className: 'container_field1' }),
          true
        );
        done();
      });
      instance.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub }, new Slick.EventData(), gridStub);
      instance.onBeforeRowDetailToggle.notify({ item: { ...mockColumn, __collapsed: false }, grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
    });

    it('should call "renderAllViewModels" when grid event "onAfterRowDetailToggle" is triggered', (done) => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
      const getElementSpy = jest.spyOn(document, 'getElementsByClassName');
      // @ts-ignore:2345
      const appendSpy = jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ view: { unbind: jest.fn() }, viewSlot: { remove: jest.fn() } });

      const instance = extension.create(columnsMock, gridOptionsMock);

      extension.register();
      instance.onAfterRowDetailToggle.subscribe(() => {
        expect(getElementSpy).toHaveBeenCalledWith('container_field1');
        expect(appendSpy).toHaveBeenCalledWith(
          undefined,
          expect.objectContaining({ model: mockColumn, addon: expect.anything(), grid: gridStub, dataView: dataViewStub }),
          expect.objectContaining({ className: 'container_field1' }),
          true
        );
        done();
      });
      instance.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub } as any, new Slick.EventData(), gridStub);
      instance.onAfterRowDetailToggle.notify({ item: mockColumn, grid: gridStub } as any, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
    });

    it('should call "redrawViewSlot" when grid event "onRowBackToViewportRange" is triggered', (done) => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
      const getElementSpy = jest.spyOn(document, 'getElementsByClassName');
      // @ts-ignore:2345
      const appendSpy = jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ view: { unbind: jest.fn() }, viewSlot: { remove: jest.fn() } });

      const instance = extension.create(columnsMock, gridOptionsMock);

      extension.register();
      instance.onRowBackToViewportRange.subscribe(() => {
        expect(getElementSpy).toHaveBeenCalledWith('container_field1');
        expect(appendSpy).toHaveBeenCalledWith(
          undefined,
          expect.objectContaining({ model: mockColumn, addon: expect.anything(), grid: gridStub, dataView: dataViewStub }),
          expect.objectContaining({ className: 'container_field1' }),
          true
        );
        done();
      });
      instance.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub } as any, new Slick.EventData(), gridStub);
      instance.onRowBackToViewportRange.notify({ item: mockColumn, grid: gridStub } as any, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
    });

    it('should run the internal "onProcessing" and call "notifyTemplate" with a Promise when "process" method is defined and executed', (done) => {
      const mockItem = { id: 2, firstName: 'John', lastName: 'Doe' };
      gridOptionsMock.rowDetailView!.process = () => new Promise((resolve) => resolve(mockItem));
      const instance = extension.create(columnsMock, gridOptionsMock);

      instance.onAsyncResponse.subscribe((_e, response) => {
        expect(response).toEqual(expect.objectContaining({ item: mockItem }));
        done();
      });

      gridOptionsMock.rowDetailView!.process(mockItem);
    });

    it('should run the internal "onProcessing" and call "notifyTemplate" with a Promise when "process" is a Fetch Promise', (done) => {
      const mockItem = { id: 2, firstName: 'John', lastName: 'Doe' };
      http.status = 200;
      http.object = mockItem;
      http.returnKey = 'date';
      http.returnValue = '6/24/1984';
      http.responseHeaders = { accept: 'json' };
      gridOptionsMock.rowDetailView!.process = () => http.fetch('/api', { method: 'GET' });
      const instance = extension.create(columnsMock, gridOptionsMock);

      instance.onAsyncResponse.subscribe((_e, response) => {
        expect(response).toEqual(expect.objectContaining({ item: mockItem }));
        done();
      });

      gridOptionsMock.rowDetailView!.process(mockItem);
    });

    it('should define "datasetIdPropertyName" with different "id" and run the internal "onProcessing" and call "notifyTemplate" with a Promise when "process" as a Promise with content to simulate http - client', (done) => {
      const mockItem = { rowId: 2, firstName: 'John', lastName: 'Doe' };
      gridOptionsMock.datasetIdPropertyName = 'rowId';
      gridOptionsMock.rowDetailView!.process = (item) => new Promise((resolve) => resolve({ content: item }));
      const instance = extension.create(columnsMock, gridOptionsMock);

      instance.onAsyncResponse.subscribe((_e, response) => {
        expect(response).toEqual(expect.objectContaining({ item: mockItem }));
        done();
      });

      gridOptionsMock.rowDetailView!.process(mockItem);
    });

    it('should run the internal "onProcessing" and call "notifyTemplate" with a Promise when "process" as a Promise with content to simulate http-client', (done) => {
      const mockItem = { id: 2, firstName: 'John', lastName: 'Doe' };
      gridOptionsMock.rowDetailView!.process = (item) => new Promise((resolve) => resolve({ content: item }));
      const instance = extension.create(columnsMock, gridOptionsMock);

      instance.onAsyncResponse.subscribe((_e, response) => {
        expect(response).toEqual(expect.objectContaining({ item: mockItem }));
        done();
      });

      gridOptionsMock.rowDetailView!.process(mockItem);
    });

    it('should throw an error when running the "process" that does not return an object with an "id" property', async () => {
      const mockItem = { firstName: 'John', lastName: 'Doe' };
      gridOptionsMock.rowDetailView!.process = (item) => new Promise((resolve) => resolve(item));
      extension.create(columnsMock, gridOptionsMock);

      try {
        await gridOptionsMock.rowDetailView!.process(mockItem);
      } catch (e) {
        expect(e.toString()).toContain(`[Aurelia-Slickgrid] could not process the Row Detail, you must make sure that your "process" callback`);
      }
    });

    it('should call Aurelia Util "disposeAllViewSlot" when grid "onSort" is triggered', (done) => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ componentRef: { instance: {} } } as any);
      const handlerSpy = jest.spyOn(extension.eventHandler, 'subscribe');
      const disposeSpy = jest.spyOn(extension, 'disposeAllViewSlot');

      const instance = extension.create(columnsMock, gridOptionsMock);
      extension.register();
      instance.onBeforeRowDetailToggle.subscribe(() => {
        gridStub.onSort.notify({ impactedColumns: mockColumn } as any, new Slick.EventData(), gridStub);
        expect(disposeSpy).toHaveBeenCalled();
        done();
      });
      instance.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
    });

    it('should dispose of the addon', () => {
      const instance = extension.create(columnsMock, gridOptionsMock);
      extension.register();
      const destroySpy = jest.spyOn(instance, 'destroy');

      extension.dispose();

      expect(destroySpy).toHaveBeenCalled();
    });
  });

  describe('possible error thrown', () => {
    it('should throw an error when calling "create" method without "rowDetailView" options defined', () => {
      const copyGridOptionsMock = { ...gridOptionsMock };
      copyGridOptionsMock.rowDetailView = undefined;
      jest.spyOn(SharedService.prototype, 'gridOptions', 'get').mockReturnValue(gridOptionsMock);

      expect(() => extension.create([], copyGridOptionsMock)).toThrowError(`The Row Detail View requires options to be passed via the "rowDetailView" property of the Grid Options`);
    });

    it('should throw an error when calling "create" method without "rowDetailView" options defined', () => {
      const copyGridOptionsMock = { ...gridOptionsMock };
      copyGridOptionsMock.rowDetailView!.process = undefined as any;
      jest.spyOn(SharedService.prototype, 'gridOptions', 'get').mockReturnValue(gridOptionsMock);

      expect(() => extension.create([], copyGridOptionsMock)).toThrowError(`You need to provide a "process" function for the Row Detail Extension to work properly`);
    });
  });
});
