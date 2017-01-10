define(['exports', './slick-pager', './slick-window-resizer', './slick-service'], function (exports, _slickPager, _slickWindowResizer, _slickService) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SlickService = exports.SlickWindowResizer = exports.SlickPager = undefined;
  exports.configure = configure;
  function configure(aurelia) {
    aurelia.globalResources('./slick-pager');
  }

  exports.SlickPager = _slickPager.SlickPager;
  exports.SlickWindowResizer = _slickWindowResizer.SlickWindowResizer;
  exports.SlickService = _slickService.SlickService;
});