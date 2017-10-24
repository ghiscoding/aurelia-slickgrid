export class Index {
  configureRouter(config, router) {
    let mapping = [
      { route: ['', 'example1'], moduleId: './example1', name: 'example1', nav: true, title: 'Example 1' }
    ];

    // create mapping for x number of Examples (skip Example1 since it was created earlier, so start at 2)
    let totalExamples = 4;
    for (let i = 2; i <= totalExamples; i++) {
      mapping.push({ route: `example${i}`, moduleId: `./example${i}`, nav: true, name: `example${i}`, title: `Example ${i}` });
    }

    config.map(mapping);

    this.router = router;
  }

}
