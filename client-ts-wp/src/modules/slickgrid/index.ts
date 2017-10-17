import { Aurelia, autoinject, PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

@autoinject()
export class Index {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    let mapping = [
      { route: ['', 'example1'], moduleId: PLATFORM.moduleName('./example1'), name: 'example1', nav: true, title: 'Example 1' },
      { route: 'example2', moduleId: PLATFORM.moduleName('./example2'), name: 'example2', nav: true, title: 'Example 2' }
    ];
    /*
        // create mapping for x number of Examples (skip Example1 since it was created earlier, so start at 2)
        let totalExamples = 2;
        for (let i = 2; i <= totalExamples; i++) {
          // mapping.push({ route: `example${i}`, moduleId: PLATFORM.moduleName(`./example${i}`), nav: true, name: `example${i}`, title: `Example ${i}` });
          mapping.push(
            { route: `example${i}`, moduleId: PLATFORM.moduleName(`./example${i}`), name: `example${i}`, nav: true, title: `Example ${i}` }
          );
        }
    */
    config.map(mapping);

    this.router = router;
  }
}
