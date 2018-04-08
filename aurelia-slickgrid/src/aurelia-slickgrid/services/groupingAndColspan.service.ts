import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { inject } from 'aurelia-framework';
import {
  Column,
  GridOption
} from './../models/index';
import * as $ from 'jquery';

// using external non-typed js libraries
declare var Slick: any;

@inject(EventAggregator)
export class GroupingAndColspanService {
  private _eventHandler = new Slick.EventHandler();
  private _dataView: any;
  private _grid: any;
  private _gridOptions: GridOption;
  private _columnDefinitions: Column[];
  aureliaEventPrefix: string;

  constructor(private ea: EventAggregator) { }

  init(grid: any, dataView: any) {
    this._grid = grid;
    this._dataView = dataView;
    if (grid) {
      this._gridOptions = grid.getOptions();
      this._columnDefinitions = grid.getColumns();
    }

    this.aureliaEventPrefix = (this._gridOptions && this._gridOptions.defaultAureliaEventPrefix) ? this._gridOptions.defaultAureliaEventPrefix : 'asg';

    // When dealing with Pre-Header Grouping colspan, we need to re-create the pre-header in multiple occasions
    // for all these occasions, we have to trigger a re-create
    if (this._gridOptions.createPreHeaderPanel) {
      this._eventHandler.subscribe(grid.onSort, (e: Event, args: any) => {
        this.createPreHeaderRowGroupingTitle();
      });
      this._eventHandler.subscribe(grid.onColumnsResized, (e: Event, args: any) => {
        this.createPreHeaderRowGroupingTitle();
      });
      this._eventHandler.subscribe(dataView.onRowCountChanged, (e: Event, args: any) => {
        this.createPreHeaderRowGroupingTitle();
      });

      // also not sure why at this point, but it seems that I need to call the 1st create in a delayed execution
      // probably some kind of timing issues and delaying it until the grid is fully ready does help
      setTimeout(() => {
        this.createPreHeaderRowGroupingTitle();
      }, 50);
    }
  }

  dispose() {
    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();
  }

  createPreHeaderRowGroupingTitle() {
    const $preHeaderPanel = $(this._grid.getPreHeaderPanel())
      .empty()
      .addClass('slick-header-columns')
      .css('left', '-1000px')
      .width(this._grid.getHeadersWidth());
    $preHeaderPanel.parent().addClass('slick-header');
    const headerColumnWidthDiff = this._grid.getHeaderColumnWidthDiff();
    let m;
    let header;
    let lastColumnGroup = '';
    let widthTotal = 0;

    for (let i = 0; i < this._columnDefinitions.length; i++) {
      m = this._columnDefinitions[i];
      if (lastColumnGroup === m.columnGroup && i > 0) {
        widthTotal += m.width;
        header.width(widthTotal - headerColumnWidthDiff);
      } else {
        widthTotal = m.width;
        header = $(`<div class="ui-state-default slick-header-column" />`)
          .html(`<span class="slick-column-name">${m.columnGroup || ''}</span>`)
          .width(m.width - headerColumnWidthDiff)
          .appendTo($preHeaderPanel);
      }
      lastColumnGroup = m.columnGroup;
    }
  }
}
