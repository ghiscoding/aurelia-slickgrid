System.register(["./global-grid-options"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var global_grid_options_1, SlickgridConfig;
    return {
        setters: [
            function (global_grid_options_1_1) {
                global_grid_options_1 = global_grid_options_1_1;
            }
        ],
        execute: function () {
            SlickgridConfig = /** @class */ (function () {
                function SlickgridConfig() {
                    this.options = global_grid_options_1.GlobalGridOptions;
                }
                return SlickgridConfig;
            }());
            exports_1("SlickgridConfig", SlickgridConfig);
        }
    };
});
