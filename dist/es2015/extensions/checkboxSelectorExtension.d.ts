import { Column, Extension, GridOption } from '../models/index';
import { SharedService } from '../services/shared.service';
import { ExtensionUtility } from './extensionUtility';
export declare class CheckboxSelectorExtension implements Extension {
    private extensionUtility;
    private sharedService;
    private _extension;
    constructor(extensionUtility: ExtensionUtility, sharedService: SharedService);
    dispose(): void;
    /**
     * Create the plugin before the Grid creation, else it will behave oddly.
     * Mostly because the column definitions might change after the grid creation
     */
    create(columnDefinitions: Column[], gridOptions: GridOption): any;
    register(rowSelectionPlugin?: any): any;
}
