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
import { singleton, inject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
import { Constants } from '../constants';
import { DelimiterType, FileType, } from './../models/index';
import { ExportService } from './export.service';
import { FilterService } from './filter.service';
import { SortService } from './sort.service';
import { sanitizeHtmlToText } from './../services/utilities';
import * as $ from 'jquery';
var ControlAndPluginService = /** @class */ (function () {
    function ControlAndPluginService(exportService, filterService, i18n, sortService) {
        this.exportService = exportService;
        this.filterService = filterService;
        this.i18n = i18n;
        this.sortService = sortService;
        this.areVisibleColumnDifferent = false;
        this.extensionList = [];
    }
    Object.defineProperty(ControlAndPluginService.prototype, "_gridOptions", {
        /** Getter for the Grid Options pulled through the Grid Object */
        get: function () {
            return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
        },
        /** Setter for the Grid Options pulled through the Grid Object */
        set: function (gridOptions) {
            this._gridOptions = gridOptions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControlAndPluginService.prototype, "_columnDefinitions", {
        /** Getter for the Column Definitions pulled through the Grid Object */
        get: function () {
            return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
        },
        enumerable: true,
        configurable: true
    });
    /** Get all columns (includes visible and non-visible) */
    ControlAndPluginService.prototype.getAllColumns = function () {
        return this.allColumns || [];
    };
    /** Get only visible columns */
    ControlAndPluginService.prototype.getVisibleColumns = function () {
        return this.visibleColumns || [];
    };
    /** Get all Extensions */
    ControlAndPluginService.prototype.getAllExtensions = function () {
        return this.extensionList;
    };
    /**
     * Get an Extension by it's name
     *  @param name
     */
    ControlAndPluginService.prototype.getExtensionByName = function (name) {
        return this.extensionList.find(function (p) { return p.name === name; });
    };
    /** Auto-resize all the column in the grid to fit the grid width */
    ControlAndPluginService.prototype.autoResizeColumns = function () {
        this._grid.autosizeColumns();
    };
    /**
     * Attach/Create different Controls or Plugins after the Grid is created
     * @param grid
     * @param dataView
     * @param groupItemMetadataProvider
     */
    ControlAndPluginService.prototype.attachDifferentControlOrPlugins = function (grid, dataView, groupItemMetadataProvider) {
        var _this = this;
        this._grid = grid;
        this._dataView = dataView;
        this.allColumns = this._columnDefinitions;
        this.visibleColumns = this._columnDefinitions;
        // make sure all columns are translated before creating ColumnPicker/GridMenu Controls
        // this is to avoid having hidden columns not being translated on first load
        if (this._gridOptions.enableTranslate) {
            this.translateItems(this.allColumns, 'headerKey', 'name');
        }
        // Column Picker Control
        if (this._gridOptions.enableColumnPicker) {
            this.columnPickerControl = this.createColumnPicker(this._grid, this._columnDefinitions);
            this.extensionList.push({ name: 'ColumnPicker', service: this.columnPickerControl });
        }
        // Grid Menu Control
        if (this._gridOptions.enableGridMenu) {
            // keep original user grid menu, useful when switching locale to translate
            this.userOriginalGridMenu = __assign({}, this._gridOptions.gridMenu);
            this.gridMenuControl = this.createGridMenu(this._grid, this._columnDefinitions);
            this.extensionList.push({ name: 'GridMenu', service: this.gridMenuControl });
        }
        // Auto Tooltip Plugin
        if (this._gridOptions.enableAutoTooltip) {
            this.autoTooltipPlugin = new Slick.AutoTooltips(this._gridOptions.autoTooltipOptions || {});
            this._grid.registerPlugin(this.autoTooltipPlugin);
            this.extensionList.push({ name: 'AutoTooltip', service: this.autoTooltipPlugin });
        }
        // Grouping Plugin
        // register the group item metadata provider to add expand/collapse group handlers
        if (this._gridOptions.enableGrouping) {
            this.groupItemMetaProviderPlugin = groupItemMetadataProvider || {};
            this._grid.registerPlugin(this.groupItemMetaProviderPlugin);
            this.extensionList.push({ name: 'GroupItemMetaProvider', service: this.groupItemMetaProviderPlugin });
        }
        // Checkbox Selector Plugin
        if (this._gridOptions.enableCheckboxSelector) {
            // when enabling the Checkbox Selector Plugin, we need to also watch onClick events to perform certain actions
            // the selector column has to be created BEFORE the grid (else it behaves oddly), but we can only watch grid events AFTER the grid is created
            this._grid.registerPlugin(this.checkboxSelectorPlugin);
            this.extensionList.push({ name: 'CheckboxSelector', service: this.checkboxSelectorPlugin });
            // this also requires the Row Selection Model to be registered as well
            if (!this.rowSelectionPlugin || !this._grid.getSelectionModel()) {
                this.rowSelectionPlugin = new Slick.RowSelectionModel(this._gridOptions.rowSelectionOptions || {});
                this._grid.setSelectionModel(this.rowSelectionPlugin);
            }
            // user might want to pre-select some rows
            // the setTimeout is because of timing issue with styling (row selection happen but rows aren't highlighted properly)
            if (this._gridOptions.preselectedRows && this.rowSelectionPlugin && this._grid.getSelectionModel()) {
                setTimeout(function () { return _this.checkboxSelectorPlugin.selectRows(_this._gridOptions.preselectedRows); }, 0);
            }
        }
        // Row Selection Plugin
        if (!this._gridOptions.enableCheckboxSelector && this._gridOptions.enableRowSelection) {
            this.rowSelectionPlugin = new Slick.RowSelectionModel(this._gridOptions.rowSelectionOptions || {});
            this._grid.setSelectionModel(this.rowSelectionPlugin);
        }
        // Header Button Plugin
        if (this._gridOptions.enableHeaderButton) {
            this.headerButtonsPlugin = new Slick.Plugins.HeaderButtons(this._gridOptions.headerButton || {});
            this._grid.registerPlugin(this.headerButtonsPlugin);
            this.extensionList.push({ name: 'HeaderButtons', service: this.headerButtonsPlugin });
            this.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                if (_this._gridOptions.headerButton && typeof _this._gridOptions.headerButton.onCommand === 'function') {
                    _this._gridOptions.headerButton.onCommand(e, args);
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
                this._gridOptions.registerPlugins.forEach(function (plugin) {
                    _this._grid.registerPlugin(plugin);
                    _this.extensionList.push({ name: 'generic', service: plugin });
                });
            }
            else {
                this._grid.registerPlugin(this._gridOptions.registerPlugins);
                this.extensionList.push({ name: 'generic', service: this._gridOptions.registerPlugins });
            }
        }
    };
    /**
     * Attach/Create different plugins before the Grid creation.
     * For example the multi-select have to be added to the column definition before the grid is created to work properly
     * @param columnDefinitions
     * @param options
     */
    ControlAndPluginService.prototype.createCheckboxPluginBeforeGridCreation = function (columnDefinitions, options) {
        if (options.enableCheckboxSelector) {
            if (!this.checkboxSelectorPlugin) {
                this.checkboxSelectorPlugin = new Slick.CheckboxSelectColumn(options.checkboxSelector || {});
            }
            var selectionColumn = this.checkboxSelectorPlugin.getColumnDefinition();
            selectionColumn.excludeFromExport = true;
            selectionColumn.excludeFromQuery = true;
            selectionColumn.excludeFromHeaderMenu = true;
            columnDefinitions.unshift(selectionColumn);
        }
    };
    /** Create the Excel like copy manager */
    ControlAndPluginService.prototype.createCellExternalCopyManagerPlugin = function (grid) {
        var _this = this;
        var newRowIds = 0;
        var pluginOptions = {
            clipboardCommandHandler: function (editCommand) {
                _this.undoRedoBuffer.queueAndExecuteCommand.call(_this.undoRedoBuffer, editCommand);
            },
            dataItemColumnValueExtractor: function (item, columnDef) {
                // when grid or cell is not editable, we will possibly evaluate the Formatter if it was passed
                // to decide if we evaluate the Formatter, we will use the same flag from Export which is "exportWithFormatter"
                if (!_this._gridOptions.editable || !columnDef.editor) {
                    var isEvaluatingFormatter = (columnDef.exportWithFormatter !== undefined) ? columnDef.exportWithFormatter : (_this._gridOptions.exportOptions && _this._gridOptions.exportOptions.exportWithFormatter);
                    if (columnDef.formatter && isEvaluatingFormatter) {
                        var formattedOutput = columnDef.formatter(0, 0, item[columnDef.field], columnDef, item, _this._grid);
                        if (columnDef.sanitizeDataExport || (_this._gridOptions.exportOptions && _this._gridOptions.exportOptions.sanitizeDataExport)) {
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
        this.cellExternalCopyManagerPlugin = new Slick.CellExternalCopyManager(pluginOptions);
        grid.registerPlugin(this.cellExternalCopyManagerPlugin);
        this.extensionList.push({ name: 'CellExternalCopyManager', service: this.cellExternalCopyManagerPlugin });
    };
    /**
     * Create the Column Picker and expose all the available hooks that user can subscribe (onColumnsChanged)
     * @param grid
     * @param columnDefinitions
     */
    ControlAndPluginService.prototype.createColumnPicker = function (grid, columnDefinitions) {
        var _this = this;
        // localization support for the picker
        var columnTitle = this.getPickerTitleOutputString('columnTitle', 'columnPicker');
        var forceFitTitle = this.getPickerTitleOutputString('forceFitTitle', 'columnPicker');
        var syncResizeTitle = this.getPickerTitleOutputString('syncResizeTitle', 'columnPicker');
        this._gridOptions.columnPicker = this._gridOptions.columnPicker || {};
        this._gridOptions.columnPicker.columnTitle = this._gridOptions.columnPicker.columnTitle || columnTitle;
        this._gridOptions.columnPicker.forceFitTitle = this._gridOptions.columnPicker.forceFitTitle || forceFitTitle;
        this._gridOptions.columnPicker.syncResizeTitle = this._gridOptions.columnPicker.syncResizeTitle || syncResizeTitle;
        this.columnPickerControl = new Slick.Controls.ColumnPicker(columnDefinitions, grid, this._gridOptions);
        if (grid && this._gridOptions.enableColumnPicker) {
            this.columnPickerControl.onColumnsChanged.subscribe(function (e, args) {
                if (_this._gridOptions.columnPicker && typeof _this._gridOptions.columnPicker.onColumnsChanged === 'function') {
                    _this._gridOptions.columnPicker.onColumnsChanged(e, args);
                }
            });
        }
        return this.columnPickerControl;
    };
    /**
     * Create (or re-create) Grid Menu and expose all the available hooks that user can subscribe (onCommand, onMenuClose, ...)
     * @param grid
     * @param columnDefinitions
     */
    ControlAndPluginService.prototype.createGridMenu = function (grid, columnDefinitions) {
        var _this = this;
        if (this._gridOptions && this._gridOptions.gridMenu) {
            this._gridOptions.gridMenu = __assign({}, this.getDefaultGridMenuOptions(), this._gridOptions.gridMenu);
            // merge original user grid menu items with internal items
            // then sort all Grid Menu Custom Items (sorted by pointer, no need to use the return)
            this._gridOptions.gridMenu.customItems = (this.userOriginalGridMenu.customItems || []).concat(this.addGridMenuCustomCommands());
            this.translateItems(this._gridOptions.gridMenu.customItems, 'titleKey', 'title');
            this.sortItems(this._gridOptions.gridMenu.customItems, 'positionOrder');
            var gridMenuControl = new Slick.Controls.GridMenu(columnDefinitions, grid, this._gridOptions);
            if (grid && this._gridOptions.gridMenu) {
                gridMenuControl.onBeforeMenuShow.subscribe(function (e, args) {
                    if (_this._gridOptions.gridMenu && typeof _this._gridOptions.gridMenu.onBeforeMenuShow === 'function') {
                        _this._gridOptions.gridMenu.onBeforeMenuShow(e, args);
                    }
                });
                gridMenuControl.onColumnsChanged.subscribe(function (e, args) {
                    _this.areVisibleColumnDifferent = true;
                    if (_this._gridOptions.gridMenu && typeof _this._gridOptions.gridMenu.onColumnsChanged === 'function') {
                        _this._gridOptions.gridMenu.onColumnsChanged(e, args);
                    }
                });
                gridMenuControl.onCommand.subscribe(function (e, args) {
                    _this.executeGridMenuInternalCustomCommands(e, args);
                    if (_this._gridOptions.gridMenu && typeof _this._gridOptions.gridMenu.onCommand === 'function') {
                        _this._gridOptions.gridMenu.onCommand(e, args);
                    }
                });
                gridMenuControl.onMenuClose.subscribe(function (e, args) {
                    if (_this._gridOptions.gridMenu && typeof _this._gridOptions.gridMenu.onMenuClose === 'function') {
                        _this._gridOptions.gridMenu.onMenuClose(e, args);
                    }
                    // we also want to resize the columns if the user decided to hide certain column(s)
                    if (grid && typeof grid.autosizeColumns === 'function') {
                        // make sure that the grid still exist (by looking if the Grid UID is found in the DOM tree)
                        var gridUid = grid.getUID();
                        if (_this.areVisibleColumnDifferent && gridUid && $("." + gridUid).length > 0) {
                            if (_this._gridOptions && _this._gridOptions.enableAutoSizeColumns) {
                                grid.autosizeColumns();
                            }
                            _this.areVisibleColumnDifferent = false;
                        }
                    }
                });
            }
            return gridMenuControl;
        }
        return null;
    };
    /**
     * Create the Header Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...)
     * @param grid
     * @param dataView
     * @param columnDefinitions
     */
    ControlAndPluginService.prototype.createHeaderMenu = function (grid, dataView, columnDefinitions) {
        var _this = this;
        this._gridOptions.headerMenu = __assign({}, this.getDefaultHeaderMenuOptions(), this._gridOptions.headerMenu);
        if (this._gridOptions.enableHeaderMenu) {
            this._gridOptions.headerMenu = this.addHeaderMenuCustomCommands(this._gridOptions, columnDefinitions);
        }
        var headerMenuPlugin = new Slick.Plugins.HeaderMenu(this._gridOptions.headerMenu);
        grid.registerPlugin(headerMenuPlugin);
        headerMenuPlugin.onCommand.subscribe(function (e, args) {
            _this.executeHeaderMenuInternalCommands(e, args);
            if (_this._gridOptions.headerMenu && typeof _this._gridOptions.headerMenu.onCommand === 'function') {
                _this._gridOptions.headerMenu.onCommand(e, args);
            }
        });
        headerMenuPlugin.onBeforeMenuShow.subscribe(function (e, args) {
            if (_this._gridOptions.headerMenu && typeof _this._gridOptions.headerMenu.onBeforeMenuShow === 'function') {
                _this._gridOptions.headerMenu.onBeforeMenuShow(e, args);
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
    /** Dispose of all the controls & plugins */
    ControlAndPluginService.prototype.dispose = function () {
        this._grid = null;
        this._dataView = null;
        this.visibleColumns = [];
        // dispose of each control/plugin if it has a destroy method
        this.extensionList.forEach(function (item) {
            if (item && item.service && item.service.destroy) {
                item.service.destroy();
            }
        });
        this.extensionList = [];
    };
    /** Create Grid Menu with Custom Commands if user has enabled Filters and/or uses a Backend Service (OData, GraphQL) */
    ControlAndPluginService.prototype.addGridMenuCustomCommands = function () {
        var backendApi = this._gridOptions.backendServiceApi || null;
        var gridMenuCustomItems = [];
        if (this._gridOptions && this._gridOptions.enableFiltering) {
            // show grid menu: clear all filters
            if (this._gridOptions && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideClearAllFiltersCommand) {
                gridMenuCustomItems.push({
                    iconCssClass: this._gridOptions.gridMenu.iconClearAllFiltersCommand || 'fa fa-filter text-danger',
                    title: this._gridOptions.enableTranslate ? this.i18n.tr('CLEAR_ALL_FILTERS') : Constants.TEXT_CLEAR_ALL_FILTERS,
                    disabled: false,
                    command: 'clear-filter',
                    positionOrder: 50
                });
            }
            // show grid menu: toggle filter row
            if (this._gridOptions && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideToggleFilterCommand) {
                gridMenuCustomItems.push({
                    iconCssClass: this._gridOptions.gridMenu.iconToggleFilterCommand || 'fa fa-random',
                    title: this._gridOptions.enableTranslate ? this.i18n.tr('TOGGLE_FILTER_ROW') : Constants.TEXT_TOGGLE_FILTER_ROW,
                    disabled: false,
                    command: 'toggle-filter',
                    positionOrder: 52
                });
            }
            // show grid menu: refresh dataset
            if (this._gridOptions && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideRefreshDatasetCommand && backendApi) {
                gridMenuCustomItems.push({
                    iconCssClass: this._gridOptions.gridMenu.iconRefreshDatasetCommand || 'fa fa-refresh',
                    title: this._gridOptions.enableTranslate ? this.i18n.tr('REFRESH_DATASET') : Constants.TEXT_REFRESH_DATASET,
                    disabled: false,
                    command: 'refresh-dataset',
                    positionOrder: 54
                });
            }
        }
        if (this._gridOptions.enableSorting) {
            // show grid menu: clear all sorting
            if (this._gridOptions && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideClearAllSortingCommand) {
                gridMenuCustomItems.push({
                    iconCssClass: this._gridOptions.gridMenu.iconClearAllSortingCommand || 'fa fa-unsorted text-danger',
                    title: this._gridOptions.enableTranslate ? this.i18n.tr('CLEAR_ALL_SORTING') : Constants.TEXT_CLEAR_ALL_SORTING,
                    disabled: false,
                    command: 'clear-sorting',
                    positionOrder: 51
                });
            }
        }
        // show grid menu: export to file
        if (this._gridOptions && this._gridOptions.enableExport && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideExportCsvCommand) {
            gridMenuCustomItems.push({
                iconCssClass: this._gridOptions.gridMenu.iconExportCsvCommand || 'fa fa-download',
                title: this._gridOptions.enableTranslate ? this.i18n.tr('EXPORT_TO_CSV') : Constants.TEXT_EXPORT_IN_CSV_FORMAT,
                disabled: false,
                command: 'export-csv',
                positionOrder: 53
            });
        }
        // show grid menu: export to text file as tab delimited
        if (this._gridOptions && this._gridOptions.enableExport && this._gridOptions.gridMenu && !this._gridOptions.gridMenu.hideExportTextDelimitedCommand) {
            gridMenuCustomItems.push({
                iconCssClass: this._gridOptions.gridMenu.iconExportTextDelimitedCommand || 'fa fa-download',
                title: this._gridOptions.enableTranslate ? this.i18n.tr('EXPORT_TO_TAB_DELIMITED') : Constants.TEXT_EXPORT_IN_TEXT_FORMAT,
                disabled: false,
                command: 'export-text-delimited',
                positionOrder: 54
            });
        }
        // add the custom "Commands" title if there are any commands
        if (this._gridOptions && this._gridOptions.gridMenu && (gridMenuCustomItems.length > 0 || (this._gridOptions.gridMenu.customItems && this._gridOptions.gridMenu.customItems.length > 0))) {
            this._gridOptions.gridMenu.customTitle = this._gridOptions.gridMenu.customTitle || this.getPickerTitleOutputString('customTitle', 'gridMenu');
        }
        return gridMenuCustomItems;
    };
    /**
     * Create Header Menu with Custom Commands if user has enabled Header Menu
     * @param options
     * @param columnDefinitions
     * @return header menu
     */
    ControlAndPluginService.prototype.addHeaderMenuCustomCommands = function (options, columnDefinitions) {
        var _this = this;
        var headerMenuOptions = options.headerMenu;
        if (columnDefinitions && Array.isArray(columnDefinitions) && options.enableHeaderMenu) {
            columnDefinitions.forEach(function (columnDef) {
                if (columnDef && !columnDef.excludeFromHeaderMenu) {
                    if (!columnDef.header || !columnDef.header.menu) {
                        columnDef.header = {
                            menu: {
                                items: []
                            }
                        };
                    }
                    var columnHeaderMenuItems = (columnDef && columnDef.header && columnDef.header.menu && columnDef.header.menu.items) || [];
                    // Sorting Commands
                    if (options.enableSorting && columnDef.sortable && headerMenuOptions && !headerMenuOptions.hideSortCommands) {
                        if (columnHeaderMenuItems.filter(function (item) { return item.command === 'sort-asc'; }).length === 0) {
                            columnHeaderMenuItems.push({
                                iconCssClass: (headerMenuOptions && headerMenuOptions.iconSortAscCommand) || 'fa fa-sort-asc',
                                title: options.enableTranslate ? _this.i18n.tr('SORT_ASCENDING') : Constants.TEXT_SORT_ASCENDING,
                                command: 'sort-asc',
                                positionOrder: 50
                            });
                        }
                        if (columnHeaderMenuItems.filter(function (item) { return item.command === 'sort-desc'; }).length === 0) {
                            columnHeaderMenuItems.push({
                                iconCssClass: (headerMenuOptions && headerMenuOptions.iconSortDescCommand) || 'fa fa-sort-desc',
                                title: options.enableTranslate ? _this.i18n.tr('SORT_DESCENDING') : Constants.TEXT_SORT_DESCENDING,
                                command: 'sort-desc',
                                positionOrder: 51
                            });
                        }
                    }
                    // Hide Column Command
                    if (headerMenuOptions && !headerMenuOptions.hideColumnHideCommand && columnHeaderMenuItems.filter(function (item) { return item.command === 'hide'; }).length === 0) {
                        columnHeaderMenuItems.push({
                            iconCssClass: headerMenuOptions.iconColumnHideCommand || 'fa fa-times',
                            title: options.enableTranslate ? _this.i18n.tr('HIDE_COLUMN') : Constants.TEXT_HIDE_COLUMN,
                            command: 'hide',
                            positionOrder: 52
                        });
                    }
                    _this.translateItems(columnHeaderMenuItems, 'titleKey', 'title');
                    // sort the custom items by their position in the list
                    columnHeaderMenuItems.sort(function (itemA, itemB) {
                        if (itemA && itemB && itemA.hasOwnProperty('positionOrder') && itemB.hasOwnProperty('positionOrder')) {
                            return itemA.positionOrder - itemB.positionOrder;
                        }
                        return 0;
                    });
                }
            });
        }
        return headerMenuOptions;
    };
    /** Execute the Header Menu Commands that was triggered by the onCommand subscribe */
    ControlAndPluginService.prototype.executeHeaderMenuInternalCommands = function (e, args) {
        if (args && args.command) {
            switch (args.command) {
                case 'hide':
                    this.hideColumn(args.column);
                    if (this._gridOptions && this._gridOptions.enableAutoSizeColumns) {
                        this._grid.autosizeColumns();
                    }
                    break;
                case 'sort-asc':
                case 'sort-desc':
                    // get previously sorted columns
                    var cols = this.sortService.getPreviousColumnSorts(args.column.id + '');
                    // add to the column array, the column sorted by the header menu
                    cols.push({ sortCol: args.column, sortAsc: (args.command === 'sort-asc') });
                    if (this._gridOptions.backendServiceApi) {
                        this.sortService.onBackendSortChanged(e, { multiColumnSort: true, sortCols: cols, grid: this._grid });
                    }
                    else {
                        this.sortService.onLocalSortChanged(this._grid, this._dataView, cols);
                    }
                    // update the this.gridObj sortColumns array which will at the same add the visual sort icon(s) on the UI
                    var newSortColumns = cols.map(function (col) {
                        if (col && col.sortCol) {
                            return {
                                columnId: col.sortCol.id || '',
                                sortAsc: col.sortAsc || false
                            };
                        }
                        return {};
                    });
                    this._grid.setSortColumns(newSortColumns); // add sort icon in UI
                    break;
                default:
                    break;
            }
        }
    };
    /**
     * Execute the Grid Menu Custom command callback that was triggered by the onCommand subscribe
     * These are the default internal custom commands
     * @param event
     * @param GridMenuItem args
     */
    ControlAndPluginService.prototype.executeGridMenuInternalCustomCommands = function (e, args) {
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
                    this._grid.setHeaderRowVisibility(!this._grid.getOptions().showHeaderRow);
                    break;
                case 'toggle-toppanel':
                    this._grid.setTopPanelVisibility(!this._grid.getOptions().showTopPanel);
                    break;
                case 'refresh-dataset':
                    this.refreshBackendDataset();
                    break;
                default:
                    break;
            }
        }
    };
    /** Refresh the dataset through the Backend Service */
    ControlAndPluginService.prototype.refreshBackendDataset = function (gridOptions) {
        var _this = this;
        var query = '';
        // user can pass new set of grid options which will override current ones
        if (gridOptions) {
            this._gridOptions = __assign({}, this._gridOptions, gridOptions);
        }
        var backendApi = this._gridOptions.backendServiceApi;
        if (!backendApi || !backendApi.service || !backendApi.process) {
            throw new Error("BackendServiceApi requires at least a \"process\" function and a \"service\" defined");
        }
        if (backendApi.service) {
            query = backendApi.service.buildQuery();
        }
        if (query && query !== '') {
            // keep start time & end timestamps & return it after process execution
            var startTime_1 = new Date();
            if (backendApi.preProcess) {
                backendApi.preProcess();
            }
            // the process could be an Observable (like HttpClient) or a Promise
            // in any case, we need to have a Promise so that we can await on it (if an Observable, convert it to Promise)
            var processPromise = backendApi.process(query);
            processPromise.then(function (processResult) {
                var endTime = new Date();
                // from the result, call our internal post process to update the Dataset and Pagination info
                if (processResult && backendApi && backendApi.internalPostProcess) {
                    backendApi.internalPostProcess(processResult);
                }
                // send the response process to the postProcess callback
                if (backendApi && backendApi.postProcess) {
                    if (processResult instanceof Object) {
                        processResult.statistics = {
                            startTime: startTime_1,
                            endTime: endTime,
                            executionTime: endTime.valueOf() - startTime_1.valueOf(),
                            totalItemCount: _this._gridOptions && _this._gridOptions.pagination && _this._gridOptions.pagination.totalItems
                        };
                    }
                    backendApi.postProcess(processResult);
                }
            });
        }
    };
    /**
     * Remove a column from the grid by it's index in the grid
     * @param array input
     * @param index
     */
    ControlAndPluginService.prototype.removeColumnByIndex = function (array, index) {
        return array.filter(function (el, i) {
            return index !== i;
        });
    };
    /** Translate the Column Picker and it's last 2 checkboxes */
    ControlAndPluginService.prototype.translateColumnPicker = function () {
        // update the properties by pointers, that is the only way to get Grid Menu Control to see the new values
        if (this._gridOptions && this._gridOptions.columnPicker) {
            this.emptyColumnPickerTitles();
            this._gridOptions.columnPicker.columnTitle = this.getPickerTitleOutputString('columnTitle', 'columnPicker');
            this._gridOptions.columnPicker.forceFitTitle = this.getPickerTitleOutputString('forceFitTitle', 'columnPicker');
            this._gridOptions.columnPicker.syncResizeTitle = this.getPickerTitleOutputString('syncResizeTitle', 'columnPicker');
        }
        // translate all columns (including non-visible)
        this.translateItems(this.allColumns, 'headerKey', 'name');
        // re-initialize the Column Picker, that will recreate all the list
        // doing an "init()" won't drop any existing command attached
        if (this.columnPickerControl.init) {
            this.columnPickerControl.init(this._grid);
        }
    };
    /** Translate the Grid Menu titles and column picker */
    ControlAndPluginService.prototype.translateGridMenu = function () {
        // update the properties by pointers, that is the only way to get Grid Menu Control to see the new values
        // we also need to call the control init so that it takes the new Grid object with latest values
        if (this._gridOptions && this._gridOptions.gridMenu) {
            this._gridOptions.gridMenu.customItems = [];
            this.emptyGridMenuTitles();
            // merge original user grid menu items with internal items
            // then sort all Grid Menu Custom Items (sorted by pointer, no need to use the return)
            this._gridOptions.gridMenu.customItems = (this.userOriginalGridMenu.customItems || []).concat(this.addGridMenuCustomCommands());
            this.translateItems(this._gridOptions.gridMenu.customItems, 'titleKey', 'title');
            this.sortItems(this._gridOptions.gridMenu.customItems, 'positionOrder');
            this._gridOptions.gridMenu.columnTitle = this.getPickerTitleOutputString('columnTitle', 'gridMenu');
            this._gridOptions.gridMenu.forceFitTitle = this.getPickerTitleOutputString('forceFitTitle', 'gridMenu');
            this._gridOptions.gridMenu.syncResizeTitle = this.getPickerTitleOutputString('syncResizeTitle', 'gridMenu');
            // translate all columns (including non-visible)
            this.translateItems(this.allColumns, 'headerKey', 'name');
            // re-initialize the Grid Menu, that will recreate all the menus & list
            // doing an "init()" won't drop any existing command attached
            if (this.gridMenuControl.init) {
                this.gridMenuControl.init(this._grid);
            }
        }
    };
    /**
     * Translate the Header Menu titles, we need to loop through all column definition to re-translate them
     */
    ControlAndPluginService.prototype.translateHeaderMenu = function () {
        if (this._gridOptions && this._gridOptions.headerMenu) {
            this.resetHeaderMenuTranslations(this.visibleColumns);
        }
    };
    /**
     * Translate manually the header titles.
     * We could optionally pass a locale (that will change currently loaded locale), else it will use current locale
     * @param locale to use
     * @param new column definitions (optional)
     */
    ControlAndPluginService.prototype.translateColumnHeaders = function (locale, newColumnDefinitions) {
        if (locale) {
            this.i18n.setLocale(locale);
        }
        var columnDefinitions = newColumnDefinitions || this._columnDefinitions;
        this.translateItems(columnDefinitions, 'headerKey', 'name');
        this.translateItems(this.allColumns, 'headerKey', 'name');
        // re-render the column headers
        this.renderColumnHeaders(columnDefinitions);
    };
    /**
     * Render (or re-render) the column headers from column definitions.
     * calling setColumns() will trigger a grid re-render
     */
    ControlAndPluginService.prototype.renderColumnHeaders = function (newColumnDefinitions) {
        var collection = newColumnDefinitions || this._columnDefinitions;
        if (Array.isArray(collection) && this._grid && this._grid.setColumns) {
            this._grid.setColumns(collection);
        }
    };
    ControlAndPluginService.prototype.emptyColumnPickerTitles = function () {
        if (this._gridOptions && this._gridOptions.columnPicker) {
            this._gridOptions.columnPicker.columnTitle = '';
            this._gridOptions.columnPicker.forceFitTitle = '';
            this._gridOptions.columnPicker.syncResizeTitle = '';
        }
    };
    ControlAndPluginService.prototype.emptyGridMenuTitles = function () {
        if (this._gridOptions && this._gridOptions.gridMenu) {
            this._gridOptions.gridMenu.customTitle = '';
            this._gridOptions.gridMenu.columnTitle = '';
            this._gridOptions.gridMenu.forceFitTitle = '';
            this._gridOptions.gridMenu.syncResizeTitle = '';
        }
    };
    /**
     * @return default Grid Menu options
     */
    ControlAndPluginService.prototype.getDefaultGridMenuOptions = function () {
        return {
            customTitle: undefined,
            columnTitle: this.getPickerTitleOutputString('columnTitle', 'gridMenu'),
            forceFitTitle: this.getPickerTitleOutputString('forceFitTitle', 'gridMenu'),
            syncResizeTitle: this.getPickerTitleOutputString('syncResizeTitle', 'gridMenu'),
            iconCssClass: 'fa fa-bars',
            menuWidth: 18,
            customItems: [],
            hideClearAllFiltersCommand: false,
            hideRefreshDatasetCommand: false,
            hideToggleFilterCommand: false,
        };
    };
    /**
     * @return default Header Menu options
     */
    ControlAndPluginService.prototype.getDefaultHeaderMenuOptions = function () {
        return {
            autoAlignOffset: 12,
            minWidth: 140,
            hideColumnHideCommand: false,
            hideSortCommands: false,
            title: ''
        };
    };
    /**
     * From a Grid Menu object property name, we will return the correct title output string following this order
     * 1- if user provided a title, use it as the output title
     * 2- else if user provided a title key, use it to translate the output title
     * 3- else if nothing is provided use
     */
    ControlAndPluginService.prototype.getPickerTitleOutputString = function (propName, pickerName) {
        var output = '';
        var picker = this._gridOptions && this._gridOptions[pickerName] || {};
        var enableTranslate = this._gridOptions && this._gridOptions.enableTranslate || false;
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
     * Reset all the Grid Menu options which have text to translate
     * @param grid menu object
     */
    ControlAndPluginService.prototype.resetHeaderMenuTranslations = function (columnDefinitions) {
        var _this = this;
        columnDefinitions.forEach(function (columnDef) {
            if (columnDef && columnDef.header && columnDef.header && columnDef.header.menu && columnDef.header.menu.items) {
                if (!columnDef.excludeFromHeaderMenu) {
                    var columnHeaderMenuItems_1 = columnDef.header.menu.items || [];
                    columnHeaderMenuItems_1.forEach(function (item) {
                        switch (item.command) {
                            case 'sort-asc':
                                item.title = _this.i18n.tr('SORT_ASCENDING') || Constants.TEXT_SORT_ASCENDING;
                                break;
                            case 'sort-desc':
                                item.title = _this.i18n.tr('SORT_DESCENDING') || Constants.TEXT_SORT_DESCENDING;
                                break;
                            case 'hide':
                                item.title = _this.i18n.tr('HIDE_COLUMN') || Constants.TEXT_HIDE_COLUMN;
                                break;
                        }
                        // re-translate if there's a "titleKey"
                        if (_this._gridOptions && _this._gridOptions.enableTranslate) {
                            _this.translateItems(columnHeaderMenuItems_1, 'titleKey', 'title');
                        }
                    });
                }
            }
        });
    };
    /**
     * Sort items in an array by a property name
     * @params items array
     * @param property name to sort with
     * @return sorted array
     */
    ControlAndPluginService.prototype.sortItems = function (items, propertyName) {
        // sort the custom items by their position in the list
        items.sort(function (itemA, itemB) {
            if (itemA && itemB && itemA.hasOwnProperty(propertyName) && itemB.hasOwnProperty(propertyName)) {
                return itemA[propertyName] - itemB[propertyName];
            }
            return 0;
        });
    };
    /** Translate the an array of items from an input key and assign to the output key */
    ControlAndPluginService.prototype.translateItems = function (items, inputKey, outputKey) {
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            if (item[inputKey]) {
                item[outputKey] = this.i18n.tr(item[inputKey]);
            }
        }
    };
    ControlAndPluginService = __decorate([
        singleton(true),
        inject(ExportService, FilterService, I18N, SortService)
    ], ControlAndPluginService);
    return ControlAndPluginService;
}());
export { ControlAndPluginService };
//# sourceMappingURL=controlAndPlugin.service.js.map