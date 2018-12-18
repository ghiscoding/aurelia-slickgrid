System.register(["aurelia-framework", "./../models/index", "./extensionUtility", "../services/shared.service"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var aurelia_framework_1, index_1, extensionUtility_1, shared_service_1, RowSelectionExtension;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (extensionUtility_1_1) {
                extensionUtility_1 = extensionUtility_1_1;
            },
            function (shared_service_1_1) {
                shared_service_1 = shared_service_1_1;
            }
        ],
        execute: function () {
            RowSelectionExtension = /** @class */ (function () {
                function RowSelectionExtension(extensionUtility, sharedService) {
                    this.extensionUtility = extensionUtility;
                    this.sharedService = sharedService;
                }
                RowSelectionExtension.prototype.dispose = function () {
                    if (this._extension && this._extension.destroy) {
                        this._extension.destroy();
                    }
                };
                RowSelectionExtension.prototype.register = function () {
                    if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
                        // dynamically import the SlickGrid plugin with requireJS
                        this.extensionUtility.loadExtensionDynamically(index_1.ExtensionName.rowSelection);
                        this._extension = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || {});
                        this.sharedService.grid.setSelectionModel(this._extension);
                        return this._extension;
                    }
                    return null;
                };
                RowSelectionExtension = __decorate([
                    aurelia_framework_1.singleton(true),
                    aurelia_framework_1.inject(extensionUtility_1.ExtensionUtility, shared_service_1.SharedService)
                ], RowSelectionExtension);
                return RowSelectionExtension;
            }());
            exports_1("RowSelectionExtension", RowSelectionExtension);
        }
    };
});
//# sourceMappingURL=rowSelectionExtension.js.map