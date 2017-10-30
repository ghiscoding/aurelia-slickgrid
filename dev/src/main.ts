/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>

// we want font-awesome to load as soon as possible to show the fa-spinner
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import './styles.css';
import './slickgrid.scss';
import { PLATFORM } from 'aurelia-pal';
import { Aurelia } from 'aurelia-framework';
import environment from './environment';
import * as Bluebird from 'bluebird';
import 'bootstrap';

// remove out if you don't want a Promise polyfill (remove also from webpack.config.js)
Bluebird.config({ warnings: { wForgottenReturn: false } });

export function configure(aurelia: Aurelia) {
  aurelia.use.standardConfiguration();

  aurelia.use.feature(PLATFORM.moduleName('examples/resources/index'));

  // local aurelia-slickgrid
  aurelia.use.feature(PLATFORM.moduleName('aurelia-slickgrid/index'));

  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-slickgrid'));

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
