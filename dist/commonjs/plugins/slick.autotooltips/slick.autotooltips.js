'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _slickgridEs = require('slickgrid-es6');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_slickgridEs.Slick.AutoTooltips = AutoTooltips;
exports.default = AutoTooltips;

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
      var $node = (0, _jquery2.default)(_grid.getCellNode(cell.row, cell.cell));
      var text = void 0;
      if ($node.innerWidth() < $node[0].scrollWidth) {
        text = _jquery2.default.trim($node.text());
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
        $node = (0, _jquery2.default)(e.target).closest('.slick-header-column');
    if (column && !column.toolTip) {
      $node.attr('title', $node.innerWidth() < $node[0].scrollWidth ? column.name : '');
    }
  }

  Object.assign(this, {
    init: init,
    destroy: destroy
  });
}