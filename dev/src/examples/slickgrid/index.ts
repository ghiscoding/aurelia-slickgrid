import { Aurelia, autoinject, PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

@autoinject()
export class Index {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    const mapping: any = [
      { route: ['', 'example1'], moduleId: PLATFORM.moduleName('./example1'), name: 'example1', nav: true, title: '1- Basic Grid' },
      { route: 'example2', moduleId: PLATFORM.moduleName('./example2'), name: 'example2', nav: true, title: '2- Formatters' },
      { route: 'example3', moduleId: PLATFORM.moduleName('./example3'), name: 'example3', nav: true, title: '3- Backend OData Service' },
      { route: 'example4', moduleId: PLATFORM.moduleName('./example4'), name: 'example4', nav: true, title: '4- Editors' }
    ];

    config.map(mapping);

    this.router = router;
  }
}
