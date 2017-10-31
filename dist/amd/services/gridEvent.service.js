define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GridEventService = /** @class */ (function () {
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
                // so if the columns definition does have an column.onCellClick property (a callback function attached), then run it
                if (typeof column.onCellClick === 'function') {
                    // add more useful properties to the return of the onCellClick callback
                    var onCellClickArgs = {
                        dataView: dataView,
                        gridDefinition: gridOptions,
                        grid: grid,
                        columnDef: column,
                        dataContext: args.grid.getDataItem(args.row)
                    };
                    // finally execute the onCellClick callback
                    column.onCellClick(onCellClickArgs);
                    e.stopImmediatePropagation();
                }
                // stop the click event bubbling
                // NOTE: We don't want to stop bubbling when doing an input edit, if we do the autoEdit which has intent of doing singleClick edit will become doubleClick edit
                if (!grid.getOptions || !grid.getOptions().autoEdit) {
                    // e.stopImmediatePropagation();
                }
            });
        };
        return GridEventService;
    }());
    exports.GridEventService = GridEventService;
});
//# sourceMappingURL=gridEvent.service.js.map