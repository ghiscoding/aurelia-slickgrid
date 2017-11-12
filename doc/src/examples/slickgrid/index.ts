import { Aurelia, autoinject, PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

@autoinject()
export class Index {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    const mapping: any = [
      { route: ['', 'example1'], moduleId: PLATFORM.moduleName('./example1'), name: 'example1', nav: true, title: '1- Basic Grid' },
      { route: 'example2', moduleId: PLATFORM.moduleName('./example2'), name: 'example2', nav: true, title: '2- Formatters' },
      { route: 'example3', moduleId: PLATFORM.moduleName('./example3'), name: 'example3', nav: true, title: '3- Editors' },
      { route: 'example4', moduleId: PLATFORM.moduleName('./example4'), name: 'example4', nav: true, title: '4- Client Side Sort/Filter' },
      { route: 'example5', moduleId: PLATFORM.moduleName('./example5'), name: 'example5', nav: true, title: '5- Backend OData Service' },
      { route: 'example6', moduleId: PLATFORM.moduleName('./example6'), name: 'example6', nav: true, title: '6- Backend GraphQL Service' },
      { route: 'example7', moduleId: PLATFORM.moduleName('./example7'), name: 'example7', nav: true, title: '7- Header Button Plugin' },
      { route: 'example8', moduleId: PLATFORM.moduleName('./example8'), name: 'example8', nav: true, title: '8- Header Menu Plugin' },
      { route: 'example9', moduleId: PLATFORM.moduleName('./example9'), name: 'example9', nav: true, title: '9- Grid Menu Control' }
    ];

    config.map(mapping);

    this.router = router;
  }
}
