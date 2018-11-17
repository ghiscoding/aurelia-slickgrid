"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var shared_service_1 = require("../services/shared.service");
var GroupItemMetaProviderExtension = /** @class */ (function () {
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
exports.GroupItemMetaProviderExtension = GroupItemMetaProviderExtension;
//# sourceMappingURL=groupItemMetaProviderExtension.js.map