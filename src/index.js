import {AureliaSlickgrid} from './aurelia-slickgrid';
import {SlickPager} from './slick-pager';
import {SlickWindowResizer} from './slick-window-resizer';

export function configure(config) {
  config.globalResources('./slick-pager');
}

export {
  AureliaSlickgrid,
  SlickPager,
  SlickWindowResizer
}
