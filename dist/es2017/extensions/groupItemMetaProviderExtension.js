var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { singleton, inject } from 'aurelia-framework';
import { SharedService } from '../services/shared.service';
let GroupItemMetaProviderExtension = class GroupItemMetaProviderExtension {
    constructor(sharedService) {
        this.sharedService = sharedService;
    }
    dispose() {
        if (this._extension && this._extension.destroy) {
            this._extension.destroy();
        }
    }
    /** register the group item metadata provider to add expand/collapse group handlers */
    register() {
        if (this.sharedService && this.sharedService.grid) {
            this._extension = this.sharedService.groupItemMetadataProvider || {};
            this.sharedService.grid.registerPlugin(this._extension);
            return this._extension;
        }
        return null;
    }
};
GroupItemMetaProviderExtension = __decorate([
    singleton(true),
    inject(SharedService)
], GroupItemMetaProviderExtension);
export { GroupItemMetaProviderExtension };
//# sourceMappingURL=groupItemMetaProviderExtension.js.map