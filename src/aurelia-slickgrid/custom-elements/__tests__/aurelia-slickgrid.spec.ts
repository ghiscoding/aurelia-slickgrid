import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';
import { SlickgridConfig } from '../../slickgrid-config';

const eventAggregator = {
  publish: jest.fn(),
  subscribe: jest.fn()
};
jest.mock('aurelia-event-aggregator', () => ({
  EventAggregator: () => eventAggregator
}));
jest.mock('flatpickr', () => { });

const aureliaGridReady = jest.fn();

describe('Aurelia-Slickgrid Custom Component', () => {
  let customElement;
  const view = `<aurelia-slickgrid
    grid-id="grid1"
    column-definitions.bind="columnDefinitions"
    grid-options.bind="gridOptions"
    dataset.bind="dataset">
  </aurelia-slickgrid>`;

  beforeEach(() => {
    customElement = StageComponent
      .withResources([
        PLATFORM.moduleName('../aurelia-slickgrid'),
        PLATFORM.moduleName('../slick-pagination'),
        PLATFORM.moduleName('../../value-converters/asgNumber')
      ])
      .inView(view)
      .boundTo({ gridId: 'grid1', columnDefinitions: [], dataset: [], gridOptions: { enableFiltering: true }, aureliaGridReady });

    customElement.bootstrap((aurelia) => {
      aurelia.use.standardConfiguration();
      // aurelia.container.registerInstance(SlickgridConfig, new SlickgridConfig());
    });
  });

  it('should make sure Aurelia-Slickgrid is defined', () => {
    expect(customElement).toBeTruthy();
    expect(customElement.constructor).toBeDefined();
  });

  it('should create a grid and expect multiple Event Aggregator being called', async () => {
    await customElement.create(bootstrap);

    expect(eventAggregator.publish).toHaveBeenCalled();
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(1, 'onBeforeGridCreate', true);
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(3, 'onGridCreated', expect.any(Object));

    customElement.dispose();
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(4, 'onBeforeGridDestroy', expect.any(Object));
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(5, 'onAfterGridDestroyed', true);
  });

  it('should create a grid and expect multiple CustomEvent being dispatched', (done) => {
    let spy;

    customElement
      .manuallyHandleLifecycle()
      .create(bootstrap)
      .then(() => spy = jest.spyOn(customElement.viewModel, 'dispatchCustomEvent'))
      .then(() => customElement.bind())
      .then(() => customElement.attached())
      .then(() => {
        expect(spy).toHaveBeenNthCalledWith(1, 'asg-on-before-grid-create');
        expect(spy).toHaveBeenNthCalledWith(2, 'asg-on-dataview-created', expect.any(Object));
        expect(spy).toHaveBeenNthCalledWith(3, 'sg-on-scroll', expect.any(Object));
        expect(spy).toHaveBeenNthCalledWith(4, 'sg-on-rendered', expect.any(Object));
        expect(spy).toHaveBeenNthCalledWith(5, 'sg-on-set-items-called', expect.any(Object));
        expect(spy).toHaveBeenNthCalledWith(6, 'asg-on-grid-created', expect.any(Object));
        expect(spy).toHaveBeenLastCalledWith('asg-on-aurelia-grid-created', expect.any(Object));
      })
      .then(() => customElement.detached(true))
      .then(() => {
        expect(spy).toHaveBeenLastCalledWith('asg-on-after-grid-destroyed', expect.any(Object));
      })
      .then(() => customElement.unbind())
      .then(done)
      .then(() => customElement.dispose(true));
  });

  it('should trigger a dataView event when dataset changed', async (done) => {
    const mockDataset = [{ id: 1, firstName: 'John' }, { id: 2, firstName: 'Jane' }];

    await customElement.create(bootstrap);
    const gridSpy = jest.spyOn(customElement.viewModel.grid, 'render');
    const dispatchSpy = jest.spyOn(customElement.viewModel, 'dispatchCustomEvent');
    expect(eventAggregator.publish).toHaveBeenCalled();
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(1, 'onBeforeGridCreate', true);
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(2, 'onDataviewCreated', expect.any(Object));
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(3, 'onGridCreated', expect.any(Object));
    customElement.viewModel.dataset = mockDataset;

    setTimeout(() => {
      expect(dispatchSpy).toHaveBeenCalledWith('sg-on-rows-changed', expect.any(Object));
      expect(gridSpy).toHaveBeenCalled();
      done();
      customElement.dispose(true);
      expect(eventAggregator.publish).toHaveBeenNthCalledWith(4, 'onBeforeGridDestroy', expect.any(Object));
      expect(eventAggregator.publish).toHaveBeenNthCalledWith(5, 'onAfterGridDestroyed', true);
    }, 50);
  });

  it('should create a grid and a slickgrid container in the DOM', async () => {
    await customElement.manuallyHandleLifecycle().create(bootstrap);
    await customElement.bind();
    await customElement.attached();
    const gridElement = customElement.element.querySelector('.gridPane');

    expect(gridElement.innerHTML).toContain('grid1');
    expect(gridElement.id).toBe('slickGridContainer-grid1');
  });

  it('should dispose & detached the grid when disposing of the element', async () => {
    await customElement.create(bootstrap);
    const spy = jest.spyOn(customElement.viewModel, 'detached');

    customElement.viewModel.dispose(true);
    expect(spy).toHaveBeenCalledWith(true);
    customElement.dispose(true);
  });

  it('should throw an error when the "enableAutoResize" is disabled and no "grid-height" is provided', (done) => {
    customElement
      .manuallyHandleLifecycle()
      .create(bootstrap)
      .then(() => customElement.bind({ gridHeight: null, gridOptions: { enableAutoResize: false } }))
      .catch((error) => {
        expect(error.message).toContain('[Aurelia-Slickgrid] requires a "grid-height" or the "enableAutoResize" grid option to be enabled.')
        done();
        customElement.dispose(true);
      });
  });
});
