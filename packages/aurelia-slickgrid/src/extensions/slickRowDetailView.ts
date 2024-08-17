import {
  addToArrayWhenNotExists,
  type EventSubscription,
  type OnBeforeRowDetailToggleArgs,
  type OnRowBackToViewportRangeArgs,
  SlickEventData,
  type SlickEventHandler,
  type SlickGrid,
  SlickRowSelectionModel,
  unsubscribeAll,
} from '@slickgrid-universal/common';
import { EventPubSubService } from '@slickgrid-universal/event-pub-sub';
import { SlickRowDetailView as UniversalSlickRowDetailView } from '@slickgrid-universal/row-detail-view-plugin';
import { type Constructable, resolve, transient } from 'aurelia';

import type { AureliaViewOutput, GridOption, RowDetailView, ViewModelBindableInputData } from '../models/index';
import { AureliaUtilService } from '../services/aureliaUtil.service';

const ROW_DETAIL_CONTAINER_PREFIX = 'container_';
const PRELOAD_CONTAINER_PREFIX = 'container_loading';

export interface CreatedView extends AureliaViewOutput {
  id: string | number;
  dataContext: any;
}

@transient()
export class SlickRowDetailView extends UniversalSlickRowDetailView {
  // override _eventHandler!: SlickEventHandler;
  protected _preloadViewModel?: Constructable;
  protected _slots: CreatedView[] = [];
  protected _viewModel?: Constructable;
  protected _subscriptions: EventSubscription[] = [];
  protected _userProcessFn?: (item: any) => Promise<any>;

  constructor(
    protected readonly aureliaUtilService: AureliaUtilService = resolve(AureliaUtilService),
    private readonly eventPubSubService: EventPubSubService = resolve(EventPubSubService),
    private readonly gridContainerElement: HTMLElement = resolve(HTMLElement)) {
    super(eventPubSubService);
  }

  get addonOptions() {
    return this.getOptions();
  }

