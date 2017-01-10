'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlickWindowResizer = exports.SlickPager = exports.AureliaSlickgrid = undefined;
exports.configure = configure;

var _aureliaSlickgrid = require('./aurelia-slickgrid');

var _slickPager = require('./slick-pager');

var _slickWindowResizer = require('./slick-window-resizer');

function configure(config) {
  config.globalResources('./slick-pager');
}

exports.AureliaSlickgrid = _aureliaSlickgrid.AureliaSlickgrid;
exports.SlickPager = _slickPager.SlickPager;
exports.SlickWindowResizer = _slickWindowResizer.SlickWindowResizer;