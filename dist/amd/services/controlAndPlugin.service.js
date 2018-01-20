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
define(["require", "exports", "aurelia-framework", "aurelia-i18n", "./filter.service", "./gridExtra.service"], function (require, exports, aurelia_framework_1, aurelia_i18n_1, filter_service_1, gridExtra_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ControlAndPluginService = /** @class */ (function () {
        function ControlAndPluginService(filterService, gridExtraService, i18n) {
            this.filterService = filterService;
            this.gridExtraService = gridExtraService;
            this.i18n = i18n;
        }
        /**
         * Attach/Create different Controls or Plugins after the Grid is created
         * @param {any} grid
         * @param {Column[]} columnDefinitions
         * @param {GridOptions} options
         * @param {any} dataView
         */
        ControlAndPluginService.prototype.attachDifferentControlOrPlugins = function (grid, columnDefinitions, options, dataView) {
            this._grid = grid;
            this._gridOptions = options;
            this._dataView = dataView;
            this._columnDefinitions = columnDefinitions;
            this.visibleColumns = columnDefinitions;
            if (options.enableColumnPicker) {
                this.columnPickerControl = this.createColumnPicker(grid, columnDefinitions, options);
            }
            if (options.enableGridMenu) {
                this.gridMenuControl = this.createGridMenu(grid, columnDefinitions, options);
            }
            if (options.enableAutoTooltip) {
                this.autoTooltipPlugin = new Slick.AutoTooltips(options.autoTooltipOptions || {});
                grid.registerPlugin(this.autoTooltipPlugin);
            }
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
            if (options.enableRowSelection) {
                this.rowSelectionPlugin = new Slick.RowSelectionModel(options.rowSelectionOptions || {});
                grid.setSelectionModel(this.rowSelectionPlugin);
            }
            if (options.enableHeaderButton) {
                this.headerButtonsPlugin = new Slick.Plugins.HeaderButtons(options.headerButton || {});
                grid.registerPlugin(this.headerButtonsPlugin);
                this.headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                    if (options.headerButton && typeof options.headerButton.onCommand === 'function') {
                        options.headerButton.onCommand(e, args);
                    }
                });
            }
            if (options.enableHeaderMenu) {
                this.headerMenuPlugin = new Slick.Plugins.HeaderMenu(options.headerMenu || {});
                grid.registerPlugin(this.headerMenuPlugin);
                this.headerMenuPlugin.onCommand.subscribe(function (e, args) {
                    if (options.headerMenu && typeof options.headerMenu.onCommand === 'function') {
                        options.headerMenu.onCommand(e, args);
                    }
                });
                this.headerMenuPlugin.onCommand.subscribe(function (e, args) {
                    if (options.headerMenu && typeof options.headerMenu.onBeforeMenuShow === 'function') {
                        options.headerMenu.onBeforeMenuShow(e, args);
                    }
                });
            }
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
        ControlAndPluginService.prototype.createColumnPicker = function (grid, columnDefinitions, options) {
            // localization support for the picker
            var forceFitTitle = options.enableTranslate ? this.i18n.tr('FORCE_FIT_COLUMNS') : 'Force fit columns';
            var syncResizeTitle = options.enableTranslate ? this.i18n.tr('SYNCHRONOUS_RESIZE') : 'Synchronous resize';
            options.columnPicker = options.columnPicker || {};
            options.columnPicker.forceFitTitle = options.columnPicker.forceFitTitle || forceFitTitle;
            options.columnPicker.syncResizeTitle = options.columnPicker.syncResizeTitle || syncResizeTitle;
            this.columnPickerControl = new Slick.Controls.ColumnPicker(columnDefinitions, grid, options);
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
                        grid.autosizeColumns();
                    }
                });
            }
            return gridMenuControl;
        };
        ControlAndPluginService.prototype.hideColumn = function (column) {
            if (this._grid && this.visibleColumns) {
                var columnIndex = this._grid.getColumnIndex(column.id);
                this.visibleColumns = this.removeColumnByIndex(this.visibleColumns, columnIndex);
                this._grid.setColumns(this.visibleColumns);
            }
        };
        ControlAndPluginService.prototype.removeColumnByIndex = function (array, index) {
            return array.filter(function (el, i) {
                return index !== i;
            });
        };
        ControlAndPluginService.prototype.autoResizeColumns = function () {
            this._grid.autosizeColumns();
        };
        ControlAndPluginService.prototype.destroy = function () {
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
            if (options.enableFiltering) {
                if (options && options.gridMenu && options.gridMenu.showClearAllFiltersCommand && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'clear-filter'; }).length === 0) {
                    options.gridMenu.customItems.push({
                        iconCssClass: 'fa fa-filter text-danger',
                        title: options.enableTranslate ? this.i18n.tr('CLEAR_ALL_FILTERS') : 'Clear All Filters',
                        disabled: false,
                        command: 'clear-filter'
                    });
                }
                if (options && options.gridMenu && options.gridMenu.showToggleFilterCommand && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'toggle-filter'; }).length === 0) {
                    options.gridMenu.customItems.push({
                        iconCssClass: 'fa fa-random',
                        title: options.enableTranslate ? this.i18n.tr('TOGGLE_FILTER_ROW') : 'Toggle Filter Row',
                        disabled: false,
                        command: 'toggle-filter'
                    });
                }
                if (options && options.gridMenu && options.gridMenu.showRefreshDatasetCommand && options.onBackendEventApi && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'refresh-dataset'; }).length === 0) {
                    options.gridMenu.customItems.push({
                        iconCssClass: 'fa fa-refresh',
                        title: options.enableTranslate ? this.i18n.tr('REFRESH_DATASET') : 'Refresh Dataset',
                        disabled: false,
                        command: 'refresh-dataset'
                    });
                }
                // Command callback, what will be executed after command is clicked
                if (options.gridMenu) {
                    options.gridMenu.onCommand = function (e, args) {
                        if (args && args.command) {
                            switch (args.command) {
                                case 'toggle-filter':
                                    grid.setHeaderRowVisibility(!grid.getOptions().showHeaderRow);
                                    break;
                                case 'toggle-toppanel':
                                    grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
                                    break;
                                case 'clear-filter':
                                    _this.filterService.clearFilters();
                                    _this._dataView.refresh();
                                    break;
                                case 'refresh-dataset':
                                    _this.refreshBackendDataset(options);
                                    break;
                                default:
                                    alert('Command: ' + args.command);
                                    break;
                            }
                        }
                    };
                }
            }
            // add the custom "Commands" title if there are any commands
            if (options && options.gridMenu && options.gridMenu.customItems && options.gridMenu.customItems.length > 0) {
                var customTitle = options.enableTranslate ? this.i18n.tr('COMMANDS') : 'Commands';
                options.gridMenu.customTitle = options.gridMenu.customTitle || customTitle;
            }
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
        ControlAndPluginService.prototype.refreshBackendDataset = function (options) {
            var query;
            if (options && options.onBackendEventApi && options.onBackendEventApi.service) {
                if (options.onBackendEventApi.service) {
                    query = options.onBackendEventApi.service.buildQuery();
                }
                if (query && query !== '') {
                    if (options.onBackendEventApi.preProcess) {
                        options.onBackendEventApi.preProcess();
                    }
                    // run the process() and then postProcess()
                    var processPromise = options.onBackendEventApi.process(query);
                    processPromise.then(function (responseProcess) {
                        // send the response process to the postProcess callback
                        if (options.onBackendEventApi && options.onBackendEventApi.postProcess) {
                            options.onBackendEventApi.postProcess(responseProcess);
                        }
                    });
                }
            }
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
            this._gridOptions.gridMenu = this.resetGridMenuTranslations(this._gridOptions.gridMenu || {});
            this.createGridMenu(this._grid, this.visibleColumns, this._gridOptions);
        };
        /**
         * Translate manually the header titles.
         * We could optionally pass a locale (that will change currently loaded locale), else it will use current locale
         * @param {string} locale locale to use
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
         * Attach/Create different plugins before the Grid creation.
         * For example the multi-select have to be added to the column definition before the grid is created to work properly
         * @param {Column[]} columnDefinitions
         * @param {GridOptions} options
         */
        ControlAndPluginService.prototype.createPluginBeforeGridCreation = function (columnDefinitions, options) {
            if (options.enableCheckboxSelector) {
                this.checkboxSelectorPlugin = new Slick.CheckboxSelectColumn(options.checkboxSelector || {});
                columnDefinitions.unshift(this.checkboxSelectorPlugin.getColumnDefinition());
            }
        };
        ControlAndPluginService = __decorate([
            aurelia_framework_1.inject(filter_service_1.FilterService, gridExtra_service_1.GridExtraService, aurelia_i18n_1.I18N)
        ], ControlAndPluginService);
        return ControlAndPluginService;
    }());
    exports.ControlAndPluginService = ControlAndPluginService;
});
//# sourceMappingURL=controlAndPlugin.service.js.map