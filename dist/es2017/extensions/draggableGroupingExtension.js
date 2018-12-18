var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { singleton, inject } from 'aurelia-framework';
import { SharedService } from '../services/shared.service';
import { ExtensionName } from '../models/index';
import { ExtensionUtility } from './extensionUtility';
let DraggableGroupingExtension = class DraggableGroupingExtension {
    constructor(extensionUtility, sharedService) {
        this.extensionUtility = extensionUtility;
        this.sharedService = sharedService;
        this._eventHandler = new Slick.EventHandler();
    }
    dispose() {
        // unsubscribe all SlickGrid events
        this._eventHandler.unsubscribeAll();
        if (this._extension && this._extension.destroy) {
            this._extension.destroy();
        }
    }
    /**
     * Attach/Create different plugins before the Grid creation.
     * For example the multi-select have to be added to the column definition before the grid is created to work properly
     */
    create(gridOptions) {
        // dynamically import the SlickGrid plugin with requireJS
        this.extensionUtility.loadExtensionDynamically(ExtensionName.draggableGrouping);
        if (!this._extension && gridOptions) {
            this._extension = new Slick.DraggableGrouping(gridOptions.draggableGrouping || {});
        }
        return this._extension;
    }
    register() {
        if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
            this.sharedService.grid.registerPlugin(this._extension);
            // Events
            if (this.sharedService.grid && this.sharedService.gridOptions.draggableGrouping) {
                if (this.sharedService.gridOptions.draggableGrouping.onExtensionRegistered) {
                    this.sharedService.gridOptions.draggableGrouping.onExtensionRegistered(this._extension);
                }
                this._eventHandler.subscribe(this._extension.onGroupChanged, (e, args) => {
                    if (this.sharedService.gridOptions.draggableGrouping && typeof this.sharedService.gridOptions.draggableGrouping.onGroupChanged === 'function') {
                        this.sharedService.gridOptions.draggableGrouping.onGroupChanged(e, args);
                    }
                });
            }
            return this._extension;
        }
        return null;
    }
};
DraggableGroupingExtension = __decorate([
    singleton(true),
    inject(ExtensionUtility, SharedService)
], DraggableGroupingExtension);
export { DraggableGroupingExtension };
//# sourceMappingURL=draggableGroupingExtension.js.map