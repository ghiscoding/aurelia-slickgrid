'use strict';

System.register(['slickgrid-es6', './slick-service', './plugins/index'], function (_export, _context) {
  "use strict";

  var Slick, Editors, Formatters, Data, Grid, FrozenGrid, SlickService, Plugins;
  function configure(aurelia) {
    aurelia.globalResources('./slick-pager');
  }

  _export('configure', configure);

  return {
    setters: [function (_slickgridEs) {
      Slick = _slickgridEs.Slick;
      Editors = _slickgridEs.Editors;
      Formatters = _slickgridEs.Formatters;
      Data = _slickgridEs.Data;
      Grid = _slickgridEs.Grid;
      FrozenGrid = _slickgridEs.FrozenGrid;
    }, function (_slickService) {
      SlickService = _slickService.SlickService;
    }, function (_pluginsIndex) {
      Plugins = _pluginsIndex;
    }],
    execute: function () {
      _export('Slick', Slick);

      _export('Editors', Editors);

      _export('Formatters', Formatters);

      _export('Data', Data);

      _export('Grid', Grid);

      _export('FrozenGrid', FrozenGrid);

      _export('Plugins', Plugins);

      _export('SlickService', SlickService);
    }
  };
});