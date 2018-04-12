"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var aurelia_event_aggregator_1 = require("aurelia-event-aggregator");
var aurelia_framework_1 = require("aurelia-framework");
var $ = require("jquery");
var GroupingAndColspanService = /** @class */ (function () {
    function GroupingAndColspanService(ea) {
        this.ea = ea;
        this._eventHandler = new Slick.EventHandler();
    }
    GroupingAndColspanService.prototype.init = function (grid, dataView) {
        var _this = this;
        this._grid = grid;
        this._dataView = dataView;
        if (grid) {
            this._gridOptions = grid.getOptions();
            this._columnDefinitions = grid.getColumns();
        }
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
        aurelia_framework_1.inject(aurelia_event_aggregator_1.EventAggregator)
    ], GroupingAndColspanService);
    return GroupingAndColspanService;
}());
exports.GroupingAndColspanService = GroupingAndColspanService;
//# sourceMappingURL=groupingAndColspan.service.js.map