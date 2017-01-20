export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name: 'welcome',    moduleId: './welcome', nav: true, title: 'Welcome' },
      { route: 'slickgrid',     name: 'slickgrid',  moduleId: './modules/slickgrid/index', nav: true, title: 'Slickgrid' }
    ]);

    this.router = router;
  }
}
