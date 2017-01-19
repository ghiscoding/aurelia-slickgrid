import {Slick} from 'slickgrid-es6';

Slick.RowMoveManager = RowMoveManager;
export default RowMoveManager;

function RowMoveManager(options){
  let _grid;
  let _canvas;
  let _dragging;
  const _self = this;
  const _handler = new Slick.EventHandler();
  const _defaults = {
    cancelEditOnDrag: false
  };

  function init(grid){
    options = Object.assign({}, _defaults, options);
    _grid = grid;
    _canvas = _grid.getCanvasNode();
    _handler
      .subscribe(_grid.onDragInit, handleDragInit)
      .subscribe(_grid.onDragStart, handleDragStart)
      .subscribe(_grid.onDrag, handleDrag)
      .subscribe(_grid.onDragEnd, handleDragEnd);
  }

  function destroy(){
    _handler.unsubscribeAll();
  }

  function handleDragInit(e, dd){
    // prevent the grid from cancelling drag'n'drop by default
    e.stopImmediatePropagation();
  }

  function handleDragStart(e, dd){
    const cell = _grid.getCellFromEvent(e);

    if (options.cancelEditOnDrag && _grid.getEditorLock().isActive()){
      _grid.getEditorLock().cancelCurrentEdit();
    }

    if (_grid.getEditorLock().isActive() || !/move|selectAndMove/.test(_grid.getColumns()[cell.cell].behavior)){
      return false;
    }

    _dragging = true;
    e.stopImmediatePropagation();

    let selectedRows = _grid.getSelectedRows();

    if (selectedRows.length == 0 || $.inArray(cell.row, selectedRows) == -1){
      selectedRows = [cell.row];
      _grid.setSelectedRows(selectedRows);
    }

    const rowHeight = _grid.getOptions().rowHeight;

    dd.selectedRows = selectedRows;

    dd.selectionProxy = $("<div class='slick-reorder-proxy'/>")
      .css('position', 'absolute')
      .css('zIndex', '99999')
      .css('width', $(_canvas).innerWidth())
      .css('height', rowHeight * selectedRows.length)
      .appendTo(_canvas);

    dd.guide = $("<div class='slick-reorder-guide'/>")
      .css('position', 'absolute')
      .css('zIndex', '99998')
      .css('width', $(_canvas).innerWidth())
      .css('top', -1000)
      .appendTo(_canvas);

    dd.insertBefore = -1;
  }

  function handleDrag(e, dd){
    if (!_dragging){
      return;
    }

    e.stopImmediatePropagation();

    const top = e.pageY - $(_canvas).offset().top;
    dd.selectionProxy.css('top', top - 5);

    const insertBefore = Math.max(0, Math.min(Math.round(top / _grid.getOptions().rowHeight), _grid.getDataLength()));
    if (insertBefore !== dd.insertBefore){
      const eventData = {
        'rows': dd.selectedRows,
        'insertBefore': insertBefore
      };

      if (_self.onBeforeMoveRows.notify(eventData) === false){
        dd.guide.css('top', -1000);
        dd.canMove = false;
      } else {
        dd.guide.css('top', insertBefore * _grid.getOptions().rowHeight);
        dd.canMove = true;
      }

      dd.insertBefore = insertBefore;
    }
  }

  function handleDragEnd(e, dd){
    if (!_dragging){
      return;
    }
    _dragging = false;
    e.stopImmediatePropagation();

    dd.guide.remove();
    dd.selectionProxy.remove();

    if (dd.canMove){
      const eventData = {
        'rows': dd.selectedRows,
        'insertBefore': dd.insertBefore
      };
      // TODO:  _grid.remapCellCssClasses ?
      _self.onMoveRows.notify(eventData);
    }
  }

  Object.assign(this, {
    'onBeforeMoveRows': new Slick.Event(),
    'onMoveRows': new Slick.Event(),
    init,
    destroy
  });
}
