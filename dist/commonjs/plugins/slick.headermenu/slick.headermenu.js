'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _slickgridEs = require('slickgrid-es6');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_slickgridEs.Slick.HeaderMenu = HeaderMenu;
exports.default = HeaderMenu;

function HeaderMenu(options) {
  var _grid = void 0;
  var _self = this;
  var _handler = new _slickgridEs.Slick.EventHandler();
  var _defaults = {
    buttonCssClass: null,
    buttonImage: null
  };

  var $menu = void 0;
  var $activeHeaderColumn = void 0;

  function init(grid) {
    options = Object.assign({}, _defaults, options);
    _grid = grid;
    _handler.subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered).subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy);

    _grid.setColumns(_grid.getColumns());

    (0, _jquery2.default)(document.body).bind('mousedown', handleBodyMouseDown);
  }

  function destroy() {
    _handler.unsubscribeAll();
    (0, _jquery2.default)(document.body).unbind('mousedown', handleBodyMouseDown);
  }

  function handleBodyMouseDown(e) {
    if ($menu && $menu[0] != e.target && !_jquery2.default.contains($menu[0], e.target)) {
      hideMenu();
    }
  }

  function hideMenu() {
    if ($menu) {
      $menu.remove();
      $menu = null;
      $activeHeaderColumn.removeClass('slick-header-column-active');
    }
  }

  function handleHeaderCellRendered(e, args) {
    var column = args.column;
    var menu = column.header && column.header.menu;

    if (menu) {
      var $el = (0, _jquery2.default)('<div></div>').addClass('slick-header-menubutton').data('column', column).data('menu', menu);

      if (options.buttonCssClass) {
        $el.addClass(options.buttonCssClass);
      }

      if (options.buttonImage) {
        $el.css('background-image', 'url(' + options.buttonImage + ')');
      }

      if (menu.tooltip) {
        $el.attr('title', menu.tooltip);
      }

      $el.bind('click', showMenu).appendTo(args.node);
    }
  }

  function handleBeforeHeaderCellDestroy(e, args) {
    var column = args.column;

    if (column.header && column.header.menu) {
      (0, _jquery2.default)(args.node).find('.slick-header-menubutton').remove();
    }
  }

  function showMenu(e) {
    var $menuButton = (0, _jquery2.default)(this);
    var menu = $menuButton.data('menu');
    var columnDef = $menuButton.data('column');

    if (_self.onBeforeMenuShow.notify({
      'grid': _grid,
      'column': columnDef,
      'menu': menu
    }, e, _self) == false) {
      return;
    }

    if (!$menu) {
      $menu = (0, _jquery2.default)("<div class='slick-header-menu'></div>").appendTo(_grid.getContainerNode());
    }
    $menu.empty();

    for (var i = 0; i < menu.items.length; i++) {
      var item = menu.items[i];

      var $li = (0, _jquery2.default)("<div class='slick-header-menuitem'></div>").data('command', item.command || '').data('column', columnDef).data('item', item).bind('click', handleMenuItemClick).appendTo($menu);

      if (item.disabled) {
        $li.addClass('slick-header-menuitem-disabled');
      }

      if (item.tooltip) {
        $li.attr('title', item.tooltip);
      }

      var $icon = (0, _jquery2.default)("<div class='slick-header-menuicon'></div>").appendTo($li);

      if (item.iconCssClass) {
        $icon.addClass(item.iconCssClass);
      }

      if (item.iconImage) {
        $icon.css('background-image', 'url(' + item.iconImage + ')');
      }

      (0, _jquery2.default)("<span class='slick-header-menucontent'></span>").text(item.title).appendTo($li);
    }

    $menu.offset({ top: (0, _jquery2.default)(this).offset().top + (0, _jquery2.default)(this).height(), left: (0, _jquery2.default)(this).offset().left });

    $activeHeaderColumn = $menuButton.closest('.slick-header-column');
    $activeHeaderColumn.addClass('slick-header-column-active');

    e.preventDefault();
    e.stopPropagation();
  }

  function handleMenuItemClick(e) {
    var command = (0, _jquery2.default)(this).data('command');
    var columnDef = (0, _jquery2.default)(this).data('column');
    var item = (0, _jquery2.default)(this).data('item');

    if (item.disabled) {
      return;
    }

    hideMenu();

    if (command != null && command != '') {
      _self.onCommand.notify({
        'grid': _grid,
        'column': columnDef,
        'command': command,
        'item': item
      }, e, _self);
    }

    e.preventDefault();
    e.stopPropagation();
  }

  Object.assign(this, {
    init: init,
    destroy: destroy,

    'onBeforeMenuShow': new _slickgridEs.Slick.Event(),
    'onCommand': new _slickgridEs.Slick.Event()
  });
}