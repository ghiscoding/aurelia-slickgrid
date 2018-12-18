var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { singleton, inject } from 'aurelia-framework';
import { ExtensionName } from '../models/index';
import { ExtensionUtility } from './extensionUtility';
import { SharedService } from '../services/shared.service';
var RowMoveManagerExtension = /** @class */ (function () {
    function RowMoveManagerExtension(extensionUtility, sharedService) {
        this.extensionUtility = extensionUtility;
        this.sharedService = sharedService;
        this._eventHandler = new Slick.EventHandler();
    }
    RowMoveManagerExtension.prototype.dispose = function () {
        // unsubscribe all SlickGrid events
        this._eventHandler.unsubscribeAll();
        if (this._extension && this._extension.destroy) {
            this._extension.destroy();
        }
    };
    RowMoveManagerExtension.prototype.register = function (rowSelectionPlugin) {
        var _this = this;
        if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
            // dynamically import the SlickGrid plugin with requireJS
            this.extensionUtility.loadExtensionDynamically(ExtensionName.rowMoveManager);
            // this also requires the Row Selection Model to be registered as well
            if (!rowSelectionPlugin || !this.sharedService.grid.getSelectionModel()) {
                this.extensionUtility.loadExtensionDynamically(ExtensionName.rowSelection);
                rowSelectionPlugin = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || {});
                this.sharedService.grid.setSelectionModel(rowSelectionPlugin);
            }
            this._extension = new Slick.RowMoveManager(this.sharedService.gridOptions.rowMoveManager || { cancelEditOnDrag: true });
            this.sharedService.grid.registerPlugin(this._extension);
            // hook all events
            if (this.sharedService.grid && this.sharedService.gridOptions.rowMoveManager) {
                if (this.sharedService.gridOptions.rowMoveManager.onExtensionRegistered) {
                    this.sharedService.gridOptions.rowMoveManager.onExtensionRegistered(this._extension);
                }
                this._eventHandler.subscribe(this._extension.onBeforeMoveRows, function (e, args) {
                    if (_this.sharedService.gridOptions.rowMoveManager && typeof _this.sharedService.gridOptions.rowMoveManager.onBeforeMoveRows === 'function') {
                        _this.sharedService.gridOptions.rowMoveManager.onBeforeMoveRows(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onMoveRows, function (e, args) {
                    if (_this.sharedService.gridOptions.rowMoveManager && typeof _this.sharedService.gridOptions.rowMoveManager.onMoveRows === 'function') {
                        _this.sharedService.gridOptions.rowMoveManager.onMoveRows(e, args);
                    }
                });
            }
            return this._extension;
        }
        return null;
    };
    RowMoveManagerExtension = __decorate([
        singleton(true),
        inject(ExtensionUtility, SharedService)
    ], RowMoveManagerExtension);
    return RowMoveManagerExtension;
}());
export { RowMoveManagerExtension };
//# sourceMappingURL=rowMoveManagerExtension.js.map