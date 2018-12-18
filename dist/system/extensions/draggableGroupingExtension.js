System.register(["aurelia-framework", "../services/shared.service", "../models/index", "./extensionUtility"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var aurelia_framework_1, shared_service_1, index_1, extensionUtility_1, DraggableGroupingExtension;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (shared_service_1_1) {
                shared_service_1 = shared_service_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (extensionUtility_1_1) {
                extensionUtility_1 = extensionUtility_1_1;
            }
        ],
        execute: function () {
            DraggableGroupingExtension = /** @class */ (function () {
                function DraggableGroupingExtension(extensionUtility, sharedService) {
                    this.extensionUtility = extensionUtility;
                    this.sharedService = sharedService;
                    this._eventHandler = new Slick.EventHandler();
                }
                DraggableGroupingExtension.prototype.dispose = function () {
                    // unsubscribe all SlickGrid events
                    this._eventHandler.unsubscribeAll();
                    if (this._extension && this._extension.destroy) {
                        this._extension.destroy();
                    }
                };
                /**
                 * Attach/Create different plugins before the Grid creation.
                 * For example the multi-select have to be added to the column definition before the grid is created to work properly
                 */
                DraggableGroupingExtension.prototype.create = function (gridOptions) {
                    // dynamically import the SlickGrid plugin with requireJS
                    this.extensionUtility.loadExtensionDynamically(index_1.ExtensionName.draggableGrouping);
                    if (!this._extension && gridOptions) {
                        this._extension = new Slick.DraggableGrouping(gridOptions.draggableGrouping || {});
                    }
                    return this._extension;
                };
                DraggableGroupingExtension.prototype.register = function () {
                    var _this = this;
                    if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
                        this.sharedService.grid.registerPlugin(this._extension);
                        // Events
                        if (this.sharedService.grid && this.sharedService.gridOptions.draggableGrouping) {
                            if (this.sharedService.gridOptions.draggableGrouping.onExtensionRegistered) {
                                this.sharedService.gridOptions.draggableGrouping.onExtensionRegistered(this._extension);
                            }
                            this._eventHandler.subscribe(this._extension.onGroupChanged, function (e, args) {
                                if (_this.sharedService.gridOptions.draggableGrouping && typeof _this.sharedService.gridOptions.draggableGrouping.onGroupChanged === 'function') {
                                    _this.sharedService.gridOptions.draggableGrouping.onGroupChanged(e, args);
                                }
                            });
                        }
                        return this._extension;
                    }
                    return null;
                };
                DraggableGroupingExtension = __decorate([
                    aurelia_framework_1.singleton(true),
                    aurelia_framework_1.inject(extensionUtility_1.ExtensionUtility, shared_service_1.SharedService)
                ], DraggableGroupingExtension);
                return DraggableGroupingExtension;
            }());
            exports_1("DraggableGroupingExtension", DraggableGroupingExtension);
        }
    };
});
//# sourceMappingURL=draggableGroupingExtension.js.map