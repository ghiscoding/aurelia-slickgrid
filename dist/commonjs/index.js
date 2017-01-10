'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlickWindowResizer = exports.SlickPager = exports.SlickService = undefined;
exports.configure = configure;

var _slickService = require('./slick-service');

var _slickPager = require('./slick-pager');

var _slickWindowResizer = require('./slick-window-resizer');

function configure(aurelia) {
  aurelia.globalResources('./slick-pager');
}

exports.SlickService = _slickService.SlickService;
exports.SlickPager = _slickPager.SlickPager;
exports.SlickWindowResizer = _slickWindowResizer.SlickWindowResizer;