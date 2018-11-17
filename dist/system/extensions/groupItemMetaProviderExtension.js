System.register(["aurelia-framework", "../services/shared.service"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var aurelia_framework_1, shared_service_1, GroupItemMetaProviderExtension;
    return {
        setters: [
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (shared_service_1_1) {
                shared_service_1 = shared_service_1_1;
            }
        ],
        execute: function () {
            GroupItemMetaProviderExtension = /** @class */ (function () {
                function GroupItemMetaProviderExtension(sharedService) {
                    this.sharedService = sharedService;
                }
                GroupItemMetaProviderExtension.prototype.dispose = function () {
                    if (this._extension && this._extension.destroy) {
                        this._extension.destroy();
                    }
                };
                /** register the group item metadata provider to add expand/collapse group handlers */
                GroupItemMetaProviderExtension.prototype.register = function () {
                    if (this.sharedService && this.sharedService.grid) {
                        this._extension = this.sharedService.groupItemMetadataProvider || {};
                        this.sharedService.grid.registerPlugin(this._extension);
                        return this._extension;
                    }
                    return null;
                };
                GroupItemMetaProviderExtension = __decorate([
                    aurelia_framework_1.singleton(true),
                    aurelia_framework_1.inject(shared_service_1.SharedService)
                ], GroupItemMetaProviderExtension);
                return GroupItemMetaProviderExtension;
            }());
            exports_1("GroupItemMetaProviderExtension", GroupItemMetaProviderExtension);
        }
    };
});
//# sourceMappingURL=groupItemMetaProviderExtension.js.map