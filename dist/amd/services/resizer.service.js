var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "aurelia-event-aggregator", "./utilities", "jquery"], function (require, exports, aurelia_framework_1, aurelia_event_aggregator_1, utilities_1, $) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // global constants, height/width are in pixels
    var DATAGRID_MIN_HEIGHT = 180;
    var DATAGRID_MIN_WIDTH = 300;
    var DATAGRID_BOTTOM_PADDING = 20;
    var DATAGRID_PAGINATION_HEIGHT = 35;
    var timer;
    var ResizerService = /** @class */ (function () {
        function ResizerService(ea) {
            this.ea = ea;
        }
        Object.defineProperty(ResizerService.prototype, "_gridOptions", {
            /** Getter for the Grid Options pulled through the Grid Object */
            get: function () {
                return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResizerService.prototype, "_gridUid", {
            /** Getter for retrieving the Grid UID that is used when dealing with multiple grids in same view. */
            get: function () {
                return (this._grid && this._grid.getUID) ? this._grid.getUID() : this._gridOptions.gridId;
            },
            enumerable: true,
            configurable: true
        });
        ResizerService.prototype.init = function (grid, fixedDimensions) {
            this._grid = grid;
            this.aureliaEventPrefix = (this._gridOptions && this._gridOptions.defaultAureliaEventPrefix) ? this._gridOptions.defaultAureliaEventPrefix : 'asg';
            if (fixedDimensions) {
                this._fixedHeight = fixedDimensions.height;
                this._fixedWidth = fixedDimensions.width;
            }
        };
        /**
         * Attach an auto resize trigger on the datagrid, if that is enable then it will resize itself to the available space
         * Options: we could also provide a % factor to resize on each height/width independently
         */
        ResizerService.prototype.attachAutoResizeDataGrid = function (newSizes) {
            var _this = this;
            // if we can't find the grid to resize, return without attaching anything
            var gridDomElm = $("#" + (this._gridOptions && this._gridOptions.gridId ? this._gridOptions.gridId : 'grid1'));
            if (gridDomElm === undefined || gridDomElm.offset() === undefined) {
                return null;
            }
            // -- 1st resize the datagrid size at first load (we need this because the .on event is not triggered on first load)
            // -- also we add a slight delay (in ms) so that we resize after the grid render is done
            this.resizeGrid(10, newSizes);
            // -- 2nd attach a trigger on the Window DOM element, so that it happens also when resizing after first load
            // -- attach auto-resize to Window object only if it exist
            $(window).on("resize.grid." + this._gridUid, function () {
                _this.ea.publish(_this.aureliaEventPrefix + ":onBeforeResize", true);
                _this.resizeGrid(0, newSizes);
            });
        };
        /**
         * Calculate the datagrid new height/width from the available space, also consider that a % factor might be applied to calculation
         * object gridOptions
         */
        ResizerService.prototype.calculateGridNewDimensions = function (gridOptions) {
            var gridDomElm = $("#" + gridOptions.gridId);
            var autoResizeOptions = gridOptions && gridOptions.autoResize;
            var containerElm = (autoResizeOptions && autoResizeOptions.containerId) ? $("#" + autoResizeOptions.containerId) : $("#" + gridOptions.gridContainerId);
            var windowElm = $(window);
            if (windowElm === undefined || containerElm === undefined || gridDomElm === undefined || gridOptions === undefined) {
                return null;
            }
            // calculate bottom padding
            // if using pagination, we need to add the pagination height to this bottom padding
            var bottomPadding = (autoResizeOptions && autoResizeOptions.bottomPadding) ? autoResizeOptions.bottomPadding : DATAGRID_BOTTOM_PADDING;
            if (bottomPadding && (gridOptions.enablePagination || this._gridOptions.backendServiceApi)) {
                bottomPadding += DATAGRID_PAGINATION_HEIGHT;
            }
            var gridHeight = windowElm.height() || 0;
            var coordOffsetTop = gridDomElm.offset();
            var gridOffsetTop = (coordOffsetTop !== undefined) ? coordOffsetTop.top : 0;
            var availableHeight = gridHeight - gridOffsetTop - bottomPadding;
            var availableWidth = containerElm.width() || 0;
            var maxHeight = (autoResizeOptions && autoResizeOptions.maxHeight && autoResizeOptions.maxHeight > 0) ? autoResizeOptions.maxHeight : undefined;
            var minHeight = (autoResizeOptions && autoResizeOptions.minHeight && autoResizeOptions.minHeight < 0) ? autoResizeOptions.minHeight : DATAGRID_MIN_HEIGHT;
            var maxWidth = (autoResizeOptions && autoResizeOptions.maxWidth && autoResizeOptions.maxWidth > 0) ? autoResizeOptions.maxWidth : undefined;
            var minWidth = (autoResizeOptions && autoResizeOptions.minWidth && autoResizeOptions.minWidth < 0) ? autoResizeOptions.minWidth : DATAGRID_MIN_WIDTH;
            var newHeight = availableHeight;
            var newWidth = (autoResizeOptions && autoResizeOptions.sidePadding) ? availableWidth - autoResizeOptions.sidePadding : availableWidth;
            // optionally (when defined), make sure that grid height & width are within their thresholds
            if (newHeight < minHeight) {
                newHeight = minHeight;
            }
            if (maxHeight && newHeight > maxHeight) {
                newHeight = maxHeight;
            }
            if (newWidth < minWidth) {
                newWidth = minWidth;
            }
            if (maxWidth && newWidth > maxWidth) {
                newWidth = maxWidth;
            }
            // return the new dimensions unless a fixed height/width was defined
            return {
                height: this._fixedHeight || newHeight,
                width: this._fixedWidth || newWidth
            };
        };
        /**
         * Dispose function when element is destroyed
         */
        ResizerService.prototype.dispose = function () {
            $(window).off("resize.grid." + this._gridUid);
        };
        /**
         * Return the last resize dimensions used
         * @return last dimensions
         */
        ResizerService.prototype.getLastResizeDimensions = function () {
            return this._lastDimensions;
        };
        /**
         * For some reason this only seems to happen in Chrome and is sometime miscalculated by SlickGrid measureSrollbar() method
         * When that happens we will compensate and resize the Grid Viewport to avoid seeing horizontal scrollbar
         * Most of the time it happens, it's a tiny offset calculation of usually 3px (enough to show scrollbar)
         * GitHub issue reference: https://github.com/6pac/SlickGrid/issues/275
         */
        ResizerService.prototype.compensateHorizontalScroll = function (grid, gridOptions) {
            var gridElm = $("#" + gridOptions.gridId);
            var scrollbarDimensions = grid && grid.getScrollbarDimensions();
            var slickGridScrollbarWidth = scrollbarDimensions && scrollbarDimensions.width;
            var calculatedScrollbarWidth = utilities_1.getScrollBarWidth();
            // if scrollbar width is different from SlickGrid calculation to our custom calculation
            // then resize the grid with the missing pixels to remove scroll (usually only 3px)
            if (slickGridScrollbarWidth < calculatedScrollbarWidth && gridElm && gridElm.width) {
                var oldWidth = gridElm && gridElm.width && gridElm.width() || 0;
                gridElm.width(oldWidth + (calculatedScrollbarWidth - slickGridScrollbarWidth));
            }
        };
        /** Resize the datagrid to fit the browser height & width */
        ResizerService.prototype.resizeGrid = function (delay, newSizes) {
            var _this = this;
            if (delay === void 0) { delay = 10; }
            if (!this._grid || !this._gridOptions) {
                throw new Error("\n      Aurelia-Slickgrid resizer requires a valid Grid object and Grid Options defined.\n      You can fix this by setting your gridOption to use \"enableAutoResize\" or create an instance of the ResizerService by calling attachAutoResizeDataGrid()");
            }
            return new Promise(function (resolve) {
                // because of the javascript async nature, we might want to delay the resize a little bit
                delay = delay || 0;
                if (delay > 0) {
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        resolve(_this.resizeGridWithDimensions(newSizes));
                    }, delay);
                }
                else {
                    resolve(_this.resizeGridWithDimensions(newSizes));
                }
            });
        };
        ResizerService.prototype.resizeGridWithDimensions = function (newSizes) {
            // calculate the available sizes with minimum height defined as a constant
            var availableDimensions = this.calculateGridNewDimensions(this._gridOptions);
            var gridElm = $("#" + this._gridOptions.gridId);
            var gridContainerElm = $("#" + this._gridOptions.gridContainerId);
            if ((newSizes || availableDimensions) && gridElm.length > 0) {
                // get the new sizes, if new sizes are passed (not 0), we will use them else use available space
                // basically if user passes 1 of the dimension, let say he passes just the height,
                // we will use the height as a fixed height but the width will be resized by it's available space
                var newHeight = (newSizes && newSizes.height) ? newSizes.height : (availableDimensions && availableDimensions.height) || 0;
                var newWidth = (newSizes && newSizes.width) ? newSizes.width : (availableDimensions && availableDimensions.width) || 0;
                // apply these new height/width to the datagrid
                gridElm.height(newHeight);
                gridElm.width(newWidth);
                gridContainerElm.height(newHeight);
                gridContainerElm.width(newWidth);
                // resize the slickgrid canvas on all browser except some IE versions
                // exclude all IE below IE11
                // IE11 wants to be a better standard (W3C) follower (finally) they even changed their appName output to also have 'Netscape'
                if (new RegExp('MSIE [6-8]').exec(navigator.userAgent) === null && this._grid && this._grid.resizeCanvas) {
                    this._grid.resizeCanvas();
                }
                // also call the grid auto-size columns so that it takes available when going bigger
                if (this._gridOptions && this._gridOptions.enableAutoSizeColumns && typeof this._grid.autosizeColumns) {
                    // make sure that the grid still exist (by looking if the Grid UID is found in the DOM tree) to avoid SlickGrid error "missing stylesheet"
                    if (this._gridUid && $("." + this._gridUid).length > 0) {
                        this._grid.autosizeColumns();
                    }
                    // compensate anytime SlickGrid measureScrollbar is incorrect
                    this.compensateHorizontalScroll(this._grid, this._gridOptions);
                }
                // keep last resized dimensions & resolve them to the Promise
                this._lastDimensions = {
                    height: newHeight,
                    width: newWidth
                };
                if ((this._gridOptions.enablePagination || this._gridOptions.backendServiceApi)) {
                    this._lastDimensions.heightWithPagination = newHeight + DATAGRID_PAGINATION_HEIGHT;
                }
            }
            return this._lastDimensions;
        };
        ResizerService = __decorate([
            aurelia_framework_1.singleton(true),
            aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator)
        ], ResizerService);
        return ResizerService;
    }());
    exports.ResizerService = ResizerService;
});
//# sourceMappingURL=resizer.service.js.map