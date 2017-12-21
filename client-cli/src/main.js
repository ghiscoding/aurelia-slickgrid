import environment from './environment';
import { I18N, TCustomAttribute } from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';
import 'bootstrap';


export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('aurelia-slickgrid')
    .feature('resources');

  // aurelia i18n to handle multiple locales
  aurelia.use.plugin('aurelia-i18n', (instance) => {
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
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
