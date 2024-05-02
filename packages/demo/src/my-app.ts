import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';

export class MyApp {
  static routes = [
    { path: ['', 'example1'], component: () => import('./examples/slickgrid/example1'), title: '1- Basic Grid / 2 Grids' },
    { path: 'example2', component: () => import('./examples/slickgrid/example2'), title: '2- Formatters' },
    { path: 'example3', component: () => import('./examples/slickgrid/example3'), title: '3- Editors / Delete' },
    { path: 'example4', component: () => import('./examples/slickgrid/example4'), title: '4- Client Side Sort/Filter' },
    { path: 'example5', component: () => import('./examples/slickgrid/example5'), title: '5- Backend OData Service' },
    { path: 'example6', component: () => import('./examples/slickgrid/example6'), title: '6- Backend GraphQL Service' },
    { path: 'example7', component: () => import('./examples/slickgrid/example7'), title: '7- Header Button Plugin' },
    { path: 'example8', component: () => import('./examples/slickgrid/example8'), title: '8- Header Menu Plugin' },
    { path: 'example9', component: () => import('./examples/slickgrid/example9'), title: '9- Grid Menu Control' },
    { path: 'example10', component: () => import('./examples/slickgrid/example10'), title: '10- Row Selection / 2 Grids' },
    { path: 'example11', component: () => import('./examples/slickgrid/example11'), title: '11- Add/Update Grid Item' },
    { path: 'example12', component: () => import('./examples/slickgrid/example12'), title: '12- Localization (i18n)' },
    { path: 'example13', component: () => import('./examples/slickgrid/example13'), title: '13- Grouping & Aggregators' },
    { path: 'example14', component: () => import('./examples/slickgrid/example14'), title: '14- Column Span & Header Grouping' },
    { path: 'example15', component: () => import('./examples/slickgrid/example15'), title: '15- Grid State & Local Storage' },
    { path: 'example16', component: () => import('./examples/slickgrid/example16'), title: '16- Row Move Plugin' },
    { path: 'example17', component: () => import('./examples/slickgrid/example17'), title: '17- Remote Model' },
    { path: 'example18', component: () => import('./examples/slickgrid/example18'), title: '18- Draggable Grouping' },
    { path: 'example19', component: () => import('./examples/slickgrid/example19'), title: '19- Row Detail View' },
    { path: 'example20', component: () => import('./examples/slickgrid/example20'), title: '20- Pinned Columns/Rows' },
    { path: 'example21', component: () => import('./examples/slickgrid/example21'), title: '21- Grid AutoHeight (full height)' },
    { path: 'example22', component: () => import('./examples/slickgrid/example22'), title: '22- with Bootstrap Tabs' },
    { path: 'example23', component: () => import('./examples/slickgrid/example23'), title: '23- Filter by Range of Values' },
    { path: 'example24', component: () => import('./examples/slickgrid/example24'), title: '24- Cell & Context Menu' },
    { path: 'example25', component: () => import('./examples/slickgrid/example25'), title: '25- GraphQL without Pagination' },
    { path: 'example26', component: () => import('./examples/slickgrid/example26'), title: '26- Use of Aurelia Components' },
    { path: 'example27', component: () => import('./examples/slickgrid/example27'), title: '27- Tree Data (Parent/Child)' },
    { path: 'example28', component: () => import('./examples/slickgrid/example28'), title: '28- Tree Data (Hierarchical set)' },
    { path: 'example29', component: () => import('./examples/slickgrid/example29'), title: '29- Grid with header and footer slots' },
    { path: 'example30', component: () => import('./examples/slickgrid/example30'), title: '30- Composite Editor Modal' },
    { path: 'example31', component: () => import('./examples/slickgrid/example31'), title: '31- Backend OData with RxJS' },
    { path: 'example32', component: () => import('./examples/slickgrid/example32'), title: '32- Columns Resize by Content' },
    { path: 'example33', component: () => import('./examples/slickgrid/example33'), title: '33- Regular & Custom Tooltip' },
    { path: 'example34', component: () => import('./examples/slickgrid/example34'), title: '34- Real-Time Trading Platform' },
    { path: 'example35', component: () => import('./examples/slickgrid/example35'), title: '35- Row Based Editing' },
    { path: 'home', component: () => import('./home-page'), title: 'Home' },
  ];

  routes = MyApp.routes;

  attached() {
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
