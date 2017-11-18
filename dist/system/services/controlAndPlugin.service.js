System.register(["aurelia-framework", "aurelia-event-aggregator", "./filter.service"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var aurelia_framework_1, aurelia_event_aggregator_1, filter_service_1, ControlAndPluginService;
    return {
        setters: [
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (aurelia_event_aggregator_1_1) {
                aurelia_event_aggregator_1 = aurelia_event_aggregator_1_1;
            },
            function (filter_service_1_1) {
                filter_service_1 = filter_service_1_1;
            }
        ],
        execute: function () {
            ControlAndPluginService = /** @class */ (function () {
                function ControlAndPluginService(ea, filterService, gridExtraService) {
                    this.ea = ea;
                    this.filterService = filterService;
                    this.gridExtraService = gridExtraService;
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
                    this._dataView = dataView;
                    this._visibleColumns = columnDefinitions;
                    if (options.enableColumnPicker) {
                        this.columnPickerControl = new Slick.Controls.ColumnPicker(columnDefinitions, grid, options);
                    }
                    if (options.enableGridMenu) {
                        this.prepareGridMenu(grid, options);
                        this.gridMenuControl = new Slick.Controls.GridMenu(columnDefinitions, grid, options);
                        if (options.gridMenu) {
                            this.gridMenuControl.onBeforeMenuShow.subscribe(function (e, args) {
                                if (options.gridMenu && typeof options.gridMenu.onBeforeMenuShow === 'function') {
                                    options.gridMenu.onBeforeMenuShow(e, args);
                                }
                            });
                            this.gridMenuControl.onCommand.subscribe(function (e, args) {
                                if (options.gridMenu && typeof options.gridMenu.onCommand === 'function') {
                                    options.gridMenu.onCommand(e, args);
                                }
                            });
                            this.gridMenuControl.onMenuClose.subscribe(function (e, args) {
                                if (options.gridMenu && typeof options.gridMenu.onMenuClose === 'function') {
                                    options.gridMenu.onMenuClose(e, args);
                                }
                            });
                        }
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
                ControlAndPluginService.prototype.hideColumn = function (column) {
                    if (this._grid && this._visibleColumns) {
                        var columnIndex = this._grid.getColumnIndex(column.id);
                        this._visibleColumns = this.removeColumnByIndex(this._visibleColumns, columnIndex);
                        this._grid.setColumns(this._visibleColumns);
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
                    this._visibleColumns = [];
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
                                title: 'Clear All Filters',
                                disabled: false,
                                command: 'clear-filter'
                            });
                        }
                        if (options && options.gridMenu && options.gridMenu.customItems && options.gridMenu.customItems.filter(function (item) { return item.command === 'toggle-filter'; }).length === 0) {
                            options.gridMenu.customItems.push({
                                iconCssClass: 'fa fa-random',
                                title: 'Toggle Filter Row',
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
                    // remove the custom command title if there's no command
                    if (options && options.gridMenu && options.gridMenu.customItems && options.gridMenu.customItems.length > 0) {
                        options.gridMenu.customTitle = options.gridMenu.customTitle || 'Commands';
                    }
                };
                ControlAndPluginService.prototype.prepareGridMenu = function (grid, options) {
                    options.gridMenu = options.gridMenu || {};
                    options.gridMenu.columnTitle = options.gridMenu.columnTitle || 'Columns';
                    options.gridMenu.iconCssClass = options.gridMenu.iconCssClass || 'fa fa-bars';
                    options.gridMenu.menuWidth = options.gridMenu.menuWidth || 18;
                    options.gridMenu.customTitle = options.gridMenu.customTitle || undefined;
                    options.gridMenu.customItems = options.gridMenu.customItems || [];
                    this.addGridMenuCustomCommands(grid, options);
                    // options.gridMenu.resizeOnShowHeaderRow = options.showHeaderRow;
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
                    aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator, filter_service_1.FilterService)
                ], ControlAndPluginService);
                return ControlAndPluginService;
            }());
            exports_1("ControlAndPluginService", ControlAndPluginService);
        }
    };
});
//# sourceMappingURL=controlAndPlugin.service.js.map