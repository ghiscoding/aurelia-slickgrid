import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { PLATFORM } from 'aurelia-pal';

// jest.mock('slickgrid/slick.grid', () => { });
const eventAggregator = {
  publish: jest.fn(),
  subscribe: jest.fn()
}
jest.mock('flatpickr', () => { });
jest.mock('aurelia-event-aggregator', () => ({
  EventAggregator: eventAggregator
}));

const aureliaGridReady = jest.fn();

describe('Aurelia-Slickgrid Custom Component', () => {
  let component;
  const view = `<aurelia-slickgrid
    grid-id.bind="gridId"
    column-definitions: columnDefinitions
    dataset.bind="dataset"
    grid-options.bind="gridOptions"
    asg-on-aurelia-grid-created.delegate="aureliaGridReady($event.detail)">
  </aurelia-slickgrid>`;

  beforeEach(() => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('./aurelia-slickgrid'))
      .inView(view)
      .boundTo({ gridId: 'grid1', columnDefinitions: [], dataset: [], gridOptions: {}, aureliaGridReady });

    component.bootstrap((aurelia) => {
      aurelia.use.standardConfiguration();
    });
  });

  it('should make sure Aurelia-Slickgrid is defined', () => {
    expect(component).toBeTruthy();
    expect(component.constructor).toBeDefined();
  });

  it('should create a grid and expect multiple Event Aggregator being called', async () => {
    await component.create(bootstrap);
    expect(eventAggregator.publish).toHaveBeenCalledTimes(3);
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(1, 'onBeforeGridCreate', true);
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(2, 'onGridCreated', expect.any(Object));
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(3, 'onDataviewCreated', expect.any(Object));

    component.dispose();
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(4, 'onBeforeGridDestroy', expect.any(Object));
    expect(eventAggregator.publish).toHaveBeenNthCalledWith(5, 'onAfterGridDestroyed', true);
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
        expect(spy).toHaveBeenNthCalledWith(2, 'sg-on-scroll', expect.any(Object));
        expect(spy).toHaveBeenNthCalledWith(3, 'sg-on-rendered', expect.any(Object));
        expect(spy).toHaveBeenNthCalledWith(4, 'asg-on-grid-created', expect.any(Object));
        expect(spy).toHaveBeenNthCalledWith(5, 'asg-on-dataview-created', expect.any(Object));
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
    await component.create(bootstrap);
    const gridElement = document.querySelector('.gridPane');

    expect(gridElement.innerHTML).toContain('grid1');
    expect(gridElement.id).toBe('slickGridContainer-grid1');
  });

  it('should dispose & detache the grid when disposing of the element', async () => {
    await component.create(bootstrap);
    const spy = jest.spyOn(component.viewModel, 'detached');

    component.viewModel.dispose(true);
    expect(spy).toHaveBeenCalledWith(true);
    component.dispose(true);
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
});


