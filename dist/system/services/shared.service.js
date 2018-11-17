System.register(["aurelia-framework"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var aurelia_framework_1, SharedService;
    return {
        setters: [
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            }
        ],
        execute: function () {
            SharedService = /** @class */ (function () {
                function SharedService() {
                }
                Object.defineProperty(SharedService.prototype, "allColumns", {
                    // --
                    // public
                    /** Getter for All Columns  in the grid (hidden/visible) */
                    get: function () {
                        return this._allColumns;
                    },
                    /** Setter for All Columns  in the grid (hidden/visible) */
                    set: function (allColumns) {
                        this._allColumns = allColumns;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SharedService.prototype, "columnDefinitions", {
                    /** Getter for the Column Definitions pulled through the Grid Object */
                    get: function () {
                        return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SharedService.prototype, "dataView", {
                    /** Getter for SlickGrid DataView object */
                    get: function () {
                        return this._dataView;
                    },
                    /** Setter for SlickGrid DataView object */
                    set: function (dataView) {
                        this._dataView = dataView;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SharedService.prototype, "grid", {
                    /** Getter for SlickGrid Grid object */
                    get: function () {
                        return this._grid;
                    },
                    /** Setter for SlickGrid Grid object */
                    set: function (grid) {
                        this._grid = grid;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SharedService.prototype, "gridOptions", {
                    /** Getter for the Grid Options pulled through the Grid Object */
                    get: function () {
                        return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
                    },
                    /** Setter for the Grid Options pulled through the Grid Object */
                    set: function (gridOptions) {
                        this.gridOptions = gridOptions;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SharedService.prototype, "groupItemMetadataProvider", {
                    /** Getter for the Grid Options */
                    get: function () {
                        return this._groupItemMetadataProvider;
                    },
                    /** Setter for the Grid Options */
                    set: function (groupItemMetadataProvider) {
                        this._groupItemMetadataProvider = groupItemMetadataProvider;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(SharedService.prototype, "visibleColumns", {
                    /** Getter for the Visible Columns in the grid */
                    get: function () {
                        return this._visibleColumns;
                    },
                    /** Setter for the Visible Columns in the grid */
                    set: function (visibleColumns) {
                        this._visibleColumns = visibleColumns;
                    },
                    enumerable: true,
                    configurable: true
                });
                SharedService = __decorate([
                    aurelia_framework_1.singleton(true)
                ], SharedService);
                return SharedService;
            }());
            exports_1("SharedService", SharedService);
        }
    };
});
//# sourceMappingURL=shared.service.js.map