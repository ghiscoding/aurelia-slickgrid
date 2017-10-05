define(["require", "exports", "./au-slickgrid", "./slickgrid-config"], function (require, exports, au_slickgrid_1, slickgrid_config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuSlickgridCustomElement = au_slickgrid_1.AuSlickgridCustomElement;
    exports.SlickgridConfig = slickgrid_config_1.SlickgridConfig;
    function configure(aurelia, callback) {
        aurelia.globalResources('./au-slickgrid');
        var config = new slickgrid_config_1.SlickgridConfig();
        if (typeof callback === 'function') {
            callback(config);
        }
    }
    exports.configure = configure;
});
