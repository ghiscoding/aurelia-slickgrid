// we want font-awesome to load as soon as possible to show the fa-spinner
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'multiple-select-modified/src/multiple-select.css';
import './styles.scss';
import { Aurelia, PLATFORM } from 'aurelia-framework';
import environment from './environment';
import { I18N, TCustomAttribute } from 'aurelia-i18n';
import Backend from 'i18next-xhr-backend';
import 'bootstrap';
import { SlickgridConfig } from './aurelia-slickgrid';

export async function configure(aurelia: Aurelia) {
  aurelia.use.standardConfiguration();

  aurelia.use.feature(PLATFORM.moduleName('examples/resources/index'));

  // local aurelia-slickgrid
  aurelia.use.feature(PLATFORM.moduleName('aurelia-slickgrid/index'), (config: SlickgridConfig) => {
    // load necessary Flatpickr Locale(s), but make sure it's imported AFTER loading Aurelia-Slickgrid plugin
    import('flatpickr/dist/l10n/fr');

    // change any of the default global options
    config.options.gridMenu!.iconCssClass = 'fa fa-bars';
  });

  // aurelia i18n to handle multiple locales
  aurelia.use.plugin(PLATFORM.moduleName('aurelia-i18n'), (instance: I18N) => {
    const aliases = ['t', 'i18n'];
    // add aliases for 't' attribute
    TCustomAttribute.configureAliases(aliases);

    // register backend plugin
    instance.i18next.use(Backend);

    return instance.setup({
      backend: {
        loadPath: 'assets/i18n/{{lng}}/{{ns}}.json',
      },
      lng: 'en',
      ns: ['aurelia-slickgrid'],
      defaultNS: 'aurelia-slickgrid',
      attributes: aliases,
      fallbackLng: 'en',
      debug: false
    });
  });

  await aurelia.start();
  await aurelia.setRoot(PLATFORM.moduleName('app'));
}
