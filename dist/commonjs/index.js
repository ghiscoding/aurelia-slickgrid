'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlickService = exports.SlickWindowResizer = exports.SlickPager = undefined;
exports.configure = configure;

var _slickPager = require('./slick-pager');

var _slickWindowResizer = require('./slick-window-resizer');

var _slickService = require('./slick-service');

function configure(aurelia) {
  aurelia.globalResources('./slick-pager');
}

exports.SlickPager = _slickPager.SlickPager;
exports.SlickWindowResizer = _slickWindowResizer.SlickWindowResizer;
exports.SlickService = _slickService.SlickService;