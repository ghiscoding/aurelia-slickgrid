System.register(["jquery"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var $, GridExtraService;
    return {
        setters: [
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            GridExtraService = /** @class */ (function () {
                function GridExtraService() {
                }
                GridExtraService.prototype.init = function (grid, dataView) {
                    this._grid = grid;
                    this._dataView = dataView;
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
                 * @param {number} rowNumber
                 * @param {number} fadeDelay
                 */
                GridExtraService.prototype.highlightRow = function (rowNumber, fadeDelay) {
                    var _this = this;
                    if (fadeDelay === void 0) { fadeDelay = 1500; }
                    // chain current item Metadata with our own Metadata for implementing highligh CSS styling
                    var previousMetadata = this._dataView.getItemMetadata;
                    this._grid.setSelectedRows([rowNumber]);
                    this._dataView.getItemMetadata = this.getItemRowMetadata(this._dataView.getItemMetadata);
                    var item = this._dataView.getItem(rowNumber);
                    item.rowClass = 'highlight';
                    this._dataView.updateItem(item.id, item);
                    var gridOptions = this._grid.getOptions();
                    // highlight the row for a user defined timeout
                    var rowElm = $("#" + gridOptions.gridId)
                        .find(".highlight.row" + rowNumber)
                        .first();
                    // delete the row's CSS that was attached for highlighting
                    setTimeout(function () {
                        delete item.rowClass;
                        _this._dataView.updateItem(item.id, item);
                    }, fadeDelay + 10);
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
                return GridExtraService;
            }());
            exports_1("GridExtraService", GridExtraService);
        }
    };
});
//# sourceMappingURL=gridExtra.service.js.map