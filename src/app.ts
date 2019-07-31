
import { autoinject, PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

@autoinject()
export class App {
  router: Router;
  title = 'Aurelia-Slickgrid';

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = this.title;
    // config.options.pushState = true;
    config.map([
      { route: 'home', name: 'home', title: 'Home', moduleId: PLATFORM.moduleName('./examples/home'), nav: true, settings: { icon: 'fa fa-home' } },
      { route: 'slickgrid', name: 'slickgrid', title: 'SlickGrid Examples', moduleId: PLATFORM.moduleName('./examples/slickgrid/index'), nav: true },
      { route: '', redirect: 'slickgrid' }
    ]);

    this.router = router;
  }
}
