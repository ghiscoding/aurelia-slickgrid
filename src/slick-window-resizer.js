import {inject} from 'aurelia-framework';
import {EventAggregator} from 'aurelia-event-aggregator';
import $ from 'jquery';

// global constants, height/width are in pixels
const DATAGRID_MIN_HEIGHT = 180;
const DATAGRID_MIN_WIDTH = 300;
const DATAGRID_BOTTOM_PADDING = 20;
const DATAGRID_PAGER_HEIGHT = 35;

@inject(EventAggregator)
export class SlickWindowResizer {
  grid = {};
  gridId = '';
  gridOptions = {};

  constructor(eventAggregator) {
    this.ea = eventAggregator;
  }

  /** Attach an auto resize trigger on the datagrid, if that is enable then it will resize itself to the available space
   * Options: we could also provide a % factor to resize on each height/width independently
   */
  attachAutoResizeDataGrid(grid, gridOptions) {
    this.grid = grid;
    this.gridId = gridOptions.gridId;
    this.gridOptions = gridOptions;
    let self = this;

    //-- 1st resize the datagrid size at first load (we need this because the .on event is not triggered on first load)
    this.resizeToFitBrowserWindow();

    //-- 2nd attach a trigger on the Window DOM element, so that it happens also when resizing after first load
    //-- attach auto-resize to Window object only if it exist
    $(window).on('resize', function() {
      self.resizeToFitBrowserWindow();
    });

    // destroy the resizer on route change
    this.ea.subscribe('router:navigation:processing', event => {
      $(window).trigger('resize').off('resize');
    });
  }

  /**
   * Private function, calculate the datagrid new height/width from the available space, also consider that a % factor might be applied to calculation
   * object gridOptions
   */
  calculateGridNewDimensions(gridOptions) {
    // find the available height/width that is leftover on the window
    if (!$(`#${gridOptions.gridId}`)) {
      $(window).off('resize');
      return null;
    }

    let bottomPadding = (typeof gridOptions.autoResizeBottomPadding === 'undefined') ? DATAGRID_BOTTOM_PADDING : parseInt(gridOptions.autoResizeBottomPadding, 10);
    if (!!gridOptions.useExternalPagination) {
      bottomPadding += DATAGRID_PAGER_HEIGHT; // add pager height to bottom padding
    }
    let availableHeight = $(window).height() - $(`#${gridOptions.gridId}`).offset().top - parseInt(bottomPadding, 10);
    let availableWidth = $('#' + gridOptions.gridContainerId).width();
    let minHeight = (typeof gridOptions.autoResizeMinHeight === 'undefined') ? DATAGRID_MIN_HEIGHT : parseInt(gridOptions.autoResizeMinHeight, 10);
    let minWidth = (typeof gridOptions.autoResizeMinWidth === 'undefined') ? DATAGRID_MIN_WIDTH : parseInt(gridOptions.autoResizeMinWidth, 10);

    let newHeight = availableHeight;
    let newWidth = availableWidth;
    if (newHeight < minHeight) {
      newHeight = minHeight;
    }
    if (newWidth < minWidth) {
      newWidth = minWidth;
    }

    // possible height/width taking a percentage portion of the screen (default at 100%)
    if (typeof gridOptions.autoResizeHeight !== 'undefined') {
      if (gridOptions.autoResizeHeight.indexOf('px') !== -1) {
        newHeight = gridOptions.autoResizeHeight;
      } else {
        newHeight = (availableHeight * parseInt(gridOptions.autoResizeHeight, 10)) / 100;

        // we still request the height to be a minimum set by the constant or by a user custom property
        if (newHeight < minHeight) {
          newHeight = minHeight;
        }
      }
    }
    if (typeof gridOptions.autoResizeWidth !== 'undefined') {
      if (gridOptions.autoResizeWidth.indexOf('px') !== -1) {
        newWidth = gridOptions.autoResizeWidth;
      } else {
        newWidth = (availableWidth * parseInt(gridOptions.autoResizeWidth, 10)) / 100;

        // we still request the height to be a minimum set by the constant or by a user custom property
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

  /** Private function, resize the datagrid to fit the browser height & width */
  resizeToFitBrowserWindow() {
    // calculate new available sizes but with minimum height of 220px
    let newSizes = this.calculateGridNewDimensions(this.gridOptions);

    if (newSizes) {
      // apply these new height/width to the datagrid
      $(`#${this.gridId}`).height(newSizes.height);
      $(`#${this.gridId}`).width(newSizes.width);

      // resize the slickgrid canvas on all browser except some IE versions
      // exclude all IE below IE11
      // IE11 wants to be a better standard (W3C) follower (finally) they even changed their appName output to also have 'Netscape'
      if (new RegExp('MSIE [6-8]').exec(navigator.userAgent) === null && this.grid) {
        this.grid.resizeCanvas();
      }
    }
  }
}
