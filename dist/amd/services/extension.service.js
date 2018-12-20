var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "aurelia-framework", "aurelia-i18n", "../models/index", "../extensions/index", "./shared.service", "slickgrid/plugins/slick.cellrangedecorator", "slickgrid/plugins/slick.cellrangeselector", "slickgrid/plugins/slick.cellselectionmodel"], function (require, exports, aurelia_framework_1, aurelia_i18n_1, index_1, index_2, shared_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ExtensionService = /** @class */ (function () {
        function ExtensionService(autoTooltipExtension, cellExternalCopyExtension, checkboxSelectorExtension, columnPickerExtension, draggableGroupingExtension, gridMenuExtension, groupItemMetaExtension, i18n, headerButtonExtension, headerMenuExtension, rowDetailViewExtension, rowMoveManagerExtension, rowSelectionExtension, sharedService) {
            this.autoTooltipExtension = autoTooltipExtension;
            this.cellExternalCopyExtension = cellExternalCopyExtension;
            this.checkboxSelectorExtension = checkboxSelectorExtension;
            this.columnPickerExtension = columnPickerExtension;
            this.draggableGroupingExtension = draggableGroupingExtension;
            this.gridMenuExtension = gridMenuExtension;
            this.groupItemMetaExtension = groupItemMetaExtension;
            this.i18n = i18n;
            this.headerButtonExtension = headerButtonExtension;
            this.headerMenuExtension = headerMenuExtension;
            this.rowDetailViewExtension = rowDetailViewExtension;
            this.rowMoveManagerExtension = rowMoveManagerExtension;
            this.rowSelectionExtension = rowSelectionExtension;
            this.sharedService = sharedService;
            this.extensionList = [];
        }
        /** Dispose of all the controls & plugins */
        ExtensionService.prototype.dispose = function () {
            this.sharedService.grid = null;
            this.sharedService.visibleColumns = [];
            // dispose of each control/plugin & reset the list
            this.extensionList.forEach(function (item) {
                if (item && item.class && item.class.dispose) {
                    item.class.dispose();
                }
            });
            this.extensionList = [];
        };
        /** Get all columns (includes visible and non-visible) */
        ExtensionService.prototype.getAllColumns = function () {
            return this.sharedService.allColumns || [];
        };
        /** Get only visible columns */
        ExtensionService.prototype.getVisibleColumns = function () {
            return this.sharedService.visibleColumns || [];
        };
        /** Get all Extensions */
        ExtensionService.prototype.getAllExtensions = function () {
            return this.extensionList;
        };
        /**
         * Get an Extension by it's name
         *  @param name
         */
        ExtensionService.prototype.getExtensionByName = function (name) {
            return this.extensionList.find(function (p) { return p.name === name; });
        };
        /** Auto-resize all the column in the grid to fit the grid width */
        ExtensionService.prototype.autoResizeColumns = function () {
            this.sharedService.grid.autosizeColumns();
        };
        /** Attach/Create different Controls or Plugins after the Grid is created */
        ExtensionService.prototype.attachDifferentExtensions = function () {
            var _this = this;
            // make sure all columns are translated before creating ColumnPicker/GridMenu Controls
            // this is to avoid having hidden columns not being translated on first load
            if (this.sharedService.gridOptions.enableTranslate) {
                this.translateItems(this.sharedService.allColumns, 'headerKey', 'name');
            }
            // Auto Tooltip Plugin
            if (this.sharedService.gridOptions.enableAutoTooltip) {
                if (this.autoTooltipExtension && this.autoTooltipExtension.register) {
                    this.extensionList.push({ name: index_1.ExtensionName.autoTooltip, class: this.autoTooltipExtension, extension: this.autoTooltipExtension.register() });
                }
            }
            // Cell External Copy Manager Plugin (Excel Like)
            if (this.sharedService.gridOptions.enableExcelCopyBuffer) {
                if (this.cellExternalCopyExtension && this.cellExternalCopyExtension.register) {
                    this.extensionList.push({ name: index_1.ExtensionName.cellExternalCopyManager, class: this.cellExternalCopyExtension, extension: this.cellExternalCopyExtension.register() });
                }
            }
            // Checkbox Selector Plugin
            if (this.sharedService.gridOptions.enableCheckboxSelector) {
                if (this.checkboxSelectorExtension && this.checkboxSelectorExtension.register) {
                    var rowSelectionExtension = this.getExtensionByName(index_1.ExtensionName.rowSelection);
                    this.extensionList.push({ name: index_1.ExtensionName.checkboxSelector, class: this.checkboxSelectorExtension, extension: this.checkboxSelectorExtension.register(rowSelectionExtension) });
                }
            }
            // Column Picker Control
            if (this.sharedService.gridOptions.enableColumnPicker) {
                if (this.columnPickerExtension && this.columnPickerExtension.register) {
                    this.extensionList.push({ name: index_1.ExtensionName.columnPicker, class: this.columnPickerExtension, extension: this.columnPickerExtension.register() });
                }
            }
            // Draggable Grouping Plugin
            if (this.sharedService.gridOptions.enableDraggableGrouping) {
                if (this.draggableGroupingExtension && this.draggableGroupingExtension.register) {
                    this.extensionList.push({ name: index_1.ExtensionName.draggableGrouping, class: this.draggableGroupingExtension, extension: this.draggableGroupingExtension.register() });
                }
            }
            // Grid Menu Control
            if (this.sharedService.gridOptions.enableGridMenu) {
                if (this.gridMenuExtension && this.gridMenuExtension.register) {
                    this.extensionList.push({ name: index_1.ExtensionName.gridMenu, class: this.gridMenuExtension, extension: this.gridMenuExtension.register() });
                }
            }
            // Grouping Plugin
            // register the group item metadata provider to add expand/collapse group handlers
            if (this.sharedService.gridOptions.enableDraggableGrouping || this.sharedService.gridOptions.enableGrouping) {
                if (this.groupItemMetaExtension && this.groupItemMetaExtension.register) {
                    this.extensionList.push({ name: index_1.ExtensionName.groupItemMetaProvider, class: this.groupItemMetaExtension, extension: this.groupItemMetaExtension.register() });
                }
            }
            // Header Button Plugin
            if (this.sharedService.gridOptions.enableHeaderButton) {
                if (this.headerButtonExtension && this.headerButtonExtension.register) {
                    this.extensionList.push({ name: index_1.ExtensionName.headerButton, class: this.headerButtonExtension, extension: this.headerButtonExtension.register() });
                }
            }
            // Header Menu Plugin
            if (this.sharedService.gridOptions.enableHeaderMenu) {
                if (this.headerMenuExtension && this.headerMenuExtension.register) {
                    this.extensionList.push({ name: index_1.ExtensionName.headerMenu, class: this.headerMenuExtension, extension: this.headerMenuExtension.register() });
                }
            }
            // Row Detail View Plugin
            if (this.sharedService.gridOptions.enableRowDetailView) {
                if (this.rowDetailViewExtension && this.rowDetailViewExtension.register) {
                    var rowSelectionExtension = this.getExtensionByName(index_1.ExtensionName.rowSelection);
                    this.extensionList.push({ name: index_1.ExtensionName.rowDetailView, class: this.rowDetailViewExtension, extension: this.rowDetailViewExtension.register(rowSelectionExtension) });
                }
            }
            // Row Move Manager Plugin
            if (this.sharedService.gridOptions.enableRowMoveManager) {
                if (this.rowMoveManagerExtension && this.rowMoveManagerExtension.register) {
                    this.extensionList.push({ name: index_1.ExtensionName.rowMoveManager, class: this.rowMoveManagerExtension, extension: this.rowMoveManagerExtension.register() });
                }
            }
            // Row Selection Plugin
            if (!this.sharedService.gridOptions.enableCheckboxSelector && this.sharedService.gridOptions.enableRowSelection) {
                if (this.rowSelectionExtension && this.rowSelectionExtension.register) {
                    this.extensionList.push({ name: index_1.ExtensionName.rowSelection, class: this.rowSelectionExtension, extension: this.rowSelectionExtension.register() });
                }
            }
            // manually register other plugins
            if (this.sharedService.gridOptions.registerPlugins !== undefined) {
                if (Array.isArray(this.sharedService.gridOptions.registerPlugins)) {
                    this.sharedService.gridOptions.registerPlugins.forEach(function (plugin) {
                        _this.sharedService.grid.registerPlugin(plugin);
                        _this.extensionList.push({ name: index_1.ExtensionName.noname, class: null, extension: plugin });
                    });
                }
                else {
                    this.sharedService.grid.registerPlugin(this.sharedService.gridOptions.registerPlugins);
                    this.extensionList.push({ name: index_1.ExtensionName.noname, class: null, extension: this.sharedService.gridOptions.registerPlugins });
                }
            }
        };
        /**
         * Attach/Create certain plugins before the Grid creation, else they might behave oddly.
         * Mostly because the column definitions might change after the grid creation
         * @param columnDefinitions
         * @param options
         */
        ExtensionService.prototype.createExtensionsBeforeGridCreation = function (columnDefinitions, options) {
            if (options.enableCheckboxSelector) {
                this.checkboxSelectorExtension.create(columnDefinitions, options);
            }
            if (options.enableRowDetailView) {
                this.rowDetailViewExtension.create(columnDefinitions, options);
            }
            if (options.enableDraggableGrouping) {
                var plugin = this.draggableGroupingExtension.create(options);
                options.enableColumnReorder = plugin.getSetupColumnReorder;
            }
        };
        /** Hide a column from the grid */
        ExtensionService.prototype.hideColumn = function (column) {
            if (this.sharedService.grid && this.sharedService.grid.getColumns && this.sharedService.grid.setColumns) {
                var columnIndex = this.sharedService.grid.getColumnIndex(column.id);
                this.sharedService.visibleColumns = this.removeColumnByIndex(this.sharedService.grid.getColumns(), columnIndex);
                this.sharedService.grid.setColumns(this.sharedService.visibleColumns);
            }
        };
        /** Refresh the dataset through the Backend Service */
        ExtensionService.prototype.refreshBackendDataset = function (gridOptions) {
            this.gridMenuExtension.refreshBackendDataset(gridOptions);
        };
        /**
         * Remove a column from the grid by it's index in the grid
         * @param array input
         * @param index
         */
        ExtensionService.prototype.removeColumnByIndex = function (array, index) {
            return array.filter(function (el, i) {
                return index !== i;
            });
        };
        /** Translate the Column Picker and it's last 2 checkboxes */
        ExtensionService.prototype.translateColumnPicker = function () {
            if (this.columnPickerExtension && this.columnPickerExtension.translateColumnPicker) {
                this.columnPickerExtension.translateColumnPicker();
            }
        };
        /** Translate the Header Menu titles, we need to loop through all column definition to re-translate them */
        ExtensionService.prototype.translateGridMenu = function () {
            if (this.gridMenuExtension && this.gridMenuExtension.translateGridMenu) {
                this.gridMenuExtension.translateGridMenu();
            }
        };
        /** Translate the Header Menu titles, we need to loop through all column definition to re-translate them */
        ExtensionService.prototype.translateHeaderMenu = function () {
            if (this.headerMenuExtension && this.headerMenuExtension.translateHeaderMenu) {
                this.headerMenuExtension.translateHeaderMenu();
            }
        };
        /**
         * Translate manually the header titles.
         * We could optionally pass a locale (that will change currently loaded locale), else it will use current locale
         * @param locale to use
         * @param new column definitions (optional)
         */
        ExtensionService.prototype.translateColumnHeaders = function (locale, newColumnDefinitions) {
            if (locale) {
                this.i18n.setLocale(locale);
            }
            var columnDefinitions = newColumnDefinitions || this.sharedService.columnDefinitions;
            this.translateItems(columnDefinitions, 'headerKey', 'name');
            this.translateItems(this.sharedService.allColumns, 'headerKey', 'name');
            // re-render the column headers
            this.renderColumnHeaders(columnDefinitions);
        };
        /**
         * Render (or re-render) the column headers from column definitions.
         * calling setColumns() will trigger a grid re-render
         */
        ExtensionService.prototype.renderColumnHeaders = function (newColumnDefinitions) {
            var collection = newColumnDefinitions || this.sharedService.columnDefinitions;
            if (Array.isArray(collection) && this.sharedService.grid && this.sharedService.grid.setColumns) {
                this.sharedService.grid.setColumns(collection);
            }
        };
        /** Translate the an array of items from an input key and assign to the output key */
        ExtensionService.prototype.translateItems = function (items, inputKey, outputKey) {
            for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                var item = items_1[_i];
                if (item[inputKey]) {
                    item[outputKey] = this.i18n.tr(item[inputKey]);
                }
            }
        };
        ExtensionService = __decorate([
            aurelia_framework_1.singleton(true),
            aurelia_framework_1.inject(index_2.AutoTooltipExtension, index_2.CellExternalCopyManagerExtension, index_2.CheckboxSelectorExtension, index_2.ColumnPickerExtension, index_2.DraggableGroupingExtension, index_2.GridMenuExtension, index_2.GroupItemMetaProviderExtension, aurelia_i18n_1.I18N, index_2.HeaderButtonExtension, index_2.HeaderMenuExtension, index_2.RowDetailViewExtension, index_2.RowMoveManagerExtension, index_2.RowSelectionExtension, shared_service_1.SharedService)
        ], ExtensionService);
        return ExtensionService;
    }());
    exports.ExtensionService = ExtensionService;
});
//# sourceMappingURL=extension.service.js.map