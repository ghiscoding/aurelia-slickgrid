var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { DelimiterType, FileType, } from './../models/index';
import { ExportService } from './export.service';
import { FilterService } from './filter.service';
import { SortService } from './sort.service';
import { sanitizeHtmlToText } from './../services/utilities';
import * as $ from 'jquery';
let ControlAndPluginService = class ControlAndPluginService {
    constructor(exportService, filterService, i18n, sortService) {
        this.exportService = exportService;
        this.filterService = filterService;
        this.i18n = i18n;
        this.sortService = sortService;
        this.areVisibleColumnDifferent = false;
    }
    /** Getter for the Grid Options pulled through the Grid Object */
    get _gridOptions() {
        return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
    }
    /** Getter for the Column Definitions pulled through the Grid Object */
    get _columnDefinitions() {
        return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
    }
    /** Auto-resize all the column in the grid to fit the grid width */
    autoResizeColumns() {
        this._grid.autosizeColumns();
    }
    /**
     * Attach/Create different Controls or Plugins after the Grid is created
     * @param grid
     * @param dataView
     * @param groupItemMetadataProvider
     */
    attachDifferentControlOrPlugins(grid, dataView, groupItemMetadataProvider) {
        this._grid = grid;
        this._dataView = dataView;
        this.visibleColumns = this._columnDefinitions;
        // Column Picker Plugin
        if (this._gridOptions.enableColumnPicker) {
            this.columnPickerControl = this.createColumnPicker(grid, this._columnDefinitions);
        }
        // Grid Menu Plugin
        if (this._gridOptions.enableGridMenu) {
            this.gridMenuControl = this.createGridMenu(grid, this._columnDefinitions);
        }
        // Auto Tooltip Plugin
        if (this._gridOptions.enableAutoTooltip) {
            this.autoTooltipPlugin = new Slick.AutoTooltips(this._gridOptions.autoTooltipOptions || {});
            grid.registerPlugin(this.autoTooltipPlugin);
        }
        // Grouping Plugin
        // register the group item metadata provider to add expand/collapse group handlers
        if (this._gridOptions.enableGrouping) {
            grid.registerPlugin(groupItemMetadataProvider);
        }
        // Checkbox Selector Plugin
        if (this._gridOptions.enableCheckboxSelector) {
            // when enabling the Checkbox Selector Plugin, we need to also watch onClick events to perform certain actions
            // the selector column has to be create BEFORE the grid (else it behaves oddly), but we can only watch grid events AFTER the grid is created
            grid.registerPlugin(this.checkboxSelectorPlugin);
            // this also requires the Row Selection Model to be registered as well
            if (!this.rowSelectionPlugin) {
                this.rowSelectionPlugin = new Slick.RowSelectionModel(this._gridOptions.rowSelectionOptions || {});
                grid.setSelectionModel(this.rowSelectionPlugin);
            }
        }
        // Row Selection Plugin
        if (!this._gridOptions.enableCheckboxSelector && this._gridOptions.enableRowSelection) {
            this.rowSelectionPlugin = new Slick.RowSelectionModel(this._gridOptions.rowSelectionOptions || {});
            grid.setSelectionModel(this.rowSelectionPlugin);
        }
        // Header Button Plugin
        if (this._gridOptions.enableHeaderButton) {
            this.headerButtonsPlugin = new Slick.Plugins.HeaderButtons(this._gridOptions.headerButton || {});
            grid.registerPlugin(this.headerButtonsPlugin);
            this.headerButtonsPlugin.onCommand.subscribe((e, args) => {
                if (this._gridOptions.headerButton && typeof this._gridOptions.headerButton.onCommand === 'function') {
                    this._gridOptions.headerButton.onCommand(e, args);
                }
            });
        }
        // Header Menu Plugin
        if (this._gridOptions.enableHeaderMenu) {
            this.headerMenuPlugin = this.createHeaderMenu(this._grid, this._dataView, this._columnDefinitions);
        }
        // Cell External Copy Manager Plugin (Excel Like)
        if (this._gridOptions.enableExcelCopyBuffer) {
            this.createUndoRedoBuffer();
            this.hookUndoShortcutKey();
            this.createCellExternalCopyManagerPlugin(this._grid);
        }
        // manually register other plugins
        if (this._gridOptions.registerPlugins !== undefined) {
            if (Array.isArray(this._gridOptions.registerPlugins)) {
                this._gridOptions.registerPlugins.forEach((plugin) => {
                    grid.registerPlugin(plugin);
                });
            }
            else {
                grid.registerPlugin(this._gridOptions.registerPlugins);
            }
        }
    }
    /**
     * Attach/Create different plugins before the Grid creation.
     * For example the multi-select have to be added to the column definition before the grid is created to work properly
     * @param columnDefinitions
     * @param options
     */
    createPluginBeforeGridCreation(columnDefinitions, options) {
        if (options.enableCheckboxSelector) {
            this.checkboxSelectorPlugin = new Slick.CheckboxSelectColumn(options.checkboxSelector || {});
            const selectionColumn = this.checkboxSelectorPlugin.getColumnDefinition();
            selectionColumn.excludeFromExport = true;
            selectionColumn.excludeFromQuery = true;
            selectionColumn.excludeFromHeaderMenu = true;
            columnDefinitions.unshift(selectionColumn);
        }
    }
    /** Create the Excel like copy manager */
    createCellExternalCopyManagerPlugin(grid) {
        let newRowIds = 0;
        const pluginOptions = {
            clipboardCommandHandler: (editCommand) => {
                this.undoRedoBuffer.queueAndExecuteCommand.call(this.undoRedoBuffer, editCommand);
            },
            dataItemColumnValueExtractor: (item, columnDef) => {
                // when grid or cell is not editable, we will possibly evaluate the Formatter if it was passed
                // to decide if we evaluate the Formatter, we will use the same flag from Export which is "exportWithFormatter"
                if (this._gridOptions && (!this._gridOptions.editable || !columnDef.editor)) {
                    const exportOptionWithFormatter = (this._gridOptions && this._gridOptions.exportOptions) ? this._gridOptions.exportOptions.exportWithFormatter : false;
                    const isEvaluatingFormatter = (columnDef.exportWithFormatter !== undefined) ? columnDef.exportWithFormatter : exportOptionWithFormatter;
                    if (columnDef.formatter && isEvaluatingFormatter) {
                        const formattedOutput = columnDef.formatter(0, 0, item[columnDef.field], columnDef, item, this._grid);
                        if (columnDef.sanitizeDataExport || (this._gridOptions.exportOptions && this._gridOptions.exportOptions.sanitizeDataExport)) {
                            return sanitizeHtmlToText(formattedOutput);
                        }
                        return formattedOutput;
                    }
                }
                // else use the default "dataItemColumnValueExtractor" from the plugin itself
                // we can do that by setting back the getter with null
                return null;
            },
            readOnlyMode: false,
            includeHeaderWhenCopying: false,
            newRowCreator: (count) => {
                for (let i = 0; i < count; i++) {
                    const item = {
                        id: 'newRow_' + newRowIds++
                    };
                    grid.getData().addItem(item);
                }
            }
        };
        grid.setSelectionModel(new Slick.CellSelectionModel());
        grid.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));
    }
    /**
     * Create the Column Picker and expose all the available hooks that user can subscribe (onColumnsChanged)
     * @param grid
     * @param columnDefinitions
     */
    createColumnPicker(grid, columnDefinitions) {
        // localization support for the picker
        const forceFitTitle = this._gridOptions.enableTranslate ? this.i18n.tr('FORCE_FIT_COLUMNS') : 'Force fit columns';
        const syncResizeTitle = this._gridOptions.enableTranslate ? this.i18n.tr('SYNCHRONOUS_RESIZE') : 'Synchronous resize';
        this._gridOptions.columnPicker = this._gridOptions.columnPicker || {};
        this._gridOptions.columnPicker.forceFitTitle = this._gridOptions.columnPicker.forceFitTitle || forceFitTitle;
        this._gridOptions.columnPicker.syncResizeTitle = this._gridOptions.columnPicker.syncResizeTitle || syncResizeTitle;
        this.columnPickerControl = new Slick.Controls.ColumnPicker(columnDefinitions, grid, this._gridOptions);
        if (grid && this._gridOptions.enableColumnPicker) {
            this.columnPickerControl.onColumnsChanged.subscribe((e, args) => {
                if (this._gridOptions.columnPicker && typeof this._gridOptions.columnPicker.onColumnsChanged === 'function') {
                    this._gridOptions.columnPicker.onColumnsChanged(e, args);
                }
            });
        }
    }
    /**
     * Create (or re-create) Grid Menu and expose all the available hooks that user can subscribe (onCommand, onMenuClose, ...)
     * @param grid
     * @param columnDefinitions
     */
    createGridMenu(grid, columnDefinitions) {
        this._gridOptions.gridMenu = Object.assign({}, this.getDefaultGridMenuOptions(), this._gridOptions.gridMenu);
        this.addGridMenuCustomCommands(grid);
        const gridMenuControl = new Slick.Controls.GridMenu(columnDefinitions, grid, this._gridOptions);
        if (grid && this._gridOptions.gridMenu) {
            gridMenuControl.onBeforeMenuShow.subscribe((e, args) => {
                if (this._gridOptions.gridMenu && typeof this._gridOptions.gridMenu.onBeforeMenuShow === 'function') {
                    this._gridOptions.gridMenu.onBeforeMenuShow(e, args);
                }
            });
            gridMenuControl.onColumnsChanged.subscribe((e, args) => {
                this.areVisibleColumnDifferent = true;
                if (this._gridOptions.gridMenu && typeof this._gridOptions.gridMenu.onColumnsChanged === 'function') {
                    this._gridOptions.gridMenu.onColumnsChanged(e, args);
                }
            });
            gridMenuControl.onCommand.subscribe((e, args) => {
                if (this._gridOptions.gridMenu && typeof this._gridOptions.gridMenu.onCommand === 'function') {
                    this._gridOptions.gridMenu.onCommand(e, args);
                }
            });
            gridMenuControl.onMenuClose.subscribe((e, args) => {
                if (this._gridOptions.gridMenu && typeof this._gridOptions.gridMenu.onMenuClose === 'function') {
                    this._gridOptions.gridMenu.onMenuClose(e, args);
                }
                // we also want to resize the columns if the user decided to hide certain column(s)
                if (grid && typeof grid.autosizeColumns === 'function') {
                    // make sure that the grid still exist (by looking if the Grid UID is found in the DOM tree)
                    const gridUid = grid.getUID();
                    if (this.areVisibleColumnDifferent && gridUid && $(`.${gridUid}`).length > 0) {
                        grid.autosizeColumns();
                        this.areVisibleColumnDifferent = false;
                    }
                }
            });
        }
        return gridMenuControl;
    }
    /**
     * Create the Header Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...)
     * @param grid
     * @param dataView
     * @param columnDefinitions
     */
    createHeaderMenu(grid, dataView, columnDefinitions) {
        this._gridOptions.headerMenu = Object.assign({}, this.getDefaultHeaderMenuOptions(), this._gridOptions.headerMenu);
        if (this._gridOptions.enableHeaderMenu) {
            this._gridOptions.headerMenu = this.addHeaderMenuCustomCommands(grid, dataView, columnDefinitions);
        }
        const headerMenuPlugin = new Slick.Plugins.HeaderMenu(this._gridOptions.headerMenu);
        grid.registerPlugin(headerMenuPlugin);
        headerMenuPlugin.onCommand.subscribe((e, args) => {
            if (this._gridOptions.headerMenu && typeof this._gridOptions.headerMenu.onCommand === 'function') {
                this._gridOptions.headerMenu.onCommand(e, args);
            }
        });
        headerMenuPlugin.onCommand.subscribe((e, args) => {
            if (this._gridOptions.headerMenu && typeof this._gridOptions.headerMenu.onBeforeMenuShow === 'function') {
                this._gridOptions.headerMenu.onBeforeMenuShow(e, args);
            }
        });
        return headerMenuPlugin;
    }
    /** Create an undo redo buffer used by the Excel like copy */
    createUndoRedoBuffer() {
        const commandQueue = [];
        let commandCtr = 0;
        this.undoRedoBuffer = {
            queueAndExecuteCommand: (editCommand) => {
                commandQueue[commandCtr] = editCommand;
                commandCtr++;
                editCommand.execute();
            },
            undo: () => {
                if (commandCtr === 0) {
                    return;
                }
                commandCtr--;
                const command = commandQueue[commandCtr];
                if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                    command.undo();
                }
            },
            redo: () => {
                if (commandCtr >= commandQueue.length) {
                    return;
                }
                const command = commandQueue[commandCtr];
                commandCtr++;
                if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                    command.execute();
                }
            }
        };
    }
    /** Hide a column from the grid */
    hideColumn(column) {
        if (this._grid && this.visibleColumns) {
            const columnIndex = this._grid.getColumnIndex(column.id);
            this.visibleColumns = this.removeColumnByIndex(this.visibleColumns, columnIndex);
            this._grid.setColumns(this.visibleColumns);
        }
    }
    /** Attach an undo shortcut key hook that will redo/undo the copy buffer */
    hookUndoShortcutKey() {
        // undo shortcut
        $(document).keydown((e) => {
            if (e.which === 90 && (e.ctrlKey || e.metaKey)) {
                if (e.shiftKey) {
                    this.undoRedoBuffer.redo();
                }
                else {
                    this.undoRedoBuffer.undo();
                }
            }
        });
    }
    dispose() {
        this._grid = null;
        this._dataView = null;
        this.visibleColumns = [];
        if (this.columnPickerControl) {
            this.columnPickerControl.destroy();
            this.columnPickerControl = null;
        }
        if (this.gridMenuControl) {
            this.gridMenuControl.destroy();
            this.gridMenuControl = null;
        }
        if (this.rowSelectionPlugin) {
            this.rowSelectionPlugin.destroy();
            this.rowSelectionPlugin = null;
        }
        if (this.checkboxSelectorPlugin) {
            this.checkboxSelectorPlugin.destroy();
            this.checkboxSelectorPlugin = null;
        }
        if (this.autoTooltipPlugin) {
            this.autoTooltipPlugin.destroy();
            this.autoTooltipPlugin = null;
        }
        if (this.headerButtonsPlugin) {
            this.headerButtonsPlugin.destroy();
            this.headerButtonsPlugin = null;
        }
        if (this.headerMenuPlugin) {
            this.headerMenuPlugin.destroy();
            this.headerMenuPlugin = null;
        }
    }
    /**
     * Create Grid Menu with Custom Commands if user has enabled Filters and/or uses a Backend Service (OData, GraphQL)
     * @param grid
     */
    addGridMenuCustomCommands(grid) {
        const backendApi = this._gridOptions.backendServiceApi || this._gridOptions.onBackendEventApi || null;
        if (this._gridOptions && this._gridOptions.enableFiltering) {
            // show grid menu: clear all filters
            if (this._gridOptions && this._gridOptions.gridMenu && this._gridOptions.gridMenu.showClearAllFiltersCommand && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item) => item.command === 'clear-filter').length === 0) {
                this._gridOptions.gridMenu.customItems.push({
                    iconCssClass: this._gridOptions.gridMenu.iconClearAllFiltersCommand || 'fa fa-filter text-danger',
                    title: this._gridOptions.enableTranslate ? this.i18n.tr('CLEAR_ALL_FILTERS') : 'Clear All Filters',
                    disabled: false,
                    command: 'clear-filter',
                    positionOrder: 50
                });
            }
            // show grid menu: toggle filter row
            if (this._gridOptions && this._gridOptions.gridMenu && this._gridOptions.gridMenu.showToggleFilterCommand && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item) => item.command === 'toggle-filter').length === 0) {
                this._gridOptions.gridMenu.customItems.push({
                    iconCssClass: this._gridOptions.gridMenu.iconToggleFilterCommand || 'fa fa-random',
                    title: this._gridOptions.enableTranslate ? this.i18n.tr('TOGGLE_FILTER_ROW') : 'Toggle Filter Row',
                    disabled: false,
                    command: 'toggle-filter',
                    positionOrder: 52
                });
            }
            // show grid menu: refresh dataset
            if (this._gridOptions && this._gridOptions.gridMenu && this._gridOptions.gridMenu.showRefreshDatasetCommand && backendApi && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item) => item.command === 'refresh-dataset').length === 0) {
                this._gridOptions.gridMenu.customItems.push({
                    iconCssClass: this._gridOptions.gridMenu.iconRefreshDatasetCommand || 'fa fa-refresh',
                    title: this._gridOptions.enableTranslate ? this.i18n.tr('REFRESH_DATASET') : 'Refresh Dataset',
                    disabled: false,
                    command: 'refresh-dataset',
                    positionOrder: 54
                });
            }
        }
        if (this._gridOptions.enableSorting) {
            // show grid menu: clear all sorting
            if (this._gridOptions && this._gridOptions.gridMenu && this._gridOptions.gridMenu.showClearAllSortingCommand && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item) => item.command === 'clear-sorting').length === 0) {
                this._gridOptions.gridMenu.customItems.push({
                    iconCssClass: this._gridOptions.gridMenu.iconClearAllSortingCommand || 'fa fa-unsorted text-danger',
                    title: this._gridOptions.enableTranslate ? this.i18n.tr('CLEAR_ALL_SORTING') : 'Clear All Sorting',
                    disabled: false,
                    command: 'clear-sorting',
                    positionOrder: 51
                });
            }
        }
        // show grid menu: export to file
        if (this._gridOptions && this._gridOptions.enableExport && this._gridOptions.gridMenu && this._gridOptions.gridMenu.showExportCsvCommand && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item) => item.command === 'export-csv').length === 0) {
            this._gridOptions.gridMenu.customItems.push({
                iconCssClass: this._gridOptions.gridMenu.iconExportCsvCommand || 'fa fa-download',
                title: this._gridOptions.enableTranslate ? this.i18n.tr('EXPORT_TO_CSV') : 'Export in CSV format',
                disabled: false,
                command: 'export-csv',
                positionOrder: 53
            });
        }
        // show grid menu: export to text file as tab delimited
        if (this._gridOptions && this._gridOptions.enableExport && this._gridOptions.gridMenu && this._gridOptions.gridMenu.showExportTextDelimitedCommand && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.filter((item) => item.command === 'export-text-delimited').length === 0) {
            this._gridOptions.gridMenu.customItems.push({
                iconCssClass: this._gridOptions.gridMenu.iconExportTextDelimitedCommand || 'fa fa-download',
                title: this._gridOptions.enableTranslate ? this.i18n.tr('EXPORT_TO_TAB_DELIMITED') : 'Export in Text format (Tab delimited)',
                disabled: false,
                command: 'export-text-delimited',
                positionOrder: 54
            });
        }
        // Command callback, what will be executed after command is clicked
        if (this._gridOptions && this._gridOptions.gridMenu && Array.isArray(this._gridOptions.gridMenu.customItems) && this._gridOptions.gridMenu.customItems.length > 0) {
            this._gridOptions.gridMenu.onCommand = (e, args) => {
                if (args && args.command) {
                    switch (args.command) {
                        case 'clear-filter':
                            this.filterService.clearFilters();
                            this._dataView.refresh();
                            break;
                        case 'clear-sorting':
                            this.sortService.clearSorting();
                            this._dataView.refresh();
                            break;
                        case 'export-csv':
                            this.exportService.exportToFile({
                                delimiter: DelimiterType.comma,
                                filename: 'export',
                                format: FileType.csv,
                                useUtf8WithBom: true
                            });
                            break;
                        case 'export-text-delimited':
                            this.exportService.exportToFile({
                                delimiter: DelimiterType.tab,
                                filename: 'export',
                                format: FileType.txt,
                                useUtf8WithBom: true
                            });
                            break;
                        case 'toggle-filter':
                            grid.setHeaderRowVisibility(!this._gridOptions.showHeaderRow);
                            break;
                        case 'toggle-toppanel':
                            grid.setTopPanelVisibility(!this._gridOptions.showTopPanel);
                            break;
                        case 'refresh-dataset':
                            this.refreshBackendDataset();
                            break;
                        default:
                            alert('Command: ' + args.command);
                            break;
                    }
                }
            };
        }
        // add the custom "Commands" title if there are any commands
        if (this._gridOptions && this._gridOptions.gridMenu && this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.length > 0) {
            const customTitle = this._gridOptions.enableTranslate ? this.i18n.tr('COMMANDS') : 'Commands';
            this._gridOptions.gridMenu.customTitle = this._gridOptions.gridMenu.customTitle || customTitle;
            // sort the custom items by their position in the list
            this._gridOptions.gridMenu.customItems.sort((itemA, itemB) => {
                if (itemA && itemB && itemA.hasOwnProperty('positionOrder') && itemB.hasOwnProperty('positionOrder')) {
                    return (itemA.positionOrder || 0) - (itemB.positionOrder || 0);
                }
                return 0;
            });
        }
    }
    /** Call a refresh dataset with a BackendServiceApi */
    refreshBackendDataset() {
        let query;
        const backendApi = this._gridOptions.backendServiceApi || this._gridOptions.onBackendEventApi;
        if (!backendApi || !backendApi.service || !backendApi.process) {
            throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
        }
        if (backendApi.service) {
            query = backendApi.service.buildQuery();
        }
        if (query && query !== '') {
            if (backendApi.preProcess) {
                backendApi.preProcess();
            }
            // execute the process promise
            const processPromise = backendApi.process(query);
            processPromise.then((processResult) => {
                // from the result, call our internal post process to update the Dataset and Pagination info
                if (processResult && backendApi && backendApi.internalPostProcess) {
                    backendApi.internalPostProcess(processResult);
                }
                // send the response process to the postProcess callback
                if (backendApi && backendApi.postProcess) {
                    backendApi.postProcess(processResult);
                }
            });
        }
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
    /**
     * Translate the Column Picker and it's last 2 checkboxes
     * Note that the only way that seems to work is to destroy and re-create the Column Picker
     * Changing only the columnPicker.columnTitle with i18n translate was not enough.
     */
    translateColumnPicker() {
        // destroy and re-create the Column Picker which seems to be the only way to translate properly
        if (this.columnPickerControl) {
            this.columnPickerControl.destroy();
            this.columnPickerControl = null;
        }
        this._gridOptions.columnPicker = undefined;
        this.createColumnPicker(this._grid, this.visibleColumns);
    }
    /**
     * Translate the Grid Menu ColumnTitle and CustomTitle.
     * Note that the only way that seems to work is to destroy and re-create the Grid Menu
     * Changing only the gridMenu.columnTitle with i18n translate was not enough.
     */
    translateGridMenu() {
        // destroy and re-create the Grid Menu which seems to be the only way to translate properly
        this.gridMenuControl.destroy();
        // reset all Grid Menu options that have translation text & then re-create the Grid Menu and also the custom items array
        if (this._gridOptions && this._gridOptions.gridMenu) {
            this._gridOptions.gridMenu = this.resetGridMenuTranslations(this._gridOptions.gridMenu);
        }
        this.createGridMenu(this._grid, this.visibleColumns);
    }
    /**
     * Translate the Header Menu titles, we need to loop through all column definition to re-translate them
     */
    translateHeaderMenu() {
        // reset all Grid Menu options that have translation text & then re-create the Grid Menu and also the custom items array
        if (this._gridOptions && this._gridOptions.headerMenu) {
            this.resetHeaderMenuTranslations(this.visibleColumns);
        }
    }
    /**
     * Translate manually the header titles.
     * We could optionally pass a locale (that will change currently loaded locale), else it will use current locale
     * @param locale to use
     */
    translateColumnHeaders(locale) {
        if (locale) {
            this.i18n.setLocale(locale);
        }
        for (const column of this._columnDefinitions) {
            if (column.headerKey) {
                column.name = this.i18n.tr(column.headerKey);
            }
        }
        // re-render the column headers
        this.renderColumnHeaders();
    }
    /**
     * Render (or re-render) the column headers from column definitions.
     * calling setColumns() will trigger a grid re-render
     */
    renderColumnHeaders(newColumnDefinitions) {
        const collection = newColumnDefinitions || this._columnDefinitions;
        if (Array.isArray(collection) && this._grid && this._grid.setColumns) {
            this._grid.setColumns(collection);
        }
    }
    /**
     * Create Header Menu with Custom Commands if user has enabled Header Menu
     * @param grid
     * @param dataView
     * @param columnDefinitions
     * @return header menu
     */
    addHeaderMenuCustomCommands(grid, dataView, columnDefinitions) {
        const headerMenuOptions = this._gridOptions.headerMenu;
        if (columnDefinitions && Array.isArray(columnDefinitions) && this._gridOptions.enableHeaderMenu) {
            columnDefinitions.forEach((columnDef) => {
                if (columnDef && !columnDef.excludeFromHeaderMenu) {
                    if (!columnDef.header || !columnDef.header.menu) {
                        columnDef.header = {
                            menu: {
                                items: []
                            }
                        };
                    }
                    if (columnDef && columnDef.header && columnDef.header.menu) {
                        const columnHeaderMenuItems = columnDef.header.menu.items || [];
                        // Sorting Commands
                        if (this._gridOptions.enableSorting && columnDef.sortable && headerMenuOptions && headerMenuOptions.showSortCommands) {
                            if (columnHeaderMenuItems.filter((item) => item.command === 'sort-asc').length === 0) {
                                columnHeaderMenuItems.push({
                                    iconCssClass: headerMenuOptions.iconSortAscCommand || 'fa fa-sort-asc',
                                    title: this._gridOptions.enableTranslate ? this.i18n.tr('SORT_ASCENDING') : 'Sort Ascending',
                                    command: 'sort-asc'
                                });
                            }
                            if (columnHeaderMenuItems.filter((item) => item.command === 'sort-desc').length === 0) {
                                columnHeaderMenuItems.push({
                                    iconCssClass: headerMenuOptions.iconSortDescCommand || 'fa fa-sort-desc',
                                    title: this._gridOptions.enableTranslate ? this.i18n.tr('SORT_DESCENDING') : 'Sort Descending',
                                    command: 'sort-desc'
                                });
                            }
                        }
                        // Hide Column Command
                        if (headerMenuOptions && headerMenuOptions.showColumnHideCommand && columnHeaderMenuItems.filter((item) => item.command === 'hide').length === 0) {
                            columnHeaderMenuItems.push({
                                iconCssClass: headerMenuOptions.iconColumnHideCommand || 'fa fa-times',
                                title: this._gridOptions.enableTranslate ? this.i18n.tr('HIDE_COLUMN') : 'Hide Column',
                                command: 'hide'
                            });
                        }
                    }
                }
            });
            // Command callback, what will be executed after command is clicked
            if (headerMenuOptions) {
                headerMenuOptions.onCommand = (e, args) => {
                    if (args && args.command) {
                        switch (args.command) {
                            case 'hide':
                                this.hideColumn(args.column);
                                this.autoResizeColumns();
                                break;
                            case 'sort-asc':
                            case 'sort-desc':
                                // get previously sorted columns
                                const cols = this.sortService.getPreviousColumnSorts(args.column.id + '');
                                // add to the column array, the column sorted by the header menu
                                cols.push({ sortCol: args.column, sortAsc: (args.command === 'sort-asc') });
                                if (this._gridOptions.backendServiceApi) {
                                    this.sortService.onBackendSortChanged(e, { multiColumnSort: true, sortCols: cols, grid });
                                }
                                else {
                                    this.sortService.onLocalSortChanged(grid, dataView, cols);
                                }
                                // update the this.gridObj sortColumns array which will at the same add the visual sort icon(s) on the UI
                                const newSortColumns = cols.map((col) => {
                                    return {
                                        columnId: (col && col.sortCol) ? col.sortCol.id : '',
                                        sortAsc: col.sortAsc
                                    };
                                });
                                grid.setSortColumns(newSortColumns); // add sort icon in UI
                                break;
                            default:
                                alert('Command: ' + args.command);
                                break;
                        }
                    }
                };
            }
        }
        return headerMenuOptions;
    }
    /**
     * @return default Grid Menu options
     */
    getDefaultGridMenuOptions() {
        return {
            columnTitle: this.i18n.tr('COLUMNS') || 'Columns',
            forceFitTitle: this.i18n.tr('FORCE_FIT_COLUMNS') || 'Force fit columns',
            syncResizeTitle: this.i18n.tr('SYNCHRONOUS_RESIZE') || 'Synchronous resize',
            iconCssClass: 'fa fa-bars',
            menuWidth: 18,
            customTitle: undefined,
            customItems: [],
            showClearAllFiltersCommand: true,
            showRefreshDatasetCommand: true,
            showToggleFilterCommand: true
        };
    }
    /**
     * @return default Header Menu options
     */
    getDefaultHeaderMenuOptions() {
        return {
            autoAlignOffset: 12,
            minWidth: 140,
            showColumnHideCommand: true,
            showSortCommands: true
        };
    }
    /**
     * Reset all the Grid Menu options which have text to translate
     * @param gridMenu object
     */
    resetGridMenuTranslations(gridMenu) {
        // we will reset the custom items array since the commands title have to be translated too (no worries, we will re-create it later)
        gridMenu.customItems = [];
        delete gridMenu.customTitle;
        gridMenu.columnTitle = this.i18n.tr('COLUMNS') || 'Columns';
        gridMenu.forceFitTitle = this.i18n.tr('FORCE_FIT_COLUMNS') || 'Force fit columns';
        gridMenu.syncResizeTitle = this.i18n.tr('SYNCHRONOUS_RESIZE') || 'Synchronous resize';
        return gridMenu;
    }
    /**
     * Reset all the Grid Menu options which have text to translate
     * @param columnDefinitions
     */
    resetHeaderMenuTranslations(columnDefinitions) {
        columnDefinitions.forEach((columnDef) => {
            if (columnDef && !columnDef.excludeFromHeaderMenu && columnDef.header && columnDef.header.menu && columnDef.header.menu.items) {
                const columnHeaderMenuItems = columnDef.header.menu.items || [];
                columnHeaderMenuItems.forEach((item) => {
                    switch (item.command) {
                        case 'sort-asc':
                            item.title = this.i18n.tr('SORT_ASCENDING') || 'Sort Ascending';
                            break;
                        case 'sort-desc':
                            item.title = this.i18n.tr('SORT_DESCENDING') || 'Sort Ascending';
                            break;
                        case 'hide':
                            item.title = this.i18n.tr('HIDE_COLUMN') || 'Sort Ascending';
                            break;
                    }
                });
            }
        });
    }
};
ControlAndPluginService = __decorate([
    inject(ExportService, FilterService, I18N, SortService)
], ControlAndPluginService);
export { ControlAndPluginService };
//# sourceMappingURL=controlAndPlugin.service.js.map