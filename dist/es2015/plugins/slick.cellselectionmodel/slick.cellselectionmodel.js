import { Slick } from 'slickgrid-es6';
import CellRangeSelector from '../slick.cellrangeselector/slick.cellrangeselector';

Slick.CellSelectionModel = CellSelectionModel;
export default CellSelectionModel;

function CellSelectionModel(options = {
  selectActiveCell: true
}) {
  let _grid;
  let _canvas;
  let _ranges = [];
  const _self = this;
  const _selector = new CellRangeSelector({
    selectionCss: {
      border: '2px solid black'
    }
  });
  let _options;
  const _defaults = {
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
    const result = [];

    for (let i = 0; i < ranges.length; i++) {
      const r = ranges[i];
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
      setSelectedRanges([new Slick.Range(args.row, args.cell)]);
    }
  }

  function handleKeyDown(e) {
    let ranges, last;
    const active = _grid.getActiveCell();

    if (active && e.shiftKey && !e.ctrlKey && !e.altKey && (e.which == 37 || e.which == 39 || e.which == 38 || e.which == 40)) {
      ranges = getSelectedRanges();
      if (!ranges.length) ranges.push(new Slick.Range(active.row, active.cell));

      last = ranges.pop();

      if (!last.contains(active.row, active.cell)) last = new Slick.Range(active.row, active.cell);

      let dRow = last.toRow - last.fromRow,
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

      const new_last = new Slick.Range(active.row, active.cell, active.row + dirRow * dRow, active.cell + dirCell * dCell);
      if (removeInvalidRanges([new_last]).length) {
        ranges.push(new_last);
        const viewRow = dirRow > 0 ? new_last.toRow : new_last.fromRow;
        const viewCell = dirCell > 0 ? new_last.toCell : new_last.fromCell;
        _grid.scrollRowIntoView(viewRow);
        _grid.scrollCellIntoView(viewRow, viewCell);
      } else ranges.push(last);

      setSelectedRanges(ranges);

      e.preventDefault();
      e.stopPropagation();
    }
  }

  Object.assign(this, {
    getSelectedRanges,
    setSelectedRanges,

    init,
    destroy,

    onSelectedRangesChanged: new Slick.Event()
  });
}