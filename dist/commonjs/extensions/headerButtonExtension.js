"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var index_1 = require("../models/index");
var extensionUtility_1 = require("./extensionUtility");
var shared_service_1 = require("../services/shared.service");
var HeaderButtonExtension = /** @class */ (function () {
    function HeaderButtonExtension(extensionUtility, sharedService) {
        this.extensionUtility = extensionUtility;
        this.sharedService = sharedService;
        this._eventHandler = new Slick.EventHandler();
    }
    HeaderButtonExtension.prototype.dispose = function () {
        // unsubscribe all SlickGrid events
        this._eventHandler.unsubscribeAll();
        if (this._extension && this._extension.destroy) {
            this._extension.destroy();
        }
    };
    // Header Button Plugin
    HeaderButtonExtension.prototype.register = function () {
        var _this = this;
        if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
            // dynamically import the SlickGrid plugin with requireJS
            this.extensionUtility.loadExtensionDynamically(index_1.ExtensionName.headerButton);
            this._extension = new Slick.Plugins.HeaderButtons(this.sharedService.gridOptions.headerButton || {});
            this.sharedService.grid.registerPlugin(this._extension);
            this._eventHandler.subscribe(this._extension.onCommand, function (e, args) {
                if (_this.sharedService.gridOptions.headerButton && typeof _this.sharedService.gridOptions.headerButton.onCommand === 'function') {
                    _this.sharedService.gridOptions.headerButton.onCommand(e, args);
                }
            });
            return this._extension;
        }
        return null;
    };
    HeaderButtonExtension = __decorate([
        aurelia_framework_1.singleton(true),
        aurelia_framework_1.inject(extensionUtility_1.ExtensionUtility, shared_service_1.SharedService)
    ], HeaderButtonExtension);
    return HeaderButtonExtension;
}());
exports.HeaderButtonExtension = HeaderButtonExtension;
//# sourceMappingURL=headerButtonExtension.js.map