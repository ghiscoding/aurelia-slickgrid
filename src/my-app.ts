import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'flatpickr/dist/flatpickr.min.css';
import './styles.scss';
import { Example1 } from './examples/slickgrid/example1';
import { Example2 } from './examples/slickgrid/example2';
import { Example3 } from './examples/slickgrid/example3';
import { Example4 } from './examples/slickgrid/example4';
import { Example5 } from './examples/slickgrid/example5';
import { Example6 } from './examples/slickgrid/example6';
import { Example7 } from './examples/slickgrid/example7';
import { Example8 } from './examples/slickgrid/example8';
import { Example9 } from './examples/slickgrid/example9';
import { Example10 } from './examples/slickgrid/example10';
import { Example11 } from './examples/slickgrid/example11';
import { Example12 } from './examples/slickgrid/example12';
import { Example13 } from './examples/slickgrid/example13';
import { Example14 } from './examples/slickgrid/example14';
import { Example15 } from './examples/slickgrid/example15';
import { Example16 } from './examples/slickgrid/example16';
import { Example17 } from './examples/slickgrid/example17';
import { Example18 } from './examples/slickgrid/example18';
import { Example19 } from './examples/slickgrid/example19';
import { Example20 } from './examples/slickgrid/example20';
import { HomePage } from './home-page';

export class MyApp {
  static routes = [
    { path: '', component: HomePage, /* () => import('./home-page') */ title: 'Home' },
    { path: 'example1', component: Example1 /* () => import('./examples/slickgrid/example1') */, title: 'Example 1' },
    { path: 'example2', component: Example2 /* () => import('./examples/slickgrid/example2') */, title: 'Example 2' },
    { path: 'example3', component: Example3 /* () => import('./examples/slickgrid/example3') */, title: 'Example 3' },
    { path: 'example4', component: Example4 /* () => import('./examples/slickgrid/example4') */, title: 'Example 4' },
    { path: 'example5', component: Example5 /* () => import('./examples/slickgrid/example5') */, title: 'Example 5' },
    { path: 'example6', component: Example6 /* () => import('./examples/slickgrid/example6') */, title: 'Example 6' },
    { path: 'example7', component: Example7 /* () => import('./examples/slickgrid/example7') */, title: 'Example 7' },
    { path: 'example8', component: Example8 /* () => import('./examples/slickgrid/example8') */, title: 'Example 8' },
    { path: 'example9', component: Example9 /* () => import('./examples/slickgrid/example9') */, title: 'Example 9' },
    { path: 'example10', component: Example10 /* () => import('./examples/slickgrid/example10') */, title: 'Example 10' },
    { path: 'example11', component: Example11 /* () => import('./examples/slickgrid/example11') */, title: 'Example 11' },
    { path: 'example12', component: Example12 /* () => import('./examples/slickgrid/example12') */, title: 'Example 12' },
    { path: 'example13', component: Example13 /* () => import('./examples/slickgrid/example13') */, title: 'Example 13' },
    { path: 'example14', component: Example14 /* () => import('./examples/slickgrid/example14') */, title: 'Example 14' },
    { path: 'example15', component: Example15 /* () => import('./examples/slickgrid/example15') */, title: 'Example 15' },
    { path: 'example16', component: Example16 /* () => import('./examples/slickgrid/example16') */, title: 'Example 16' },
    { path: 'example17', component: Example17 /* () => import('./examples/slickgrid/example17') */, title: 'Example 17' },
    { path: 'example18', component: Example18 /* () => import('./examples/slickgrid/example18') */, title: 'Example 18' },
    { path: 'example19', component: Example19 /* () => import('./examples/slickgrid/example19') */, title: 'Example 19' },
    { path: 'example20', component: Example20 /* () => import('./examples/slickgrid/example20') */, title: 'Example 20' },
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
