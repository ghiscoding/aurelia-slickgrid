import { I18N } from 'aurelia-i18n';
import { Column, Extension, GridMenu, GridMenuItem, GridOption, HeaderMenuOnCommandArgs } from '../models/index';
import { ExportService } from '../services/export.service';
import { ExtensionUtility } from './extensionUtility';
import { FilterService } from '../services/filter.service';
import { SortService } from '../services/sort.service';
import { SharedService } from '../services/shared.service';
export declare class GridMenuExtension implements Extension {
    private exportService;
    private extensionUtility;
    private filterService;
    private i18n;
    private sharedService;
    private sortService;
    private _eventHandler;
    private _extension;
    areVisibleColumnDifferent: boolean;
    userOriginalGridMenu: GridMenu;
    constructor(exportService: ExportService, extensionUtility: ExtensionUtility, filterService: FilterService, i18n: I18N, sharedService: SharedService, sortService: SortService);
    dispose(): void;
    /** Create the Header Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...) */
    register(): any;
    /**
     * Execute the Grid Menu Custom command callback that was triggered by the onCommand subscribe
     * These are the default internal custom commands
     * @param event
     * @param GridMenuItem args
     */
    executeGridMenuInternalCustomCommands(e: Event, args: GridMenuItem): void;
    /** Refresh the dataset through the Backend Service */
    refreshBackendDataset(gridOptions?: GridOption): void;
    /** Create Grid Menu with Custom Commands if user has enabled Filters and/or uses a Backend Service (OData, GraphQL) */
    private addGridMenuCustomCommands();
    /** Execute the Header Menu Commands that was triggered by the onCommand subscribe */
    executeHeaderMenuInternalCommands(e: Event, args: HeaderMenuOnCommandArgs): void;
    /** Hide a column from the grid */
    hideColumn(column: Column): void;
    /** Translate the Grid Menu titles and column picker */
    translateGridMenu(): void;
    private emptyGridMenuTitles();
    /**
     * @return default Grid Menu options
     */
    private getDefaultGridMenuOptions();
}
