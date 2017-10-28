System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GridEventService;
    return {
        setters: [],
        execute: function () {
            GridEventService = /** @class */ (function () {
                function GridEventService() {
                }
                /* OnMouseHover (Enter/Leave) Events */
                GridEventService.prototype.attachOnMouseHover = function (grid) {
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
                /* OnClick Event */
                GridEventService.prototype.attachOnClick = function (grid, gridOptions, dataView) {
                    grid.onClick.subscribe(function (e, args) {
                        if (!e || !args || !args.grid || args.cell === undefined || !args.grid.getColumns || !args.grid.getDataItem) {
                            return;
                        }
                        var column = args.grid.getColumns()[args.cell];
                        // so if the columns definition does have an column.onCellClick property (a function attached), then run it
                        if (typeof column.onCellClick === 'function') {
                            // attach both "this._gridOptions" and "_slickDataViewObj" since we'll need them inside the AJAX column.onClick
                            var onCellClickArgs = {
                                dataView: dataView,
                                gridDefinition: gridOptions,
                                grid: grid,
                                columnDef: args.grid.getColumns()[args.cell],
                                dataContext: args.grid.getDataItem(args.row)
                            };
                            // finally call up the Slick.column.onClicks.... function
                            column.onCellClick(onCellClickArgs);
                            e.stopImmediatePropagation();
                        }
                        // stop the click event bubbling
                        // NOTE: We don't want to stop bubbling when doing an input edit, if we do the autoEdit which has intent of doing singleClick edit will become doubleClick edit
                        if (grid.getOptions && !grid.getOptions().autoEdit) {
                            e.stopImmediatePropagation();
                        }
                    });
                };
                return GridEventService;
            }());
            exports_1("GridEventService", GridEventService);
        }
    };
});
//# sourceMappingURL=gridEvent.service.js.map