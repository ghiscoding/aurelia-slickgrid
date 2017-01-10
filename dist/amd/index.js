define(['exports', './slick-service', './slick-pager', './slick-window-resizer'], function (exports, _slickService, _slickPager, _slickWindowResizer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SlickWindowResizer = exports.SlickPager = exports.SlickService = undefined;
  exports.configure = configure;
  function configure(aurelia, callback) {
    aurelia.globalResources('./slick-pager');

    var config = new BootstrapConfig();

    if (typeof callback === 'function') {
      callback(config);
    }
  }

  exports.SlickService = _slickService.SlickService;
  exports.SlickPager = _slickPager.SlickPager;
  exports.SlickWindowResizer = _slickWindowResizer.SlickWindowResizer;
});