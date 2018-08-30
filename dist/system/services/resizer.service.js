System.register(["aurelia-framework", "jquery", "aurelia-event-aggregator"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var aurelia_framework_1, $, aurelia_event_aggregator_1, DATAGRID_MIN_HEIGHT, DATAGRID_MIN_WIDTH, DATAGRID_BOTTOM_PADDING, DATAGRID_PAGINATION_HEIGHT, timer, ResizerService;
    return {
        setters: [
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function ($_1) {
                $ = $_1;
            },
            function (aurelia_event_aggregator_1_1) {
                aurelia_event_aggregator_1 = aurelia_event_aggregator_1_1;
            }
        ],
        execute: function () {
            // global constants, height/width are in pixels
            DATAGRID_MIN_HEIGHT = 180;
            DATAGRID_MIN_WIDTH = 300;
            DATAGRID_BOTTOM_PADDING = 20;
            DATAGRID_PAGINATION_HEIGHT = 35;
            ResizerService = /** @class */ (function () {
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
                ResizerService.prototype.init = function (grid) {
                    this._grid = grid;
                    this.aureliaEventPrefix = (this._gridOptions && this._gridOptions.defaultAureliaEventPrefix) ? this._gridOptions.defaultAureliaEventPrefix : 'asg';
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
                    this.resizeGrid(0, newSizes);
                    // -- 2nd attach a trigger on the Window DOM element, so that it happens also when resizing after first load
                    // -- attach auto-resize to Window object only if it exist
                    $(window).on("resize.grid." + this._gridUid, function () {
                        _this.ea.publish(_this.aureliaEventPrefix + ":onBeforeResize", true);
                        // for some yet unknown reason, calling the resize twice removes any stuttering/flickering when changing the height and makes it much smoother
                        _this.resizeGrid(0, newSizes);
                        _this.resizeGrid(0, newSizes);
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
                    if (bottomPadding && (gridOptions.enablePagination || this._gridOptions.backendServiceApi)) {
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
                 * Dispose function when element is destroyed
                 */
                ResizerService.prototype.dispose = function () {
                    $(window).off("resize.grid." + this._gridUid);
                };
                ResizerService.prototype.getLastResizeDimensions = function () {
                    return this._lastDimensions;
                };
                /** Resize the datagrid to fit the browser height & width */
                ResizerService.prototype.resizeGrid = function (delay, newSizes) {
                    var _this = this;
                    if (!this._grid || !this._gridOptions) {
                        throw new Error("\n      Aurelia-Slickgrid resizer requires a valid Grid object and Grid Options defined.\n      You can fix this by setting your gridOption to use \"enableAutoResize\" or create an instance of the ResizerService by calling attachAutoResizeDataGrid()");
                    }
                    return new Promise(function (resolve) {
                        // because of the javascript async nature, we might want to delay the resize a little bit
                        delay = delay || 0;
                        clearTimeout(timer);
                        timer = setTimeout(function () {
                            // calculate the available sizes with minimum height defined as a constant
                            var availableDimensions = _this.calculateGridNewDimensions(_this._gridOptions);
                            var gridElm = $("#" + _this._gridOptions.gridId);
                            var gridContainerElm = $("#" + _this._gridOptions.gridContainerId);
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
                                if (new RegExp('MSIE [6-8]').exec(navigator.userAgent) === null && _this._grid) {
                                    _this._grid.resizeCanvas();
                                }
                                // also call the grid auto-size columns so that it takes available when going bigger
                                if (_this._grid && _this._gridOptions && _this._gridOptions.enableAutoSizeColumns && typeof _this._grid.autosizeColumns === 'function') {
                                    _this._grid.autosizeColumns();
                                }
                                // keep last resized dimensions & resolve them to the Promise
                                _this._lastDimensions = {
                                    height: newHeight,
                                    width: newWidth
                                };
                                if ((_this._gridOptions.enablePagination || _this._gridOptions.backendServiceApi)) {
                                    _this._lastDimensions.heightWithPagination = newHeight + DATAGRID_PAGINATION_HEIGHT;
                                }
                                resolve(_this._lastDimensions);
                            }
                        }, delay);
                    });
                };
                ResizerService = __decorate([
                    aurelia_framework_1.singleton(true),
                    aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator)
                ], ResizerService);
                return ResizerService;
            }());
            exports_1("ResizerService", ResizerService);
        }
    };
});
//# sourceMappingURL=resizer.service.js.map