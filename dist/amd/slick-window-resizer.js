define(['exports', 'aurelia-framework', 'aurelia-event-aggregator', 'jquery'], function (exports, _aureliaFramework, _aureliaEventAggregator, _jquery) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.SlickWindowResizer = undefined;

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var DATAGRID_MIN_HEIGHT = 180;
  var DATAGRID_MIN_WIDTH = 300;
  var DATAGRID_BOTTOM_PADDING = 20;
  var DATAGRID_PAGER_HEIGHT = 35;

  var SlickWindowResizer = exports.SlickWindowResizer = (_dec = (0, _aureliaFramework.inject)(_aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function SlickWindowResizer(eventAggregator) {
      _classCallCheck(this, SlickWindowResizer);

      this.grid = {};
      this.gridId = "";
      this.gridOptions = {};

      this.ea = eventAggregator;
    }

    SlickWindowResizer.prototype.attachAutoResizeDataGrid = function attachAutoResizeDataGrid(grid, gridOptions) {
      this.grid = grid;
      this.gridId = gridOptions.gridId;
      this.gridOptions = gridOptions;
      var self = this;

      this.resizeToFitBrowserWindow();

      (0, _jquery2.default)(window).on("resize", function () {
        self.resizeToFitBrowserWindow();
      });

      this.ea.subscribe('router:navigation:processing', function (event) {
        (0, _jquery2.default)(window).trigger('resize').off('resize');
      });
    };

    SlickWindowResizer.prototype.calculateGridNewDimensions = function calculateGridNewDimensions(gridOptions) {
      if (!(0, _jquery2.default)('#' + gridOptions.gridId)) {
        (0, _jquery2.default)(window).off("resize");
        return null;
      }

      var bottomPadding = typeof gridOptions.autoResizeBottomPadding === "undefined" ? DATAGRID_BOTTOM_PADDING : parseInt(gridOptions.autoResizeBottomPadding);
      if (!!gridOptions.useExternalPagination) {
        bottomPadding += DATAGRID_PAGER_HEIGHT;
      }
      var availableHeight = (0, _jquery2.default)(window).height() - (0, _jquery2.default)('#' + gridOptions.gridId).offset().top - parseInt(bottomPadding);
      var availableWidth = (0, _jquery2.default)('#' + gridOptions.gridContainerId).width();
      var minHeight = typeof gridOptions.autoResizeMinHeight === "undefined" ? DATAGRID_MIN_HEIGHT : parseInt(gridOptions.autoResizeMinHeight);
      var minWidth = typeof gridOptions.autoResizeMinWidth === "undefined" ? DATAGRID_MIN_WIDTH : parseInt(gridOptions.autoResizeMinWidth);

      var newHeight = availableHeight;
      var newWidth = availableWidth;
      if (newHeight < minHeight) {
        newHeight = minHeight;
      }
      if (newWidth < minWidth) {
        newWidth = minWidth;
      }

      if (typeof gridOptions.autoResizeHeight !== "undefined") {
        if (gridOptions.autoResizeHeight.indexOf("px") !== -1) {
          newHeight = gridOptions.autoResizeHeight;
        } else {
          newHeight = availableHeight * parseInt(gridOptions.autoResizeHeight) / 100;

          if (newHeight < minHeight) {
            newHeight = minHeight;
          }
        }
      }
      if (typeof gridOptions.autoResizeWidth !== "undefined") {
        if (gridOptions.autoResizeWidth.indexOf("px") !== -1) {
          newWidth = gridOptions.autoResizeWidth;
        } else {
          newWidth = availableWidth * parseInt(gridOptions.autoResizeWidth) / 100;

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
      console.log('resize');

      var newSizes = this.calculateGridNewDimensions(this.gridOptions);

      if (newSizes) {
        (0, _jquery2.default)('#' + this.gridId).height(newSizes.height);
        (0, _jquery2.default)('#' + this.gridId).width(newSizes.width);

        if (new RegExp("MSIE [6-8]").exec(navigator.userAgent) == null && this.grid) {
          this.grid.resizeCanvas();
        }
      }
    };

    return SlickWindowResizer;
  }()) || _class);
});