export class App {
  constructor(api) {
    this.api = api;
  }

  configureRouter(config, router){
    config.title = 'Aurelia';
    config.map([
      { route: 'slickgrid', name: 'slickgrid', moduleId: './modules/slickgrid/index', nav: true, title: 'Slickgrid' },
      { route: '',          redirect: 'slickgrid' }
    ]);

    this.router = router;
  }
}
