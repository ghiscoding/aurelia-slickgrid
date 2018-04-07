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
      { route: 'example9', moduleId: PLATFORM.moduleName('./example9'), name: 'example9', nav: true, title: '9- Grid Menu Control' },
      { route: 'example10', moduleId: PLATFORM.moduleName('./example10'), name: 'example10', nav: true, title: '10- Row Selection' },
      { route: 'example11', moduleId: PLATFORM.moduleName('./example11'), name: 'example11', nav: true, title: '11- Add/Update Grid Item' },
      { route: 'example12', moduleId: PLATFORM.moduleName('./example12'), name: 'example12', nav: true, title: '12- Localization (i18n)' },
      { route: 'example13', moduleId: PLATFORM.moduleName('./example13'), name: 'example13', nav: true, title: '13- Grouping & Aggregators' },
      { route: 'example14', moduleId: PLATFORM.moduleName('./example14'), name: 'example14', nav: true, title: '14- Column Span' },
    ];

    config.map(mapping);

    this.router = router;
  }
}
