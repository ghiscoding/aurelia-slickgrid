'use strict';

System.register(['slickgrid-es6', 'aurelia-framework', './slick-window-resizer', 'jquery'], function (_export, _context) {
  "use strict";

  var Grid, Data, Formatters, inject, SlickResizer, $, _createClass, _dec, _class, AureliaSlickgrid;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  return {
    setters: [function (_slickgridEs) {
      Grid = _slickgridEs.Grid;
      Data = _slickgridEs.Data;
      Formatters = _slickgridEs.Formatters;
    }, function (_aureliaFramework) {
      inject = _aureliaFramework.inject;
    }, function (_slickWindowResizer) {
      SlickResizer = _slickWindowResizer.SlickResizer;
    }, function (_jquery) {
      $ = _jquery.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('AureliaSlickgrid', AureliaSlickgrid = (_dec = inject(SlickResizer), _dec(_class = function () {
        function AureliaSlickgrid(slickResizer) {
          _classCallCheck(this, AureliaSlickgrid);

          this.columnDefinition = {};
          this.data = {};
          this.grid = {};
          this.gridId = "myGrid";
          this.gridOptions = {};
          this.isCreated = false;
          this.paginationCallback = null;

          this.slickResizer = slickResizer;
        }

        AureliaSlickgrid.prototype.createDatagrid = function createDatagrid(gridId, columnDefinition, gridOptions, data) {
          this.columnDefinition = columnDefinition || {};
          this.data = data || {};
          this.gridId = gridId || "myGrid";
          this.gridOptions = gridOptions || {};
          this.gridOptions.gridId = this.gridId;

          this.grid = new Grid('#' + this.gridId, this.data, this.columnDefinition, this.gridOptions);
          this.isCreated = true;
          if (typeof this.gridOptions.onSortingChanged === "function") {
            this.grid.onSort.subscribe(this.gridOptions.onSortingChanged);
          }

          if (!!this.gridOptions.autoResize) {
            this.slickResizer.attachAutoResizeDataGrid(this.grid, this.gridOptions);
          }
        };

        AureliaSlickgrid.prototype.refreshDataset = function refreshDataset(dataset) {
          if (dataset) {
            this.grid.setData(dataset);
            this.grid.invalidate();
            this.grid.render();
          }
        };

        _createClass(AureliaSlickgrid, [{
          key: 'gridObject',
          get: function get() {
            return this.grid;
          }
        }]);

        return AureliaSlickgrid;
      }()) || _class));

      _export('AureliaSlickgrid', AureliaSlickgrid);
    }
  };
});