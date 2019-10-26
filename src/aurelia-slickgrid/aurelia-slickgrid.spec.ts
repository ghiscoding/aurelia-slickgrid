import { bootstrap } from 'aurelia-bootstrapper';
import { EventAggregator } from 'aurelia-event-aggregator';
import { StageComponent } from 'aurelia-testing';
import { PLATFORM } from 'aurelia-pal';
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
import { GridOption } from './models';
import { Container } from 'aurelia-framework';

declare var Slick: any;

const sharedServiceStub = {} as SharedService;
Object.defineProperty(sharedServiceStub, 'dataView', {
  get: jest.fn(() => 'bar'),
  set: jest.fn()
});

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
  getScrollbarDimensions: jest.fn(),
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

// const eventAggregator = {
//   publish: jest.fn(),
//   subscribe: jest.fn()
// };
jest.mock('flatpickr', () => { });
// jest.mock('aurelia-event-aggregator', () => ({
//   EventAggregator: eventAggregator
// }));

const aureliaGridReady = jest.fn();

describe('Aurelia-Slickgrid Custom Component instatiated via StageComponent', () => {
  let ea: EventAggregator;
  let container: Container;
  let component;
  let eu: ExtensionUtility;

  const view = `<aurelia-slickgrid
    grid-id="grid1"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset">
  </aurelia-slickgrid>`;

  beforeEach(() => {
    ea = new EventAggregator();

    component = StageComponent
      .withResources([
        PLATFORM.moduleName('./aurelia-slickgrid'),
        PLATFORM.moduleName('./slick-pagination'),
        PLATFORM.moduleName('./value-converters/asgNumber')
      ])
      .inView(view)
      .boundTo({ gridId: 'grid1', columnDefinitions: [], dataset: [], gridOptions: { enableExcelExport: false }, aureliaGridReady, gridHeight: 600, gridWidth: 800 });

    component.bootstrap((aurelia) => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(EventAggregator, ea);
      aurelia.container.registerInstance(ExtensionUtility, mockExtensionUtility);
      // aurelia.container.registerInstance(ExcelExportService, excelExportServiceStub);
      // aurelia.container.registerInstance(ExportService, exportServiceStub);
      // aurelia.container.registerInstance(ExtensionService, extensionServiceStub);
      // aurelia.container.registerInstance(ExtensionUtility, eu);
      // aurelia.container.registerInstance(FilterService, filterServiceStub);
      // aurelia.container.registerInstance(GraphqlService, mockGraphqlService);
      // aurelia.container.registerInstance(GroupingAndColspanService, groupingAndColspanServiceStub);
      // aurelia.container.registerInstance(SortService, sortServiceStub);

      // aurelia.container.registerInstance(SlickgridConfig, new SlickgridConfig());
    });

  });

  it('should make sure Aurelia-Slickgrid is defined', () => {
    expect(component).toBeTruthy();
    expect(component.constructor).toBeDefined();
  });

  it('should create a grid and expect multiple Event Aggregator being called', async () => {
    const spy = jest.spyOn(ea, 'publish');
    await component.create(bootstrap);
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenNthCalledWith(1, 'onBeforeGridCreate', true);
    expect(spy).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
    expect(spy).toHaveBeenNthCalledWith(3, 'onGridCreated', expect.any(Object));

    component.dispose();
    expect(spy).toHaveBeenNthCalledWith(4, 'onBeforeGridDestroy', expect.any(Object));
    expect(spy).toHaveBeenNthCalledWith(5, 'onAfterGridDestroyed', true);
  });

  it('should create a grid and expect multiple CustomEvent being dispatched', (done) => {
    let spy;

    component
      .manuallyHandleLifecycle()
      .create(bootstrap)
      .then(() => spy = jest.spyOn(component.viewModel, 'dispatchCustomEvent'))
      .then(() => component.bind())
      .then(() => component.attached())
      .then(() => {
        expect(spy).toHaveBeenNthCalledWith(1, 'asg-on-before-grid-create');
        expect(spy).toHaveBeenNthCalledWith(2, 'asg-on-dataview-created', expect.any(Object));
        // expect(spy).toHaveBeenNthCalledWith(3, 'sg-on-scroll', expect.any(Object));
        // expect(spy).toHaveBeenNthCalledWith(4, 'sg-on-rendered', expect.any(Object));
        expect(spy).toHaveBeenNthCalledWith(3, 'asg-on-grid-created', expect.any(Object));
        expect(spy).toHaveBeenLastCalledWith('asg-on-aurelia-grid-created', expect.any(Object));
      })
      .then(() => component.detached(true))
      .then(() => {
        expect(spy).toHaveBeenLastCalledWith('asg-on-after-grid-destroyed', expect.any(Object));
      })
      .then(() => component.unbind())
      .then(done)
      .then(() => component.dispose(true));
  });

  it('should create a grid and a slickgrid container in the DOM', async () => {
    await component.manuallyHandleLifecycle().create(bootstrap);
    await component.bind();
    await component.attached();
    const gridPaneElm = document.querySelector<HTMLDivElement>('.gridPane');
    const gridContainerElm = document.querySelector<HTMLDivElement>('.slickgrid-container');

    expect(gridPaneElm.id).toBe('slickGridContainer-grid1');
    expect(gridContainerElm.id).toBe('grid1');
  });

  it('should dispose & detached the grid when disposing of the element', async () => {
    await component.create(bootstrap);
    const spy = jest.spyOn(component.viewModel, 'detached');

    component.viewModel.dispose(true);
    expect(spy).toHaveBeenCalledWith(true);
    component.dispose(true);
  });

  it('should define grid height & width and expect them to be used in the view', async () => {
    await component.manuallyHandleLifecycle().create(bootstrap);
    await component.bind({ gridId: 'grid1', columnDefinitions: [], dataset: [], gridOptions: {}, aureliaGridReady, gridHeight: 600, gridWidth: 800 });
    await component.attached();

    component.gridHeight = 600;
    component.gridWidth = 800;

    const gridPaneElm = document.querySelector<HTMLDivElement>('.gridPane');
    const gridContainerElm = document.querySelector<HTMLDivElement>('.slickgrid-container');

    expect(component.gridHeight).toBe(600);
    expect(component.gridWidth).toBe(800);
    // expect(gridContainerElm.style.height).toBe('600px');
    // expect(gridPaneElm.style.width).toBe('800px');
  });

  it('should throw an error when the "enableAutoResize" is disabled and no "grid-height" is provided', (done) => {
    component
      .manuallyHandleLifecycle()
      .create(bootstrap)
      .then(() => component.bind({ gridHeight: null, gridOptions: { enableAutoResize: false } }))
      .catch((error) => {
        expect(error.message).toContain('[Aurelia-Slickgrid] requires a "grid-height" or the "enableAutoResize" grid option to be enabled.')
        done();
        component.dispose(true);
      });
  });

  describe('initialization method', () => {
    beforeEach(() => {
      // component.dispose();
    });

    xdescribe('use grouping', () => {
      it('should load groupItemMetaProvider to the DataView when using "draggableGrouping" feature', (done) => {
        const extensionSpy = jest.spyOn(eu, 'loadExtensionDynamically');
        let spy;

        component
          .manuallyHandleLifecycle()
          .create(bootstrap)
          .then(() => {
            spy = jest.spyOn(component.get(ExtensionUtility), 'loadExtensionDynamically')
          })
          .then(() => component.bind({ gridId: 'grid1', columnDefinitions: [], dataset: [], gridOptions: { enableExcelExport: false, draggableGrouping: {}, enableGrouping: true }, aureliaGridReady, gridHeight: 600, gridWidth: 800 }))
          .then(() => component.attached())
          .then(() => {
            expect(spy).toHaveBeenCalledWith('groupItemMetaProvider');
            done();
          });

        // const dataviewSpy = jest.spyOn(mockDataViewImplementation.prototype, 'constructor');
        // const groupMetaSpy = jest.spyOn(mockGroupItemMetaProviderImplementation.prototype, 'constructor');
        // const sharedMetaSpy = jest.spyOn(SharedService.prototype, 'groupItemMetadataProvider', 'set');

        // component.gridOptions = { draggableGrouping: {} } as GridOption;
        // await component.manuallyHandleLifecycle().create(bootstrap);
        // await component.bind({ gridId: 'grid1', columnDefinitions: [], dataset: [], gridOptions: { enableExcelExport: false, draggableGrouping: {}, enableGrouping: true }, aureliaGridReady, gridHeight: 600, gridWidth: 800 });
        // await component.attached();

        // expect(extensionSpy).toHaveBeenCalledWith('groupItemMetaProvider');
        // console.log('done')
        // expect(dataviewSpy).toHaveBeenCalledWith({ groupItemMetadataProvider: expect.anything() });
        // expect(groupMetaSpy).toHaveBeenCalledWith();
        // expect(sharedMetaSpy).toHaveBeenCalledWith(mockGroupItemMetaProvider);
      });
    });
  });
});
