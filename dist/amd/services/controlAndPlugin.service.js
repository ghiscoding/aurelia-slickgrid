var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "aurelia-i18n", "./filter.service", "./gridExtra.service", "jquery"], function (require, exports, aurelia_framework_1, aurelia_i18n_1, filter_service_1, gridExtra_service_1, $) {
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
                this.columnPickerControl = new Slick.Controls.ColumnPicker(columnDefinitions, grid, options);
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
        ControlAndPluginService.prototype.createGridMenu = function (grid, columnDefinitions, options) {
            var _this = this;
            this.prepareGridMenu(grid, options);
            var gridMenuControl = new Slick.Controls.GridMenu(columnDefinitions, grid, options);
            if (options.gridMenu) {
                gridMenuControl.onBeforeMenuShow.subscribe(function (e, args) {
                    if (options.gridMenu && typeof options.gridMenu.onBeforeMenuShow === 'function') {
                        options.gridMenu.onBeforeMenuShow(e, args);
                    }
                    else {
                        // when using i18n with Grid Menu, we have a problem with the last 2 checkbox
                        // they are written in plain English within the SlickGrid Controls
                        // and so we don't have access directly to their text, however with a jQuery hack,
                        // we can somehow change the text with jQuery but it's very patchy
                        if (options.enableTranslate) {
                            setTimeout(function () {
                                var forceFitElm = $("label:contains('Force fit columns')");
                                var syncResizeElm = $("label:contains('Synchronous resize')");
                                if (Array.isArray(forceFitElm) && forceFitElm[0] && forceFitElm[0].hasOwnProperty('lastChild') && forceFitElm[0].lastChild.hasOwnProperty('textContent')) {
                                    forceFitElm[0].lastChild.textContent = _this.i18n.tr('FORCE_FIT_COLUMNS');
                                }
                                if (Array.isArray(syncResizeElm) && syncResizeElm[0] && syncResizeElm[0].hasOwnProperty('lastChild') && syncResizeElm[0].lastChild.hasOwnProperty('textContent')) {
                                    syncResizeElm[0].lastChild.textContent = _this.i18n.tr('SYNCHRONOUS_RESIZE');
                                }
                            }, 0);
                        }
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
                    _this._grid.autosizeColumns();
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
        ControlAndPluginService.prototype.addGridMenuCustomCommands = function (grid, options) {
            var _this = this;
            if (options.enableFiltering) {
                if (options && options.gridMenu && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'clear-filter'; }).length === 0) {
                    options.gridMenu.customItems.push({
                        iconCssClass: 'fa fa-filter text-danger',
                        title: options.enableTranslate ? this.i18n.tr('CLEAR_ALL_FILTERS') : 'Clear All Filters',
                        disabled: false,
                        command: 'clear-filter'
                    });
                }
                if (options && options.gridMenu && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'toggle-filter'; }).length === 0) {
                    options.gridMenu.customItems.push({
                        iconCssClass: 'fa fa-random',
                        title: options.enableTranslate ? this.i18n.tr('TOGGLE_FILTER_ROW') : 'Toggle Filter Row',
                        disabled: false,
                        command: 'toggle-filter'
                    });
                }
                if (options.gridMenu) {
                    options.gridMenu.onCommand = function (e, args) {
                        if (args.command === 'toggle-filter') {
                            grid.setHeaderRowVisibility(!grid.getOptions().showHeaderRow);
                        }
                        else if (args.command === 'toggle-toppanel') {
                            grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
                        }
                        else if (args.command === 'clear-filter') {
                            _this.filterService.clearFilters();
                            _this._dataView.refresh();
                        }
                        else {
                            alert('Command: ' + args.command);
                        }
                    };
                }
            }
            // add the custom command title if there's no command
            if (options && options.gridMenu && options.gridMenu.customItems && options.gridMenu.customItems.length > 0) {
                var customTitle = options.enableTranslate ? this.i18n.tr('COMMANDS') : 'Commands';
                options.gridMenu.customTitle = options.gridMenu.customTitle || customTitle;
            }
        };
        ControlAndPluginService.prototype.prepareGridMenu = function (grid, options) {
            var columnTitle = options.enableTranslate ? this.i18n.tr('COLUMNS') : 'Columns';
            options.gridMenu = options.gridMenu || {};
            options.gridMenu.columnTitle = options.gridMenu.columnTitle || columnTitle;
            options.gridMenu.iconCssClass = options.gridMenu.iconCssClass || 'fa fa-bars';
            options.gridMenu.menuWidth = options.gridMenu.menuWidth || 18;
            options.gridMenu.customTitle = options.gridMenu.customTitle || undefined;
            options.gridMenu.customItems = options.gridMenu.customItems || [];
            this.addGridMenuCustomCommands(grid, options);
            // options.gridMenu.resizeOnShowHeaderRow = options.showHeaderRow;
        };
        /**
         * Translate the Grid Menu ColumnTitle and CustomTitle.
         * Note that the only way that seems to work is to destroy and re-create the Grid Menu
         * Changing only the gridMenu.columnTitle with i18n translate was not enough.
         */
        ControlAndPluginService.prototype.translateGridMenu = function () {
            // destroy and re-create the Grid Menu which seems to be the only way to translate properly
            this.gridMenuControl.destroy();
            this._gridOptions.gridMenu = undefined;
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