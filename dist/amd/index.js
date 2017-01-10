define(['exports', './aurelia-slickgrid', './slick-pager', './slick-window-resizer'], function (exports, _aureliaSlickgrid, _slickPager, _slickWindowResizer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SlickWindowResizer = exports.SlickPager = exports.AureliaSlickgrid = undefined;
  exports.configure = configure;
  function configure(config) {
    config.globalResources('./slick-pager');
  }

  exports.AureliaSlickgrid = _aureliaSlickgrid.AureliaSlickgrid;
  exports.SlickPager = _slickPager.SlickPager;
  exports.SlickWindowResizer = _slickWindowResizer.SlickWindowResizer;
});