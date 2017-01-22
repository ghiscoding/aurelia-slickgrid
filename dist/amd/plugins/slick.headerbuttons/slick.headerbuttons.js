define(['exports', 'jquery', 'slickgrid-es6'], function (exports, _jquery, _slickgridEs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _jquery2 = _interopRequireDefault(_jquery);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _slickgridEs.Slick.HeaderButtons = HeaderButtons;
  exports.default = HeaderButtons;

  function HeaderButtons(options) {
    var _grid;
    var _self = this;
    var _handler = new _slickgridEs.Slick.EventHandler();
    var _defaults = {
      buttonCssClass: 'slick-header-button'
    };

    function init(grid) {
      options = Object.assign({}, _defaults, options);
      _grid = grid;
      _handler.subscribe(_grid.onHeaderCellRendered, handleHeaderCellRendered).subscribe(_grid.onBeforeHeaderCellDestroy, handleBeforeHeaderCellDestroy);

      _grid.setColumns(_grid.getColumns());
    }

    function destroy() {
      _handler.unsubscribeAll();
    }

    function handleHeaderCellRendered(e, args) {
      var column = args.column;

      if (column.header && column.header.buttons) {
        var i = column.header.buttons.length;
        while (i--) {
          var button = column.header.buttons[i];
          var btn = (0, _jquery2.default)('<div></div>').addClass(options.buttonCssClass).data('column', column).data('button', button);

          if (button.showOnHover) {
            btn.addClass('slick-header-button-hidden');
          }

          if (button.image) {
            btn.css('backgroundImage', 'url(' + button.image + ')');
          }

          if (button.cssClass) {
            btn.addClass(button.cssClass);
          }

          if (button.tooltip) {
            btn.attr('title', button.tooltip);
          }

          if (button.command) {
            btn.data('command', button.command);
          }

          if (button.handler) {
            btn.bind('click', button.handler);
          }

          btn.bind('click', handleButtonClick).appendTo(args.node);
          args.node.classList.add('has-buttons');
        }
      }
    }

    function handleBeforeHeaderCellDestroy(e, args) {
      var column = args.column;

      if (column.header && column.header.buttons) {
        (0, _jquery2.default)(args.node).find('.' + options.buttonCssClass).remove();
      }
    }

    function handleButtonClick(e) {
      var command = (0, _jquery2.default)(this).data('command');
      var columnDef = (0, _jquery2.default)(this).data('column');
      var button = (0, _jquery2.default)(this).data('button');

      if (command != null) {
        _self.onCommand.notify({
          'grid': _grid,
          'column': columnDef,
          'command': command,
          'button': button
        }, e, _self);

        _grid.updateColumnHeader(columnDef.id);
      }

      e.preventDefault();
      e.stopPropagation();
    }

    Object.assign(this, {
      init: init,
      destroy: destroy,

      'onCommand': new _slickgridEs.Slick.Event()
    });
  }
});