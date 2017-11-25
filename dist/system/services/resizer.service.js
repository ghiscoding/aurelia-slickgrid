System.register(["jquery"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var $, DATAGRID_MIN_HEIGHT, DATAGRID_MIN_WIDTH, DATAGRID_BOTTOM_PADDING, DATAGRID_PAGINATION_HEIGHT, timer, ResizerService;
    return {
        setters: [
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            // global constants, height/width are in pixels
            DATAGRID_MIN_HEIGHT = 180;
            DATAGRID_MIN_WIDTH = 300;
            DATAGRID_BOTTOM_PADDING = 20;
            DATAGRID_PAGINATION_HEIGHT = 35;
            ResizerService = /** @class */ (function () {
                function ResizerService() {
                }
                ResizerService.prototype.init = function (grid, gridOptions) {
                    this._grid = grid;
                    this._gridOptions = gridOptions;
                };
                /** Attach an auto resize trigger on the datagrid, if that is enable then it will resize itself to the available space
                 * Options: we could also provide a % factor to resize on each height/width independently
                 */
                ResizerService.prototype.attachAutoResizeDataGrid = function () {
                    var _this = this;
                    // if we can't find the grid to resize, return without attaching anything
                    var gridDomElm = $("#" + (this._gridOptions && this._gridOptions.gridId ? this._gridOptions.gridId : 'grid1'));
                    if (gridDomElm === undefined || gridDomElm.offset() === undefined) {
                        return null;
                    }
                    // -- 1st resize the datagrid size at first load (we need this because the .on event is not triggered on first load)
                    this.resizeGrid();
                    // -- 2nd attach a trigger on the Window DOM element, so that it happens also when resizing after first load
                    // -- attach auto-resize to Window object only if it exist
                    $(window).on('resize.grid', function () {
                        // for some yet unknown reason, calling the resize twice removes any stuttering/flickering when changing the height and makes it much smoother
                        _this.resizeGrid();
                        _this.resizeGrid();
                    });
                };
                /**
                 * Calculate the datagrid new height/width from the available space, also consider that a % factor might be applied to calculation
                 * object gridOptions
                 */
                ResizerService.prototype.calculateGridNewDimensions = function (gridOptions) {
                    var gridDomElm = $("#" + gridOptions.gridId);
                    var containerElm = (gridOptions.autoResize && gridOptions.autoResize.containerId) ? $("#" + gridOptions.autoResize.containerId) : $("#" + gridOptions.gridContainerId);
                    var windowElm = $(window);
                    if (windowElm === undefined || containerElm === undefined || gridDomElm === undefined) {
                        return null;
                    }
                    // calculate bottom padding
                    // if using pagination, we need to add the pagination height to this bottom padding
                    var bottomPadding = (gridOptions.autoResize && gridOptions.autoResize.bottomPadding) ? gridOptions.autoResize.bottomPadding : DATAGRID_BOTTOM_PADDING;
                    if (bottomPadding && gridOptions.enablePagination) {
                        bottomPadding += DATAGRID_PAGINATION_HEIGHT;
                    }
                    var gridHeight = windowElm.height() || 0;
                    var coordOffsetTop = gridDomElm.offset();
                    var gridOffsetTop = (coordOffsetTop !== undefined) ? coordOffsetTop.top : 0;
                    var availableHeight = gridHeight - gridOffsetTop - bottomPadding;
                    var availableWidth = containerElm.width() || 0;
                    var minHeight = (gridOptions.autoResize && gridOptions.autoResize.minHeight < 0) ? gridOptions.autoResize.minHeight : DATAGRID_MIN_HEIGHT;
                    var minWidth = (gridOptions.autoResize && gridOptions.autoResize.minWidth < 0) ? gridOptions.autoResize.minWidth : DATAGRID_MIN_WIDTH;
                    var newHeight = availableHeight;
                    var newWidth = (gridOptions.autoResize && gridOptions.autoResize.sidePadding) ? availableWidth - gridOptions.autoResize.sidePadding : availableWidth;
                    if (newHeight < minHeight) {
                        newHeight = minHeight;
                    }
                    if (newWidth < minWidth) {
                        newWidth = minWidth;
                    }
                    return {
                        height: newHeight,
                        width: newWidth
                    };
                };
                /**
                 * Destroy function when element is destroyed
                 */
                ResizerService.prototype.destroy = function () {
                    $(window).off('resize.grid');
                };
                /** Resize the datagrid to fit the browser height & width */
                ResizerService.prototype.resizeGrid = function (delay, newSizes) {
                    var _this = this;
                    if (!this._grid || !this._gridOptions) {
                        throw new Error("\n      Angular-Slickgrid resizer requires a valid Grid object and Grid Options defined.\n      You can fix this by setting your gridOption to use \"enableAutoResize\" or create an instance of the ResizerService by calling attachAutoResizeDataGrid()");
                    }
                    // because of the javascript async nature, we might want to delay the resize a little bit
                    delay = delay || 0;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        // calculate new available sizes but with minimum height of 220px
                        newSizes = newSizes || _this.calculateGridNewDimensions(_this._gridOptions);
                        if (newSizes) {
                            // apply these new height/width to the datagrid
                            $("#" + _this._gridOptions.gridId).height(newSizes.height);
                            $("#" + _this._gridOptions.gridId).width(newSizes.width);
                            $("#" + _this._gridOptions.gridContainerId).height(newSizes.height);
                            $("#" + _this._gridOptions.gridContainerId).width(newSizes.width);
                            // resize the slickgrid canvas on all browser except some IE versions
                            // exclude all IE below IE11
                            // IE11 wants to be a better standard (W3C) follower (finally) they even changed their appName output to also have 'Netscape'
                            if (new RegExp('MSIE [6-8]').exec(navigator.userAgent) === null && _this._grid) {
                                _this._grid.resizeCanvas();
                            }
                            // also call the grid auto-size columns so that it takes available when going bigger
                            if (_this._grid && typeof _this._grid.autosizeColumns === 'function') {
                                _this._grid.autosizeColumns();
                            }
                        }
                    }, delay);
                };
                return ResizerService;
            }());
            exports_1("ResizerService", ResizerService);
        }
    };
});
//# sourceMappingURL=resizer.service.js.map