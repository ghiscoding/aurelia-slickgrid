import { Column, SharedService, SlickGrid, SlickNamespace, } from '@slickgrid-universal/common';
import { SlickRowSelectionModel } from '@slickgrid-universal/common/dist/commonjs/extensions/slickRowSelectionModel';
import { EventPubSubService } from '@slickgrid-universal/event-pub-sub';

import { GridOption } from '../../models/gridOption.interface';
import { AureliaUtilService } from '../../services';
import { RowDetailView } from '../../models';
import { HttpStub } from '../../../../test/httpClientStub';
import { SlickRowDetailView } from '../slickRowDetailView';
jest.mock('@slickgrid-universal/row-detail-view-plugin');

declare const Slick: SlickNamespace;
const ROW_DETAIL_CONTAINER_PREFIX = 'container_';
const PRELOAD_CONTAINER_PREFIX = 'container_loading';

const aureliaUtilServiceStub = {
  createAureliaViewModelAddToSlot: jest.fn(),
  createAureliaViewAddToSlot: jest.fn(),
} as unknown as AureliaUtilService;

const gridOptionsMock = {
  enableRowDetailView: true,
  rowDetailView: {
    cssClass: 'detail-view-toggle',
    panelRows: 1,
    keyPrefix: '__',
    useRowClick: true,
    useSimpleViewportCalc: true,
    saveDetailViewOnScroll: false,
    process: () => new Promise((resolve) => resolve('process resolving')),
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

const gridStub = {
  getUID: jest.fn(),
  getOptions: () => gridOptionsMock,
  getSelectionModel: jest.fn(),
  registerPlugin: jest.fn(),
  setSelectionModel: jest.fn(),
  onColumnsReordered: new Slick.Event(),
  onSelectedRowsChanged: new Slick.Event(),
  onSort: new Slick.Event(),
} as unknown as SlickGrid;

const mockRowSelectionModel = {
  constructor: jest.fn(),
  init: jest.fn(),
  destroy: jest.fn(),
  dispose: jest.fn(),
  getSelectedRows: jest.fn(),
  setSelectedRows: jest.fn(),
  getSelectedRanges: jest.fn(),
  setSelectedRanges: jest.fn(),
  onSelectedRangesChanged: new Slick.Event(),
} as unknown as SlickRowSelectionModel;

jest.mock('@slickgrid-universal/common/dist/commonjs/extensions/slickRowSelectionModel', () => ({
  SlickRowSelectionModel: jest.fn().mockImplementation(() => mockRowSelectionModel),
}));

describe('SlickRowDetailView', () => {
  let eventPubSubService: EventPubSubService;
  let plugin: SlickRowDetailView;

  const div = document.createElement('div');
  div.innerHTML = `<div class="container_loading"></div><div class="container_field1"></div>`;
  document.body.appendChild(div);

  beforeEach(() => {
    eventPubSubService = new EventPubSubService(div);
    plugin = new SlickRowDetailView(aureliaUtilServiceStub, eventPubSubService, document.body as HTMLDivElement);
    plugin.eventHandler = new Slick.EventHandler();
  });

  it('should create the RowDetailView plugin', () => {
    expect(plugin).toBeTruthy();
  });

  it('should expect "getOptions" to be called when calling addonOptions GETTER', () => {
    const getOptionSpy = jest.spyOn(plugin, 'getOptions').mockReturnValue({ cssClass: 'some-class' } as any);

    const options = plugin.addonOptions;

    expect(options).toEqual({ cssClass: 'some-class' });
    expect(getOptionSpy).toHaveBeenCalled();
  });

  describe('registered plugin', () => {
    beforeEach(() => {
      gridOptionsMock.datasetIdPropertyName = 'id';
      jest.spyOn(gridStub, 'getOptions').mockReturnValue(gridOptionsMock);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should run the "process" method when defined', async () => {
      gridOptionsMock.rowDetailView!.process = () => new Promise((resolve) => resolve('process resolved'));
      const output = await gridOptionsMock.rowDetailView!.process({ id: 'field1', field: 'field1' });
      expect(output).toBe('process resolved');
    });

    it('should provide a sanitized "preTemplate" when only a "preloadComponent" is provided (meaning no "preTemplate" is originally provided)', async () => {
      gridOptionsMock.rowDetailView!.preloadView = 'some-preload-view';
      jest.spyOn(gridStub, 'getOptions').mockReturnValue(gridOptionsMock);

      plugin.init(gridStub);
      const output = await gridOptionsMock.rowDetailView!.preTemplate!();

      expect(output).toEqual(`<div class="${PRELOAD_CONTAINER_PREFIX}"></div>`);
    });

    it('should provide a sanitized "postTemplate" when only a "viewComponent" is provided (meaning no "postTemplate" is originally provided)', async () => {
      gridOptionsMock.rowDetailView!.viewModel = 'some-view-model';
      jest.spyOn(gridStub, 'getOptions').mockReturnValue(gridOptionsMock);

      const output = await gridOptionsMock.rowDetailView!.postTemplate!({ id: 'field1', field: 'field1' });
      expect(output).toEqual(`<div class="${ROW_DETAIL_CONTAINER_PREFIX}field1"></div>`);
    });

    it('should define "datasetIdPropertyName" with different "id" and provide a sanitized "postTemplate" when only a "viewComponent" is provided (meaning no "postTemplate" is originally provided)', async () => {
      gridOptionsMock.rowDetailView!.viewModel = 'some-view-model';
      gridOptionsMock.datasetIdPropertyName = 'rowId';
      const output = await gridOptionsMock.rowDetailView!.postTemplate!({ rowId: 'field1', field: 'field1' });
      expect(output).toEqual(`<div class="${ROW_DETAIL_CONTAINER_PREFIX}field1"></div>`);
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
      jest.spyOn(gridStub, 'getOptions').mockReturnValue(gridOptionsMock);
      jest.clearAllMocks();
      gridStub.onColumnsReordered = new Slick.Event();
      gridStub.onSort = new Slick.Event();
    });

    afterEach(() => {
      plugin?.eventHandler?.unsubscribeAll();
      plugin?.dispose();
      jest.clearAllMocks();
      plugin.onAsyncResponse = null;
      plugin.onAsyncEndUpdate = null;
      plugin.onAfterRowDetailToggle = null;
      plugin.onBeforeRowDetailToggle = null;
      plugin.onRowBackToViewportRange = null;
      plugin.onRowOutOfViewportRange = null;
    });

    it('should register the addon', () => {
      const copyGridOptionsMock = { ...gridOptionsMock };
      gridOptionsMock.rowDetailView.onExtensionRegistered = jest.fn();
      jest.spyOn(gridStub, 'getOptions').mockReturnValue(copyGridOptionsMock);
      const onRegisteredSpy = jest.spyOn(copyGridOptionsMock.rowDetailView, 'onExtensionRegistered');

      plugin.init(gridStub);
      const instance = plugin.register();
      const addonInstance = plugin.getAddonInstance();

      expect(instance).toBeTruthy();
      expect(instance).toEqual(addonInstance);
      expect(onRegisteredSpy).toHaveBeenCalledWith(instance);
      expect(SlickRowSelectionModel).toHaveBeenCalledWith({ selectActiveRow: true });
    });

    it('should call internal event handler subscribe and expect the "onAsyncResponse" option to be called when addon notify is called', () => {
      const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      const onAsyncRespSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      plugin.init(gridStub);
      plugin.onAsyncResponse = new Slick.Event();
      plugin.register();

      plugin.onAsyncResponse.notify({ item: columnsMock[0], detailView: {} }, new Slick.EventData(), gridStub);

      // expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
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
      // const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      const renderSpy = jest.spyOn(plugin, 'renderViewModel');

      const onAsyncRespSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      plugin.init(gridStub);
      plugin.onAsyncEndUpdate = new Slick.Event();
      plugin.register();
      plugin.onAsyncEndUpdate.notify({ item: columnsMock[0], grid: gridStub }, new Slick.EventData(), gridStub);

      // expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      // expect(handlerSpy).toHaveBeenCalledWith(
      //   { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
      //   expect.anything()
      // );
      expect(onAsyncRespSpy).not.toHaveBeenCalled();
      expect(onAsyncEndSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], grid: gridStub });
      expect(renderSpy).toHaveBeenCalledWith({ cssClass: 'red', field: 'field1', id: 'field1', width: 100, });
      expect(onAfterRowSpy).not.toHaveBeenCalled();
      expect(onBeforeRowSpy).not.toHaveBeenCalled();
      expect(onRowOutViewSpy).not.toHaveBeenCalled();
      expect(onRowBackViewSpy).not.toHaveBeenCalled();
    });

    it('should call internal event handler subscribe and expect the "onAfterRowDetailToggle" option to be called when addon notify is called', () => {
      // const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      const onAsyncRespSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      plugin.init(gridStub);
      plugin.onAfterRowDetailToggle = new Slick.Event();
      plugin.register();
      plugin.onAfterRowDetailToggle.notify({ item: columnsMock[0], expandedRows: [0], grid: gridStub }, new Slick.EventData(), gridStub);

      // expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      // expect(handlerSpy).toHaveBeenCalledWith(
      //   { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
      //   expect.anything()
      // );
      expect(onAsyncRespSpy).not.toHaveBeenCalled();
      expect(onAsyncEndSpy).not.toHaveBeenCalled();
      expect(onAfterRowSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], expandedRows: [0], grid: gridStub });
      expect(onBeforeRowSpy).not.toHaveBeenCalled();
      expect(onRowOutViewSpy).not.toHaveBeenCalled();
      expect(onRowBackViewSpy).not.toHaveBeenCalled();
    });

    it('should call internal event handler subscribe and expect the "onBeforeRowDetailToggle" option to be called when addon notify is called', () => {
      // const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      const onAsyncRespSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      plugin.init(gridStub);
      plugin.onBeforeRowDetailToggle = new Slick.Event();
      plugin.register();
      plugin.onBeforeRowDetailToggle.notify({ item: columnsMock[0], grid: gridStub }, new Slick.EventData(), gridStub);

      // expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      // expect(handlerSpy).toHaveBeenCalledWith(
      //   { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
      //   expect.anything()
      // );
      expect(onAsyncRespSpy).not.toHaveBeenCalled();
      expect(onAsyncEndSpy).not.toHaveBeenCalled();
      expect(onAfterRowSpy).not.toHaveBeenCalled();
      expect(onBeforeRowSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], grid: gridStub });
      expect(onRowOutViewSpy).not.toHaveBeenCalled();
      expect(onRowBackViewSpy).not.toHaveBeenCalled();
    });

    it('should call internal event handler subscribe and expect the "onRowOutOfViewportRange" option to be called when addon notify is called', () => {
      // const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      const onAsyncRespSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      plugin.init(gridStub);
      plugin.onRowOutOfViewportRange = new Slick.Event();
      plugin.register();
      plugin.onRowOutOfViewportRange.notify(
        { item: columnsMock[0], rowId: 0, rowIndex: 0, expandedRows: [0], rowIdsOutOfViewport: [], grid: gridStub },
        new Slick.EventData(),
        gridStub
      );

      // expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      // expect(handlerSpy).toHaveBeenCalledWith(
      //   { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
      //   expect.anything()
      // );
      expect(onAsyncRespSpy).not.toHaveBeenCalled();
      expect(onAsyncEndSpy).not.toHaveBeenCalled();
      expect(onAfterRowSpy).not.toHaveBeenCalled();
      expect(onBeforeRowSpy).not.toHaveBeenCalled();
      expect(onRowOutViewSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], rowId: 0, rowIndex: 0, expandedRows: [0], rowIdsOutOfViewport: [], grid: gridStub });
      expect(onRowBackViewSpy).not.toHaveBeenCalled();
    });

    it('should call internal event handler subscribe and expect the "onRowBackToViewportRange" option to be called when addon notify is called', () => {
      // const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      const onAsyncRespSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncResponse');
      const onAsyncEndSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAsyncEndUpdate');
      const onAfterRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onAfterRowDetailToggle');
      const onBeforeRowSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onBeforeRowDetailToggle');
      const onRowOutViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowOutOfViewportRange');
      const onRowBackViewSpy = jest.spyOn(gridOptionsMock.rowDetailView as RowDetailView, 'onRowBackToViewportRange');

      plugin.init(gridStub);
      plugin.onRowBackToViewportRange = new Slick.Event();
      plugin.register();
      plugin.onRowBackToViewportRange.notify(
        { item: columnsMock[0], rowId: 0, rowIndex: 0, expandedRows: [columnsMock[0] as any], rowIdsOutOfViewport: [], grid: gridStub },
        new Slick.EventData(),
        gridStub
      );

      // expect(handlerSpy).toHaveBeenCalledTimes(8); // there are an extra 2x on the grid itself
      // expect(handlerSpy).toHaveBeenCalledWith(
      //   { notify: expect.anything(), subscribe: expect.anything(), unsubscribe: expect.anything(), },
      //   expect.anything()
      // );
      expect(onAsyncRespSpy).not.toHaveBeenCalled();
      expect(onAsyncEndSpy).not.toHaveBeenCalled();
      expect(onAfterRowSpy).not.toHaveBeenCalled();
      expect(onBeforeRowSpy).not.toHaveBeenCalled();
      expect(onRowOutViewSpy).not.toHaveBeenCalled();
      expect(onRowBackViewSpy).toHaveBeenCalledWith(expect.anything(), { item: columnsMock[0], rowId: 0, rowIndex: 0, expandedRows: [columnsMock[0] as any], rowIdsOutOfViewport: [], grid: gridStub });
    });

    it('should call Aurelia Util "createAureliaViewModelAddToSlot" when grid "onColumnsReordered" is triggered', (done) => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      // @ts-ignore:2345
      const appendSpy = jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ view: {}, viewSlot: {} });

      plugin.init(gridStub);
      plugin.onBeforeRowDetailToggle = new Slick.Event();
      plugin.register();
      plugin.eventHandler.subscribe(plugin.onBeforeRowDetailToggle, () => {
        gridStub.onColumnsReordered.notify({ impactedColumns: [mockColumn] } as any, new Slick.EventData(), gridStub);
        expect(appendSpy).toHaveBeenCalledWith(
          '',
          expect.objectContaining({ model: mockColumn, addon: expect.anything(), grid: gridStub, }),
          expect.objectContaining({ className: 'container_field1' }),
          true
        );
        done();
      });
      plugin.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
    });

    it('should call "redrawAllViewSlots" when using Row Selection and the event "onSelectedRowsChanged" is triggered', () => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      gridOptionsMock.enableCheckboxSelector = true;
      const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      // @ts-ignore:2345
      const appendSpy = jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ view: { unbind: jest.fn() }, viewSlot: { remove: jest.fn() } });

      plugin.init(gridStub);
      const redrawSpy = jest.spyOn(plugin, 'redrawAllViewSlots');
      plugin.onBeforeRowDetailToggle = new Slick.Event();
      plugin.register();
      plugin.eventHandler.subscribe(plugin.onBeforeRowDetailToggle, () => {
        gridStub.onSelectedRowsChanged.notify({ rows: [0], previousSelectedRows: [], grid: gridStub }, new Slick.EventData(), gridStub);
        expect(appendSpy).toHaveBeenCalledWith(
          '',
          expect.objectContaining({ model: mockColumn, addon: expect.anything(), grid: gridStub, }),
          expect.objectContaining({ className: 'container_field1' }),
          true
        );
      });
      plugin.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub }, new Slick.EventData(), gridStub);
      plugin.onBeforeRowDetailToggle.notify({ item: { ...mockColumn, __collapsed: false }, grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
      expect(redrawSpy).toHaveBeenCalledTimes(2);
    });

    it('should call "redrawAllViewSlots" when event "filterChanged" is triggered', () => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      // @ts-ignore:2345
      const appendSpy = jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ view: { unbind: jest.fn() }, viewSlot: { remove: jest.fn() } });

      plugin.init(gridStub);
      const redrawSpy = jest.spyOn(plugin, 'redrawAllViewSlots');
      plugin.onBeforeRowDetailToggle = new Slick.Event();
      plugin.register();

      plugin.eventHandler.subscribe(plugin.onBeforeRowDetailToggle, () => {
        eventPubSubService.publish('onFilterChanged', { columnId: 'field1', operator: '=', searchTerms: [] });
        expect(appendSpy).toHaveBeenCalledWith(
          '',
          expect.objectContaining({ model: mockColumn, addon: expect.anything(), grid: gridStub, }),
          expect.objectContaining({ className: 'container_field1' }),
          true
        );
      });
      plugin.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub }, new Slick.EventData(), gridStub);
      plugin.onBeforeRowDetailToggle.notify({ item: { ...mockColumn, __collapsed: false }, grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
      expect(redrawSpy).toHaveBeenCalledTimes(2);
    });

    it('should call "redrawAllViewSlots" when event "onGridMenuClearAllFilters" is triggered', (done) => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');

      plugin.init(gridStub);
      const redrawSpy = jest.spyOn(plugin, 'redrawAllViewSlots');
      plugin.onBeforeRowDetailToggle = new Slick.Event();
      plugin.register();

      plugin.eventHandler.subscribe(plugin.onBeforeRowDetailToggle, () => {
        eventPubSubService.publish('onGridMenuClearAllFilters', { columnId: 'field1', operator: '=', searchTerms: [] });
      });
      plugin.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub }, new Slick.EventData(), gridStub);
      plugin.onBeforeRowDetailToggle.notify({ item: { ...mockColumn, __collapsed: false }, grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
      setTimeout(() => {
        expect(redrawSpy).toHaveBeenCalledTimes(4);
        done();
      });
    });

    it('should call "redrawAllViewSlots" when event "onGridMenuClearAllSorting" is triggered', (done) => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');

      plugin.init(gridStub);
      const redrawSpy = jest.spyOn(plugin, 'redrawAllViewSlots');
      plugin.onBeforeRowDetailToggle = new Slick.Event();
      plugin.register();

      plugin.eventHandler.subscribe(plugin.onBeforeRowDetailToggle, () => {
        eventPubSubService.publish('onGridMenuClearAllSorting', { columnId: 'field1', operator: '=', searchTerms: [] });
      });
      plugin.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub }, new Slick.EventData(), gridStub);
      plugin.onBeforeRowDetailToggle.notify({ item: { ...mockColumn, __collapsed: false }, grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
      setTimeout(() => {
        expect(redrawSpy).toHaveBeenCalledTimes(4);
        done();
      });
    });

    it('should call "renderAllViewModels" when grid event "onAfterRowDetailToggle" is triggered', () => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      const getElementSpy = jest.spyOn(document.body, 'getElementsByClassName');
      // @ts-ignore:2345
      const appendSpy = jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ view: { unbind: jest.fn() }, viewSlot: { remove: jest.fn() } });

      plugin.init(gridStub);
      plugin.onAfterRowDetailToggle = new Slick.Event();
      plugin.onBeforeRowDetailToggle = new Slick.Event();
      plugin.register();
      plugin.onAfterRowDetailToggle.subscribe(() => {
        expect(getElementSpy).toHaveBeenCalledWith('container_field1');
        expect(appendSpy).toHaveBeenCalledWith(
          '',
          expect.objectContaining({ model: mockColumn, addon: expect.anything(), grid: gridStub, }),
          expect.objectContaining({ className: 'container_field1' }),
          true
        );
      });
      plugin.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub } as any, new Slick.EventData(), gridStub);
      plugin.onAfterRowDetailToggle.notify({ item: mockColumn, grid: gridStub } as any, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
    });

    it('should call "redrawViewSlot" when grid event "onRowBackToViewportRange" is triggered', () => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      // @ts-ignore:2345
      const appendSpy = jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ view: { unbind: jest.fn() }, viewSlot: { remove: jest.fn() } });
      const redrawSpy = jest.spyOn(plugin, 'redrawAllViewSlots');

      plugin.init(gridStub);
      plugin.onBeforeRowDetailToggle = new Slick.Event();
      plugin.onRowBackToViewportRange = new Slick.Event();
      plugin.register();
      plugin.onRowBackToViewportRange.subscribe(() => {
        expect(appendSpy).toHaveBeenCalledWith(
          '',
          expect.objectContaining({ model: mockColumn, addon: expect.anything(), grid: gridStub, }),
          expect.objectContaining({ className: 'container_field1' }),
          true
        );
        expect(redrawSpy).toHaveBeenCalled();
      });
      plugin.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub } as any, new Slick.EventData(), gridStub);
      plugin.onRowBackToViewportRange.notify({ item: mockColumn, grid: gridStub } as any, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
    });

    it('should run the internal "onProcessing" and call "notifyTemplate" with a Promise when "process" method is defined and executed', (done) => {
      const mockItem = { id: 2, firstName: 'John', lastName: 'Doe' };
      gridOptionsMock.rowDetailView!.process = () => new Promise((resolve) => resolve(mockItem));
      plugin.init(gridStub);
      plugin.onAsyncResponse = new Slick.Event();
      plugin.onAsyncResponse.subscribe((_e, response) => {
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
      gridOptionsMock.rowDetailView!.process = () => http.fetch('http://localhost/api', { method: 'GET' });
      plugin.init(gridStub);
      plugin.onAsyncResponse = new Slick.Event();
      plugin.onAsyncResponse.subscribe((_e, response) => {
        expect(response).toEqual(expect.objectContaining({ item: mockItem }));
        done();
      });

      gridOptionsMock.rowDetailView!.process(mockItem);
    });

    it('should define "datasetIdPropertyName" with different "id" and run the internal "onProcessing" and call "notifyTemplate" with a Promise when "process" as a Promise with content to simulate http - client', (done) => {
      const mockItem = { rowId: 2, firstName: 'John', lastName: 'Doe' };
      gridOptionsMock.datasetIdPropertyName = 'rowId';
      gridOptionsMock.rowDetailView!.process = (item) => new Promise((resolve) => resolve({ content: item }));
      plugin.init(gridStub);
      plugin.onAsyncResponse = new Slick.Event();
      plugin.onAsyncResponse.subscribe((_e, response) => {
        expect(response).toEqual(expect.objectContaining({ item: mockItem }));
        done();
      });

      gridOptionsMock.rowDetailView!.process(mockItem);
    });

    it('should run the internal "onProcessing" and call "notifyTemplate" with a Promise when "process" as a Promise with content to simulate http-client', (done) => {
      const mockItem = { id: 2, firstName: 'John', lastName: 'Doe' };
      gridOptionsMock.rowDetailView!.process = (item) => new Promise((resolve) => resolve({ content: item }));
      plugin.init(gridStub);
      plugin.onBeforeRowDetailToggle = new Slick.Event();
      plugin.onAsyncResponse = new Slick.Event();
      plugin.onAsyncResponse.subscribe((_e, response) => {
        expect(response).toEqual(expect.objectContaining({ item: mockItem }));
        done();
      });

      gridOptionsMock.rowDetailView!.process(mockItem);
    });

    it('should throw an error when running the "process" that does not return an object with an "id" property', async () => {
      const mockItem = { firstName: 'John', lastName: 'Doe' };
      gridOptionsMock.rowDetailView!.process = (item) => new Promise((resolve) => resolve(item));
      plugin.init(gridStub);

      try {
        await gridOptionsMock.rowDetailView!.process(mockItem);
      } catch (e) {
        expect(e.toString()).toContain(`[Aurelia-Slickgrid] could not process the Row Detail, you must make sure that your "process" callback`);
      }
    });

    it('should call Aurelia Util "disposeAllViewSlot" when grid "onSort" is triggered', (done) => {
      const mockColumn = { id: 'field1', field: 'field1', width: 100, cssClass: 'red', __collapsed: true };
      jest.spyOn(aureliaUtilServiceStub, 'createAureliaViewModelAddToSlot').mockReturnValue({ componentRef: { plugin: {} } } as any);
      const handlerSpy = jest.spyOn(plugin.eventHandler, 'subscribe');
      const disposeSpy = jest.spyOn(plugin, 'disposeAllViewSlot');

      plugin.init(gridStub);
      plugin.onBeforeRowDetailToggle = new Slick.Event();
      plugin.eventHandler.subscribe(plugin.onBeforeRowDetailToggle, () => {
        gridStub.onSort.notify({ impactedColumns: [mockColumn] } as any, new Slick.EventData(), gridStub);
        expect(disposeSpy).toHaveBeenCalled();
        done();
      });
      plugin.onBeforeRowDetailToggle.notify({ item: mockColumn, grid: gridStub }, new Slick.EventData(), gridStub);

      expect(handlerSpy).toHaveBeenCalled();
    });
  });

  describe('possible error thrown', () => {
    it('should throw an error when creating with "init" and the row detail is without a "process" method defined', () => {
      const copyGridOptionsMock = { ...gridOptionsMock };
      copyGridOptionsMock.rowDetailView.process = undefined;
      jest.spyOn(gridStub, 'getOptions').mockReturnValue(gridOptionsMock);

      expect(() => plugin.init(gridStub)).toThrowError(`[Aurelia-Slickgrid] You need to provide a "process" function for the Row Detail Extension to work properly`);
    });

    it('should throw an error when creating with "register" and the row detail is without a "process" method defined', () => {
      const copyGridOptionsMock = { ...gridOptionsMock };
      copyGridOptionsMock.rowDetailView.process = undefined;
      jest.spyOn(gridStub, 'getOptions').mockReturnValue(gridOptionsMock);

      expect(() => plugin.register()).toThrowError(`[Aurelia-Slickgrid] You need to provide a "process" function for the Row Detail Extension to work properly`);
    });
  });
});
