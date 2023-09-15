import Aurelia/* , { StyleConfiguration }*/ from 'aurelia';
import { MyApp } from './my-app';
// Css files imported in this main file are NOT processed by style-loader
// They are for sharedStyles in shadowDOM.
// However, css files imported in other js/ts files are processed by style-loader.
// import shared from './shared.css';
import { AureliaSlickGridConfiguration } from './aurelia-slickgrid/index';
import { I18nConfiguration } from '@aurelia/i18n';
import Fetch from 'i18next-fetch-backend';
import { RouterConfiguration } from '@aurelia/router';
import { Example19DetailView } from './examples/slickgrid/example19-detail-view';
import { Example19Preload } from './examples/slickgrid/example19-preload';
import { DecimalValueConverter } from './examples/resources/value-converters/decimal';
import { StringifyValueConverter } from './examples/resources/value-converters/stringify';
import { DateFormatValueConverter } from './examples/resources/value-converters/date-format';

Aurelia
  /*
  .register(StyleConfiguration.shadowDOM({
    // optionally add the shared styles for all components
    sharedStyles: [shared]
  }))
  */
  // Register all exports of the plugin
  .register(RouterConfiguration.customize({ useHref: false }), Example19DetailView, Example19Preload)
  .register(I18nConfiguration.customize((options) => {
    options.translationAttributeAliases = ['i18n', 'tr'];
    options.initOptions = {
      backend: {
        loadPath: './assets/i18n/{{lng}}/{{ns}}.json',
      },
      lng: 'en',
      ns: ['aurelia-slickgrid'],
      defaultNS: 'aurelia-slickgrid',
      fallbackLng: 'en',
      debug: false,
      plugins: [Fetch],
    };
  }))
  .register(AureliaSlickGridConfiguration.customize(config => {
    import('flatpickr/dist/l10n/fr');

    // change any of the default global options
    config.options.gridMenu!.iconCssClass = 'fa fa-bars';
  }))
  .register(DecimalValueConverter, StringifyValueConverter, DateFormatValueConverter)
  .app(MyApp)
  .start();
