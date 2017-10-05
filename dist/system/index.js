System.register(["./au-slickgrid", "./slickgrid-config"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function configure(aurelia, callback) {
        aurelia.globalResources('./au-slickgrid');
        var config = new slickgrid_config_1.SlickgridConfig();
        if (typeof callback === 'function') {
            callback(config);
        }
    }
    exports_1("configure", configure);
    var au_slickgrid_1, slickgrid_config_1;
    return {
        setters: [
            function (au_slickgrid_1_1) {
                au_slickgrid_1 = au_slickgrid_1_1;
            },
            function (slickgrid_config_1_1) {
                slickgrid_config_1 = slickgrid_config_1_1;
            }
        ],
        execute: function () {
            exports_1("AuSlickgridCustomElement", au_slickgrid_1.AuSlickgridCustomElement);
            exports_1("SlickgridConfig", slickgrid_config_1.SlickgridConfig);
        }
    };
});
