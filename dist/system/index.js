'use strict';

System.register(['./aurelia-slickgrid', './slick-pager', './slick-window-resizer'], function (_export, _context) {
  "use strict";

  var AureliaSlickgrid, SlickPager, SlickWindowResizer;
  function configure(config) {
    config.globalResources('./aurelia-slickgrid');
    config.globalResources('./slick-pager');
    config.globalResources('./slick-window-resizer');
  }

  _export('configure', configure);

  return {
    setters: [function (_aureliaSlickgrid) {
      AureliaSlickgrid = _aureliaSlickgrid.AureliaSlickgrid;
    }, function (_slickPager) {
      SlickPager = _slickPager.SlickPager;
    }, function (_slickWindowResizer) {
      SlickWindowResizer = _slickWindowResizer.SlickWindowResizer;
    }],
    execute: function () {
      _export('AureliaSlickgrid', AureliaSlickgrid);

      _export('SlickPager', SlickPager);

      _export('SlickWindowResizer', SlickWindowResizer);
    }
  };
});