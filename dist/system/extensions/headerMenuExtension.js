System.register(["aurelia-framework", "aurelia-i18n", "../constants", "../models/index", "../services/sort.service", "../services/shared.service", "./extensionUtility"], function (exports_1, context_1) {
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
    var __moduleName = context_1 && context_1.id;
    var aurelia_framework_1, aurelia_i18n_1, constants_1, index_1, sort_service_1, shared_service_1, extensionUtility_1, HeaderMenuExtension;
    return {
        setters: [
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function (aurelia_i18n_1_1) {
                aurelia_i18n_1 = aurelia_i18n_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (sort_service_1_1) {
                sort_service_1 = sort_service_1_1;
            },
            function (shared_service_1_1) {
                shared_service_1 = shared_service_1_1;
            },
            function (extensionUtility_1_1) {
                extensionUtility_1 = extensionUtility_1_1;
            }
        ],
        execute: function () {
            HeaderMenuExtension = /** @class */ (function () {
                function HeaderMenuExtension(extensionUtility, i18n, sharedService, sortService) {
                    this.extensionUtility = extensionUtility;
                    this.i18n = i18n;
                    this.sharedService = sharedService;
                    this.sortService = sortService;
                    this._eventHandler = new Slick.EventHandler();
                }
                HeaderMenuExtension.prototype.dispose = function () {
                    // unsubscribe all SlickGrid events
                    this._eventHandler.unsubscribeAll();
                    if (this._extension && this._extension.destroy) {
                        this._extension.destroy();
                    }
                };
                /**
                 * Create the Header Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...)
                 * @param grid
                 * @param dataView
                 * @param columnDefinitions
                 */
                HeaderMenuExtension.prototype.register = function () {
                    var _this = this;
                    if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
                        // dynamically import the SlickGrid plugin with requireJS
                        this.extensionUtility.loadExtensionDynamically(index_1.ExtensionName.headerMenu);
                        this.sharedService.gridOptions.headerMenu = __assign({}, this.getDefaultHeaderMenuOptions(), this.sharedService.gridOptions.headerMenu);
                        if (this.sharedService.gridOptions.enableHeaderMenu) {
                            this.sharedService.gridOptions.headerMenu = this.addHeaderMenuCustomCommands(this.sharedService.gridOptions, this.sharedService.columnDefinitions);
                        }
                        this._extension = new Slick.Plugins.HeaderMenu(this.sharedService.gridOptions.headerMenu);
                        this.sharedService.grid.registerPlugin(this._extension);
                        this._eventHandler.subscribe(this._extension.onCommand, function (e, args) {
                            _this.executeHeaderMenuInternalCommands(e, args);
                            if (_this.sharedService.gridOptions.headerMenu && typeof _this.sharedService.gridOptions.headerMenu.onCommand === 'function') {
                                _this.sharedService.gridOptions.headerMenu.onCommand(e, args);
                            }
                        });
                        this._eventHandler.subscribe(this._extension.onBeforeMenuShow, function (e, args) {
                            if (_this.sharedService.gridOptions.headerMenu && typeof _this.sharedService.gridOptions.headerMenu.onBeforeMenuShow === 'function') {
                                _this.sharedService.gridOptions.headerMenu.onBeforeMenuShow(e, args);
                            }
                        });
                        return this._extension;
                    }
                    return null;
                };
                /**
                 * Create Header Menu with Custom Commands if user has enabled Header Menu
                 * @param options
                 * @param columnDefinitions
                 * @return header menu
                 */
                HeaderMenuExtension.prototype.addHeaderMenuCustomCommands = function (options, columnDefinitions) {
                    var _this = this;
                    var headerMenuOptions = options.headerMenu || {};
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
                                var columnHeaderMenuItems = columnDef && columnDef.header && columnDef.header.menu && columnDef.header.menu.items || [];
                                // Sorting Commands
                                if (options.enableSorting && columnDef.sortable && headerMenuOptions && !headerMenuOptions.hideSortCommands) {
                                    if (columnHeaderMenuItems.filter(function (item) { return item.command === 'sort-asc'; }).length === 0) {
                                        columnHeaderMenuItems.push({
                                            iconCssClass: headerMenuOptions.iconSortAscCommand || 'fa fa-sort-asc',
                                            title: options.enableTranslate ? _this.i18n.tr('SORT_ASCENDING') : constants_1.Constants.TEXT_SORT_ASCENDING,
                                            command: 'sort-asc',
                                            positionOrder: 50
                                        });
                                    }
                                    if (columnHeaderMenuItems.filter(function (item) { return item.command === 'sort-desc'; }).length === 0) {
                                        columnHeaderMenuItems.push({
                                            iconCssClass: headerMenuOptions.iconSortDescCommand || 'fa fa-sort-desc',
                                            title: options.enableTranslate ? _this.i18n.tr('SORT_DESCENDING') : constants_1.Constants.TEXT_SORT_DESCENDING,
                                            command: 'sort-desc',
                                            positionOrder: 51
                                        });
                                    }
                                }
                                // Hide Column Command
                                if (headerMenuOptions && !headerMenuOptions.hideColumnHideCommand && columnHeaderMenuItems.filter(function (item) { return item.command === 'hide'; }).length === 0) {
                                    columnHeaderMenuItems.push({
                                        iconCssClass: headerMenuOptions.iconColumnHideCommand || 'fa fa-times',
                                        title: options.enableTranslate ? _this.i18n.tr('HIDE_COLUMN') : constants_1.Constants.TEXT_HIDE_COLUMN,
                                        command: 'hide',
                                        positionOrder: 52
                                    });
                                }
                                _this.extensionUtility.translateItems(columnHeaderMenuItems, 'titleKey', 'title');
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
                HeaderMenuExtension.prototype.executeHeaderMenuInternalCommands = function (e, args) {
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
                HeaderMenuExtension.prototype.hideColumn = function (column) {
                    if (this.sharedService.grid && this.sharedService.grid.getColumns && this.sharedService.grid.setColumns) {
                        var columnIndex = this.sharedService.grid.getColumnIndex(column.id);
                        this.sharedService.visibleColumns = this.extensionUtility.arrayRemoveItemByIndex(this.sharedService.grid.getColumns(), columnIndex);
                        this.sharedService.grid.setColumns(this.sharedService.visibleColumns);
                    }
                };
                /**
                 * Reset all the Grid Menu options which have text to translate
                 * @param grid menu object
                 */
                HeaderMenuExtension.prototype.resetHeaderMenuTranslations = function (columnDefinitions) {
                    var _this = this;
                    columnDefinitions.forEach(function (columnDef) {
                        if (columnDef && columnDef.header && columnDef.header && columnDef.header.menu && columnDef.header.menu.items) {
                            if (!columnDef.excludeFromHeaderMenu) {
                                var columnHeaderMenuItems_1 = columnDef.header.menu.items || [];
                                columnHeaderMenuItems_1.forEach(function (item) {
                                    switch (item.command) {
                                        case 'sort-asc':
                                            item.title = _this.i18n.tr('SORT_ASCENDING') || constants_1.Constants.TEXT_SORT_ASCENDING;
                                            break;
                                        case 'sort-desc':
                                            item.title = _this.i18n.tr('SORT_DESCENDING') || constants_1.Constants.TEXT_SORT_DESCENDING;
                                            break;
                                        case 'hide':
                                            item.title = _this.i18n.tr('HIDE_COLUMN') || constants_1.Constants.TEXT_HIDE_COLUMN;
                                            break;
                                    }
                                    // re-translate if there's a "titleKey"
                                    if (_this.sharedService.gridOptions && _this.sharedService.gridOptions.enableTranslate) {
                                        _this.extensionUtility.translateItems(columnHeaderMenuItems_1, 'titleKey', 'title');
                                    }
                                });
                            }
                        }
                    });
                };
                /**
                 * Translate the Header Menu titles, we need to loop through all column definition to re-translate them
                 */
                HeaderMenuExtension.prototype.translateHeaderMenu = function () {
                    if (this.sharedService.gridOptions && this.sharedService.gridOptions.headerMenu) {
                        this.resetHeaderMenuTranslations(this.sharedService.visibleColumns);
                    }
                };
                /**
                 * @return default Header Menu options
                 */
                HeaderMenuExtension.prototype.getDefaultHeaderMenuOptions = function () {
                    return {
                        autoAlignOffset: 12,
                        minWidth: 140,
                        hideColumnHideCommand: false,
                        hideSortCommands: false,
                        title: ''
                    };
                };
                HeaderMenuExtension = __decorate([
                    aurelia_framework_1.singleton(true),
                    aurelia_framework_1.inject(extensionUtility_1.ExtensionUtility, aurelia_i18n_1.I18N, shared_service_1.SharedService, sort_service_1.SortService)
                ], HeaderMenuExtension);
                return HeaderMenuExtension;
            }());
            exports_1("HeaderMenuExtension", HeaderMenuExtension);
        }
    };
});
//# sourceMappingURL=headerMenuExtension.js.map