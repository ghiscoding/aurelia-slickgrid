import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'flatpickr/dist/flatpickr.min.css';
import './styles.scss';
import '@slickgrid-universal/common/dist/styles/css/slickgrid-theme-bootstrap.css';
import { Example1 } from './examples/slickgrid/example1';
import { Example15 } from './examples/slickgrid/example15';
import { Example19 } from './examples/slickgrid/example19';
import { Example2 } from './examples/slickgrid/example2';
import { HomePage } from './home-page';

export class MyApp {
  static routes = [
    { path: '', component: HomePage, title: 'Home' },
    { path: 'example1', component: Example1, title: 'Example 1' },
    { path: 'example2', component: Example2, title: 'Example 2' },
    { path: 'example15', component: Example15, title: 'Example 15' },
    { path: 'example19', component: Example19, title: 'Example 19' },
  ];

  routes = MyApp.routes;

  attaching() {
    this.addGitHubStarsLogo();
  }

  addGitHubStarsLogo() {
    // GitHub logo with Stars shouldn't be created while testing in Cypress (which always wait few seconds even minutes to load the logo)
    // <a href="https://github.com/ghiscoding/slickgrid-universal"><img src="https://img.shields.io/github/stars/ghiscoding/slickgrid-universal?style=social"></a>
    const decodedCookie = decodeURIComponent(document.cookie);
    if (decodedCookie !== 'serve-mode=cypress') {
      const ghStarLinkElm = document.createElement('a');
      ghStarLinkElm.href = 'https://github.com/ghiscoding/aurelia-slickgrid';

      const imgStarElm = document.createElement('img');
      imgStarElm.src = 'https://img.shields.io/github/stars/ghiscoding/aurelia-slickgrid?style=social';

      const ghButtonContainerElm = document.querySelector('.github-button-container');
      if (ghButtonContainerElm && !ghButtonContainerElm.querySelector('a')) {
        ghStarLinkElm.appendChild(imgStarElm);
        ghButtonContainerElm.appendChild(ghStarLinkElm);
      }
    }
  }
}
