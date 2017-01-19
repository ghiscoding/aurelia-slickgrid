'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slickgridEs = require('slickgrid-es6');

var _slick = require('../slick.cellrangeselector/slick.cellrangeselector');

var _slick2 = _interopRequireDefault(_slick);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_slickgridEs.Slick.CellSelectionModel = CellSelectionModel;
exports.default = CellSelectionModel;


function CellSelectionModel() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    selectActiveCell: true
  };

  var _grid = void 0;
  var _canvas = void 0;
  var _ranges = [];
  var _self = this;
  var _selector = new _slick2.default({
    selectionCss: {
      border: '2px solid black'
    }
  });
  var _options = void 0;
  var _defaults = {
    selectActiveCell: true
  };

  function init(grid) {
    _options = Object.assign({}, options);
    _grid = grid;
    _canvas = _grid.getCanvasNode();
    _grid.onActiveCellChanged.subscribe(handleActiveCellChange);
    _grid.onKeyDown.subscribe(handleKeyDown);
    grid.registerPlugin(_selector);
    _selector.onCellRangeSelected.subscribe(handleCellRangeSelected);
    _selector.onBeforeCellRangeSelected.subscribe(handleBeforeCellRangeSelected);
  }

  function destroy() {
    _grid.onActiveCellChanged.unsubscribe(handleActiveCellChange);
    _grid.onKeyDown.unsubscribe(handleKeyDown);
    _selector.onCellRangeSelected.unsubscribe(handleCellRangeSelected);
    _selector.onBeforeCellRangeSelected.unsubscribe(handleBeforeCellRangeSelected);
    _grid.unregisterPlugin(_selector);
  }

  function removeInvalidRanges(ranges) {
    var result = [];

    for (var i = 0; i < ranges.length; i++) {
      var r = ranges[i];
      if (_grid.canCellBeSelected(r.fromRow, r.fromCell) && _grid.canCellBeSelected(r.toRow, r.toCell)) {
        result.push(r);
      }
    }

    return result;
  }

  function setSelectedRanges(ranges) {
    if ((!_ranges || _ranges.length === 0) && (!ranges || ranges.length === 0)) {
      return;
    }

    _ranges = removeInvalidRanges(ranges);
    _self.onSelectedRangesChanged.notify(_ranges);
  }

  function getSelectedRanges() {
    return _ranges;
  }

  function handleBeforeCellRangeSelected(e, args) {
    if (_grid.getEditorLock().isActive()) {
      e.stopPropagation();
      return false;
    }
  }

  function handleCellRangeSelected(e, args) {
    setSelectedRanges([args.range]);
  }

  function handleActiveCellChange(e, args) {
    if (_options.selectActiveCell && args.row != null && args.cell != null) {
      setSelectedRanges([new _slickgridEs.Slick.Range(args.row, args.cell)]);
    }
  }

  function handleKeyDown(e) {
    var ranges = void 0,
        last = void 0;
    var active = _grid.getActiveCell();

    if (active && e.shiftKey && !e.ctrlKey && !e.altKey && (e.which == 37 || e.which == 39 || e.which == 38 || e.which == 40)) {
      ranges = getSelectedRanges();
      if (!ranges.length) ranges.push(new _slickgridEs.Slick.Range(active.row, active.cell));

      last = ranges.pop();

      if (!last.contains(active.row, active.cell)) last = new _slickgridEs.Slick.Range(active.row, active.cell);

      var dRow = last.toRow - last.fromRow,
          dCell = last.toCell - last.fromCell,
          dirRow = active.row == last.fromRow ? 1 : -1,
          dirCell = active.cell == last.fromCell ? 1 : -1;

      if (e.which == 37) {
        dCell -= dirCell;
      } else if (e.which == 39) {
        dCell += dirCell;
      } else if (e.which == 38) {
        dRow -= dirRow;
      } else if (e.which == 40) {
        dRow += dirRow;
      }

      var new_last = new _slickgridEs.Slick.Range(active.row, active.cell, active.row + dirRow * dRow, active.cell + dirCell * dCell);
      if (removeInvalidRanges([new_last]).length) {
        ranges.push(new_last);
        var viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow;
        var viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
        _grid.scrollRowIntoView(viewRow);
        _grid.scrollCellIntoView(viewRow, viewCell);
      } else ranges.push(last);

      setSelectedRanges(ranges);

      e.preventDefault();
      e.stopPropagation();
    }
  }

  Object.assign(this, {
    getSelectedRanges: getSelectedRanges,
    setSelectedRanges: setSelectedRanges,

    init: init,
    destroy: destroy,

    onSelectedRangesChanged: new _slickgridEs.Slick.Event()
  });
}