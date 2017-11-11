
import { Aurelia, autoinject, PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

@autoinject()
export class App {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = 'Aurelia-Slickgrid';
    config.map([
      { route: 'slickgrid', name: 'slickgrid', title: 'Examples', moduleId: PLATFORM.moduleName('./examples/slickgrid/index'), nav: true },
      { route: '', redirect: 'slickgrid' }
    ]);

    this.router = router;
  }
}
