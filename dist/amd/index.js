define(['exports', './slick-service', './slick-pager', './slick-window-resizer'], function (exports, _slickService, _slickPager, _slickWindowResizer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SlickWindowResizer = exports.SlickPager = exports.SlickService = undefined;
  exports.configure = configure;
  function configure(aurelia) {
    aurelia.globalResources('./slick-pager');
  }

  exports.SlickService = _slickService.SlickService;
  exports.SlickPager = _slickPager.SlickPager;
  exports.SlickWindowResizer = _slickWindowResizer.SlickWindowResizer;
});