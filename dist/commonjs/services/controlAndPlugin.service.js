"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_framework_1 = require("aurelia-framework");
var aurelia_i18n_1 = require("aurelia-i18n");
var index_1 = require("./../models/index");
var export_service_1 = require("./export.service");
var filter_service_1 = require("./filter.service");
var sort_service_1 = require("./sort.service");
var utilities_1 = require("./../services/utilities");
var $ = require("jquery");
var ControlAndPluginService = /** @class */ (function () {
    function ControlAndPluginService(exportService, filterService, i18n, sortService) {
        this.exportService = exportService;
        this.filterService = filterService;
        this.i18n = i18n;
        this.sortService = sortService;
    }
    /** Auto-resize all the column in the grid to fit the grid width */
    ControlAndPluginService.prototype.autoResizeColumns = function () {
        this._grid.autosizeColumns();
    };
    /**
     * Attach/Create different Controls or Plugins after the Grid is created
     * @param grid
     * @param columnDefinitions
     * @param options
     * @param dataView
     */
    ControlAndPluginService.prototype.attachDifferentControlOrPlugins = function (grid, columnDefinitions, options, dataView, groupItemMetadataProvider) {
        this._grid = grid;
        this._gridOptions = options;
        this._dataView = dataView;
        this._columnDefinitions = columnDefinitions;
        this.visibleColumns = columnDefinitions;
        // Column Picker Plugin
        if (options.enableColumnPicker) {
            this.columnPickerControl = this.createColumnPicker(grid, columnDefinitions, options);
        }
        // Grid Menu Plugin
        if (options.enableGridMenu) {
            this.gridMenuControl = this.createGridMenu(grid, columnDefinitions, options);
        }
        // Auto Tooltip Plugin
        if (options.enableAutoTooltip) {
            this.autoTooltipPlugin = new Slick.AutoTooltips(options.autoTooltipOptions || {});
            grid.registerPlugin(this.autoTooltipPlugin);
        }
        // Grouping Plugin
        // register the group item metadata provider to add expand/collapse group handlers
        if (options.enableGrouping) {
            grid.registerPlugin(groupItemMetadataProvider);
        }
        // Checkbox Selector Plugin
        if (options.enableCheckboxSelector) {
            // when enabling the Checkbox Selector Plugin, we need to also watch onClick events to perform certain actions
            // the selector column has to be create BEFORE the grid (else it behaves oddly), but we can only watch grid events AFTER the grid is created
            grid.registerPlugin(this.checkboxSelectorPlugin);
            // this also requires the Row Selection Model to be registered as well
            if (!this.rowSelectionPlugin) {
                this.rowSelectionPlugin = new Slick.RowSelectionModel(options.rowSelectionOptions || {});
                grid.setSelectionModel(this.rowSelectionPlugin);
            }
        }
        // Row Selection Plugin
        if (options.enableRowSelection) {
            this.rowSelectionPlugin = new Slick.RowSelectionModel(options.rowSelectionOptions || {});
            grid.setSelectionModel(this.rowSelectionPlugin);
        }
        // Header Button Plugin
        if (options.enableHeaderButton) {
            this.headerButtonsPlugin = new Slick.Plugins.HeaderButtons(options.headerButton || {});
            grid.registerPlugin(this.headerButtonsPlugin);
            this.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                if (options.headerButton && typeof options.headerButton.onCommand === 'function') {
                    options.headerButton.onCommand(e, args);
                }
            });
        }
        // Header Menu Plugin
        if (options.enableHeaderMenu) {
            this.headerMenuPlugin = this.createHeaderMenu(this._grid, this._dataView, this._columnDefinitions, this._gridOptions);
        }
        // Cell External Copy Manager Plugin (Excel Like)
        if (options.enableExcelCopyBuffer) {
            this.createUndoRedoBuffer();
            this.hookUndoShortcutKey();
            this.createCellExternalCopyManagerPlugin(this._grid, this._gridOptions);
        }
        // manually register other plugins
        if (options.registerPlugins !== undefined) {
            if (Array.isArray(options.registerPlugins)) {
                options.registerPlugins.forEach(function (plugin) {
                    grid.registerPlugin(plugin);
                });
            }
            else {
                grid.registerPlugin(options.registerPlugins);
            }
        }
    };
    /**
     * Attach/Create different plugins before the Grid creation.
     * For example the multi-select have to be added to the column definition before the grid is created to work properly
     * @param columnDefinitions
     * @param options
     */
    ControlAndPluginService.prototype.createPluginBeforeGridCreation = function (columnDefinitions, options) {
        if (options.enableCheckboxSelector) {
            this.checkboxSelectorPlugin = new Slick.CheckboxSelectColumn(options.checkboxSelector || {});
            var selectionColumn = this.checkboxSelectorPlugin.getColumnDefinition();
            selectionColumn.excludeFromExport = true;
            selectionColumn.excludeFromQuery = true;
            columnDefinitions.unshift(selectionColumn);
        }
    };
    /** Create the Excel like copy manager */
    ControlAndPluginService.prototype.createCellExternalCopyManagerPlugin = function (grid, gridOptions) {
        var _this = this;
        var newRowIds = 0;
        var pluginOptions = {
            clipboardCommandHandler: function (editCommand) {
                _this.undoRedoBuffer.queueAndExecuteCommand.call(_this.undoRedoBuffer, editCommand);
            },
            dataItemColumnValueExtractor: function (item, columnDef) {
                // when grid or cell is not editable, we will possibly evaluate the Formatter if it was passed
                // to decide if we evaluate the Formatter, we will use the same flag from Export which is "exportWithFormatter"
                if (gridOptions && (!gridOptions.editable || !columnDef.editor)) {
                    var exportOptionWithFormatter = (gridOptions && gridOptions.exportOptions) ? gridOptions.exportOptions.exportWithFormatter : false;
                    var isEvaluatingFormatter = (columnDef.exportWithFormatter !== undefined) ? columnDef.exportWithFormatter : exportOptionWithFormatter;
                    if (columnDef.formatter && isEvaluatingFormatter) {
                        var formattedOutput = columnDef.formatter(0, 0, item[columnDef.field], columnDef, item, _this._grid);
                        if (columnDef.sanitizeDataExport || (gridOptions.exportOptions && gridOptions.exportOptions.sanitizeDataExport)) {
                            return utilities_1.sanitizeHtmlToText(formattedOutput);
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
            newRowCreator: function (count) {
                for (var i = 0; i < count; i++) {
                    var item = {
                        id: 'newRow_' + newRowIds++
                    };
                    grid.getData().addItem(item);
                }
            }
        };
        grid.setSelectionModel(new Slick.CellSelectionModel());
        grid.registerPlugin(new Slick.CellExternalCopyManager(pluginOptions));
    };
    /**
     * Create the Column Picker and expose all the available hooks that user can subscribe (onColumnsChanged)
     * @param grid
     * @param columnDefinitions
     * @param options
     */
    ControlAndPluginService.prototype.createColumnPicker = function (grid, columnDefinitions, options) {
        // localization support for the picker
        var forceFitTitle = options.enableTranslate ? this.i18n.tr('FORCE_FIT_COLUMNS') : 'Force fit columns';
        var syncResizeTitle = options.enableTranslate ? this.i18n.tr('SYNCHRONOUS_RESIZE') : 'Synchronous resize';
        options.columnPicker = options.columnPicker || {};
        options.columnPicker.forceFitTitle = options.columnPicker.forceFitTitle || forceFitTitle;
        options.columnPicker.syncResizeTitle = options.columnPicker.syncResizeTitle || syncResizeTitle;
        this.columnPickerControl = new Slick.Controls.ColumnPicker(columnDefinitions, grid, options);
        if (grid && options.enableColumnPicker) {
            this.columnPickerControl.onColumnsChanged.subscribe(function (e, args) {
                if (options.columnPicker && typeof options.columnPicker.onColumnsChanged === 'function') {
                    options.columnPicker.onColumnsChanged(e, args);
                }
            });
        }
    };
    /**
     * Create (or re-create) Grid Menu and expose all the available hooks that user can subscribe (onCommand, onMenuClose, ...)
     * @param grid
     * @param columnDefinitions
     * @param options
     */
    ControlAndPluginService.prototype.createGridMenu = function (grid, columnDefinitions, options) {
        options.gridMenu = __assign({}, this.getDefaultGridMenuOptions(), options.gridMenu);
        this.addGridMenuCustomCommands(grid, options);
        var gridMenuControl = new Slick.Controls.GridMenu(columnDefinitions, grid, options);
        if (grid && options.gridMenu) {
            gridMenuControl.onBeforeMenuShow.subscribe(function (e, args) {
                if (options.gridMenu && typeof options.gridMenu.onBeforeMenuShow === 'function') {
                    options.gridMenu.onBeforeMenuShow(e, args);
                }
            });
            gridMenuControl.onColumnsChanged.subscribe(function (e, args) {
                if (options.gridMenu && typeof options.gridMenu.onColumnsChanged === 'function') {
                    options.gridMenu.onColumnsChanged(e, args);
                }
            });
            gridMenuControl.onCommand.subscribe(function (e, args) {
                if (options.gridMenu && typeof options.gridMenu.onCommand === 'function') {
                    options.gridMenu.onCommand(e, args);
                }
            });
            gridMenuControl.onMenuClose.subscribe(function (e, args) {
                if (options.gridMenu && typeof options.gridMenu.onMenuClose === 'function') {
                    options.gridMenu.onMenuClose(e, args);
                }
                // we also want to resize the columns if the user decided to hide certain column(s)
                if (grid && typeof grid.autosizeColumns === 'function') {
                    // make sure that the grid still exist (by looking if the Grid UID is found in the DOM tree)
                    var gridUid = grid.getUID();
                    if (gridUid && $("." + gridUid).length > 0) {
                        grid.autosizeColumns();
                    }
                }
            });
        }
        return gridMenuControl;
    };
    /**
     * Create the Header Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...)
     * @param grid
     * @param columnDefinitions
     * @param options
     */
    ControlAndPluginService.prototype.createHeaderMenu = function (grid, dataView, columnDefinitions, options) {
        options.headerMenu = __assign({}, this.getDefaultHeaderMenuOptions(), options.headerMenu);
        if (options.enableHeaderMenu) {
            options.headerMenu = this.addHeaderMenuCustomCommands(grid, dataView, options, columnDefinitions);
        }
        var headerMenuPlugin = new Slick.Plugins.HeaderMenu(options.headerMenu);
        grid.registerPlugin(headerMenuPlugin);
        headerMenuPlugin.onCommand.subscribe(function (e, args) {
            if (options.headerMenu && typeof options.headerMenu.onCommand === 'function') {
                options.headerMenu.onCommand(e, args);
            }
        });
        headerMenuPlugin.onCommand.subscribe(function (e, args) {
            if (options.headerMenu && typeof options.headerMenu.onBeforeMenuShow === 'function') {
                options.headerMenu.onBeforeMenuShow(e, args);
            }
        });
        return headerMenuPlugin;
    };
    /** Create an undo redo buffer used by the Excel like copy */
    ControlAndPluginService.prototype.createUndoRedoBuffer = function () {
        var commandQueue = [];
        var commandCtr = 0;
        this.undoRedoBuffer = {
            queueAndExecuteCommand: function (editCommand) {
                commandQueue[commandCtr] = editCommand;
                commandCtr++;
                editCommand.execute();
            },
            undo: function () {
                if (commandCtr === 0) {
                    return;
                }
                commandCtr--;
                var command = commandQueue[commandCtr];
                if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                    command.undo();
                }
            },
            redo: function () {
                if (commandCtr >= commandQueue.length) {
                    return;
                }
                var command = commandQueue[commandCtr];
                commandCtr++;
                if (command && Slick.GlobalEditorLock.cancelCurrentEdit()) {
                    command.execute();
                }
            }
        };
    };
    /** Hide a column from the grid */
    ControlAndPluginService.prototype.hideColumn = function (column) {
        if (this._grid && this.visibleColumns) {
            var columnIndex = this._grid.getColumnIndex(column.id);
            this.visibleColumns = this.removeColumnByIndex(this.visibleColumns, columnIndex);
            this._grid.setColumns(this.visibleColumns);
        }
    };
    /** Attach an undo shortcut key hook that will redo/undo the copy buffer */
    ControlAndPluginService.prototype.hookUndoShortcutKey = function () {
        var _this = this;
        // undo shortcut
        $(document).keydown(function (e) {
            if (e.which === 90 && (e.ctrlKey || e.metaKey)) {
                if (e.shiftKey) {
                    _this.undoRedoBuffer.redo();
                }
                else {
                    _this.undoRedoBuffer.undo();
                }
            }
        });
    };
    ControlAndPluginService.prototype.dispose = function () {
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
    };
    /**
     * Create Grid Menu with Custom Commands if user has enabled Filters and/or uses a Backend Service (OData, GraphQL)
     * @param grid
     * @param options
     */
    ControlAndPluginService.prototype.addGridMenuCustomCommands = function (grid, options) {
        var _this = this;
        var backendApi = options.backendServiceApi || options.onBackendEventApi || null;
        if (options && options.enableFiltering) {
            // show grid menu: clear all filters
            if (options && options.gridMenu && options.gridMenu.showClearAllFiltersCommand && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'clear-filter'; }).length === 0) {
                options.gridMenu.customItems.push({
                    iconCssClass: options.gridMenu.iconClearAllFiltersCommand || 'fa fa-filter text-danger',
                    title: options.enableTranslate ? this.i18n.tr('CLEAR_ALL_FILTERS') : 'Clear All Filters',
                    disabled: false,
                    command: 'clear-filter',
                    positionOrder: 50
                });
            }
            // show grid menu: toggle filter row
            if (options && options.gridMenu && options.gridMenu.showToggleFilterCommand && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'toggle-filter'; }).length === 0) {
                options.gridMenu.customItems.push({
                    iconCssClass: options.gridMenu.iconToggleFilterCommand || 'fa fa-random',
                    title: options.enableTranslate ? this.i18n.tr('TOGGLE_FILTER_ROW') : 'Toggle Filter Row',
                    disabled: false,
                    command: 'toggle-filter',
                    positionOrder: 52
                });
            }
            // show grid menu: refresh dataset
            if (options && options.gridMenu && options.gridMenu.showRefreshDatasetCommand && backendApi && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'refresh-dataset'; }).length === 0) {
                options.gridMenu.customItems.push({
                    iconCssClass: options.gridMenu.iconRefreshDatasetCommand || 'fa fa-refresh',
                    title: options.enableTranslate ? this.i18n.tr('REFRESH_DATASET') : 'Refresh Dataset',
                    disabled: false,
                    command: 'refresh-dataset',
                    positionOrder: 54
                });
            }
        }
        if (options.enableSorting) {
            // show grid menu: clear all sorting
            if (options && options.gridMenu && options.gridMenu.showClearAllSortingCommand && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'clear-sorting'; }).length === 0) {
                options.gridMenu.customItems.push({
                    iconCssClass: options.gridMenu.iconClearAllSortingCommand || 'fa fa-unsorted text-danger',
                    title: options.enableTranslate ? this.i18n.tr('CLEAR_ALL_SORTING') : 'Clear All Sorting',
                    disabled: false,
                    command: 'clear-sorting',
                    positionOrder: 51
                });
            }
        }
        // show grid menu: export to file
        if (options && options.enableExport && options.gridMenu && options.gridMenu.showExportCsvCommand && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'export-csv'; }).length === 0) {
            options.gridMenu.customItems.push({
                iconCssClass: options.gridMenu.iconExportCsvCommand || 'fa fa-download',
                title: options.enableTranslate ? this.i18n.tr('EXPORT_TO_CSV') : 'Export in CSV format',
                disabled: false,
                command: 'export-csv',
                positionOrder: 53
            });
        }
        // show grid menu: export to text file as tab delimited
        if (options && options.enableExport && options.gridMenu && options.gridMenu.showExportTextDelimitedCommand && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'export-text-delimited'; }).length === 0) {
            options.gridMenu.customItems.push({
                iconCssClass: options.gridMenu.iconExportTextDelimitedCommand || 'fa fa-download',
                title: options.enableTranslate ? this.i18n.tr('EXPORT_TO_TAB_DELIMITED') : 'Export in Text format (Tab delimited)',
                disabled: false,
                command: 'export-text-delimited',
                positionOrder: 54
            });
        }
        // Command callback, what will be executed after command is clicked
        if (options && options.gridMenu && Array.isArray(options.gridMenu.customItems) && options.gridMenu.customItems.length > 0) {
            options.gridMenu.onCommand = function (e, args) {
                if (args && args.command) {
                    switch (args.command) {
                        case 'clear-filter':
                            _this.filterService.clearFilters();
                            _this._dataView.refresh();
                            break;
                        case 'clear-sorting':
                            _this.sortService.clearSorting();
                            _this._dataView.refresh();
                            break;
                        case 'export-csv':
                            _this.exportService.exportToFile({
                                delimiter: index_1.DelimiterType.comma,
                                filename: 'export',
                                format: index_1.FileType.csv,
                                useUtf8WithBom: true
                            });
                            break;
                        case 'export-text-delimited':
                            _this.exportService.exportToFile({
                                delimiter: index_1.DelimiterType.tab,
                                filename: 'export',
                                format: index_1.FileType.txt,
                                useUtf8WithBom: true
                            });
                            break;
                        case 'toggle-filter':
                            grid.setHeaderRowVisibility(!grid.getOptions().showHeaderRow);
                            break;
                        case 'toggle-toppanel':
                            grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
                            break;
                        case 'refresh-dataset':
                            _this.refreshBackendDataset();
                            break;
                        default:
                            alert('Command: ' + args.command);
                            break;
                    }
                }
            };
        }
        // add the custom "Commands" title if there are any commands
        if (options && options.gridMenu && options.gridMenu.customItems && options.gridMenu.customItems.length > 0) {
            var customTitle = options.enableTranslate ? this.i18n.tr('COMMANDS') : 'Commands';
            options.gridMenu.customTitle = options.gridMenu.customTitle || customTitle;
            // sort the custom items by their position in the list
            options.gridMenu.customItems.sort(function (itemA, itemB) {
                if (itemA && itemB && itemA.hasOwnProperty('positionOrder') && itemB.hasOwnProperty('positionOrder')) {
                    return (itemA.positionOrder || 0) - (itemB.positionOrder || 0);
                }
                return 0;
            });
        }
    };
    /** Call a refresh dataset with a BackendServiceApi */
    ControlAndPluginService.prototype.refreshBackendDataset = function () {
        var query;
        var backendApi = this._gridOptions.backendServiceApi || this._gridOptions.onBackendEventApi;
        if (!backendApi || !backendApi.service || !backendApi.process) {
            throw new Error("BackendServiceApi requires at least a \"process\" function and a \"service\" defined");
        }
        if (backendApi.service) {
            query = backendApi.service.buildQuery();
        }
        if (query && query !== '') {
            if (backendApi.preProcess) {
                backendApi.preProcess();
            }
            // execute the process promise
            var processPromise = backendApi.process(query);
            processPromise.then(function (processResult) {
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
    };
    /** Remove a column from the grid by it's index in the grid */
    ControlAndPluginService.prototype.removeColumnByIndex = function (array, index) {
        return array.filter(function (el, i) {
            return index !== i;
        });
    };
    /**
     * Translate the Column Picker and it's last 2 checkboxes
     * Note that the only way that seems to work is to destroy and re-create the Column Picker
     * Changing only the columnPicker.columnTitle with i18n translate was not enough.
     */
    ControlAndPluginService.prototype.translateColumnPicker = function () {
        // destroy and re-create the Column Picker which seems to be the only way to translate properly
        if (this.columnPickerControl) {
            this.columnPickerControl.destroy();
            this.columnPickerControl = null;
        }
        this._gridOptions.columnPicker = undefined;
        this.createColumnPicker(this._grid, this.visibleColumns, this._gridOptions);
    };
    /**
     * Translate the Grid Menu ColumnTitle and CustomTitle.
     * Note that the only way that seems to work is to destroy and re-create the Grid Menu
     * Changing only the gridMenu.columnTitle with i18n translate was not enough.
     */
    ControlAndPluginService.prototype.translateGridMenu = function () {
        // destroy and re-create the Grid Menu which seems to be the only way to translate properly
        this.gridMenuControl.destroy();
        // reset all Grid Menu options that have translation text & then re-create the Grid Menu and also the custom items array
        if (this._gridOptions && this._gridOptions.gridMenu) {
            this._gridOptions.gridMenu = this.resetGridMenuTranslations(this._gridOptions.gridMenu);
        }
        this.createGridMenu(this._grid, this.visibleColumns, this._gridOptions);
    };
    /**
     * Translate the Header Menu titles, we need to loop through all column definition to re-translate them
     */
    ControlAndPluginService.prototype.translateHeaderMenu = function () {
        // reset all Grid Menu options that have translation text & then re-create the Grid Menu and also the custom items array
        if (this._gridOptions && this._gridOptions.headerMenu) {
            this.resetHeaderMenuTranslations(this.visibleColumns);
        }
    };
    /**
     * Translate manually the header titles.
     * We could optionally pass a locale (that will change currently loaded locale), else it will use current locale
     * @param locale to use
     */
    ControlAndPluginService.prototype.translateHeaders = function (locale) {
        if (locale) {
            this.i18n.setLocale(locale);
        }
        for (var _i = 0, _a = this._columnDefinitions; _i < _a.length; _i++) {
            var column = _a[_i];
            if (column.headerKey) {
                column.name = this.i18n.tr(column.headerKey);
            }
        }
        // calling setColumns() will trigger a grid re-render
        this._grid.setColumns(this._columnDefinitions);
    };
    /**
     * Create Header Menu with Custom Commands if user has enabled Header Menu
     * @param grid
     * @param dataView
     * @param options
     * @param columnDefinitions
     * @return header menu
     */
    ControlAndPluginService.prototype.addHeaderMenuCustomCommands = function (grid, dataView, options, columnDefinitions) {
        var _this = this;
        var headerMenuOptions = options.headerMenu;
        if (columnDefinitions && Array.isArray(columnDefinitions) && options.enableHeaderMenu) {
            columnDefinitions.forEach(function (columnDef) {
                if (columnDef) {
                    if (!columnDef.header || !columnDef.header.menu) {
                        columnDef.header = {
                            menu: {
                                items: []
                            }
                        };
                    }
                    if (columnDef && columnDef.header && columnDef.header.menu) {
                        var columnHeaderMenuItems = columnDef.header.menu.items || [];
                        // Sorting Commands
                        if (options.enableSorting && columnDef.sortable && headerMenuOptions && headerMenuOptions.showSortCommands) {
                            if (columnHeaderMenuItems.filter(function (item) { return item.command === 'sort-asc'; }).length === 0) {
                                columnHeaderMenuItems.push({
                                    iconCssClass: headerMenuOptions.iconSortAscCommand || 'fa fa-sort-asc',
                                    title: options.enableTranslate ? _this.i18n.tr('SORT_ASCENDING') : 'Sort Ascending',
                                    command: 'sort-asc'
                                });
                            }
                            if (columnHeaderMenuItems.filter(function (item) { return item.command === 'sort-desc'; }).length === 0) {
                                columnHeaderMenuItems.push({
                                    iconCssClass: headerMenuOptions.iconSortDescCommand || 'fa fa-sort-desc',
                                    title: options.enableTranslate ? _this.i18n.tr('SORT_DESCENDING') : 'Sort Descending',
                                    command: 'sort-desc'
                                });
                            }
                        }
                        // Hide Column Command
                        if (headerMenuOptions && headerMenuOptions.showColumnHideCommand && columnHeaderMenuItems.filter(function (item) { return item.command === 'hide'; }).length === 0) {
                            columnHeaderMenuItems.push({
                                iconCssClass: headerMenuOptions.iconColumnHideCommand || 'fa fa-times',
                                title: options.enableTranslate ? _this.i18n.tr('HIDE_COLUMN') : 'Hide Column',
                                command: 'hide'
                            });
                        }
                    }
                }
            });
            // Command callback, what will be executed after command is clicked
            if (headerMenuOptions) {
                headerMenuOptions.onCommand = function (e, args) {
                    if (args && args.command) {
                        switch (args.command) {
                            case 'hide':
                                _this.hideColumn(args.column);
                                _this.autoResizeColumns();
                                break;
                            case 'sort-asc':
                            case 'sort-desc':
                                // get previously sorted columns
                                var cols = _this.sortService.getPreviousColumnSorts(args.column.id + '');
                                // add to the column array, the column sorted by the header menu
                                cols.push({ sortCol: args.column, sortAsc: (args.command === 'sort-asc') });
                                if (options.backendServiceApi) {
                                    _this.sortService.onBackendSortChanged(e, { multiColumnSort: true, sortCols: cols, grid: grid });
                                }
                                else {
                                    _this.sortService.onLocalSortChanged(grid, options, dataView, cols);
                                }
                                // update the this.gridObj sortColumns array which will at the same add the visual sort icon(s) on the UI
                                var newSortColumns = cols.map(function (col) {
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
    };
    /**
     * @return default Grid Menu options
     */
    ControlAndPluginService.prototype.getDefaultGridMenuOptions = function () {
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
    };
    /**
     * @return default Header Menu options
     */
    ControlAndPluginService.prototype.getDefaultHeaderMenuOptions = function () {
        return {
            autoAlignOffset: 12,
            minWidth: 140,
            showColumnHideCommand: true,
            showSortCommands: true
        };
    };
    /**
     * Reset all the Grid Menu options which have text to translate
     * @param grid menu object
     */
    ControlAndPluginService.prototype.resetGridMenuTranslations = function (gridMenu) {
        // we will reset the custom items array since the commands title have to be translated too (no worries, we will re-create it later)
        gridMenu.customItems = [];
        delete gridMenu.customTitle;
        gridMenu.columnTitle = this.i18n.tr('COLUMNS') || 'Columns';
        gridMenu.forceFitTitle = this.i18n.tr('FORCE_FIT_COLUMNS') || 'Force fit columns';
        gridMenu.syncResizeTitle = this.i18n.tr('SYNCHRONOUS_RESIZE') || 'Synchronous resize';
        return gridMenu;
    };
    /**
     * Reset all the Grid Menu options which have text to translate
     * @param grid menu object
     */
    ControlAndPluginService.prototype.resetHeaderMenuTranslations = function (columnDefinitions) {
        var _this = this;
        columnDefinitions.forEach(function (columnDef) {
            if (columnDef && columnDef.header && columnDef.header && columnDef.header.menu && columnDef.header.menu.items) {
                var columnHeaderMenuItems = columnDef.header.menu.items || [];
                columnHeaderMenuItems.forEach(function (item) {
                    switch (item.command) {
                        case 'sort-asc':
                            item.title = _this.i18n.tr('SORT_ASCENDING') || 'Sort Ascending';
                            break;
                        case 'sort-desc':
                            item.title = _this.i18n.tr('SORT_DESCENDING') || 'Sort Ascending';
                            break;
                        case 'hide':
                            item.title = _this.i18n.tr('HIDE_COLUMN') || 'Sort Ascending';
                            break;
                    }
                });
            }
        });
    };
    ControlAndPluginService = __decorate([
        aurelia_framework_1.inject(export_service_1.ExportService, filter_service_1.FilterService, aurelia_i18n_1.I18N, sort_service_1.SortService)
    ], ControlAndPluginService);
    return ControlAndPluginService;
}());
exports.ControlAndPluginService = ControlAndPluginService;
//# sourceMappingURL=controlAndPlugin.service.js.map