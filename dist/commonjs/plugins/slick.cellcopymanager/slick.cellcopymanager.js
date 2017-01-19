'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slickgridEs = require('slickgrid-es6');

var keyCode = _slickgridEs.Slick.keyCode;


_slickgridEs.Slick.CellRangeDecorator = CellCopyManager;
exports.default = CellCopyManager;


function CellCopyManager() {
  var _grid;
  var _self = this;
  var _copiedRanges;

  function init(grid) {
    _grid = grid;
    _grid.onKeyDown.subscribe(handleKeyDown);
  }

  function destroy() {
    _grid.onKeyDown.unsubscribe(handleKeyDown);
  }

  function handleKeyDown(e, args) {
    var ranges;
    if (!_grid.getEditorLock().isActive()) {
      if (e.which == keyCode.ESCAPE) {
        if (_copiedRanges) {
          e.preventDefault();
          clearCopySelection();
          _self.onCopyCancelled.notify({ ranges: _copiedRanges });
          _copiedRanges = null;
        }
      }

      if (e.which == 67 && (e.ctrlKey || e.metaKey)) {
        ranges = _grid.getSelectionModel().getSelectedRanges();
        if (ranges.length != 0) {
          e.preventDefault();
          _copiedRanges = ranges;
          markCopySelection(ranges);
          _self.onCopyCells.notify({ ranges: ranges });
        }
      }

      if (e.which == 86 && (e.ctrlKey || e.metaKey)) {
        if (_copiedRanges) {
          e.preventDefault();
          clearCopySelection();
          ranges = _grid.getSelectionModel().getSelectedRanges();
          _self.onPasteCells.notify({ from: _copiedRanges, to: ranges });
          _copiedRanges = null;
        }
      }
    }
  }

  function markCopySelection(ranges) {
    var columns = _grid.getColumns();
    var hash = {};
    for (var i = 0; i < ranges.length; i++) {
      for (var j = ranges[i].fromRow; j <= ranges[i].toRow; j++) {
        hash[j] = {};
        for (var k = ranges[i].fromCell; k <= ranges[i].toCell; k++) {
          hash[j][columns[k].id] = 'copied';
        }
      }
    }
    _grid.setCellCssStyles('copy-manager', hash);
  }

  function clearCopySelection() {
    _grid.removeCellCssStyles('copy-manager');
  }

  Object.assign(this, {
    init: init,
    destroy: destroy,
    clearCopySelection: clearCopySelection,

    onCopyCells: new _slickgridEs.Slick.Event(),
    onCopyCancelled: new _slickgridEs.Slick.Event(),
    onPasteCells: new _slickgridEs.Slick.Event()
  });
}