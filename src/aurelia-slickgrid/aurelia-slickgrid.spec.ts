import { StageComponent, ComponentTester } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { Container } from 'aurelia-dependency-injection';
import { PLATFORM } from 'aurelia-pal';
import { AureliaSlickgridCustomElement } from './aurelia-slickgrid';
import { ExtensionService, ExportService, FilterService, GridEventService, GridService, GridStateService, GroupingAndColspanService, ResizerService, SharedService, SortService } from './services';
import { BindingEngine } from 'aurelia-binding';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ExtensionUtility } from './extensions';

// jest.mock('slickgrid/slick.grid', () => { });
jest.mock('flatpickr', () => { });

describe('Aurelia-Slickgrid Custom Component', () => {
  // let component: ComponentTester<AureliaSlickgridCustomElement>;
  let component;
  let container: Container;
  let bindingEngine;
  let exportService;
  let eventAggregator;
  let extensionService;
  let extensionUtility;
  let filterService;
  let gridEventService;
  let gridService;
  let gridStateService;
  let groupingAndColspanService;
  let resizerService;
  let sharedService;
  let sortService;
  let viewModel: AureliaSlickgridCustomElement;

  beforeEach(() => {
    container = new Container();
    bindingEngine = container.get(BindingEngine);
    exportService = container.get(ExportService);
    eventAggregator = container.get(EventAggregator);
    extensionService = container.get(ExtensionService);
    extensionUtility = container.get(ExtensionUtility);
    filterService = container.get(FilterService);
    gridEventService = container.get(GridEventService);
    gridService = container.get(GridService);
    gridStateService = container.get(GridStateService);
    groupingAndColspanService = container.get(GroupingAndColspanService);
    resizerService = container.get(ResizerService);
    sharedService = container.get(SharedService);
    sortService = container.get(SortService);
    // viewModel = container.get(AureliaSlickgridCustomElement);

    component = StageComponent
      .withResources(PLATFORM.moduleName('./aurelia-slickgrid'))
      .inView('<aurelia-slickgrid grid-id.bind="gridId"></aurelia-slickgrid>')
      .boundTo({ gridId: 'grid1', Slick: {} });
    // .boundTo(viewModel);

    component.bootstrap((aurelia) => {
      aurelia.use.standardConfiguration();
      // aurelia.container.registerInstance(BindingEngine, bindingEngine);
    });
  });

  it('should make sure Aurelia-Slickgrid is defined', () => {
    expect(component).toBeTruthy();
  });

  it('should create a grid and a slickgrid container in the DOM', (done) => {
    component.create(bootstrap)
      .then(() => {
        const gridElement = document.querySelector('.gridPane');
        expect(gridElement.innerHTML).toContain('grid1');
        expect(gridElement.id).toBe('slickGridContainer-grid1');
        done();
        component.dispose();
      })
      .catch((error) => console.log(error));

  });
});


