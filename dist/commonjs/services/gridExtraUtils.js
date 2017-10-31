"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GridExtraUtils = /** @class */ (function () {
    function GridExtraUtils() {
    }
    GridExtraUtils.getColumnDefinitionAndData = function (args) {
        if (!args || !args.grid || !args.grid.getColumns || !args.grid.getDataItem) {
            throw new Error('To get the column definition and data, we need to have these arguments passed (row, cell, grid)');
        }
        return {
            columnDef: args.grid.getColumns()[args.cell],
            dataContext: args.grid.getDataItem(args.row)
        };
    };
    return GridExtraUtils;
}());
exports.GridExtraUtils = GridExtraUtils;
//# sourceMappingURL=gridExtraUtils.js.map