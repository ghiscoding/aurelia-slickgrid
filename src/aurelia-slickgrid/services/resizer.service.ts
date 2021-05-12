import {
  FieldType,
  GetSlickEventType,
  GridSize,
  parseFormatterWhenExist,
  sanitizeHtmlToText,
  SlickDataView,
  SlickEventData,
  SlickEventHandler,
  SlickNamespace,
  SlickResizer,
} from '@slickgrid-universal/common';
import { inject, singleton } from 'aurelia-framework';

import { GridOption, SlickGrid } from '../models/index';
import { PubSubService } from './pubSub.service';

// using external non-typed js libraries
declare const Slick: SlickNamespace;
const DATAGRID_FOOTER_HEIGHT = 25;
const DATAGRID_PAGINATION_HEIGHT = 35;

@singleton(true)
@inject(PubSubService)
export class ResizerService {
  private _grid!: SlickGrid;
  private _addon!: SlickResizer;
  private _eventHandler: SlickEventHandler;
  private _gridParentContainerElm?: HTMLElement;
  private _lastDimensions?: GridSize;
  private _totalColumnsWidthByContent = 0;

  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }

  /** Getter for the Grid Options pulled through the Grid Object */
  get gridOptions(): GridOption {
    return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
  }

  /** Getter for the SlickGrid DataView */
  get dataView(): SlickDataView {
    return this._grid?.getData() as SlickDataView;
  }

  constructor(private readonly pubSubService: PubSubService) {
    this._eventHandler = new Slick.EventHandler();
  }

  /** Get the instance of the SlickGrid addon (control or plugin). */
  getAddonInstance(): SlickResizer | null {
    return this._addon;
  }

  /** dispose (destroy) the 3rd party plugin */
  dispose() {
    this._addon?.destroy();
    this._eventHandler?.unsubscribeAll();
  }

  init(grid: SlickGrid, gridParentContainerElm?: HTMLElement) {
    this._grid = grid;
    this._gridParentContainerElm = gridParentContainerElm;

    if (gridParentContainerElm) {
      const fixedGridDimensions = (this.gridOptions?.gridHeight || this.gridOptions?.gridWidth) ? { height: this.gridOptions?.gridHeight, width: this.gridOptions?.gridWidth } : undefined;
      const autoResizeOptions = this.gridOptions?.autoResize ?? { bottomPadding: 0 };
      if (autoResizeOptions?.bottomPadding !== undefined && this.gridOptions?.showCustomFooter) {
        const footerHeight: string | number = this.gridOptions?.customFooterOptions?.footerHeight ?? DATAGRID_FOOTER_HEIGHT;
        autoResizeOptions.bottomPadding += parseInt(`${footerHeight}`, 10);
      }
      if (autoResizeOptions?.bottomPadding !== undefined && this.gridOptions?.enablePagination) {
        autoResizeOptions.bottomPadding += DATAGRID_PAGINATION_HEIGHT;
      }
      if (fixedGridDimensions?.width && gridParentContainerElm?.style) {
        gridParentContainerElm.style.width = typeof fixedGridDimensions.width === 'string' ? fixedGridDimensions.width : `${fixedGridDimensions.width}px`;
      }

      this._addon = new Slick.Plugins.Resizer({ ...autoResizeOptions, gridContainer: gridParentContainerElm }, fixedGridDimensions);
      this._grid.registerPlugin<SlickResizer>(this._addon);
      if (this.gridOptions.enableAutoResize && this._addon?.resizeGrid() instanceof Promise) {
        this._addon.resizeGrid()
          .catch((rejection: any) => console.log('Error:', rejection));
      }

      // Events
      if (this.gridOptions.autoResize) {
        if (this._addon && this._addon.onGridAfterResize) {
          const onGridAfterResizeHandler = this._addon.onGridAfterResize;
          (this._eventHandler as SlickEventHandler<GetSlickEventType<typeof onGridAfterResizeHandler>>).subscribe(onGridAfterResizeHandler, (_e, args) => {
            this.pubSubService.publish('onGridAfterResize', args);

            // we can call our resize by content here (when enabled)
            // since the core Slick.Resizer plugin only supports the "autosizeColumns"
            if (this.gridOptions.enableAutoResizeColumnsByCellContent && (!this._lastDimensions?.width || args.dimensions.width !== this._lastDimensions?.width)) {
              this.resizeColumnsByCellContent();
            }
            this._lastDimensions = args.dimensions;
          });
        }
        if (this._addon && this._addon.onGridBeforeResize) {
          const onGridBeforeResizeHandler = this._addon.onGridBeforeResize;
          (this._eventHandler as SlickEventHandler<GetSlickEventType<typeof onGridBeforeResizeHandler>>).subscribe(onGridBeforeResizeHandler, (_e, args) => {
            this.pubSubService.publish('onGridBeforeResize', args);
          });
        }
      }
    }
  }

  /**
   * Return the last resize dimensions used by the service
   * @return {object} last dimensions (height, width)
   */
  getLastResizeDimensions(): GridSize {
    return this._addon?.getLastResizeDimensions();
  }

  /**
   * Provide the possibility to pause the resizer for some time, until user decides to re-enabled it later if he wish to.
   * @param {boolean} isResizePaused are we pausing the resizer?
   */
  pauseResizer(isResizePaused: boolean) {
    this._addon.pauseResizer(isResizePaused);
  }

  /**
   * Resize the datagrid to fit the browser height & width.
   * @param {number} delay to wait before resizing, defaults to 0 (in milliseconds)
   * @param {object} newSizes can optionally be passed (height, width)
   * @param {object} event that triggered the resize, defaults to null
   * @return If the browser supports it, we can return a Promise that would resolve with the new dimensions
   */
  resizeGrid(delay?: number, newSizes?: GridSize, event?: SlickEventData): Promise<GridSize> | null {
    return this._addon?.resizeGrid(delay, newSizes, event);
  }

  /**
   * Resize each column width by their cell text/value content (this could potentially go wider than the viewport and end up showing an horizontal scroll).
   * This operation requires to loop through each dataset item to inspect each cell content width and has a performance cost associated to this process.
   *
   * NOTE: please that for performance reasons we will only inspect the first 1000 rows,
   * however user could override it by using the grid option `resizeMaxItemToInspectCellContentWidth` to increase/decrease how many items to inspect.
   * @param {Boolean} recalculateColumnsTotalWidth - defaults to false, do we want to recalculate the necessary total columns width even if it was already calculated?
   */
  resizeColumnsByCellContent(recalculateColumnsTotalWidth = false) {
    const columnDefinitions = this._grid.getColumns();
    const dataset = this.dataView.getItems() as any[];
    const columnWidths: { [columnId in string | number]: number; } = {};
    let reRender = false;

    if (!Array.isArray(dataset) || dataset.length === 0) {
      return;
    }

    // read a few optional resize by content grid options
    const resizeCellCharWidthInPx = this.gridOptions.resizeCellCharWidthInPx ?? 7; // width in pixels of a string character, this can vary depending on which font family/size is used & cell padding
    const resizeCellPaddingWidthInPx = this.gridOptions.resizeCellPaddingWidthInPx ?? 6;
    const resizeFormatterPaddingWidthInPx = this.gridOptions.resizeFormatterPaddingWidthInPx ?? 6;
    const resizeMaxItemToInspectCellContentWidth = this.gridOptions.resizeMaxItemToInspectCellContentWidth ?? 1000; // how many items do we want to analyze cell content with widest width

    // calculate total width necessary by each cell content
    // we won't re-evaluate if we already had calculated the total
    if (this._totalColumnsWidthByContent === 0 || recalculateColumnsTotalWidth) {
      // loop through all columns to get their minWidth or width for later usage
      for (const columnDef of columnDefinitions) {
        columnWidths[columnDef.id] = columnDef.originalWidth ?? columnDef.minWidth ?? 0;
      }

      // loop through the entire dataset (limit to first 1000 rows), and evaluate the width by its content
      // if we have a Formatter, we will also potentially add padding
      dataset.every((item: any, rowIdx: number) => {
        if (rowIdx > resizeMaxItemToInspectCellContentWidth) {
          return false;
        }
        columnDefinitions.forEach((columnDef, colIdx) => {
          if (!columnDef.originalWidth) {
            const charWidthPx = columnDef?.resizeCharWidthInPx ?? resizeCellCharWidthInPx;
            const formattedData = parseFormatterWhenExist(columnDef?.formatter, rowIdx, colIdx, columnDef, item, this._grid);
            const formattedDataSanitized = sanitizeHtmlToText(formattedData);
            const formattedTextWidthInPx = Math.ceil(formattedDataSanitized.length * charWidthPx);
            const resizeMaxWidthThreshold = columnDef.resizeMaxWidthThreshold;
            if (columnDef && (columnWidths[columnDef.id] === undefined || formattedTextWidthInPx > columnWidths[columnDef.id])) {
              columnWidths[columnDef.id] = (resizeMaxWidthThreshold !== undefined && formattedTextWidthInPx > resizeMaxWidthThreshold)
                ? resizeMaxWidthThreshold
                : (columnDef.maxWidth !== undefined && formattedTextWidthInPx > columnDef.maxWidth) ? columnDef.maxWidth : formattedTextWidthInPx;
            }
          }
        });
        return true;
      });

      // finally loop through all column definitions one last time to apply new calculated `width` on each elligible column
      let totalColsWidth = 0;
      for (const column of columnDefinitions) {
        const fieldType = column?.filter?.type ?? column?.type ?? FieldType.string;
        const resizeAlwaysRecalculateWidth = column.resizeAlwaysRecalculateWidth ?? this.gridOptions?.resizeAlwaysRecalculateColumnWidth ?? false;

        if (column.originalWidth && !resizeAlwaysRecalculateWidth) {
          column.width = column.originalWidth;
        } else if (columnWidths[column.id] !== undefined) {
          if (column.rerenderOnResize) {
            reRender = true;
          }

          // let's start with column width found in previous column & data analysis
          let newColWidth = columnWidths[column.id];

          // apply optional ratio which is typically 1, except for string where we use a ratio of around ~0.9 since we have more various thinner characters like (i, l, t, ...)
          const stringWidthRatio = column?.resizeCalcWidthRatio ?? this.gridOptions?.resizeDefaultRatioForStringType ?? 0.9;
          newColWidth *= fieldType === 'string' ? stringWidthRatio : 1;

          // apply extra cell padding, custom padding & editor formatter padding
          // --
          newColWidth += resizeCellPaddingWidthInPx;
          if (column.resizeExtraWidthPadding) {
            newColWidth += column.resizeExtraWidthPadding;
          }
          if (column.editor && this.gridOptions.editable) {
            newColWidth += resizeFormatterPaddingWidthInPx;
          }

          // make sure we're not over a column max width and/or optional custom max width threshold
          if (column.maxWidth !== undefined && newColWidth > column.maxWidth) {
            newColWidth = column.maxWidth;
          }
          if (column.resizeMaxWidthThreshold !== undefined && newColWidth > column.resizeMaxWidthThreshold) {
            newColWidth = column.resizeMaxWidthThreshold;
          }

          // make the value the closest bottom integer
          newColWidth = Math.ceil(newColWidth);

          // finally only apply the new width if user didn't yet provide one and/or if user really wants to specifically ask for a recalculate
          if (column.originalWidth === undefined || column.resizeAlwaysRecalculateWidth === true || this.gridOptions?.resizeAlwaysRecalculateColumnWidth === true) {
            column.width = Math.ceil(newColWidth);
          }
        }

        // add the new column width to the total width which we'll use later to compare against viewport width
        totalColsWidth += column.width || 0;
        this._totalColumnsWidthByContent = totalColsWidth;
      }
    }

    // send updated column definitions widths to SlickGrid
    this._grid.setColumns(columnDefinitions);

    // get the grid container viewport width and if our viewport calculated total columns is greater than the viewport width
    // then we'll call reRenderColumns() when getting wider than viewport or else the default autosizeColumns() when we know we have plenty of space to shrink the columns
    const viewportWidth = this._gridParentContainerElm?.offsetWidth ?? 0;
    this._totalColumnsWidthByContent > viewportWidth ? this._grid.reRenderColumns(reRender) : this._grid.autosizeColumns();
  }
}
