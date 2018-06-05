var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GridEventService = /** @class */ (function () {
        function GridEventService() {
            this._eventHandler = new Slick.EventHandler();
        }
        /* OnCellChange Event */
        GridEventService.prototype.attachOnCellChange = function (grid, dataView) {
            // subscribe to this Slickgrid event of onCellChange
            this._eventHandler.subscribe(grid.onCellChange, function (e, args) {
                if (!e || !args || !grid || args.cell === undefined || !grid.getColumns || !grid.getDataItem) {
                    return;
                }
                var column = grid.getColumns()[args.cell];
                // if the column definition has a onCellChange property (a callback function), then run it
                if (typeof column.onCellChange === 'function') {
                    // add to the output gridOptions & dataView since we'll need them inside the AJAX column.onCellChange
                    var returnedArgs = {
                        row: args.row,
                        cell: args.cell,
                        dataView: dataView,
                        gridDefinition: grid.getOptions(),
                        grid: grid,
                        columnDef: column,
                        dataContext: grid.getDataItem(args.row)
                    };
                    // finally call up the Slick.column.onCellChanges.... function
                    column.onCellChange(e, returnedArgs);
                }
            });
        };
        /* OnClick Event */
        GridEventService.prototype.attachOnClick = function (grid, dataView) {
            this._eventHandler.subscribe(grid.onClick, function (e, args) {
                if (!e || !args || !grid || args.cell === undefined || !grid.getColumns || !grid.getDataItem) {
                    return;
                }
                var column = grid.getColumns()[args.cell];
                // if the column definition has a onCellClick property (a callback function), then run it
                if (typeof column.onCellClick === 'function') {
                    // add to the output gridOptions & dataView since we'll need them inside the AJAX column.onClick
                    var returnedArgs = {
                        row: args.row,
                        cell: args.cell,
                        dataView: dataView,
                        gridDefinition: grid.getOptions(),
                        grid: grid,
                        columnDef: column,
                        dataContext: grid.getDataItem(args.row)
                    };
                    // finally call up the Slick.column.onCellClick.... function
                    column.onCellClick(e, returnedArgs);
                }
            });
        };
        GridEventService.prototype.dispose = function () {
            this._eventHandler.unsubscribeAll();
        };
        GridEventService = __decorate([
            aurelia_framework_1.singleton(true)
        ], GridEventService);
        return GridEventService;
    }());
    exports.GridEventService = GridEventService;
});
//# sourceMappingURL=gridEvent.service.js.map