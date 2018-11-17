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
     * Attach/Create different plugins before the Grid creation.
     * For example the multi-select have to be added to the column definition before the grid is created to work properly
     */
    create(columnDefinitions: Column[], gridOptions: GridOption): any;
    register(rowSelectionPlugin?: any): any;
}
