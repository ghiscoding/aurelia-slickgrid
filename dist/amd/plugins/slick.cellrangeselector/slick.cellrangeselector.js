define(['exports', 'jquery', 'slickgrid-es6', '../slick.cellrangedecorator/slick.cellrangedecorator'], function (exports, _jquery, _slickgridEs, _slick) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = _interopRequireDefault(_jquery);

  var _slick2 = _interopRequireDefault(_slick);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _slickgridEs.Slick.CellRangeSelector = CellRangeSelector;
  exports.default = CellRangeSelector;


  function CellRangeSelector(options) {
    var _grid = void 0;
    var _canvas = void 0;
    var _dragging = void 0;
    var _decorator = void 0;
    var _range = {};

    var _self = this;
    var _handler = new _slickgridEs.Slick.EventHandler();
    var _defaults = {
      selectionCss: {}
    };

    function init(grid) {
      options = Object.assign({}, _defaults, options);
      _decorator = new _slick2.default(grid, options);
      _grid = grid;
      _canvas = _grid.getCanvasNode();
      _handler.subscribe(_grid.onDragInit, handleDragInit).subscribe(_grid.onDragStart, handleDragStart).subscribe(_grid.onDrag, handleDrag).subscribe(_grid.onDragEnd, handleDragEnd);
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleDragInit(e, dd) {
      e.stopImmediatePropagation();
    }

    function handleDragStart(jqueryEvent, interactEvent) {
      var cell = _grid.getCellFromEvent(interactEvent.originalEvent);
      if (_self.onBeforeCellRangeSelected.notify(cell) !== false) {
        if (_grid.canCellBeSelected(cell.row, cell.cell)) {
          _dragging = true;
        }
      }
      if (!_dragging) {
        return;
      }

      _grid.focus();

      var start = _grid.getCellFromPoint(interactEvent.x0 - (0, _jquery2.default)(_canvas).offset().left, interactEvent.y0 - (0, _jquery2.default)(_canvas).offset().top);

      _range = {
        start: start,
        end: {}
      };

      return _decorator.show(new _slickgridEs.Slick.Range(start.row, start.cell));
    }

    function handleDrag(e, interactEvent) {
      if (!_dragging) {
        return;
      }


      var end = _grid.getCellFromPoint(interactEvent.pageX - (0, _jquery2.default)(_canvas).offset().left, interactEvent.pageY - (0, _jquery2.default)(_canvas).offset().top);

      if (!_grid.canCellBeSelected(end.row, end.cell)) {
        return;
      }

      _range.end = end;
      _decorator.show(new _slickgridEs.Slick.Range(_range.start.row, _range.start.cell, end.row, end.cell));
    }

    function handleDragEnd(e) {
      if (!_dragging) {
        return;
      }

      _dragging = false;


      _decorator.hide();
      _self.onCellRangeSelected.notify({
        range: new _slickgridEs.Slick.Range(_range.start.row, _range.start.cell, _range.end.row, _range.end.cell)
      });
      _range = {};
    }

    Object.assign(this, {
      init: init,
      destroy: destroy,

      onBeforeCellRangeSelected: new _slickgridEs.Slick.Event(),
      onCellRangeSelected: new _slickgridEs.Slick.Event()
    });
  }
});