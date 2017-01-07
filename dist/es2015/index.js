import { AureliaSlickgrid } from './aurelia-slickgrid';
import { SlickPager } from './slick-pager';
import { SlickWindowResizer } from './slick-window-resizer';

export function configure(config) {
  config.globalResources('./aurelia-slickgrid');
  config.globalResources('./slick-pager');
  config.globalResources('./slick-window-resizer');
}

export { AureliaSlickgrid, SlickPager, SlickWindowResizer };