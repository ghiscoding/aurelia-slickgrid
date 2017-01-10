'use strict';

System.register(['./slick-pager', './slick-window-resizer', './slick-service'], function (_export, _context) {
  "use strict";

  var SlickPager, SlickWindowResizer, SlickService;
  function configure(aurelia) {
    aurelia.globalResources('./slick-pager');
  }

  _export('configure', configure);

  return {
    setters: [function (_slickPager) {
      SlickPager = _slickPager.SlickPager;
    }, function (_slickWindowResizer) {
      SlickWindowResizer = _slickWindowResizer.SlickWindowResizer;
    }, function (_slickService) {
      SlickService = _slickService.SlickService;
    }],
    execute: function () {
      _export('SlickPager', SlickPager);

      _export('SlickWindowResizer', SlickWindowResizer);

      _export('SlickService', SlickService);
    }
  };
});