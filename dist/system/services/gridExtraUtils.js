System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GridExtraUtils;
    return {
        setters: [],
        execute: function () {
            GridExtraUtils = /** @class */ (function () {
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
            exports_1("GridExtraUtils", GridExtraUtils);
        }
    };
});
//# sourceMappingURL=gridExtraUtils.js.map