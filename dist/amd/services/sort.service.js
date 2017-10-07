define(["require", "exports", "./../models/fieldType", "./../sorters"], function (require, exports, fieldType_1, sorters_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var SortService = /** @class */ (function () {
        function SortService() {
        }
        /**
         * Attach a backend sort (single/multi) hook to the grid
         * @param grid SlickGrid Grid object
         * @param gridOptions Grid Options object
         */
        SortService.prototype.attachBackendOnSort = function (grid, gridOptions) {
            this.subscriber = grid.onSort;
            this.subscriber.subscribe(gridOptions.onSortChanged);
        };
        /**
         * Attach a local sort (single/multi) hook to the grid
         * @param grid SlickGrid Grid object
         * @param gridOptions Grid Options object
         * @param dataView
         */
        SortService.prototype.attachLocalOnSort = function (grid, dataView) {
            this.subscriber = grid.onSort;
            this.subscriber.subscribe(function (e, args) {
                // multiSort and singleSort are not exactly the same, but we want to structure it the same for the (for loop) after
                // also to avoid having to rewrite the for loop in the sort, we will make the singleSort an array of 1 object
                var sortColumns = (args.multiColumnSort) ? args.sortCols : new Array({ sortAsc: args.sortAsc, sortCol: args.sortCol });
                dataView.sort(function (dataRow1, dataRow2) {
                    for (var i = 0, l = sortColumns.length; i < l; i++) {
                        var sortDirection = sortColumns[i].sortAsc ? 1 : -1;
                        var sortField = sortColumns[i].sortCol.field;
                        var fieldType = sortColumns[i].sortCol.type || 'string';
                        var value1 = dataRow1[sortField];
                        var value2 = dataRow2[sortField];
                        var result = 0;
                        switch (fieldType) {
                            case fieldType_1.FieldType.number:
                                result = sorters_1.Sorters.numeric(value1, value2, sortDirection);
                                break;
                            case fieldType_1.FieldType.date:
                                result = sorters_1.Sorters.date(value1, value2, sortDirection);
                                break;
                            case fieldType_1.FieldType.dateIso:
                                result = sorters_1.Sorters.dateIso(value1, value2, sortDirection);
                                break;
                            case fieldType_1.FieldType.dateUs:
                                result = sorters_1.Sorters.dateUs(value1, value2, sortDirection);
                                break;
                            case fieldType_1.FieldType.dateUsShort:
                                result = sorters_1.Sorters.dateUsShort(value1, value2, sortDirection);
                                break;
                            default:
                                result = sorters_1.Sorters.string(value1, value2, sortDirection);
                                break;
                        }
                        if (result !== 0) {
                            return result;
                        }
                    }
                    return 0;
                });
                grid.invalidate();
                grid.render();
            });
        };
        SortService.prototype.destroy = function () {
            this.subscriber.unsubscribe();
        };
        return SortService;
    }());
    exports.SortService = SortService;
});
