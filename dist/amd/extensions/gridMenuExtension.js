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
define(["require", "exports", "aurelia-framework", "aurelia-i18n", "../constants", "../models/index", "../services/export.service", "./extensionUtility", "../services/filter.service", "../services/sort.service", "../services/shared.service"], function (require, exports, aurelia_framework_1, aurelia_i18n_1, constants_1, index_1, export_service_1, extensionUtility_1, filter_service_1, sort_service_1, shared_service_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GridMenuExtension = /** @class */ (function () {
        function GridMenuExtension(exportService, extensionUtility, filterService, i18n, sharedService, sortService) {
            this.exportService = exportService;
            this.extensionUtility = extensionUtility;
            this.filterService = filterService;
            this.i18n = i18n;
            this.sharedService = sharedService;
            this.sortService = sortService;
            this._eventHandler = new Slick.EventHandler();
            this.areVisibleColumnDifferent = false;
        }
        GridMenuExtension.prototype.dispose = function () {
            // unsubscribe all SlickGrid events
            this._eventHandler.unsubscribeAll();
            if (this._extension && this._extension.destroy) {
                this._extension.destroy();
            }
        };
        /** Create the Header Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...) */
        GridMenuExtension.prototype.register = function () {
            var _this = this;
            // keep original user grid menu, useful when switching locale to translate
            this.userOriginalGridMenu = __assign({}, this.sharedService.gridOptions.gridMenu);
            if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu) {
                // dynamically import the SlickGrid plugin with requireJS
                this.extensionUtility.loadExtensionDynamically(index_1.ExtensionName.gridMenu);
                this.sharedService.gridOptions.gridMenu = __assign({}, this.getDefaultGridMenuOptions(), this.sharedService.gridOptions.gridMenu);
                // merge original user grid menu items with internal items
                // then sort all Grid Menu Custom Items (sorted by pointer, no need to use the return)
                this.sharedService.gridOptions.gridMenu.customItems = (this.userOriginalGridMenu.customItems || []).concat(this.addGridMenuCustomCommands());
                this.extensionUtility.translateItems(this.sharedService.gridOptions.gridMenu.customItems, 'titleKey', 'title');
                this.extensionUtility.sortItems(this.sharedService.gridOptions.gridMenu.customItems, 'positionOrder');
                this._extension = new Slick.Controls.GridMenu(this.sharedService.columnDefinitions, this.sharedService.grid, this.sharedService.gridOptions);
                if (this.sharedService.grid && this.sharedService.gridOptions.gridMenu) {
                    this._eventHandler.subscribe(this._extension.onBeforeMenuShow, function (e, args) {
                        if (_this.sharedService.gridOptions.gridMenu && typeof _this.sharedService.gridOptions.gridMenu.onBeforeMenuShow === 'function') {
                            _this.sharedService.gridOptions.gridMenu.onBeforeMenuShow(e, args);
                        }
                    });
                    this._eventHandler.subscribe(this._extension.onColumnsChanged, function (e, args) {
                        _this.areVisibleColumnDifferent = true;
                        if (_this.sharedService.gridOptions.gridMenu && typeof _this.sharedService.gridOptions.gridMenu.onColumnsChanged === 'function') {
                            _this.sharedService.gridOptions.gridMenu.onColumnsChanged(e, args);
                        }
                    });
                    this._eventHandler.subscribe(this._extension.onCommand, function (e, args) {
                        _this.executeGridMenuInternalCustomCommands(e, args);
                        if (_this.sharedService.gridOptions.gridMenu && typeof _this.sharedService.gridOptions.gridMenu.onCommand === 'function') {
                            _this.sharedService.gridOptions.gridMenu.onCommand(e, args);
                        }
                    });
                    this._eventHandler.subscribe(this._extension.onMenuClose, function (e, args) {
                        if (_this.sharedService.gridOptions.gridMenu && typeof _this.sharedService.gridOptions.gridMenu.onMenuClose === 'function') {
                            _this.sharedService.gridOptions.gridMenu.onMenuClose(e, args);
                        }
                        // we also want to resize the columns if the user decided to hide certain column(s)
                        if (_this.sharedService.grid && typeof _this.sharedService.grid.autosizeColumns === 'function') {
                            // make sure that the grid still exist (by looking if the Grid UID is found in the DOM tree)
                            var gridUid = _this.sharedService.grid.getUID();
                            if (_this.areVisibleColumnDifferent && gridUid && $("." + gridUid).length > 0) {
                                if (_this.sharedService.gridOptions && _this.sharedService.gridOptions.enableAutoSizeColumns) {
                                    _this.sharedService.grid.autosizeColumns();
                                }
                                _this.areVisibleColumnDifferent = false;
                            }
                        }
                    });
                }
                return this._extension;
            }
            return null;
        };
        /**
         * Execute the Grid Menu Custom command callback that was triggered by the onCommand subscribe
         * These are the default internal custom commands
         * @param event
         * @param GridMenuItem args
         */
        GridMenuExtension.prototype.executeGridMenuInternalCustomCommands = function (e, args) {
            if (args && args.command) {
                switch (args.command) {
                    case 'clear-filter':
                        this.filterService.clearFilters();
                        this.sharedService.dataView.refresh();
                        break;
                    case 'clear-sorting':
                        this.sortService.clearSorting();
                        this.sharedService.dataView.refresh();
                        break;
                    case 'export-csv':
                        this.exportService.exportToFile({
                            delimiter: index_1.DelimiterType.comma,
                            filename: 'export',
                            format: index_1.FileType.csv,
                            useUtf8WithBom: true
                        });
                        break;
                    case 'export-text-delimited':
                        this.exportService.exportToFile({
                            delimiter: index_1.DelimiterType.tab,
                            filename: 'export',
                            format: index_1.FileType.txt,
                            useUtf8WithBom: true
                        });
                        break;
                    case 'toggle-filter':
                        this.sharedService.grid.setHeaderRowVisibility(!this.sharedService.grid.getOptions().showHeaderRow);
                        break;
                    case 'toggle-toppanel':
                        this.sharedService.grid.setTopPanelVisibility(!this.sharedService.grid.getOptions().showTopPanel);
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
        GridMenuExtension.prototype.refreshBackendDataset = function (gridOptions) {
            var _this = this;
            var query = '';
            // user can pass new set of grid options which will override current ones
            if (gridOptions) {
                this.sharedService.gridOptions = __assign({}, this.sharedService.gridOptions, gridOptions);
            }
            var backendApi = this.sharedService.gridOptions.backendServiceApi;
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
                                totalItemCount: _this.sharedService.gridOptions && _this.sharedService.gridOptions.pagination && _this.sharedService.gridOptions.pagination.totalItems
                            };
                        }
                        backendApi.postProcess(processResult);
                    }
                });
            }
        };
        /** Create Grid Menu with Custom Commands if user has enabled Filters and/or uses a Backend Service (OData, GraphQL) */
        GridMenuExtension.prototype.addGridMenuCustomCommands = function () {
            var backendApi = this.sharedService.gridOptions.backendServiceApi || null;
            var gridMenuCustomItems = [];
            if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableFiltering) {
                // show grid menu: clear all filters
                if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideClearAllFiltersCommand) {
                    gridMenuCustomItems.push({
                        iconCssClass: this.sharedService.gridOptions.gridMenu.iconClearAllFiltersCommand || 'fa fa-filter text-danger',
                        title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('CLEAR_ALL_FILTERS') : constants_1.Constants.TEXT_CLEAR_ALL_FILTERS,
                        disabled: false,
                        command: 'clear-filter',
                        positionOrder: 50
                    });
                }
                // show grid menu: toggle filter row
                if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideToggleFilterCommand) {
                    gridMenuCustomItems.push({
                        iconCssClass: this.sharedService.gridOptions.gridMenu.iconToggleFilterCommand || 'fa fa-random',
                        title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('TOGGLE_FILTER_ROW') : constants_1.Constants.TEXT_TOGGLE_FILTER_ROW,
                        disabled: false,
                        command: 'toggle-filter',
                        positionOrder: 52
                    });
                }
                // show grid menu: refresh dataset
                if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideRefreshDatasetCommand && backendApi) {
                    gridMenuCustomItems.push({
                        iconCssClass: this.sharedService.gridOptions.gridMenu.iconRefreshDatasetCommand || 'fa fa-refresh',
                        title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('REFRESH_DATASET') : constants_1.Constants.TEXT_REFRESH_DATASET,
                        disabled: false,
                        command: 'refresh-dataset',
                        positionOrder: 54
                    });
                }
            }
            if (this.sharedService.gridOptions.enableSorting) {
                // show grid menu: clear all sorting
                if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideClearAllSortingCommand) {
                    gridMenuCustomItems.push({
                        iconCssClass: this.sharedService.gridOptions.gridMenu.iconClearAllSortingCommand || 'fa fa-unsorted text-danger',
                        title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('CLEAR_ALL_SORTING') : constants_1.Constants.TEXT_CLEAR_ALL_SORTING,
                        disabled: false,
                        command: 'clear-sorting',
                        positionOrder: 51
                    });
                }
            }
            // show grid menu: export to file
            if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableExport && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideExportCsvCommand) {
                gridMenuCustomItems.push({
                    iconCssClass: this.sharedService.gridOptions.gridMenu.iconExportCsvCommand || 'fa fa-download',
                    title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('EXPORT_TO_CSV') : constants_1.Constants.TEXT_EXPORT_IN_CSV_FORMAT,
                    disabled: false,
                    command: 'export-csv',
                    positionOrder: 53
                });
            }
            // show grid menu: export to text file as tab delimited
            if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableExport && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideExportTextDelimitedCommand) {
                gridMenuCustomItems.push({
                    iconCssClass: this.sharedService.gridOptions.gridMenu.iconExportTextDelimitedCommand || 'fa fa-download',
                    title: this.sharedService.gridOptions.enableTranslate ? this.i18n.tr('EXPORT_TO_TAB_DELIMITED') : constants_1.Constants.TEXT_EXPORT_IN_TEXT_FORMAT,
                    disabled: false,
                    command: 'export-text-delimited',
                    positionOrder: 54
                });
            }
            // add the custom "Commands" title if there are any commands
            if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && (gridMenuCustomItems.length > 0 || (this.sharedService.gridOptions.gridMenu.customItems && this.sharedService.gridOptions.gridMenu.customItems.length > 0))) {
                this.sharedService.gridOptions.gridMenu.customTitle = this.sharedService.gridOptions.gridMenu.customTitle || this.extensionUtility.getPickerTitleOutputString('customTitle', 'gridMenu');
            }
            return gridMenuCustomItems;
        };
        /** Execute the Header Menu Commands that was triggered by the onCommand subscribe */
        GridMenuExtension.prototype.executeHeaderMenuInternalCommands = function (e, args) {
            if (args && args.command) {
                switch (args.command) {
                    case 'hide':
                        this.hideColumn(args.column);
                        if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableAutoSizeColumns) {
                            this.sharedService.grid.autosizeColumns();
                        }
                        break;
                    case 'sort-asc':
                    case 'sort-desc':
                        // get previously sorted columns
                        var cols = this.sortService.getPreviousColumnSorts(args.column.id + '');
                        // add to the column array, the column sorted by the header menu
                        cols.push({ sortCol: args.column, sortAsc: (args.command === 'sort-asc') });
                        if (this.sharedService.gridOptions.backendServiceApi) {
                            this.sortService.onBackendSortChanged(e, { multiColumnSort: true, sortCols: cols, grid: this.sharedService.grid });
                        }
                        else {
                            this.sortService.onLocalSortChanged(this.sharedService.grid, this.sharedService.dataView, cols);
                        }
                        // update the this.sharedService.gridObj sortColumns array which will at the same add the visual sort icon(s) on the UI
                        var newSortColumns = cols.map(function (col) {
                            return {
                                columnId: col && col.sortCol && col.sortCol.id,
                                sortAsc: col && col.sortAsc
                            };
                        });
                        this.sharedService.grid.setSortColumns(newSortColumns); // add sort icon in UI
                        break;
                    default:
                        break;
                }
            }
        };
        /** Hide a column from the grid */
        GridMenuExtension.prototype.hideColumn = function (column) {
            if (this.sharedService.grid && this.sharedService.grid.getColumns && this.sharedService.grid.setColumns) {
                var columnIndex = this.sharedService.grid.getColumnIndex(column.id);
                this.sharedService.visibleColumns = this.extensionUtility.arrayRemoveItemByIndex(this.sharedService.grid.getColumns(), columnIndex);
                this.sharedService.grid.setColumns(this.sharedService.visibleColumns);
            }
        };
        /** Translate the Grid Menu titles and column picker */
        GridMenuExtension.prototype.translateGridMenu = function () {
            // update the properties by pointers, that is the only way to get Grid Menu Control to see the new values
            // we also need to call the control init so that it takes the new Grid object with latest values
            if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu) {
                this.sharedService.gridOptions.gridMenu.customItems = [];
                this.emptyGridMenuTitles();
                // merge original user grid menu items with internal items
                // then sort all Grid Menu Custom Items (sorted by pointer, no need to use the return)
                this.sharedService.gridOptions.gridMenu.customItems = (this.userOriginalGridMenu.customItems || []).concat(this.addGridMenuCustomCommands());
                this.extensionUtility.translateItems(this.sharedService.gridOptions.gridMenu.customItems, 'titleKey', 'title');
                this.extensionUtility.sortItems(this.sharedService.gridOptions.gridMenu.customItems, 'positionOrder');
                this.sharedService.gridOptions.gridMenu.columnTitle = this.extensionUtility.getPickerTitleOutputString('columnTitle', 'gridMenu');
                this.sharedService.gridOptions.gridMenu.forceFitTitle = this.extensionUtility.getPickerTitleOutputString('forceFitTitle', 'gridMenu');
                this.sharedService.gridOptions.gridMenu.syncResizeTitle = this.extensionUtility.getPickerTitleOutputString('syncResizeTitle', 'gridMenu');
                // translate all columns (including non-visible)
                this.extensionUtility.translateItems(this.sharedService.allColumns, 'headerKey', 'name');
                // re-initialize the Grid Menu, that will recreate all the menus & list
                // doing an "init()" won't drop any existing command attached
                if (this._extension.init) {
                    this._extension.init(this.sharedService.grid);
                }
            }
        };
        GridMenuExtension.prototype.emptyGridMenuTitles = function () {
            if (this.sharedService && this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu) {
                this.sharedService.gridOptions.gridMenu.customTitle = '';
                this.sharedService.gridOptions.gridMenu.columnTitle = '';
                this.sharedService.gridOptions.gridMenu.forceFitTitle = '';
                this.sharedService.gridOptions.gridMenu.syncResizeTitle = '';
            }
        };
        /**
         * @return default Grid Menu options
         */
        GridMenuExtension.prototype.getDefaultGridMenuOptions = function () {
            return {
                customTitle: undefined,
                columnTitle: this.extensionUtility.getPickerTitleOutputString('columnTitle', 'gridMenu'),
                forceFitTitle: this.extensionUtility.getPickerTitleOutputString('forceFitTitle', 'gridMenu'),
                syncResizeTitle: this.extensionUtility.getPickerTitleOutputString('syncResizeTitle', 'gridMenu'),
                iconCssClass: 'fa fa-bars',
                menuWidth: 18,
                customItems: [],
                hideClearAllFiltersCommand: false,
                hideRefreshDatasetCommand: false,
                hideToggleFilterCommand: false,
            };
        };
        GridMenuExtension = __decorate([
            aurelia_framework_1.singleton(true),
            aurelia_framework_1.inject(export_service_1.ExportService, extensionUtility_1.ExtensionUtility, filter_service_1.FilterService, aurelia_i18n_1.I18N, shared_service_1.SharedService, sort_service_1.SortService)
        ], GridMenuExtension);
        return GridMenuExtension;
    }());
    exports.GridMenuExtension = GridMenuExtension;
});
//# sourceMappingURL=gridMenuExtension.js.map