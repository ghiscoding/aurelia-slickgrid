"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var au_slickgrid_1 = require("./au-slickgrid");
exports.AuSlickgridCustomElement = au_slickgrid_1.AuSlickgridCustomElement;
var slickgrid_config_1 = require("./slickgrid-config");
exports.SlickgridConfig = slickgrid_config_1.SlickgridConfig;
function configure(aurelia, callback) {
    aurelia.globalResources('./au-slickgrid');
    var config = new slickgrid_config_1.SlickgridConfig();
    if (typeof callback === 'function') {
        callback(config);
    }
}
exports.configure = configure;
