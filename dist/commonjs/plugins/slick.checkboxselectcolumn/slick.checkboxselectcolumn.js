'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

var _slickgridEs = require('slickgrid-es6');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_slickgridEs.Slick.CheckboxSelectColumn = CheckboxSelectColumn;
exports.default = CheckboxSelectColumn;


function CheckboxSelectColumn(options) {
  var _grid = void 0;
  var _self = this;
  var _handler = new _slickgridEs.Slick.EventHandler();
  var _selectedRowsLookup = {};
  var _defaults = {
    columnId: '_checkbox_selector',
    cssClass: null,
    toolTip: 'Select/Deselect All',
    width: 30
  };

  var _options = _jquery2.default.extend(true, {}, _defaults, options);

  function init(grid) {
    _grid = grid;
    _handler.subscribe(_grid.onSelectedRowsChanged, handleSelectedRowsChanged).subscribe(_grid.onClick, handleClick).subscribe(_grid.onHeaderClick, handleHeaderClick).subscribe(_grid.onKeyDown, handleKeyDown);
  }

  function destroy() {
    _handler.unsubscribeAll();
  }

  function handleSelectedRowsChanged(e, args) {
    var selectedRows = _grid.getSelectedRows();
    var lookup = {},
        row = void 0,
        i = void 0;
    for (i = 0; i < selectedRows.length; i++) {
      row = selectedRows[i];
      lookup[row] = true;
      if (lookup[row] !== _selectedRowsLookup[row]) {
        _grid.invalidateRow(row);
        delete _selectedRowsLookup[row];
      }
    }
    for (i in _selectedRowsLookup) {
      _grid.invalidateRow(i);
    }
    _selectedRowsLookup = lookup;
    _grid.render();

    if (selectedRows.length && selectedRows.length == _grid.getDataLength()) {
      _grid.updateColumnHeader(_options.columnId, "<input type='checkbox' checked='checked'>", _options.toolTip);
    } else {
      _grid.updateColumnHeader(_options.columnId, "<input type='checkbox'>", _options.toolTip);
    }
  }

  function handleKeyDown(e, args) {
    if (e.which == 32) {
      if (_grid.getColumns()[args.cell].id === _options.columnId) {
        if (!_grid.getEditorLock().isActive() || _grid.getEditorLock().commitCurrentEdit()) {
          toggleRowSelection(args.row);
        }
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }
  }

  function handleClick(e, args) {
    if (_grid.getColumns()[args.cell].id === _options.columnId && (0, _jquery2.default)(e.target).is(':checkbox')) {
      if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      toggleRowSelection(args.row);
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  function toggleRowSelection(row) {
    if (_selectedRowsLookup[row]) {
      _grid.setSelectedRows(_jquery2.default.grep(_grid.getSelectedRows(), function (n) {
        return n != row;
      }));
    } else {
      _grid.setSelectedRows(_grid.getSelectedRows().concat(row));
    }
  }

  function handleHeaderClick(e, args) {
    if (args.column.id == _options.columnId && (0, _jquery2.default)(e.target).is(':checkbox')) {
      if (_grid.getEditorLock().isActive() && !_grid.getEditorLock().commitCurrentEdit()) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }

      if ((0, _jquery2.default)(e.target).is(':checked')) {
        var rows = [];
        for (var i = 0; i < _grid.getDataLength(); i++) {
          rows.push(i);
        }
        _grid.setSelectedRows(rows);
      } else {
        _grid.setSelectedRows([]);
      }
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }

  function getColumnDefinition() {
    return {
      id: _options.columnId,
      name: "<input type='checkbox'>",
      toolTip: _options.toolTip,
      field: 'sel',
      width: _options.width,
      resizable: false,
      sortable: false,
      cssClass: _options.cssClass,
      formatter: checkboxSelectionFormatter
    };
  }

  function checkboxSelectionFormatter(row, cell, value, columnDef, dataContext) {
    if (dataContext) {
      return _selectedRowsLookup[row] ? "<input type='checkbox' checked='checked'>" : "<input type='checkbox'>";
    }
    return null;
  }

  Object.assign(this, {
    init: init,
    destroy: destroy,

    getColumnDefinition: getColumnDefinition
  });
}