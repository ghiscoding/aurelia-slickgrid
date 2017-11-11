var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { FilterService } from './filter.service';
let ControlAndPluginService = class ControlAndPluginService {
    constructor(ea, filterService) {
        this.ea = ea;
        this.filterService = filterService;
    }
    attachDifferentControlOrPlugins(grid, columnDefinitions, options, dataView) {
        this._visibleColumns = columnDefinitions;
        this._dataView = dataView;
        this._grid = grid;
        if (options.enableColumnPicker) {
            this.columnPickerControl = new Slick.Controls.ColumnPicker(columnDefinitions, grid, options);
        }
        if (options.enableGridMenu) {
            this.prepareGridMenu(options);
            this.gridMenuControl = new Slick.Controls.GridMenu(columnDefinitions, grid, options);
            if (options.gridMenu) {
                this.gridMenuControl.onBeforeMenuShow.subscribe((e, args) => {
                    if (options.gridMenu && typeof options.gridMenu.onBeforeMenuShow === 'function') {
                        options.gridMenu.onBeforeMenuShow(e, args);
                    }
                });
                this.gridMenuControl.onCommand.subscribe((e, args) => {
                    if (options.gridMenu && typeof options.gridMenu.onCommand === 'function') {
                        options.gridMenu.onCommand(e, args);
                    }
                });
                this.gridMenuControl.onMenuClose.subscribe((e, args) => {
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
        if (options.enableRowSelection) {
            this.rowSelectionPlugin = new Slick.RowSelectionModel(options.rowSelectionOptions || {});
            grid.setSelectionModel(this.rowSelectionPlugin);
        }
        if (options.enableHeaderButton) {
            this.headerButtonsPlugin = new Slick.Plugins.HeaderButtons(options.headerButtonOptions || {});
            grid.registerPlugin(this.headerButtonsPlugin);
            this.headerButtonsPlugin.onCommand.subscribe((e, args) => {
                if (options.headerButtonOptions && typeof options.headerButtonOptions.onCommand === 'function') {
                    options.headerButtonOptions.onCommand(e, args);
                }
            });
        }
        if (options.enableHeaderMenu) {
            this.headerMenuPlugin = new Slick.Plugins.HeaderMenu(options.headerMenuOptions || {});
            grid.registerPlugin(this.headerMenuPlugin);
            this.headerMenuPlugin.onCommand.subscribe((e, args) => {
                if (options.headerMenuOptions && typeof options.headerMenuOptions.onCommand === 'function') {
                    options.headerMenuOptions.onCommand(e, args);
                }
            });
        }
        if (options.registerPlugins !== undefined) {
            if (Array.isArray(options.registerPlugins)) {
                options.registerPlugins.forEach((plugin) => {
                    grid.registerPlugin(plugin);
                });
            }
            else {
                grid.registerPlugin(options.registerPlugins);
            }
        }
        // destroy all the Controls & Plugins when changing Route
        this.ea.subscribe('router:navigation:processing', () => {
            this.columnPickerControl.destroy();
            this.gridMenuControl.destroy();
            /* The following plugins destroy are causing a page reload, not sure why, will leave commented out until I find why */
            // this.autoTooltipPlugin.destroy();
            // this.headerButtonsPlugin.destroy();
            // this.headerMenuPlugin.destroy();
            // this.rowSelectionPlugin.destroy();
        });
    }
    hideColumn(column) {
        const columnIndex = this._grid.getColumnIndex(column.id);
        this._visibleColumns = this.removeColumnByIndex(this._visibleColumns, columnIndex);
        this._grid.setColumns(this._visibleColumns);
    }
    removeColumnByIndex(array, index) {
        return array.filter((el, i) => {
            return index !== i;
        });
    }
    autoResizeColumns() {
        this._grid.autosizeColumns();
    }
    addGridMenuCustomCommands(options) {
        if (options && options.enableFiltering && options.gridMenu && options.gridMenu.customItems) {
            if (options.gridMenu.customItems.filter((item) => item.command === 'clear-filter').length === 0) {
                options.gridMenu.customItems.push({
                    iconCssClass: 'fa fa-filter text-danger',
                    title: 'Clear All Filters',
                    disabled: false,
                    command: 'clear-filter'
                });
            }
            if (options.gridMenu.customItems.filter((item) => item.command === 'toggle-filter').length === 0) {
                options.gridMenu.customItems.push({
                    iconCssClass: 'fa fa-random',
                    title: 'Toggle Filter Row',
                    disabled: false,
                    command: 'toggle-filter'
                });
            }
            options.gridMenu.onCommand = (e, args) => {
                if (args.command === 'toggle-filter') {
                    this._grid.setHeaderRowVisibility(!this._grid.getOptions().showHeaderRow);
                }
                else if (args.command === 'toggle-toppanel') {
                    this._grid.setTopPanelVisibility(!this._grid.getOptions().showTopPanel);
                }
                else if (args.command === 'clear-filter') {
                    this.filterService.clearFilters();
                    this._dataView.refresh();
                }
            };
        }
        // remove the custom command title if there's no command
        if (options && options.gridMenu && options.gridMenu.customItems && options.gridMenu.customItems.length > 0) {
            options.gridMenu.customTitle = options.gridMenu.customTitle || 'Commands';
        }
    }
    prepareGridMenu(options) {
        options.gridMenu = options.gridMenu || {};
        options.gridMenu.columnTitle = options.gridMenu.columnTitle || 'Columns';
        options.gridMenu.iconCssClass = options.gridMenu.iconCssClass || 'fa fa-bars';
        options.gridMenu.menuWidth = options.gridMenu.menuWidth || 18;
        options.gridMenu.customTitle = options.gridMenu.customTitle || undefined;
        options.gridMenu.customItems = options.gridMenu.customItems || [];
        this.addGridMenuCustomCommands(options);
    }
};
ControlAndPluginService = __decorate([
    inject(EventAggregator, FilterService)
], ControlAndPluginService);
export { ControlAndPluginService };
//# sourceMappingURL=controlAndPlugin.service.js.map