import { I18N } from 'aurelia-i18n';
import { SharedService } from '../services/shared.service';
import { ExtensionName } from '../models/index';
export declare class ExtensionUtility {
    private i18n;
    private sharedService;
    constructor(i18n: I18N, sharedService: SharedService);
    /**
     * Remove a column from the grid by it's index in the grid
     * @param array input
     * @param index
     */
    arrayRemoveItemByIndex(array: any[], index: number): any[];
    /**
     * Load SlickGrid Extension (Control/Plugin) dynamically (on demand)
     * This will basically only load the extension when user enables the feature
     * @param extensionName
     */
    loadExtensionDynamically(extensionName: ExtensionName): any;
    /**
     * From a Grid Menu object property name, we will return the correct title output string following this order
     * 1- if user provided a title, use it as the output title
     * 2- else if user provided a title key, use it to translate the output title
     * 3- else if nothing is provided use
     */
    getPickerTitleOutputString(propName: string, pickerName: 'gridMenu' | 'columnPicker'): string;
    /**
     * Sort items in an array by a property name
     * @params items array
     * @param property name to sort with
     * @return sorted array
     */
    sortItems(items: any[], propertyName: string): void;
    /** Translate the an array of items from an input key and assign to the output key */
    translateItems(items: any[], inputKey: string, outputKey: string): void;
}
