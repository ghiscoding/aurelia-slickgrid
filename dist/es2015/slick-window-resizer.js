var _dec, _class;

import { inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import $ from 'jquery';

const DATAGRID_MIN_HEIGHT = 180;
const DATAGRID_MIN_WIDTH = 300;
const DATAGRID_BOTTOM_PADDING = 20;
const DATAGRID_PAGER_HEIGHT = 35;

export let SlickWindowResizer = (_dec = inject(EventAggregator), _dec(_class = class SlickWindowResizer {

  constructor(eventAggregator) {
    this.grid = {};
    this.gridId = '';
    this.gridOptions = {};

    this.ea = eventAggregator;
  }

  attachAutoResizeDataGrid(grid, gridOptions) {
    this.grid = grid;
    this.gridId = gridOptions.gridId;
    this.gridOptions = gridOptions;
    let self = this;

    this.resizeToFitBrowserWindow();

    $(window).on('resize', function () {
      self.resizeToFitBrowserWindow();
    });

    this.ea.subscribe('router:navigation:processing', event => {
      $(window).trigger('resize').off('resize');
    });
  }

  calculateGridNewDimensions(gridOptions) {
    if (!$(`#${ gridOptions.gridId }`)) {
      $(window).off('resize');
      return null;
    }

    let bottomPadding = typeof gridOptions.autoResizeBottomPadding === 'undefined' ? DATAGRID_BOTTOM_PADDING : parseInt(gridOptions.autoResizeBottomPadding, 10);
    if (!!gridOptions.useExternalPagination) {
      bottomPadding += DATAGRID_PAGER_HEIGHT;
    }
    let availableHeight = $(window).height() - $(`#${ gridOptions.gridId }`).offset().top - parseInt(bottomPadding, 10);
    let availableWidth = $('#' + gridOptions.gridContainerId).width();
    let minHeight = typeof gridOptions.autoResizeMinHeight === 'undefined' ? DATAGRID_MIN_HEIGHT : parseInt(gridOptions.autoResizeMinHeight, 10);
    let minWidth = typeof gridOptions.autoResizeMinWidth === 'undefined' ? DATAGRID_MIN_WIDTH : parseInt(gridOptions.autoResizeMinWidth, 10);

    let newHeight = availableHeight;
    let newWidth = availableWidth;
    if (newHeight < minHeight) {
      newHeight = minHeight;
    }
    if (newWidth < minWidth) {
      newWidth = minWidth;
    }

    if (typeof gridOptions.autoResizeHeight !== 'undefined') {
      if (gridOptions.autoResizeHeight.indexOf('px') !== -1) {
        newHeight = gridOptions.autoResizeHeight;
      } else {
        newHeight = availableHeight * parseInt(gridOptions.autoResizeHeight, 10) / 100;

        if (newHeight < minHeight) {
          newHeight = minHeight;
        }
      }
    }
    if (typeof gridOptions.autoResizeWidth !== 'undefined') {
      if (gridOptions.autoResizeWidth.indexOf('px') !== -1) {
        newWidth = gridOptions.autoResizeWidth;
      } else {
        newWidth = availableWidth * parseInt(gridOptions.autoResizeWidth, 10) / 100;

        if (newWidth < minWidth) {
          newWidth = minWidth;
        }
      }
    }

    return {
      height: newHeight,
      width: newWidth
    };
  }

  resizeToFitBrowserWindow() {
    let newSizes = this.calculateGridNewDimensions(this.gridOptions);

    if (newSizes) {
      $(`#${ this.gridId }`).height(newSizes.height);
      $(`#${ this.gridId }`).width(newSizes.width);

      if (new RegExp('MSIE [6-8]').exec(navigator.userAgent) === null && this.grid) {
        this.grid.resizeCanvas();
      }
    }
  }
}) || _class);