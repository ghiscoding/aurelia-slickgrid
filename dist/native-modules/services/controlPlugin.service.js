var ControlPluginService = /** @class */ (function () {
    function ControlPluginService() {
    }
    ControlPluginService.prototype.attachDifferentControlOrPlugins = function (grid, columnDefinitions, options, dataView) {
        if (options.enableColumnPicker) {
            var columnPickerControl = new Slick.Controls.ColumnPicker(columnDefinitions, grid, options);
        }
        if (options.enableGridMenu) {
            options.gridMenu = options.gridMenu || {};
            options.gridMenu.columnTitle = options.gridMenu.columnTitle || 'Columns';
            options.gridMenu.iconCssClass = options.gridMenu.iconCssClass || 'fa fa-bars';
            options.gridMenu.menuWidth = options.gridMenu.menuWidth || 18;
            options.gridMenu.resizeOnShowHeaderRow = options.showHeaderRow;
            var gridMenuControl = new Slick.Controls.GridMenu(columnDefinitions, grid, options);
            gridMenuControl.onCommand.subscribe(function (e, args) {
                if (typeof options.onGridMenuCommand === 'function') {
                    options.onGridMenuCommand(e, args);
                }
            });
        }
        if (options.enableAutoTooltip) {
            grid.registerPlugin(new Slick.AutoTooltips(options.autoTooltipOptions || {}));
        }
        if (options.enableRowSelection) {
            grid.setSelectionModel(new Slick.RowSelectionModel(options.rowSelectionOptions || {}));
        }
        if (options.enableHeaderButton) {
            var headerButtonsPlugin = new Slick.Plugins.HeaderButtons(options.headerButtonOptions || {});
            grid.registerPlugin(headerButtonsPlugin);
            headerButtonsPlugin.onCommand.subscribe(function (e, args) {
                if (typeof options.onHeaderButtonCommand === 'function') {
                    options.onHeaderButtonCommand(e, args);
                }
            });
        }
        if (options.enableHeaderMenu) {
            var headerMenuPlugin = new Slick.Plugins.HeaderMenu(options.headerMenuOptions || {});
            grid.registerPlugin(headerMenuPlugin);
            headerMenuPlugin.onCommand.subscribe(function (e, args) {
                if (typeof options.onHeaderMenuCommand === 'function') {
                    options.onHeaderMenuCommand(e, args);
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
    return ControlPluginService;
}());
export { ControlPluginService };
//# sourceMappingURL=controlPlugin.service.js.map