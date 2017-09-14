'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlickWindowResizer = undefined;

var _dec, _class;

var _aureliaFramework = require('aurelia-framework');

var _aureliaEventAggregator = require('aurelia-event-aggregator');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DATAGRID_MIN_HEIGHT = 180;
var DATAGRID_MIN_WIDTH = 300;
var DATAGRID_BOTTOM_PADDING = 20;
var DATAGRID_PAGER_HEIGHT = 35;

var SlickWindowResizer = exports.SlickWindowResizer = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
  function SlickWindowResizer(eventAggregator) {
    _classCallCheck(this, SlickWindowResizer);

    this.grid = {};
    this.gridId = '';
    this.gridOptions = {};

    this.ea = eventAggregator;
  }

  SlickWindowResizer.prototype.attachAutoResizeDataGrid = function attachAutoResizeDataGrid(grid, gridOptions) {
    var _this = this;

    this.grid = grid;
    this.gridId = gridOptions.gridId;
    this.gridOptions = gridOptions;

    var gridDomElm = (0, _jquery2.default)('#' + gridOptions.gridId);
    if (!gridDomElm || typeof gridDomElm.offset() === 'undefined') {
      return null;
    }

    this.resizeToFitBrowserWindow();

    (0, _jquery2.default)(window).on('resize', function () {
      _this.resizeToFitBrowserWindow();
      _this.resizeToFitBrowserWindow();
    });

    this.ea.subscribe('router:navigation:processing', function (event) {
      (0, _jquery2.default)(window).trigger('resize').off('resize');
    });
  };

  SlickWindowResizer.prototype.calculateGridNewDimensions = function calculateGridNewDimensions(gridOptions) {
    if (!(0, _jquery2.default)('#' + gridOptions.gridId)) {
      (0, _jquery2.default)(window).off('resize');
      return null;
    }

    var bottomPadding = typeof gridOptions.autoResizeBottomPadding === 'undefined' ? DATAGRID_BOTTOM_PADDING : parseInt(gridOptions.autoResizeBottomPadding, 10);
    if (!!gridOptions.useExternalPagination) {
      bottomPadding += DATAGRID_PAGER_HEIGHT;
    }
    var availableHeight = (0, _jquery2.default)(window).height() - (0, _jquery2.default)('#' + gridOptions.gridId).offset().top - parseInt(bottomPadding, 10);
    var availableWidth = (0, _jquery2.default)('#' + gridOptions.gridContainerId).width();
    var minHeight = typeof gridOptions.autoResizeMinHeight === 'undefined' ? DATAGRID_MIN_HEIGHT : parseInt(gridOptions.autoResizeMinHeight, 10);
    var minWidth = typeof gridOptions.autoResizeMinWidth === 'undefined' ? DATAGRID_MIN_WIDTH : parseInt(gridOptions.autoResizeMinWidth, 10);

    var newHeight = availableHeight;
    var newWidth = availableWidth;
    if (newHeight < minHeight) {
      newHeight = minHeight;
    }
    if (newWidth < minWidth) {
      newWidth = minWidth;
    }

    if (typeof gridOptions.autoResizeHeight !== 'undefined') {
      if (gridOptions.autoResizeHeight.indexOf('px') !== -1) {
        newHeight = gridOptions.autoResizeHeight;
      } else {
        newHeight = availableHeight * parseInt(gridOptions.autoResizeHeight, 10) / 100;

        if (newHeight < minHeight) {
          newHeight = minHeight;
        }
      }
    }
    if (typeof gridOptions.autoResizeWidth !== 'undefined') {
      if (gridOptions.autoResizeWidth.indexOf('px') !== -1) {
        newWidth = gridOptions.autoResizeWidth;
      } else {
        newWidth = availableWidth * parseInt(gridOptions.autoResizeWidth, 10) / 100;

        if (newWidth < minWidth) {
          newWidth = minWidth;
        }
      }
    }

    return {
      height: newHeight,
      width: newWidth
    };
  };

  SlickWindowResizer.prototype.resizeToFitBrowserWindow = function resizeToFitBrowserWindow() {
    var newSizes = this.calculateGridNewDimensions(this.gridOptions);

    if (newSizes) {
      (0, _jquery2.default)('#' + this.gridId).height(newSizes.height);
      (0, _jquery2.default)('#' + this.gridId).width(newSizes.width);

      if (new RegExp('MSIE [6-8]').exec(navigator.userAgent) === null && this.grid) {
        this.grid.resizeCanvas();
      }
    }
  };

  return SlickWindowResizer;
}()) || _class);