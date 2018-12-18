var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { singleton, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Constants } from '../constants';
import { SharedService } from '../services/shared.service';
import { ExtensionName } from '../models/index';
var ExtensionUtility = /** @class */ (function () {
    function ExtensionUtility(i18n, sharedService) {
        this.i18n = i18n;
        this.sharedService = sharedService;
    }
    /**
     * Remove a column from the grid by it's index in the grid
     * @param array input
     * @param index
     */
    ExtensionUtility.prototype.arrayRemoveItemByIndex = function (array, index) {
        return array.filter(function (el, i) {
            return index !== i;
        });
    };
    /**
     * Load SlickGrid Extension (Control/Plugin) dynamically (on demand)
     * This will basically only load the extension when user enables the feature
     * @param extensionName
     */
    ExtensionUtility.prototype.loadExtensionDynamically = function (extensionName) {
        try {
            switch (extensionName) {
                case ExtensionName.autoTooltip:
                    require('slickgrid/plugins/slick.autotooltips');
                    break;
                case ExtensionName.cellExternalCopyManager:
                    require('slickgrid/plugins/slick.cellexternalcopymanager');
                    break;
                case ExtensionName.checkboxSelector:
                    require('slickgrid/plugins/slick.checkboxselectcolumn');
                    break;
                case ExtensionName.columnPicker:
                    require('slickgrid/controls/slick.columnpicker');
                    break;
                case ExtensionName.draggableGrouping:
                    require('slickgrid/plugins/slick.draggablegrouping.js');
                    break;
                case ExtensionName.gridMenu:
                    require('slickgrid/controls/slick.gridmenu');
                    break;
                case ExtensionName.groupItemMetaProvider:
                    require('slickgrid/slick.groupitemmetadataprovider');
                    break;
                case ExtensionName.headerButton:
                    require('slickgrid/plugins/slick.headerbuttons');
                    break;
                case ExtensionName.headerMenu:
                    require('slickgrid/plugins/slick.headermenu');
                    break;
                case ExtensionName.rowSelection:
                    require('slickgrid/plugins/slick.rowselectionmodel');
                    break;
                case ExtensionName.rowDetailView:
                    require('slickgrid/plugins/slick.rowdetailview.js');
                    break;
                case ExtensionName.rowMoveManager:
                    require('slickgrid/plugins/slick.rowmovemanager.js');
                    break;
            }
        }
        catch (e) {
            // do nothing, we fall here when using Aurelia-CLI and RequireJS
            // if you do use RequireJS then you need to make sure to include all necessary extensions in your `aurelia.json`
        }
    };
    /**
     * From a Grid Menu object property name, we will return the correct title output string following this order
     * 1- if user provided a title, use it as the output title
     * 2- else if user provided a title key, use it to translate the output title
     * 3- else if nothing is provided use
     */
    ExtensionUtility.prototype.getPickerTitleOutputString = function (propName, pickerName) {
        var output = '';
        var picker = this.sharedService.gridOptions && this.sharedService.gridOptions[pickerName] || {};
        var enableTranslate = this.sharedService.gridOptions && this.sharedService.gridOptions.enableTranslate || false;
        var title = picker && picker[propName];
        var titleKey = picker && picker[propName + "Key"];
        if (titleKey) {
            output = this.i18n.tr(titleKey || ' ');
        }
        else {
            switch (propName) {
                case 'customTitle':
                    output = title || (enableTranslate ? this.i18n.tr('COMMANDS') : Constants.TEXT_COMMANDS);
                    break;
                case 'columnTitle':
                    output = title || (enableTranslate ? this.i18n.tr('COLUMNS') : Constants.TEXT_COLUMNS);
                    break;
                case 'forceFitTitle':
                    output = title || (enableTranslate ? this.i18n.tr('FORCE_FIT_COLUMNS') : Constants.TEXT_FORCE_FIT_COLUMNS);
                    break;
                case 'syncResizeTitle':
                    output = title || (enableTranslate ? this.i18n.tr('SYNCHRONOUS_RESIZE') : Constants.TEXT_SYNCHRONOUS_RESIZE);
                    break;
                default:
                    output = title;
                    break;
            }
        }
        return output;
    };
    /**
     * Sort items in an array by a property name
     * @params items array
     * @param property name to sort with
     * @return sorted array
     */
    ExtensionUtility.prototype.sortItems = function (items, propertyName) {
        // sort the custom items by their position in the list
        items.sort(function (itemA, itemB) {
            if (itemA && itemB && itemA.hasOwnProperty(propertyName) && itemB.hasOwnProperty(propertyName)) {
                return itemA[propertyName] - itemB[propertyName];
            }
            return 0;
        });
    };
    /** Translate the an array of items from an input key and assign to the output key */
    ExtensionUtility.prototype.translateItems = function (items, inputKey, outputKey) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (item[inputKey]) {
                item[outputKey] = this.i18n.tr(item[inputKey]);
            }
        }
    };
    ExtensionUtility = __decorate([
        singleton(true),
        inject(I18N, SharedService)
    ], ExtensionUtility);
    return ExtensionUtility;
}());
export { ExtensionUtility };
//# sourceMappingURL=extensionUtility.js.map