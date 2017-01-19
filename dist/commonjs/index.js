'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlickService = exports.SlickWindowResizer = exports.SlickPager = exports.Plugins = exports.FrozenGrid = exports.Grid = exports.Data = exports.Formatters = exports.Editors = exports.Slick = undefined;
exports.configure = configure;

var _slickgridEs = require('slickgrid-es6');

var _slickPager = require('./slick-pager');

var _slickWindowResizer = require('./slick-window-resizer');

var _slickService = require('./slick-service');

var _index = require('./plugins/index');

var Plugins = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function configure(aurelia) {
  aurelia.globalResources('./slick-pager');
}

exports.Slick = _slickgridEs.Slick;
exports.Editors = _slickgridEs.Editors;
exports.Formatters = _slickgridEs.Formatters;
exports.Data = _slickgridEs.Data;
exports.Grid = _slickgridEs.Grid;
exports.FrozenGrid = _slickgridEs.FrozenGrid;
exports.Plugins = Plugins;
exports.SlickPager = _slickPager.SlickPager;
exports.SlickWindowResizer = _slickWindowResizer.SlickWindowResizer;
exports.SlickService = _slickService.SlickService;