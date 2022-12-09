
import { autoinject, PLATFORM } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';

@autoinject()
export class App {
  router!: Router;
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

  attached() {
    this.addGitHubStarsLogo();
  }

  addGitHubStarsLogo() {
    // GitHub logo with Stars shouldn't be created while testing in Cypress (which always wait few seconds even minutes to load the logo)
    // <a href="https://github.com/slickclub/slickgrid-universal"><img src="https://img.shields.io/github/stars/slickclub/slickgrid-universal?style=social"></a>
    const decodedCookie = decodeURIComponent(document.cookie);
    if (decodedCookie !== 'serve-mode=cypress') {
      const ghStarLinkElm = document.createElement('a');
      ghStarLinkElm.href = 'https://github.com/slickclub/aurelia-slickgrid';

      const imgStarElm = document.createElement('img');
      imgStarElm.src = 'https://img.shields.io/github/stars/slickclub/aurelia-slickgrid?style=social';

      const ghButtonContainerElm = document.querySelector('.github-button-container');
      if (ghButtonContainerElm && !ghButtonContainerElm.querySelector('a')) {
        ghStarLinkElm.appendChild(imgStarElm);
        ghButtonContainerElm.appendChild(ghStarLinkElm);
      }
    }
  }
}
