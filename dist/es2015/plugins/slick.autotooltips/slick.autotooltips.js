import $ from 'jquery';
import { Slick } from 'slickgrid-es6';

Slick.AutoTooltips = AutoTooltips;
export default AutoTooltips;

function AutoTooltips(options) {
  let _grid;
  const _self = this;
  const _defaults = {
    enableForCells: true,
    enableForHeaderCells: false,
    maxToolTipLength: null
  };

  function init(grid) {
    options = Object.assign({}, _defaults, options);
    _grid = grid;
    if (options.enableForCells) _grid.onMouseEnter.subscribe(handleMouseEnter);
    if (options.enableForHeaderCells) _grid.onHeaderMouseEnter.subscribe(handleHeaderMouseEnter);
  }

  function destroy() {
    if (options.enableForCells) _grid.onMouseEnter.unsubscribe(handleMouseEnter);
    if (options.enableForHeaderCells) _grid.onHeaderMouseEnter.unsubscribe(handleHeaderMouseEnter);
  }

  function handleMouseEnter(e) {
    const cell = _grid.getCellFromEvent(e);
    if (cell) {
      let $node = $(_grid.getCellNode(cell.row, cell.cell));
      let text;
      if ($node.innerWidth() < $node[0].scrollWidth) {
        text = $.trim($node.text());
        if (options.maxToolTipLength && text.length > options.maxToolTipLength) {
          text = text.substr(0, options.maxToolTipLength - 3) + '...';
        }
      } else {
        text = '';
      }
      $node.attr('title', text);
    }
  }

  function handleHeaderMouseEnter(e, args) {
    const column = args.column,
          $node = $(e.target).closest('.slick-header-column');
    if (column && !column.toolTip) {
      $node.attr('title', $node.innerWidth() < $node[0].scrollWidth ? column.name : '');
    }
  }

  Object.assign(this, {
    init,
    destroy
  });
}