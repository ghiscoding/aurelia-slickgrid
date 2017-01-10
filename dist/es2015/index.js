import { SlickService } from './slick-service';
import { SlickPager } from './slick-pager';
import { SlickWindowResizer } from './slick-window-resizer';

export function configure(aurelia) {
  aurelia.globalResources('./slick-pager');
}

export { SlickService, SlickPager, SlickWindowResizer };