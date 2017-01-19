import $ from 'jquery';
import { Slick } from 'slickgrid-es6';
import CellRangeDecorator from '../slick.cellrangedecorator/slick.cellrangedecorator';

Slick.CellRangeSelector = CellRangeSelector;
export default CellRangeSelector;

function CellRangeSelector(options) {
  let _grid;
  let _canvas;
  let _dragging;
  let _decorator;
  let _range = {};

  const _self = this;
  const _handler = new Slick.EventHandler();
  const _defaults = {
    selectionCss: {}
  };

  function init(grid) {
    options = Object.assign({}, _defaults, options);
    _decorator = new CellRangeDecorator(grid, options);
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
    const cell = _grid.getCellFromEvent(interactEvent.originalEvent);
    if (_self.onBeforeCellRangeSelected.notify(cell) !== false) {
      if (_grid.canCellBeSelected(cell.row, cell.cell)) {
        _dragging = true;
      }
    }
    if (!_dragging) {
      return;
    }

    _grid.focus();

    const start = _grid.getCellFromPoint(interactEvent.x0 - $(_canvas).offset().left, interactEvent.y0 - $(_canvas).offset().top);

    _range = {
      start,
      end: {}
    };

    return _decorator.show(new Slick.Range(start.row, start.cell));
  }

  function handleDrag(e, interactEvent) {
    if (!_dragging) {
      return;
    }


    const end = _grid.getCellFromPoint(interactEvent.pageX - $(_canvas).offset().left, interactEvent.pageY - $(_canvas).offset().top);

    if (!_grid.canCellBeSelected(end.row, end.cell)) {
      return;
    }

    _range.end = end;
    _decorator.show(new Slick.Range(_range.start.row, _range.start.cell, end.row, end.cell));
  }

  function handleDragEnd(e) {
    if (!_dragging) {
      return;
    }

    _dragging = false;


    _decorator.hide();
    _self.onCellRangeSelected.notify({
      range: new Slick.Range(_range.start.row, _range.start.cell, _range.end.row, _range.end.cell)
    });
    _range = {};
  }

  Object.assign(this, {
    init,
    destroy,

    onBeforeCellRangeSelected: new Slick.Event(),
    onCellRangeSelected: new Slick.Event()
  });
}