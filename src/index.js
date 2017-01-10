import {SlickPager} from './slick-pager';
import {SlickWindowResizer} from './slick-window-resizer';
import {SlickService} from './slick-service';

export function configure(aurelia) {
  aurelia.globalResources('./slick-pager');
}

export {
  SlickPager,
  SlickWindowResizer,
  SlickService
}
