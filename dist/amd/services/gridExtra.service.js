define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GridExtraService = /** @class */ (function () {
        function GridExtraService() {
        }
        Object.defineProperty(GridExtraService.prototype, "_gridOptions", {
            /** Getter for the Grid Options pulled through the Grid Object */
            get: function () {
                return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Initialize the Service
         * @param grid
         * @param dataView
         */
        GridExtraService.prototype.init = function (grid, dataView) {
            this._grid = grid;
            this._dataView = dataView;
        };
        GridExtraService.prototype.getDataItemByRowNumber = function (rowNumber) {
            if (!this._grid || typeof this._grid.getDataItem !== 'function') {
                throw new Error('We could not find SlickGrid Grid object');
            }
            return this._grid.getDataItem(rowNumber);
        };
        /** Chain the item Metadata with our implementation of Metadata at given row index */
        GridExtraService.prototype.getItemRowMetadata = function (previousItemMetadata) {
            var _this = this;
            return function (rowNumber) {
                var item = _this._dataView.getItem(rowNumber);
                var meta = {
                    cssClasses: ''
                };
                if (typeof previousItemMetadata === 'object' && !$.isEmptyObject(previousItemMetadata)) {
                    meta = previousItemMetadata(rowNumber);
                }
                if (item && item._dirty) {
                    meta.cssClasses = (meta.cssClasses || '') + ' dirty';
                }
                if (item && item.rowClass) {
                    meta.cssClasses += " " + item.rowClass;
                    meta.cssClasses += " row" + rowNumber;
                }
                return meta;
            };
        };
        /**
         * Highlight then fade a row for x seconds.
         * The implementation follows this SO answer: https://stackoverflow.com/a/19985148/1212166
         * @param rowNumber
         * @param fadeDelay
         */
        GridExtraService.prototype.highlightRow = function (rowNumber, fadeDelay) {
            var _this = this;
            if (fadeDelay === void 0) { fadeDelay = 1500; }
            // create a SelectionModel if there's not one yet
            if (!this._grid.getSelectionModel()) {
                var rowSelectionPlugin = new Slick.RowSelectionModel(this._gridOptions.rowSelectionOptions || {});
                this._grid.setSelectionModel(rowSelectionPlugin);
            }
            this._grid.setSelectedRows([rowNumber]);
            this._dataView.getItemMetadata = this.getItemRowMetadata(this._dataView.getItemMetadata);
            var item = this._dataView.getItem(rowNumber);
            if (item && item.id) {
                item.rowClass = 'highlight';
                this._dataView.updateItem(item.id, item);
                // highlight the row for a user defined timeout
                $("#" + this._gridOptions.gridId)
                    .find(".highlight.row" + rowNumber)
                    .first();
                // delete the row's CSS that was attached for highlighting
                setTimeout(function () {
                    if (item && item.id) {
                        delete item.rowClass;
                        var gridIdx = _this._dataView.getIdxById(item.id);
                        if (gridIdx !== undefined) {
                            _this._dataView.updateItem(item.id, item);
                        }
                    }
                }, fadeDelay + 10);
            }
        };
        GridExtraService.prototype.getSelectedRows = function () {
            return this._grid.getSelectedRows();
        };
        GridExtraService.prototype.setSelectedRow = function (rowIndex) {
            this._grid.setSelectedRows([rowIndex]);
        };
        GridExtraService.prototype.setSelectedRows = function (rowIndexes) {
            this._grid.setSelectedRows(rowIndexes);
        };
        GridExtraService.prototype.renderGrid = function () {
            if (this._grid && typeof this._grid.invalidate === 'function') {
                this._grid.invalidate();
                this._grid.render();
            }
        };
        /**
         * Add an item (data item) to the datagrid
         * @param object dataItem: item object holding all properties of that row
         */
        GridExtraService.prototype.addItemToDatagrid = function (item) {
            if (!this._grid || !this._gridOptions || !this._dataView) {
                throw new Error('We could not find SlickGrid Grid, DataView objects');
            }
            if (!this._gridOptions || (!this._gridOptions.enableCheckboxSelector && !this._gridOptions.enableRowSelection)) {
                throw new Error('addItemToDatagrid() requires to have a valid Slickgrid Selection Model. You can overcome this issue by enabling enableCheckboxSelector or enableRowSelection to True');
            }
            var row = 0;
            this._dataView.insertItem(row, item);
            // scroll to first row and highlight it
            this._grid.scrollRowIntoView(0);
            this.highlightRow(0, 1500);
            // refresh dataview & grid
            this._dataView.refresh();
        };
        /**
         * Delete an existing item from the datagrid (dataView)
         * @param object item: item object holding all properties of that row
         */
        GridExtraService.prototype.deleteDataGridItem = function (item) {
            var row = this._dataView.getRowById(item.id);
            var itemId = (!item || !item.hasOwnProperty('id')) ? -1 : item.id;
            if (row === undefined || itemId === -1) {
                throw new Error("Could not find the item in the grid or it's associated \"id\"");
            }
            // delete the item from the dataView
            this._dataView.deleteItem(itemId);
            this._dataView.refresh();
        };
        /**
         * Delete an existing item from the datagrid (dataView)
         * @param object item: item object holding all properties of that row
         */
        GridExtraService.prototype.deleteDataGridItemById = function (id) {
            var row = this._dataView.getRowById(id);
            if (row === undefined) {
                throw new Error("Could not find the item in the grid by it's associated \"id\"");
            }
            // delete the item from the dataView
            this._dataView.deleteItem(id);
            this._dataView.refresh();
        };
        /**
         * Update an existing item with new properties inside the datagrid (dataView)
         * @param object item: item object holding all properties of that row
         */
        GridExtraService.prototype.updateDataGridItem = function (item) {
            var row = this._dataView.getRowById(item.id);
            var itemId = (!item || !item.hasOwnProperty('id')) ? -1 : item.id;
            if (itemId === -1) {
                throw new Error("Could not find the item in the grid or it's associated \"id\"");
            }
            var gridIdx = this._dataView.getIdxById(itemId);
            if (gridIdx !== undefined) {
                // Update the item itself inside the dataView
                this._dataView.updateItem(itemId, item);
                // highlight the row we just updated
                this.highlightRow(row, 1500);
                // refresh dataview & grid
                this._dataView.refresh();
            }
        };
        return GridExtraService;
    }());
    exports.GridExtraService = GridExtraService;
});
//# sourceMappingURL=gridExtra.service.js.map