var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { singleton, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Constants } from '../constants';
import { ExtensionName, } from '../models/index';
import { SortService } from '../services/sort.service';
import { SharedService } from '../services/shared.service';
import { ExtensionUtility } from './extensionUtility';
let HeaderMenuExtension = class HeaderMenuExtension {
    constructor(extensionUtility, i18n, sharedService, sortService) {
        this.extensionUtility = extensionUtility;
        this.i18n = i18n;
        this.sharedService = sharedService;
        this.sortService = sortService;
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
     * Create the Header Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...)
     * @param grid
     * @param dataView
     * @param columnDefinitions
     */
    register() {
        if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
            // dynamically import the SlickGrid plugin with requireJS
            this.extensionUtility.loadExtensionDynamically(ExtensionName.headerMenu);
            this.sharedService.gridOptions.headerMenu = Object.assign({}, this.getDefaultHeaderMenuOptions(), this.sharedService.gridOptions.headerMenu);
            if (this.sharedService.gridOptions.enableHeaderMenu) {
                this.sharedService.gridOptions.headerMenu = this.addHeaderMenuCustomCommands(this.sharedService.gridOptions, this.sharedService.columnDefinitions);
            }
            this._extension = new Slick.Plugins.HeaderMenu(this.sharedService.gridOptions.headerMenu);
            this.sharedService.grid.registerPlugin(this._extension);
            // hook all events
            if (this.sharedService.grid && this.sharedService.gridOptions.headerMenu) {
                if (this.sharedService.gridOptions.headerMenu.onExtensionRegistered) {
                    this.sharedService.gridOptions.headerMenu.onExtensionRegistered(this._extension);
                }
                this._eventHandler.subscribe(this._extension.onCommand, (e, args) => {
                    this.executeHeaderMenuInternalCommands(e, args);
                    if (this.sharedService.gridOptions.headerMenu && typeof this.sharedService.gridOptions.headerMenu.onCommand === 'function') {
                        this.sharedService.gridOptions.headerMenu.onCommand(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onBeforeMenuShow, (e, args) => {
                    if (this.sharedService.gridOptions.headerMenu && typeof this.sharedService.gridOptions.headerMenu.onBeforeMenuShow === 'function') {
                        this.sharedService.gridOptions.headerMenu.onBeforeMenuShow(e, args);
                    }
                });
            }
            return this._extension;
        }
        return null;
    }
    /**
     * Create Header Menu with Custom Commands if user has enabled Header Menu
     * @param options
     * @param columnDefinitions
     * @return header menu
     */
    addHeaderMenuCustomCommands(options, columnDefinitions) {
        const headerMenuOptions = options.headerMenu || {};
        if (columnDefinitions && Array.isArray(columnDefinitions) && options.enableHeaderMenu) {
            columnDefinitions.forEach((columnDef) => {
                if (columnDef && !columnDef.excludeFromHeaderMenu) {
                    if (!columnDef.header || !columnDef.header.menu) {
                        columnDef.header = {
                            menu: {
                                items: []
                            }
                        };
                    }
                    const columnHeaderMenuItems = columnDef && columnDef.header && columnDef.header.menu && columnDef.header.menu.items || [];
                    // Sorting Commands
                    if (options.enableSorting && columnDef.sortable && headerMenuOptions && !headerMenuOptions.hideSortCommands) {
                        if (columnHeaderMenuItems.filter((item) => item.command === 'sort-asc').length === 0) {
                            columnHeaderMenuItems.push({
                                iconCssClass: headerMenuOptions.iconSortAscCommand || 'fa fa-sort-asc',
                                title: options.enableTranslate ? this.i18n.tr('SORT_ASCENDING') : Constants.TEXT_SORT_ASCENDING,
                                command: 'sort-asc',
                                positionOrder: 50
                            });
                        }
                        if (columnHeaderMenuItems.filter((item) => item.command === 'sort-desc').length === 0) {
                            columnHeaderMenuItems.push({
                                iconCssClass: headerMenuOptions.iconSortDescCommand || 'fa fa-sort-desc',
                                title: options.enableTranslate ? this.i18n.tr('SORT_DESCENDING') : Constants.TEXT_SORT_DESCENDING,
                                command: 'sort-desc',
                                positionOrder: 51
                            });
                        }
                    }
                    // Hide Column Command
                    if (headerMenuOptions && !headerMenuOptions.hideColumnHideCommand && columnHeaderMenuItems.filter((item) => item.command === 'hide').length === 0) {
                        columnHeaderMenuItems.push({
                            iconCssClass: headerMenuOptions.iconColumnHideCommand || 'fa fa-times',
                            title: options.enableTranslate ? this.i18n.tr('HIDE_COLUMN') : Constants.TEXT_HIDE_COLUMN,
                            command: 'hide',
                            positionOrder: 52
                        });
                    }
                    this.extensionUtility.translateItems(columnHeaderMenuItems, 'titleKey', 'title');
                    // sort the custom items by their position in the list
                    columnHeaderMenuItems.sort((itemA, itemB) => {
                        if (itemA && itemB && itemA.hasOwnProperty('positionOrder') && itemB.hasOwnProperty('positionOrder')) {
                            return itemA.positionOrder - itemB.positionOrder;
                        }
                        return 0;
                    });
                }
            });
        }
        return headerMenuOptions;
    }
    /** Execute the Header Menu Commands that was triggered by the onCommand subscribe */
    executeHeaderMenuInternalCommands(e, args) {
        if (args && args.command) {
            switch (args.command) {
                case 'hide':
                    this.hideColumn(args.column);
                    if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableAutoSizeColumns) {
                        this.sharedService.grid.autosizeColumns();
                    }
                    break;
                case 'sort-asc':
                case 'sort-desc':
                    // get previously sorted columns
                    const cols = this.sortService.getPreviousColumnSorts(args.column.id + '');
                    // add to the column array, the column sorted by the header menu
                    cols.push({ sortCol: args.column, sortAsc: (args.command === 'sort-asc') });
                    if (this.sharedService.gridOptions.backendServiceApi) {
                        this.sortService.onBackendSortChanged(e, { multiColumnSort: true, sortCols: cols, grid: this.sharedService.grid });
                    }
                    else if (this.sharedService.dataView) {
                        this.sortService.onLocalSortChanged(this.sharedService.grid, this.sharedService.dataView, cols);
                    }
                    else {
                        // when using customDataView, we will simply send it as a onSort event with notify
                        const isMultiSort = this.sharedService && this.sharedService.gridOptions && this.sharedService.gridOptions.multiColumnSort || false;
                        const sortOutput = isMultiSort ? cols : cols[0];
                        args.grid.onSort.notify(sortOutput);
                    }
                    // update the this.sharedService.gridObj sortColumns array which will at the same add the visual sort icon(s) on the UI
                    const newSortColumns = cols.map((col) => {
                        return {
                            columnId: col && col.sortCol && col.sortCol.id,
                            sortAsc: col && col.sortAsc
                        };
                    });
                    this.sharedService.grid.setSortColumns(newSortColumns); // add sort icon in UI
                    break;
                default:
                    break;
            }
        }
    }
    /** Hide a column from the grid */
    hideColumn(column) {
        if (this.sharedService.grid && this.sharedService.grid.getColumns && this.sharedService.grid.setColumns) {
            const columnIndex = this.sharedService.grid.getColumnIndex(column.id);
            this.sharedService.visibleColumns = this.extensionUtility.arrayRemoveItemByIndex(this.sharedService.grid.getColumns(), columnIndex);
            this.sharedService.grid.setColumns(this.sharedService.visibleColumns);
        }
    }
    /**
     * Reset all the Grid Menu options which have text to translate
     * @param grid menu object
     */
    resetHeaderMenuTranslations(columnDefinitions) {
        columnDefinitions.forEach((columnDef) => {
            if (columnDef && columnDef.header && columnDef.header && columnDef.header.menu && columnDef.header.menu.items) {
                if (!columnDef.excludeFromHeaderMenu) {
                    const columnHeaderMenuItems = columnDef.header.menu.items || [];
                    columnHeaderMenuItems.forEach((item) => {
                        switch (item.command) {
                            case 'sort-asc':
                                item.title = this.i18n.tr('SORT_ASCENDING') || Constants.TEXT_SORT_ASCENDING;
                                break;
                            case 'sort-desc':
                                item.title = this.i18n.tr('SORT_DESCENDING') || Constants.TEXT_SORT_DESCENDING;
                                break;
                            case 'hide':
                                item.title = this.i18n.tr('HIDE_COLUMN') || Constants.TEXT_HIDE_COLUMN;
                                break;
                        }
                        // re-translate if there's a "titleKey"
                        if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableTranslate) {
                            this.extensionUtility.translateItems(columnHeaderMenuItems, 'titleKey', 'title');
                        }
                    });
                }
            }
        });
    }
    /**
     * Translate the Header Menu titles, we need to loop through all column definition to re-translate them
     */
    translateHeaderMenu() {
        if (this.sharedService.gridOptions && this.sharedService.gridOptions.headerMenu) {
            this.resetHeaderMenuTranslations(this.sharedService.visibleColumns);
        }
    }
    /**
     * @return default Header Menu options
     */
    getDefaultHeaderMenuOptions() {
        return {
            autoAlignOffset: 12,
            minWidth: 140,
            hideColumnHideCommand: false,
            hideSortCommands: false,
            title: ''
        };
    }
};
HeaderMenuExtension = __decorate([
    singleton(true),
    inject(ExtensionUtility, I18N, SharedService, SortService)
], HeaderMenuExtension);
export { HeaderMenuExtension };
//# sourceMappingURL=headerMenuExtension.js.map