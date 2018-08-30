var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-i18n", "aurelia-framework", "./controlAndPlugin.service", "./filter.service", "./gridState.service", "./sort.service", "jquery"], function (require, exports, aurelia_i18n_1, aurelia_framework_1, controlAndPlugin_service_1, filter_service_1, gridState_service_1, sort_service_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GridService = /** @class */ (function () {
        function GridService(controlAndPluginService, filterService, i18n, gridStateService, sortService) {
            this.controlAndPluginService = controlAndPluginService;
            this.filterService = filterService;
            this.i18n = i18n;
            this.gridStateService = gridStateService;
            this.sortService = sortService;
        }
        Object.defineProperty(GridService.prototype, "_columnDefinitions", {
            /** Getter for the Column Definitions pulled through the Grid Object */
            get: function () {
                return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(GridService.prototype, "_gridOptions", {
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
        GridService.prototype.init = function (grid, dataView) {
            this._grid = grid;
            this._dataView = dataView;
        };
        /**
         * From a SlickGrid Event triggered get the Column Definition and Item Data Context
         *
         * For example the SlickGrid onClick will return cell arguments when subscribing to it.
         * From these cellArgs, we want to get the Column Definition and Item Data
         * @param cell event args
         * @return object with columnDef and dataContext
         */
        GridService.prototype.getColumnFromEventArguments = function (args) {
            if (!args || !args.grid || !args.grid.getColumns || !args.grid.getDataItem) {
                throw new Error('To get the column definition and data, we need to have these arguments passed as objects (row, cell, grid)');
            }
            return {
                row: args.row,
                cell: args.cell,
                columnDef: args.grid.getColumns()[args.cell],
                dataContext: args.grid.getDataItem(args.row),
                dataView: this._dataView,
                grid: this._grid,
                gridDefinition: this._gridOptions
            };
        };
        /** Get data item by it's row index number */
        GridService.prototype.getDataItemByRowNumber = function (rowNumber) {
            if (!this._grid || typeof this._grid.getDataItem !== 'function') {
                throw new Error('We could not find SlickGrid Grid object');
            }
            return this._grid.getDataItem(rowNumber);
        };
        /** Chain the item Metadata with our implementation of Metadata at given row index */
        GridService.prototype.getItemRowMetadata = function (previousItemMetadata) {
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
        GridService.prototype.highlightRow = function (rowNumber, fadeDelay) {
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
        /** Get the Data Item from a grid row index */
        GridService.prototype.getDataItemByRowIndex = function (index) {
            if (!this._grid || typeof this._grid.getDataItem !== 'function') {
                throw new Error('We could not find SlickGrid Grid object');
            }
            return this._grid.getDataItem(index);
        };
        /** Get the Data Item from an array of grid row indexes */
        GridService.prototype.getDataItemByRowIndexes = function (indexes) {
            var _this = this;
            if (!this._grid || typeof this._grid.getDataItem !== 'function') {
                throw new Error('We could not find SlickGrid Grid object');
            }
            var dataItems = [];
            if (Array.isArray(indexes)) {
                indexes.forEach(function (idx) {
                    dataItems.push(_this._grid.getDataItem(idx));
                });
            }
            return dataItems;
        };
        /** Get the currently selected row indexes */
        GridService.prototype.getSelectedRows = function () {
            return this._grid.getSelectedRows();
        };
        /** Get the currently selected rows item data */
        GridService.prototype.getSelectedRowsDataItem = function () {
            if (!this._grid || typeof this._grid.getSelectedRows !== 'function') {
                throw new Error('We could not find SlickGrid Grid object');
            }
            var selectedRowIndexes = this._grid.getSelectedRows();
            return this.getDataItemByRowIndexes(selectedRowIndexes);
        };
        /** Select the selected row by a row index */
        GridService.prototype.setSelectedRow = function (rowIndex) {
            this._grid.setSelectedRows([rowIndex]);
        };
        /** Set selected rows with provided array of row indexes */
        GridService.prototype.setSelectedRows = function (rowIndexes) {
            this._grid.setSelectedRows(rowIndexes);
        };
        /** Re-Render the Grid */
        GridService.prototype.renderGrid = function () {
            if (this._grid && typeof this._grid.invalidate === 'function') {
                this._grid.invalidate();
                this._grid.render();
            }
        };
        /**
         * Reset the grid to it's original state (clear any filters, sorting & pagination if exists) .
         * The column definitions could be passed as argument to reset (this can be used after a Grid State reset)
         * The reset will clear the Filters & Sort, then will reset the Columns to their original state
         */
        GridService.prototype.resetGrid = function (columnDefinitions) {
            // reset columns to original states & refresh the grid
            if (this._grid && this._dataView) {
                var originalColumns = this.controlAndPluginService.getAllColumns();
                // const originalColumns = columnDefinitions || this._columnDefinitions;
                if (Array.isArray(originalColumns) && originalColumns.length > 0) {
                    // set the grid columns to it's original column definitions
                    this._grid.setColumns(originalColumns);
                    this._dataView.refresh();
                    if (this._gridOptions && this._gridOptions.enableAutoSizeColumns) {
                        this._grid.autosizeColumns();
                    }
                    this.gridStateService.resetColumns(columnDefinitions);
                }
            }
            if (this.filterService && this.filterService.clearFilters) {
                this.filterService.clearFilters();
            }
            if (this.sortService && this.sortService.clearSorting) {
                this.sortService.clearSorting();
            }
        };
        /**
         * Add an item (data item) to the datagrid, by default it will highlight (flashing) the inserted row but we can disable it too
         * @param object dataItem: item object holding all properties of that row
         * @param shouldHighlightRow do we want to highlight the row after adding item
         */
        GridService.prototype.addItemToDatagrid = function (item, shouldHighlightRow) {
            if (shouldHighlightRow === void 0) { shouldHighlightRow = true; }
            if (!this._grid || !this._gridOptions || !this._dataView) {
                throw new Error('We could not find SlickGrid Grid, DataView objects');
            }
            var row = 0;
            this._dataView.insertItem(row, item);
            this._grid.scrollRowIntoView(0); // scroll to row 0
            // highlight the row we just added, if defined
            if (shouldHighlightRow) {
                this.highlightRow(0, 1500);
            }
            // refresh dataview & grid
            this._dataView.refresh();
        };
        /**
         * Add item array (data item) to the datagrid, by default it will highlight (flashing) the inserted row but we can disable it too
         * @param dataItem array: item object holding all properties of that row
         * @param shouldHighlightRow do we want to highlight the row after adding item
         */
        GridService.prototype.addItemsToDatagrid = function (items, shouldHighlightRow) {
            var _this = this;
            if (shouldHighlightRow === void 0) { shouldHighlightRow = true; }
            if (Array.isArray(items)) {
                items.forEach(function (item) { return _this.addItemToDatagrid(item, shouldHighlightRow); });
            }
        };
        /**
         * Delete an existing item from the datagrid (dataView)
         * @param object item: item object holding all properties of that row
         */
        GridService.prototype.deleteDataGridItem = function (item) {
            if (!item || !item.hasOwnProperty('id')) {
                throw new Error("deleteDataGridItem() requires an item object which includes the \"id\" property");
            }
            var itemId = (!item || !item.hasOwnProperty('id')) ? undefined : item.id;
            this.deleteDataGridItemById(itemId);
        };
        /**
         * Delete an existing item from the datagrid (dataView) by it's id
         * @param itemId: item unique id
         */
        GridService.prototype.deleteDataGridItemById = function (itemId) {
            if (itemId === undefined) {
                throw new Error("Cannot delete a row without a valid \"id\"");
            }
            if (this._dataView.getRowById(itemId) === undefined) {
                throw new Error("Could not find the item in the grid by it's associated \"id\"");
            }
            // delete the item from the dataView
            this._dataView.deleteItem(itemId);
            this._dataView.refresh();
        };
        /**
         * Update an existing item with new properties inside the datagrid
         * @param object item: item object holding all properties of that row
         */
        GridService.prototype.updateDataGridItem = function (item) {
            var itemId = (!item || !item.hasOwnProperty('id')) ? undefined : item.id;
            if (itemId === undefined) {
                throw new Error("Could not find the item in the grid or it's associated \"id\"");
            }
            this.updateDataGridItemById(itemId, item);
        };
        /**
         * Update an existing item in the datagrid by it's id and new properties
         * @param itemId: item unique id
         * @param object item: item object holding all properties of that row
         * @param shouldHighlightRow do we want to highlight the row after update
         */
        GridService.prototype.updateDataGridItemById = function (itemId, item, shouldHighlightRow) {
            if (shouldHighlightRow === void 0) { shouldHighlightRow = true; }
            if (itemId === undefined) {
                throw new Error("Cannot update a row without a valid \"id\"");
            }
            var row = this._dataView.getRowById(itemId);
            if (!item || row === undefined) {
                throw new Error("Could not find the item in the grid or it's associated \"id\"");
            }
            var gridIdx = this._dataView.getIdxById(itemId);
            if (gridIdx !== undefined) {
                // Update the item itself inside the dataView
                this._dataView.updateItem(itemId, item);
                // highlight the row we just updated, if defined
                if (shouldHighlightRow) {
                    this.highlightRow(row, 1500);
                }
                // refresh dataview & grid
                this._dataView.refresh();
            }
        };
        GridService = __decorate([
            aurelia_framework_1.singleton(true),
            aurelia_framework_1.inject(controlAndPlugin_service_1.ControlAndPluginService, filter_service_1.FilterService, aurelia_i18n_1.I18N, gridState_service_1.GridStateService, sort_service_1.SortService)
        ], GridService);
        return GridService;
    }());
    exports.GridService = GridService;
});
//# sourceMappingURL=grid.service.js.map