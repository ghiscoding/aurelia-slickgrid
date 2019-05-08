import { ResizerService } from './resizer.service';
import { EventAggregator } from 'aurelia-event-aggregator';
import { StageComponent } from 'aurelia-testing';
import { bootstrap } from 'aurelia-bootstrapper';
import { GridOption } from '../models';
import { DOM } from 'aurelia-pal';

const gridOptionMock = {
  gridId: 'grid1',
  autoResize: { containerId: 'demo-container' },
  enableAutoResize: true
} as GridOption;

const gridStub = {
  getOptions: () => gridOptionMock,
  getUID: () => 'abc123',
};

describe('Resizer Service', () => {
  let service: ResizerService;

  beforeEach(async () => {
    const component = StageComponent
      .withResources('../../app')
      .inView(`<div id="grid1"></div>`);
    await component.create(bootstrap);

    service = new ResizerService(new EventAggregator());
    service.init(gridStub);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should trigger a grid resize on a window resize', () => {
    // arrange
    const gridSpy = jest.spyOn(gridStub, 'getOptions');
    const serviceSpy = jest.spyOn(service, 'resizeGrid');

    // act
    // bind window resize & call a viewport resize
    service.bindAutoResizeDataGrid();
    Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 500 });
    window.dispatchEvent(DOM.createCustomEvent(`resize`, { bubbles: true }));

    // assert
    expect(gridSpy).toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();
  });
});
