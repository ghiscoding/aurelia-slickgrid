var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "../models/index", "../services/shared.service", "./extensionUtility"], function (require, exports, aurelia_framework_1, index_1, shared_service_1, extensionUtility_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CheckboxSelectorExtension = /** @class */ (function () {
        function CheckboxSelectorExtension(extensionUtility, sharedService) {
            this.extensionUtility = extensionUtility;
            this.sharedService = sharedService;
        }
        CheckboxSelectorExtension.prototype.dispose = function () {
            if (this._extension && this._extension.destroy) {
                this._extension.destroy();
            }
        };
        /**
         * Create the plugin before the Grid creation, else it will behave oddly.
         * Mostly because the column definitions might change after the grid creation
         */
        CheckboxSelectorExtension.prototype.create = function (columnDefinitions, gridOptions) {
            if (columnDefinitions && gridOptions) {
                // dynamically import the SlickGrid plugin with requireJS
                this.extensionUtility.loadExtensionDynamically(index_1.ExtensionName.checkboxSelector);
                if (!this._extension) {
                    this._extension = new Slick.CheckboxSelectColumn(gridOptions.checkboxSelector || {});
                }
                var selectionColumn = this._extension.getColumnDefinition();
                selectionColumn.excludeFromExport = true;
                selectionColumn.excludeFromQuery = true;
                selectionColumn.excludeFromHeaderMenu = true;
                columnDefinitions.unshift(selectionColumn);
                return this._extension;
            }
            return null;
        };
        CheckboxSelectorExtension.prototype.register = function (rowSelectionPlugin) {
            var _this = this;
            if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
                // the plugin has to be created BEFORE the grid (else it behaves oddly), but we can only watch grid events AFTER the grid is created
                this.sharedService.grid.registerPlugin(this._extension);
                // this also requires the Row Selection Model to be registered as well
                if (!rowSelectionPlugin || !this.sharedService.grid.getSelectionModel()) {
                    this.extensionUtility.loadExtensionDynamically(index_1.ExtensionName.rowSelection);
                    rowSelectionPlugin = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || {});
                    this.sharedService.grid.setSelectionModel(rowSelectionPlugin);
                }
                // user might want to pre-select some rows
                // the setTimeout is because of timing issue with styling (row selection happen but rows aren't highlighted properly)
                if (this.sharedService.gridOptions.preselectedRows && rowSelectionPlugin && this.sharedService.grid.getSelectionModel()) {
                    setTimeout(function () { return _this._extension.selectRows(_this.sharedService.gridOptions.preselectedRows); }, 0);
                }
                return rowSelectionPlugin;
            }
            return null;
        };
        CheckboxSelectorExtension = __decorate([
            aurelia_framework_1.singleton(true),
            aurelia_framework_1.inject(extensionUtility_1.ExtensionUtility, shared_service_1.SharedService)
        ], CheckboxSelectorExtension);
        return CheckboxSelectorExtension;
    }());
    exports.CheckboxSelectorExtension = CheckboxSelectorExtension;
});
//# sourceMappingURL=checkboxSelectorExtension.js.map