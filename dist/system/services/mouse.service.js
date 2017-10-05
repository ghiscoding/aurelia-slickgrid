System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var MouseService;
    return {
        setters: [],
        execute: function () {
            MouseService = /** @class */ (function () {
                function MouseService() {
                }
                MouseService.prototype.attachOnMouseHover = function (grid) {
                    grid.onMouseEnter.subscribe(function (e) {
                        var cell = grid.getCellFromEvent(e);
                        if (cell && cell.row >= 0) {
                            grid.setSelectedRows([cell.row]);
                            e.preventDefault();
                        }
                    });
                    grid.onMouseLeave.subscribe(function (e) {
                        grid.setSelectedRows([]);
                        e.preventDefault();
                    });
                };
                return MouseService;
            }());
            exports_1("MouseService", MouseService);
        }
    };
});
