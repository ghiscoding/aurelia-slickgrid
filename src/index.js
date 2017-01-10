import {SlickService} from './slick-service';
import {SlickPager} from './slick-pager';
import {SlickWindowResizer} from './slick-window-resizer';

export function configure(aurelia, callback) {
  aurelia.globalResources('./slick-pager');

  let config = new BootstrapConfig();

  if (typeof callback === 'function') {
      callback(config);
  }
}

export {
  SlickService,
  SlickPager,
  SlickWindowResizer
}
