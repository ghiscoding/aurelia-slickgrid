import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import '@slickgrid-universal/common/dist/styles/css/slickgrid-theme-material.css';
import { Example1 } from './examples/slickgrid/example1';
import { Example19 } from './examples/slickgrid/example19';
import { Example2 } from './examples/slickgrid/example2';
import { HomePage } from './home-page';

export class MyApp {
  static routes = [
    { path: '', component: HomePage, title: 'Home' },
    { path: 'example1', component: Example1, title: 'Example 1' },
    { path: 'example2', component: Example2, title: 'Example 2' },
    { path: 'example19', component: Example19, title: 'Example 19' },
  ];

  routes = MyApp.routes;
}
