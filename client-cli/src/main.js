import environment from './environment';
import 'bootstrap';


export function configure(aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin('aurelia-slickgrid')
    .feature('resources');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
