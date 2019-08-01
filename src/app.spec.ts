import { App } from './app';
import { PLATFORM } from 'aurelia-pal';

class RouterStub {
  routes;
  options: any = {};

  configure(handler) {
    handler(this);
  }

  map(routes) {
    this.routes = routes;
  }
}

describe('the app module', () => {
  let sut: any;
  let mockedRouter: any;

  beforeEach(() => {
    mockedRouter = new RouterStub();
    sut = new App();
    sut.configureRouter(mockedRouter, mockedRouter);
  });

  it('should configureRouter is defined', () => {
    expect(sut.configureRouter).toBeDefined();
  });

  xit('should have pushState enabled', () => {
    expect(sut.router.options.pushState).toBeTruthy();
  });

  it('should contains a router property', () => {
    expect(sut.router).toBeDefined();
  });

  it('should configures the router title', () => {
    expect(sut.router.title).toEqual('Aurelia-Slickgrid');
  });

  it('should have a Home route', () => {
    expect(sut.router.routes).toContainEqual({ route: 'home', name: 'home', title: 'Home', moduleId: PLATFORM.moduleName('./examples/home'), nav: true, settings: { icon: 'fa fa-home' } });
  });

  it('should have a Slickgrid route', () => {
    expect(sut.router.routes).toContainEqual({ route: 'slickgrid', name: 'slickgrid', title: 'SlickGrid Examples', moduleId: PLATFORM.moduleName('./examples/slickgrid/index'), nav: true });
  });

  it('should have a redirect on empty route', () => {
    expect(sut.router.routes).toContainEqual({ route: '', redirect: 'slickgrid' });
  });
});
