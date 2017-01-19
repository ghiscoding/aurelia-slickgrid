'use strict';

System.register(['jquery', 'slickgrid-es6'], function (_export, _context) {
  "use strict";

  var $, Slick;

  function AutoTooltips(options) {
    var _grid = void 0;
    var _self = this;
    var _defaults = {
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
      var cell = _grid.getCellFromEvent(e);
      if (cell) {
        var $node = $(_grid.getCellNode(cell.row, cell.cell));
        var text = void 0;
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
      var column = args.column,
          $node = $(e.target).closest('.slick-header-column');
      if (column && !column.toolTip) {
        $node.attr('title', $node.innerWidth() < $node[0].scrollWidth ? column.name : '');
      }
    }

    Object.assign(this, {
      init: init,
      destroy: destroy
    });
  }
  return {
    setters: [function (_jquery) {
      $ = _jquery.default;
    }, function (_slickgridEs) {
      Slick = _slickgridEs.Slick;
    }],
    execute: function () {

      Slick.AutoTooltips = AutoTooltips;

      _export('default', AutoTooltips);
    }
  };
});