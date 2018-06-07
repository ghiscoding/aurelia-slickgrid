/// <reference types="aurelia-loader-webpack/src/webpack-hot-interface"/>

// we want font-awesome to load as soon as possible to show the fa-spinner
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import 'flatpickr/dist/flatpickr.min.css';
import './styles/styles.css';
import 'aurelia-slickgrid/dist/lib/multiple-select/multiple-select.css';
import 'aurelia-slickgrid/dist/lib/multiple-select/multiple-select.js';
import 'aurelia-slickgrid/dist/styles/css/slickgrid-theme-bootstrap.css';
import { Aurelia, PLATFORM } from 'aurelia-framework';
import environment from './environment';
import { I18N, TCustomAttribute } from 'aurelia-i18n';
import * as Backend from 'i18next-xhr-backend';
import * as Bluebird from 'bluebird';
import 'bootstrap';

/** Disable long stack traces for IE11 */
Bluebird.config({
  warnings: {
    wForgottenReturn: false
  },
  longStackTraces: false
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature(PLATFORM.moduleName('resources/index'));

  aurelia.use.plugin(PLATFORM.moduleName('aurelia-slickgrid'), config => {
    // change any of the default global options
    config.options.gridMenu.iconCssClass = 'fa fa-bars';
  });

  // aurelia i18n to handle multiple locales
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-i18n'), (instance) => {
    // register backend plugin
    instance.i18next.use(Backend);

    return instance.setup({
      backend: {
        loadPath: './assets/i18n/{{lng}}/{{ns}}.json',
      },
      lng: 'en',
      ns: ['aurelia-slickgrid'],
      defaultNS: 'aurelia-slickgrid',
      attributes: ['t', 'i18n'],
      fallbackLng: 'en',
      debug: false
    });
  });

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('app')));
}
