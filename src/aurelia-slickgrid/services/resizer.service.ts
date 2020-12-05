import {
  GetSlickEventType,
  GridOption,
  GridSize,
  PubSubService,
  SlickEventData,
  SlickEventHandler,
  SlickGrid,
  SlickNamespace,
  SlickResizer,
} from '@slickgrid-universal/common';

// using external non-typed js libraries
declare const Slick: SlickNamespace;
const DATAGRID_FOOTER_HEIGHT = 25;
const DATAGRID_PAGINATION_HEIGHT = 35;

export class ResizerService {
  private _grid: SlickGrid;
  private _addon: SlickResizer;
  private _eventHandler: SlickEventHandler;

  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }

  /** Getter for the Grid Options pulled through the Grid Object */
  get gridOptions(): GridOption {
    return (this._grid && this._grid.getOptions) ? this._grid.getOptions() : {};
  }

  constructor(private eventPubSubService: PubSubService) {
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

  init(grid: SlickGrid, gridParentContainerElm: HTMLElement) {
    this._grid = grid;
    const fixedGridDimensions = (this.gridOptions?.gridHeight || this.gridOptions?.gridWidth) ? { height: this.gridOptions?.gridHeight, width: this.gridOptions?.gridWidth } : undefined;
    const autoResizeOptions = this.gridOptions?.autoResize ?? { bottomPadding: 0 };
    if (autoResizeOptions && autoResizeOptions.bottomPadding !== undefined && this.gridOptions?.showCustomFooter) {
      const footerHeight: string | number = this.gridOptions?.customFooterOptions?.footerHeight ?? DATAGRID_FOOTER_HEIGHT;
      autoResizeOptions.bottomPadding += parseInt(`${footerHeight}`, 10);
    }
    if (autoResizeOptions && autoResizeOptions.bottomPadding !== undefined && this.gridOptions?.enablePagination) {
      autoResizeOptions.bottomPadding += DATAGRID_PAGINATION_HEIGHT;
    }
    if (fixedGridDimensions?.width && gridParentContainerElm?.style) {
      gridParentContainerElm.style.width = `${fixedGridDimensions.width}px`;
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
          this.eventPubSubService.publish('onGridAfterResize', args);
        });
      }
      if (this._addon && this._addon.onGridBeforeResize) {
        const onGridBeforeResizeHandler = this._addon.onGridBeforeResize;
        (this._eventHandler as SlickEventHandler<GetSlickEventType<typeof onGridBeforeResizeHandler>>).subscribe(onGridBeforeResizeHandler, (_e, args) => {
          this.eventPubSubService.publish('onGridBeforeResize', args);
        });
      }
    }
  }

  /**
   * Return the last resize dimensions used by the service
   * @return {object} last dimensions (height: number, width: number)
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
   * @param {object} newSizes can optionally be passed (height: number, width: number)
   * @param {object} event that triggered the resize, defaults to null
   * @return If the browser supports it, we can return a Promise that would resolve with the new dimensions
   */
  resizeGrid(delay?: number, newSizes?: GridSize, event?: SlickEventData): Promise<GridSize> | null {
    return this._addon?.resizeGrid(delay, newSizes, event);
  }
}