  protected get datasetIdPropName(): string {
    return this.gridOptions.datasetIdPropertyName || 'id';
  }

  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }
  set eventHandler(eventHandler: SlickEventHandler) {
    this._eventHandler = eventHandler;
  }
  /** Getter for the Grid Options pulled through the Grid Object */
  get gridOptions(): GridOption {
    return (this._grid?.getOptions() || {}) as GridOption;
  }

  get rowDetailViewOptions(): RowDetailView | undefined {
    return this.gridOptions.rowDetailView;
  }

  /** Dispose of the RowDetailView Extension */
  dispose() {
    this.disposeAllViewSlot();
    unsubscribeAll(this._subscriptions);
    super.dispose();
  }

  /** Dispose of all the opened Row Detail Panels Aurelia View Slots */
  disposeAllViewSlot() {
    if (Array.isArray(this._slots)) {
      this._slots.forEach((slot) => this.disposeViewSlot(slot));
    }
    this._slots = [];
  }

  /** Get the instance of the SlickGrid addon (control or plugin). */
  getAddonInstance(): SlickRowDetailView | null {
    return this;
  }

  init(grid: SlickGrid) {
    this._grid = grid;
    super.init(this._grid);
    this.register(grid?.getSelectionModel() as SlickRowSelectionModel);
  }

  /**
   * Create the plugin before the Grid creation, else it will behave oddly.
   * Mostly because the column definitions might change after the grid creation
   */
  register(rowSelectionPlugin?: SlickRowSelectionModel) {
    if (typeof this.gridOptions.rowDetailView?.process === 'function') {
      // we need to keep the user "process" method and replace it with our own execution method
      // we do this because when we get the item detail, we need to call "onAsyncResponse.notify" for the plugin to work
      this._userProcessFn = this.gridOptions.rowDetailView.process as (item: any) => Promise<any>;                // keep user's process method
      this.addonOptions.process = (item) => this.onProcessing(item);  // replace process method & run our internal one
    } else {
      throw new Error('[Aurelia-Slickgrid] You need to provide a "process" function for the Row Detail Extension to work properly');
    }

    if (this._grid && this.gridOptions?.rowDetailView) {
      // load the Preload & RowDetail Templates (could be straight HTML or Aurelia View/ViewModel)
      // when those are Aurelia View/ViewModel, we need to create View Slot & provide the html containers to the Plugin (preTemplate/postTemplate methods)
      if (!this.gridOptions.rowDetailView.preTemplate) {
        this._preloadViewModel = this.gridOptions?.rowDetailView?.preloadViewModel;
        this.addonOptions.preTemplate = () => this._grid.sanitizeHtmlString(`<div class="${PRELOAD_CONTAINER_PREFIX}"></div>`) as string;
      }
      if (!this.gridOptions.rowDetailView.postTemplate) {
        this._viewModel = this.gridOptions?.rowDetailView?.viewModel;
        this.addonOptions.postTemplate = (itemDetail: any) => this._grid.sanitizeHtmlString(`<div class="${ROW_DETAIL_CONTAINER_PREFIX}${itemDetail[this.datasetIdPropName]}"></div>`) as string;
      }

      if (this._grid && this.gridOptions) {
        // this also requires the Row Selection Model to be registered as well
        if (!rowSelectionPlugin || !this._grid.getSelectionModel()) {
          rowSelectionPlugin = new SlickRowSelectionModel(this.gridOptions.rowSelectionOptions || { selectActiveRow: true });
          this._grid.setSelectionModel(rowSelectionPlugin);
        }

        // hook all events
        if (this._grid && this.rowDetailViewOptions) {
          if (this.rowDetailViewOptions.onExtensionRegistered) {
            this.rowDetailViewOptions.onExtensionRegistered(this);
          }

          if (this.onAsyncResponse) {
            this._eventHandler.subscribe(this.onAsyncResponse, (event, args) => {
              if (typeof this.rowDetailViewOptions?.onAsyncResponse === 'function') {
                this.rowDetailViewOptions.onAsyncResponse(event, args);
              }
            });
          }

          if (this.onAsyncEndUpdate) {
            this._eventHandler.subscribe(this.onAsyncEndUpdate, async (event, args) => {
              // triggers after backend called "onAsyncResponse.notify()"
              await this.renderViewModel(args?.item);

              if (typeof this.rowDetailViewOptions?.onAsyncEndUpdate === 'function') {
                this.rowDetailViewOptions.onAsyncEndUpdate(event, args);
              }
            });
          }

          if (this.onAfterRowDetailToggle) {
            this._eventHandler.subscribe(this.onAfterRowDetailToggle, async (event, args) => {
              // display preload template & re-render all the other Detail Views after toggling
              // the preload View will eventually go away once the data gets loaded after the "onAsyncEndUpdate" event
              await this.renderPreloadView();
              this.renderAllViewModels();

              if (typeof this.rowDetailViewOptions?.onAfterRowDetailToggle === 'function') {
                this.rowDetailViewOptions.onAfterRowDetailToggle(event, args);
              }
            });
          }

          if (this.onBeforeRowDetailToggle) {
            this._eventHandler.subscribe(this.onBeforeRowDetailToggle, (event, args) => {
              // before toggling row detail, we need to create View Slot if it doesn't exist
              this.handleOnBeforeRowDetailToggle(event, args);

              if (typeof this.rowDetailViewOptions?.onBeforeRowDetailToggle === 'function') {
                return this.rowDetailViewOptions.onBeforeRowDetailToggle(event, args);
              }
              return true;
            });
          }

          if (this.onRowBackToViewportRange) {
            this._eventHandler.subscribe(this.onRowBackToViewportRange, async (event, args) => {
              // when row is back to viewport range, we will re-render the View Slot(s)
              await this.handleOnRowBackToViewportRange(event, args);

              if (typeof this.rowDetailViewOptions?.onRowBackToViewportRange === 'function') {
                this.rowDetailViewOptions.onRowBackToViewportRange(event, args);
              }
            });
          }

          if (this.onRowOutOfViewportRange) {
            this._eventHandler.subscribe(this.onRowOutOfViewportRange, (event, args) => {
              if (typeof this.rowDetailViewOptions?.onRowOutOfViewportRange === 'function') {
                this.rowDetailViewOptions.onRowOutOfViewportRange(event, args);
              }
            });
          }

          // --
          // hook some events needed by the Plugin itself

          // we need to redraw the open detail views if we change column position (column reorder)
          this._eventHandler.subscribe(this._grid.onColumnsReordered, this.redrawAllViewSlots.bind(this));

          // on row selection changed, we also need to redraw
          if (this.gridOptions.enableRowSelection || this.gridOptions.enableCheckboxSelector) {
            this._eventHandler.subscribe(this._grid.onSelectedRowsChanged, this.redrawAllViewSlots.bind(this));
          }

          // on column sort/reorder, all row detail are collapsed so we can dispose of all the Views as well
          this._eventHandler.subscribe(this._grid.onSort, this.disposeAllViewSlot.bind(this));

          // on filter changed, we need to re-render all Views
          this._subscriptions.push(
            this.eventPubSubService?.subscribe('onFilterChanged', this.redrawAllViewSlots.bind(this)),
            this.eventPubSubService?.subscribe('onGridMenuClearAllFilters', () => window.setTimeout(() => this.redrawAllViewSlots())),
            this.eventPubSubService?.subscribe('onGridMenuClearAllSorting', () => window.setTimeout(() => this.redrawAllViewSlots())),
          );
        }
      }
    }

    return this;
  }

  /** Redraw (re-render) all the expanded row detail View Slots */
  async redrawAllViewSlots() {
    await Promise.all(this._slots.map(async x => this.redrawViewSlot(x)));
  }

  /** Render all the expanded row detail View Slots */
  async renderAllViewModels() {
    await Promise.all(this._slots.filter(x => x?.dataContext).map(async x => this.renderViewModel(x.dataContext)));
  }

  /** Redraw the necessary View Slot */
  async redrawViewSlot(slot: CreatedView) {
    const containerElement = this.gridContainerElement.getElementsByClassName(`${ROW_DETAIL_CONTAINER_PREFIX}${slot.id}`);
    if (containerElement?.length >= 0) {
      await this.renderViewModel(slot.dataContext);
    }
  }

  /** Render (or re-render) the View Slot (Row Detail) */
  async renderPreloadView() {
    const containerElements = this.gridContainerElement.getElementsByClassName(`${PRELOAD_CONTAINER_PREFIX}`);
    if (this._preloadViewModel && containerElements?.length >= 0) {
      await this.aureliaUtilService.createAureliaViewModelAddToSlot(this._preloadViewModel, undefined, containerElements[containerElements.length - 1]);
    }
  }

  /** Render (or re-render) the View Slot (Row Detail) */
  async renderViewModel(item: any) {
    const containerElements = this.gridContainerElement.getElementsByClassName(`${ROW_DETAIL_CONTAINER_PREFIX}${item[this.datasetIdPropName]}`);
    if (this._viewModel && containerElements?.length > 0) {
      const bindableData = {
        model: item,
        addon: this,
        grid: this._grid,
        dataView: this.dataView,
        parent: this.rowDetailViewOptions?.parent,
      } as ViewModelBindableInputData;
      const aureliaComp = await this.aureliaUtilService.createAureliaViewModelAddToSlot(this._viewModel, bindableData, containerElements[containerElements.length - 1]);
      const slotObj = this._slots.find(obj => obj.id === item[this.datasetIdPropName]);

      if (slotObj && aureliaComp) {
        slotObj.controller = aureliaComp.controller;
      }
    }
  }

  // --
  // protected functions
  // ------------------

  protected disposeViewSlot(expandedView: CreatedView): CreatedView | void {
    if (expandedView?.controller) {
      const container = this.gridContainerElement.getElementsByClassName(`${ROW_DETAIL_CONTAINER_PREFIX}${this._slots[0].id}`);
      if (container?.length) {
        expandedView.controller.deactivate(expandedView.controller, null);
        container[0].innerHTML = '';
        return expandedView;
      }
    }
  }

  /**
   * Just before the row get expanded or collapsed we will do the following
   * First determine if the row is expanding or collapsing,
   * if it's expanding we will add it to our View Slots reference array if we don't already have it
   * or if it's collapsing we will remove it from our View Slots reference array
   */
  protected handleOnBeforeRowDetailToggle(_e: SlickEventData<OnBeforeRowDetailToggleArgs>, args: { grid: SlickGrid; item: any; }) {
    // expanding
    if (args?.item?.__collapsed) {
      // expanding row detail
      if (args?.item) {
        const viewInfo: CreatedView = {
          id: args.item[this.datasetIdPropName],
          dataContext: args.item
        };
        const idPropName = this.gridOptions.datasetIdPropertyName || 'id';
        addToArrayWhenNotExists(this._slots, viewInfo, idPropName);
      }
    } else {
      // collapsing, so dispose of the View/ViewSlot
      const foundSlotIndex = this._slots.findIndex((slot: CreatedView) => slot.id === args.item[this.datasetIdPropName]);
      if (foundSlotIndex >= 0) {
        if (this.disposeViewSlot(this._slots[foundSlotIndex])) {
          this._slots.splice(foundSlotIndex, 1);
        }
      }
    }
  }

  /** When Row comes back to Viewport Range, we need to redraw the View */
  protected async handleOnRowBackToViewportRange(_e: SlickEventData<OnRowBackToViewportRangeArgs>, args: {
    item: any;
    rowId: string | number;
    rowIndex: number;
    expandedRows: (string | number)[];
    rowIdsOutOfViewport: (string | number)[];
    grid: SlickGrid;
  }) {
    if (args?.item) {
      await this.redrawAllViewSlots();
    }
  }

  /**
   * notify the onAsyncResponse with the "args.item" (required property)
   * the plugin will then use item to populate the row detail panel with the "postTemplate"
   * @param item
   */
  protected notifyTemplate(item: any) {
    if (this.onAsyncResponse) {
      this.onAsyncResponse.notify({ item, itemDetail: item }, new SlickEventData(), this);
    }
  }

  /**
   * On Processing, we will notify the plugin with the new item detail once backend server call completes
   * @param item
   */
  protected async onProcessing(item: any) {
    if (item && typeof this._userProcessFn === 'function') {
      let awaitedItemDetail: any;
      const userProcessFn = this._userProcessFn(item);

      // wait for the "userProcessFn", once resolved we will save it into the "collection"
      const response: any | any[] = await userProcessFn;

      if (response.hasOwnProperty(this.datasetIdPropName)) {
        awaitedItemDetail = response; // from Promise
      } else if (response instanceof Response && typeof response['json'] === 'function') {
        awaitedItemDetail = await response['json'](); // from Fetch
      } else if (response && response['content']) {
        awaitedItemDetail = response['content']; // from aurelia-http-client
      }

      if (!awaitedItemDetail || !awaitedItemDetail.hasOwnProperty(this.datasetIdPropName)) {
        throw new Error(`[Aurelia-Slickgrid] could not process the Row Detail, you must make sure that your "process" callback
          (a Promise or an HttpClient call returning an Observable) returns an item object that has an "${this.datasetIdPropName}" property`);
      }

      // notify the plugin with the new item details
      this.notifyTemplate(awaitedItemDetail || {});
    }
  }
}
