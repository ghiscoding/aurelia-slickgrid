'use strict';

System.register(['aurelia-framework', 'aurelia-event-aggregator', 'jquery'], function (_export, _context) {
  "use strict";

  var inject, EventAggregator, $, _dec, _class, DATAGRID_MIN_HEIGHT, DATAGRID_MIN_WIDTH, DATAGRID_BOTTOM_PADDING, DATAGRID_PAGER_HEIGHT, SlickWindowResizer;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }, function (_jquery) {
      $ = _jquery.default;
    }],
    execute: function () {
      DATAGRID_MIN_HEIGHT = 180;
      DATAGRID_MIN_WIDTH = 300;
      DATAGRID_BOTTOM_PADDING = 20;
      DATAGRID_PAGER_HEIGHT = 35;

      _export('SlickWindowResizer', SlickWindowResizer = (_dec = inject(EventAggregator), _dec(_class = function () {
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

          var gridDomElm = $('#' + gridOptions.gridId);
          if (!gridDomElm || typeof gridDomElm.offset() === 'undefined') {
            return null;
          }

          this.resizeToFitBrowserWindow();

          $(window).on('resize', function () {
            _this.resizeToFitBrowserWindow();
            _this.resizeToFitBrowserWindow();
          });

          this.ea.subscribe('router:navigation:processing', function (event) {
            $(window).trigger('resize').off('resize');
          });
        };

        SlickWindowResizer.prototype.calculateGridNewDimensions = function calculateGridNewDimensions(gridOptions) {
          if (!$('#' + gridOptions.gridId)) {
            $(window).off('resize');
            return null;
          }

          var bottomPadding = typeof gridOptions.autoResizeBottomPadding === 'undefined' ? DATAGRID_BOTTOM_PADDING : parseInt(gridOptions.autoResizeBottomPadding, 10);
          if (!!gridOptions.useExternalPagination) {
            bottomPadding += DATAGRID_PAGER_HEIGHT;
          }
          var availableHeight = $(window).height() - $('#' + gridOptions.gridId).offset().top - parseInt(bottomPadding, 10);
          var availableWidth = $('#' + gridOptions.gridContainerId).width();
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
            $('#' + this.gridId).height(newSizes.height);
            $('#' + this.gridId).width(newSizes.width);

            if (new RegExp('MSIE [6-8]').exec(navigator.userAgent) === null && this.grid) {
              this.grid.resizeCanvas();
            }
          }
        };

        return SlickWindowResizer;
      }()) || _class));

      _export('SlickWindowResizer', SlickWindowResizer);
    }
  };
});