'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SlickService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class;

var _slickgridEs = require('slickgrid-es6');

var _aureliaFramework = require('aurelia-framework');

var _slickWindowResizer = require('./slick-window-resizer');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SlickService = exports.SlickService = (_dec = (0, _aureliaFramework.inject)(_slickWindowResizer.SlickWindowResizer), _dec(_class = function () {
  function SlickService(slickWindowResizer) {
    _classCallCheck(this, SlickService);

    this.columnDefinition = {};
    this.data = {};
    this.grid = {};
    this.gridId = 'myGrid';
    this.gridOptions = {};
    this.isCreated = false;
    this.paginationCallback = null;

    this.slickResizer = slickWindowResizer;
  }

  SlickService.prototype.createGrid = function createGrid(gridId, columnDefinition, gridOptions, data) {
    this.columnDefinition = columnDefinition || {};
    this.data = data || {};
    this.gridId = gridId || 'myGrid';
    this.gridOptions = gridOptions || {};
    this.gridOptions.gridId = this.gridId;

    if (!!gridOptions.gridType && gridOptions.gridType.toLowerCase() === 'frozengrid') {
      this.grid = new _slickgridEs.FrozenGrid('#' + this.gridId, this.data, this.columnDefinition, this.gridOptions);
    } else {
      this.grid = new _slickgridEs.Grid('#' + this.gridId, this.data, this.columnDefinition, this.gridOptions);
    }

    this.isCreated = true;
    if (typeof this.gridOptions.onSortingChanged === 'function') {
      this.grid.onSort.subscribe(this.gridOptions.onSortingChanged);
    }

    if (!!this.gridOptions.autoResize) {
      this.slickResizer.attachAutoResizeDataGrid(this.grid, this.gridOptions);
    }

    return this.grid;
  };

  SlickService.prototype.refreshDataset = function refreshDataset(dataset) {
    if (dataset) {
      this.grid.setData(dataset);
      this.grid.invalidate();
      this.grid.render();
    }
  };

  _createClass(SlickService, [{
    key: 'gridObject',
    get: function get() {
      return this.grid;
    }
  }]);

  return SlickService;
}()) || _class);