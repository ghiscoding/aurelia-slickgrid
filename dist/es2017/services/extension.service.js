var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
// import common 3rd party SlickGrid plugins/libs
import 'slickgrid/plugins/slick.cellrangedecorator';
import 'slickgrid/plugins/slick.cellrangeselector';
import 'slickgrid/plugins/slick.cellselectionmodel';
import { singleton, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { ExtensionName, } from '../models/index';
import { AutoTooltipExtension, CellExternalCopyManagerExtension, CheckboxSelectorExtension, ColumnPickerExtension, GridMenuExtension, GroupItemMetaProviderExtension, HeaderButtonExtension, HeaderMenuExtension, RowMoveManagerExtension, RowSelectionExtension, } from '../extensions/index';
import { SharedService } from './shared.service';
let ExtensionService = class ExtensionService {
    constructor(autoTooltipExtension, cellExternalCopyExtension, checkboxSelectorExtension, columnPickerExtension, gridMenuExtension, groupItemMetaExtension, i18n, headerButtonExtension, headerMenuExtension, rowMoveManagerExtension, rowSelectionExtension, sharedService) {
        this.autoTooltipExtension = autoTooltipExtension;
        this.cellExternalCopyExtension = cellExternalCopyExtension;
        this.checkboxSelectorExtension = checkboxSelectorExtension;
        this.columnPickerExtension = columnPickerExtension;
        this.gridMenuExtension = gridMenuExtension;
        this.groupItemMetaExtension = groupItemMetaExtension;
        this.i18n = i18n;
        this.headerButtonExtension = headerButtonExtension;
        this.headerMenuExtension = headerMenuExtension;
        this.rowMoveManagerExtension = rowMoveManagerExtension;
        this.rowSelectionExtension = rowSelectionExtension;
        this.sharedService = sharedService;
        this.extensionList = [];
    }
    /** Dispose of all the controls & plugins */
    dispose() {
        this.sharedService.grid = null;
        this.sharedService.visibleColumns = [];
        // dispose of each control/plugin & reset the list
        this.extensionList.forEach((item) => {
            if (item && item.class && item.class.dispose) {
                item.class.dispose();
            }
        });
        this.extensionList = [];
    }
    /** Get all columns (includes visible and non-visible) */
    getAllColumns() {
        return this.sharedService.allColumns || [];
    }
    /** Get only visible columns */
    getVisibleColumns() {
        return this.sharedService.visibleColumns || [];
    }
    /** Get all Extensions */
    getAllExtensions() {
        return this.extensionList;
    }
    /**
     * Get an Extension by it's name
     *  @param name
     */
    getExtensionByName(name) {
        return this.extensionList.find((p) => p.name === name);
    }
    /** Auto-resize all the column in the grid to fit the grid width */
    autoResizeColumns() {
        this.sharedService.grid.autosizeColumns();
    }
    /** Attach/Create different Controls or Plugins after the Grid is created */
    attachDifferentExtensions() {
        // make sure all columns are translated before creating ColumnPicker/GridMenu Controls
        // this is to avoid having hidden columns not being translated on first load
        if (this.sharedService.gridOptions.enableTranslate) {
            this.translateItems(this.sharedService.allColumns, 'headerKey', 'name');
        }
        // Auto Tooltip Plugin
        if (this.sharedService.gridOptions.enableAutoTooltip) {
            if (this.autoTooltipExtension && this.autoTooltipExtension.register) {
                this.extensionList.push({ name: ExtensionName.autoTooltip, class: this.autoTooltipExtension, extension: this.autoTooltipExtension.register() });
            }
        }
        // Cell External Copy Manager Plugin (Excel Like)
        if (this.sharedService.gridOptions.enableExcelCopyBuffer) {
            if (this.cellExternalCopyExtension && this.cellExternalCopyExtension.register) {
                this.extensionList.push({ name: ExtensionName.cellExternalCopyManager, class: this.cellExternalCopyExtension, extension: this.cellExternalCopyExtension.register() });
            }
        }
        // Checkbox Selector Plugin
        if (this.sharedService.gridOptions.enableCheckboxSelector) {
            if (this.checkboxSelectorExtension && this.checkboxSelectorExtension.register) {
                const rowSelectionExtension = this.getExtensionByName(ExtensionName.rowSelection);
                this.extensionList.push({ name: ExtensionName.checkboxSelector, class: this.checkboxSelectorExtension, extension: this.checkboxSelectorExtension.register(rowSelectionExtension) });
            }
        }
        // Column Picker Control
        if (this.sharedService.gridOptions.enableColumnPicker) {
            if (this.columnPickerExtension && this.columnPickerExtension.register) {
                this.extensionList.push({ name: ExtensionName.columnPicker, class: this.columnPickerExtension, extension: this.columnPickerExtension.register() });
            }
        }
        // Grid Menu Control
        if (this.sharedService.gridOptions.enableGridMenu) {
            if (this.gridMenuExtension && this.gridMenuExtension.register) {
                this.extensionList.push({ name: ExtensionName.gridMenu, class: this.gridMenuExtension, extension: this.gridMenuExtension.register() });
            }
        }
        // Grouping Plugin
        // register the group item metadata provider to add expand/collapse group handlers
        if (this.sharedService.gridOptions.enableGrouping) {
            if (this.groupItemMetaExtension && this.groupItemMetaExtension.register) {
                this.extensionList.push({ name: ExtensionName.groupItemMetaProvider, class: this.groupItemMetaExtension, extension: this.groupItemMetaExtension.register() });
            }
        }
        // Header Button Plugin
        if (this.sharedService.gridOptions.enableHeaderButton) {
            if (this.headerButtonExtension && this.headerButtonExtension.register) {
                this.extensionList.push({ name: ExtensionName.headerButton, class: this.headerButtonExtension, extension: this.headerButtonExtension.register() });
            }
        }
        // Header Menu Plugin
        if (this.sharedService.gridOptions.enableHeaderMenu) {
            if (this.headerMenuExtension && this.headerMenuExtension.register) {
                this.extensionList.push({ name: ExtensionName.headerMenu, class: this.headerMenuExtension, extension: this.headerMenuExtension.register() });
            }
        }
        // Row Move Manager Plugin
        if (this.sharedService.gridOptions.enableRowMoveManager) {
            if (this.rowMoveManagerExtension && this.rowMoveManagerExtension.register) {
                this.extensionList.push({ name: ExtensionName.rowMoveManager, class: this.rowMoveManagerExtension, extension: this.rowMoveManagerExtension.register() });
            }
        }
        // Row Selection Plugin
        if (!this.sharedService.gridOptions.enableCheckboxSelector && this.sharedService.gridOptions.enableRowSelection) {
            if (this.rowSelectionExtension && this.rowSelectionExtension.register) {
                this.extensionList.push({ name: ExtensionName.rowSelection, class: this.rowSelectionExtension, extension: this.rowSelectionExtension.register() });
            }
        }
        // manually register other plugins
        if (this.sharedService.gridOptions.registerPlugins !== undefined) {
            if (Array.isArray(this.sharedService.gridOptions.registerPlugins)) {
                this.sharedService.gridOptions.registerPlugins.forEach((plugin) => {
                    this.sharedService.grid.registerPlugin(plugin);
                    this.extensionList.push({ name: ExtensionName.noname, class: null, extension: plugin });
                });
            }
            else {
                this.sharedService.grid.registerPlugin(this.sharedService.gridOptions.registerPlugins);
                this.extensionList.push({ name: ExtensionName.noname, class: null, extension: this.sharedService.gridOptions.registerPlugins });
            }
        }
    }
    /**
     * Attach/Create different plugins before the Grid creation.
     * For example the multi-select have to be added to the column definition before the grid is created to work properly
     * @param columnDefinitions
     * @param options
     */
    createCheckboxPluginBeforeGridCreation(columnDefinitions, options) {
        if (options.enableCheckboxSelector) {
            this.checkboxSelectorExtension.create(columnDefinitions, options);
        }
    }
    /** Hide a column from the grid */
    hideColumn(column) {
        if (this.sharedService.grid && this.sharedService.grid.getColumns && this.sharedService.grid.setColumns) {
            const columnIndex = this.sharedService.grid.getColumnIndex(column.id);
            this.sharedService.visibleColumns = this.removeColumnByIndex(this.sharedService.grid.getColumns(), columnIndex);
            this.sharedService.grid.setColumns(this.sharedService.visibleColumns);
        }
    }
    /** Refresh the dataset through the Backend Service */
    refreshBackendDataset(gridOptions) {
        this.gridMenuExtension.refreshBackendDataset(gridOptions);
    }
    /**
     * Remove a column from the grid by it's index in the grid
     * @param array input
     * @param index
     */
    removeColumnByIndex(array, index) {
        return array.filter((el, i) => {
            return index !== i;
        });
    }
    /** Translate the Column Picker and it's last 2 checkboxes */
    translateColumnPicker() {
        if (this.columnPickerExtension && this.columnPickerExtension.translateColumnPicker) {
            this.columnPickerExtension.translateColumnPicker();
        }
    }
    /** Translate the Header Menu titles, we need to loop through all column definition to re-translate them */
    translateGridMenu() {
        if (this.gridMenuExtension && this.gridMenuExtension.translateGridMenu) {
            this.gridMenuExtension.translateGridMenu();
        }
    }
    /** Translate the Header Menu titles, we need to loop through all column definition to re-translate them */
    translateHeaderMenu() {
        if (this.headerMenuExtension && this.headerMenuExtension.translateHeaderMenu) {
            this.headerMenuExtension.translateHeaderMenu();
        }
    }
    /**
     * Translate manually the header titles.
     * We could optionally pass a locale (that will change currently loaded locale), else it will use current locale
     * @param locale to use
     * @param new column definitions (optional)
     */
    translateColumnHeaders(locale, newColumnDefinitions) {
        if (locale) {
            this.i18n.setLocale(locale);
        }
        const columnDefinitions = newColumnDefinitions || this.sharedService.columnDefinitions;
        this.translateItems(columnDefinitions, 'headerKey', 'name');
        this.translateItems(this.sharedService.allColumns, 'headerKey', 'name');
        // re-render the column headers
        this.renderColumnHeaders(columnDefinitions);
    }
    /**
     * Render (or re-render) the column headers from column definitions.
     * calling setColumns() will trigger a grid re-render
     */
    renderColumnHeaders(newColumnDefinitions) {
        const collection = newColumnDefinitions || this.sharedService.columnDefinitions;
        if (Array.isArray(collection) && this.sharedService.grid && this.sharedService.grid.setColumns) {
            this.sharedService.grid.setColumns(collection);
        }
    }
    /** Translate the an array of items from an input key and assign to the output key */
    translateItems(items, inputKey, outputKey) {
        for (const item of items) {
            if (item[inputKey]) {
                item[outputKey] = this.i18n.tr(item[inputKey]);
            }
        }
    }
};
ExtensionService = __decorate([
    singleton(true),
    inject(AutoTooltipExtension, CellExternalCopyManagerExtension, CheckboxSelectorExtension, ColumnPickerExtension, GridMenuExtension, GroupItemMetaProviderExtension, I18N, HeaderButtonExtension, HeaderMenuExtension, RowMoveManagerExtension, RowSelectionExtension, SharedService)
], ExtensionService);
export { ExtensionService };
//# sourceMappingURL=extension.service.js.map