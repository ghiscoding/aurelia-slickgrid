'use strict';

System.register(['jquery', 'slickgrid-es6', './slick.headermenu.css'], function (_export, _context) {
  "use strict";

  var $, Slick;

  function HeaderMenu(options) {
    var _grid = void 0;
    var _self = this;
    var _handler = new Slick.EventHandler();
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

      $(document.body).bind('mousedown', handleBodyMouseDown);
    }

    function destroy() {
      _handler.unsubscribeAll();
      $(document.body).unbind('mousedown', handleBodyMouseDown);
    }

    function handleBodyMouseDown(e) {
      if ($menu && $menu[0] != e.target && !$.contains($menu[0], e.target)) {
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
        var $el = $('<div></div>').addClass('slick-header-menubutton').data('column', column).data('menu', menu);

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
        $(args.node).find('.slick-header-menubutton').remove();
      }
    }

    function showMenu(e) {
      var $menuButton = $(this);
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
        $menu = $("<div class='slick-header-menu'></div>").appendTo(_grid.getContainerNode());
      }
      $menu.empty();

      for (var i = 0; i < menu.items.length; i++) {
        var item = menu.items[i];

        var $li = $("<div class='slick-header-menuitem'></div>").data('command', item.command || '').data('column', columnDef).data('item', item).bind('click', handleMenuItemClick).appendTo($menu);

        if (item.disabled) {
          $li.addClass('slick-header-menuitem-disabled');
        }

        if (item.tooltip) {
          $li.attr('title', item.tooltip);
        }

        var $icon = $("<div class='slick-header-menuicon'></div>").appendTo($li);

        if (item.iconCssClass) {
          $icon.addClass(item.iconCssClass);
        }

        if (item.iconImage) {
          $icon.css('background-image', 'url(' + item.iconImage + ')');
        }

        $("<span class='slick-header-menucontent'></span>").text(item.title).appendTo($li);
      }

      $menu.offset({ top: $(this).offset().top + $(this).height(), left: $(this).offset().left });

      $activeHeaderColumn = $menuButton.closest('.slick-header-column');
      $activeHeaderColumn.addClass('slick-header-column-active');

      e.preventDefault();
      e.stopPropagation();
    }

    function handleMenuItemClick(e) {
      var command = $(this).data('command');
      var columnDef = $(this).data('column');
      var item = $(this).data('item');

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

      'onBeforeMenuShow': new Slick.Event(),
      'onCommand': new Slick.Event()
    });
  }
  return {
    setters: [function (_jquery) {
      $ = _jquery.default;
    }, function (_slickgridEs) {
      Slick = _slickgridEs.Slick;
    }, function (_slickHeadermenuCss) {}],
    execute: function () {

      Slick.HeaderMenu = HeaderMenu;

      _export('default', HeaderMenu);
    }
  };
});