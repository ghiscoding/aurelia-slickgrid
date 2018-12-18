System.register(["aurelia-event-aggregator", "aurelia-framework", "jquery"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var aurelia_event_aggregator_1, aurelia_framework_1, $, GroupingAndColspanService;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (aurelia_event_aggregator_1_1) {
                aurelia_event_aggregator_1 = aurelia_event_aggregator_1_1;
            },
            function (aurelia_framework_1_1) {
                aurelia_framework_1 = aurelia_framework_1_1;
            },
            function ($_1) {
                $ = $_1;
            }
        ],
        execute: function () {
            GroupingAndColspanService = /** @class */ (function () {
                function GroupingAndColspanService(ea) {
                    this.ea = ea;
                    this._eventHandler = new Slick.EventHandler();
                }
                Object.defineProperty(GroupingAndColspanService.prototype, "_gridOptions", {
                    /** Getter for the Grid Options pulled through the Grid Object */
                    get: function () {
                        return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(GroupingAndColspanService.prototype, "_columnDefinitions", {
                    /** Getter for the Column Definitions pulled through the Grid Object */
                    get: function () {
                        return (this._grid && this._grid.getColumns) ? this._grid.getColumns() : [];
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Initialize the Service
                 * @param grid
                 * @param dataView
                 */
                GroupingAndColspanService.prototype.init = function (grid, dataView) {
                    var _this = this;
                    this._grid = grid;
                    this._dataView = dataView;
                    this.aureliaEventPrefix = (this._gridOptions && this._gridOptions.defaultAureliaEventPrefix) ? this._gridOptions.defaultAureliaEventPrefix : 'asg';
                    if (grid && this._gridOptions) {
                        // When dealing with Pre-Header Grouping colspan, we need to re-create the pre-header in multiple occasions
                        // for all these occasions, we have to trigger a re-create
                        if (this._gridOptions.createPreHeaderPanel) {
                            this._eventHandler.subscribe(grid.onSort, function (e, args) {
                                _this.createPreHeaderRowGroupingTitle();
                            });
                            this._eventHandler.subscribe(grid.onColumnsResized, function (e, args) {
                                _this.createPreHeaderRowGroupingTitle();
                            });
                            this._eventHandler.subscribe(dataView.onRowCountChanged, function (e, args) {
                                _this.createPreHeaderRowGroupingTitle();
                            });
                            // also not sure why at this point, but it seems that I need to call the 1st create in a delayed execution
                            // probably some kind of timing issues and delaying it until the grid is fully ready does help
                            setTimeout(function () {
                                _this.createPreHeaderRowGroupingTitle();
                            }, 50);
                        }
                    }
                };
                GroupingAndColspanService.prototype.dispose = function () {
                    // unsubscribe all SlickGrid events
                    this._eventHandler.unsubscribeAll();
                };
                GroupingAndColspanService.prototype.createPreHeaderRowGroupingTitle = function () {
                    var $preHeaderPanel = $(this._grid.getPreHeaderPanel())
                        .empty()
                        .addClass('slick-header-columns')
                        .css('left', '-1000px')
                        .width(this._grid.getHeadersWidth());
                    $preHeaderPanel.parent().addClass('slick-header');
                    var headerColumnWidthDiff = this._grid.getHeaderColumnWidthDiff() || 0;
                    var columnDef;
                    var header;
                    var lastColumnGroup = '';
                    var widthTotal = 0;
                    for (var i = 0; i < this._columnDefinitions.length; i++) {
                        columnDef = this._columnDefinitions[i];
                        if (columnDef) {
                            if (lastColumnGroup === columnDef.columnGroup && i > 0) {
                                widthTotal += columnDef.width || 0;
                                if (header && header.width) {
                                    header.width(widthTotal - headerColumnWidthDiff);
                                }
                            }
                            else {
                                widthTotal = columnDef.width || 0;
                                header = $("<div class=\"ui-state-default slick-header-column\" />")
                                    .html("<span class=\"slick-column-name\">" + (columnDef.columnGroup || '') + "</span>")
                                    .width((columnDef.width || 0) - headerColumnWidthDiff)
                                    .appendTo($preHeaderPanel);
                            }
                            lastColumnGroup = columnDef.columnGroup || '';
                        }
                    }
                };
                GroupingAndColspanService = __decorate([
                    aurelia_framework_1.singleton(true),
                    aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator)
                ], GroupingAndColspanService);
                return GroupingAndColspanService;
            }());
            exports_1("GroupingAndColspanService", GroupingAndColspanService);
        }
    };
});
//# sourceMappingURL=groupingAndColspan.service.js.map