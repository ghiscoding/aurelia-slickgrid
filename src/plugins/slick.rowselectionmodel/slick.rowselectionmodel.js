import $ from 'jquery';
import {Slick} from 'slickgrid-es6';

Slick.RowSelectionModel = RowSelectionModel;
export default RowSelectionModel;

function RowSelectionModel(options){
  let _grid;
  let _ranges = [];
  const _self = this;
  const _handler = new Slick.EventHandler();
  let _inHandler;
  let _options;
  const _defaults = {
    selectActiveRow: true
  };

  function init(grid){
    _options = Object.assign({}, _defaults, options);
    _grid = grid;
    _handler.subscribe(_grid.onActiveCellChanged,
      wrapHandler(handleActiveCellChange));
    _handler.subscribe(_grid.onKeyDown,
      wrapHandler(handleKeyDown));
    _handler.subscribe(_grid.onClick,
      wrapHandler(handleClick));
  }

  function destroy(){
    _handler.unsubscribeAll();
  }

  function wrapHandler(handler){
    return function(){
      if (!_inHandler){
        _inHandler = true;
        handler.apply(this, arguments);
        _inHandler = false;
      }
    };
  }

  function rangesToRows(ranges){
    const rows = [];
    for (let i = 0; i < ranges.length; i++){
      for (let j = ranges[i].fromRow; j <= ranges[i].toRow; j++){
        rows.push(j);
      }
    }
    return rows;
  }

  function rowsToRanges(rows){
    const ranges = [];
    const lastCell = _grid.getColumns().length - 1;
    for (let i = 0; i < rows.length; i++){
      ranges.push(new Slick.Range(rows[i], 0, rows[i], lastCell));
    }
    return ranges;
  }

  function getRowsRange(from, to){
    let i;
    const rows = [];
    for (i = from; i <= to; i++){
      rows.push(i);
    }
    for (i = to; i < from; i++){
      rows.push(i);
    }
    return rows;
  }

  function getSelectedRows(){
    return rangesToRows(_ranges);
  }

  function setSelectedRows(rows){
    setSelectedRanges(rowsToRanges(rows));
  }

  function setSelectedRanges(ranges){
    // simle check for: empty selection didn't change, prevent firing onSelectedRangesChanged
    if ((!_ranges || _ranges.length === 0) && (!ranges || ranges.length === 0)){
      return;
    }
    _ranges = ranges;
    _self.onSelectedRangesChanged.notify(_ranges);
  }

  function getSelectedRanges(){
    return _ranges;
  }

  function handleActiveCellChange(e, data){
    if (_options.selectActiveRow && data.row != null){
      setSelectedRanges([new Slick.Range(data.row, 0, data.row, _grid.getColumns().length - 1)]);
    }
  }

  function handleKeyDown(e){
    const activeRow = _grid.getActiveCell();
    if (activeRow && e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && (e.which == 38 || e.which == 40)){
      let selectedRows = getSelectedRows();
      selectedRows.sort(function(x, y){
        return x - y;
      });

      if (!selectedRows.length){
        selectedRows = [activeRow.row];
      }

      let top = selectedRows[0];
      let bottom = selectedRows[selectedRows.length - 1];
      let active;

      if (e.which == 40){
        active = activeRow.row < bottom || top == bottom ? ++bottom : ++top;
      } else {
        active = activeRow.row < bottom ? --bottom : --top;
      }

      if (active >= 0 && active < _grid.getDataLength()){
        _grid.scrollRowIntoView(active);
        _ranges = rowsToRanges(getRowsRange(top, bottom));
        setSelectedRanges(_ranges);
      }

      e.preventDefault();
      e.stopPropagation();
    }
  }

  function handleClick(e){
    const cell = _grid.getCellFromEvent(e);
    if (!cell || !_grid.canCellBeActive(cell.row, cell.cell)){
      return false;
    }

    if (!_grid.getOptions().multiSelect || (
      !e.ctrlKey && !e.shiftKey && !e.metaKey)){
      return false;
    }

    let selection = rangesToRows(_ranges);
    const idx = $.inArray(cell.row, selection);

    if (idx === -1 && (e.ctrlKey || e.metaKey)){
      selection.push(cell.row);
      _grid.setActiveCell(cell.row, cell.cell);
    } else if (idx !== -1 && (e.ctrlKey || e.metaKey)){
      selection = $.grep(selection, function(o, i){
        return (o !== cell.row);
      });
      _grid.setActiveCell(cell.row, cell.cell);
    } else if (selection.length && e.shiftKey){
      const last = selection.pop();
      const from = Math.min(cell.row, last);
      const to = Math.max(cell.row, last);
      selection = [];
      for (let i = from; i <= to; i++){
        if (i !== last){
          selection.push(i);
        }
      }
      selection.push(last);
      _grid.setActiveCell(cell.row, cell.cell);
    }

    _ranges = rowsToRanges(selection);
    setSelectedRanges(_ranges);
    e.stopImmediatePropagation();

    return true;
  }

  Object.assign(this, {
    getSelectedRows,
    setSelectedRows,

    getSelectedRanges,
    setSelectedRanges,

    init,
    destroy,

    'onSelectedRangesChanged': new Slick.Event()
  });
}
