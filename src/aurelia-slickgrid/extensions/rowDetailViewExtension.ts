import { inject, singleton } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { AureliaViewOutput, Column, Extension, ExtensionName, GridOption, SlickEventHandler } from '../models/index';
import { ExtensionUtility } from './extensionUtility';
import { SharedService } from '../services/shared.service';
import { AureliaUtilService } from '../services/aureliaUtil.service';
import { addToArrayWhenNotExists, disposeAllSubscriptions } from '../services/utilities';
import * as DOMPurify from 'dompurify';

// using external non-typed js libraries
declare var Slick: any;

const ROW_DETAIL_CONTAINER_PREFIX = 'container_';
const PRELOAD_CONTAINER_PREFIX = 'container_loading';

export interface CreatedView extends AureliaViewOutput {
  id: string | number;
  dataContext: any;
}

@singleton(true)
@inject(
  AureliaUtilService,
  EventAggregator,
  ExtensionUtility,
  SharedService,
)
export class RowDetailViewExtension implements Extension {
  private _addon: any;
  private _eventHandler: SlickEventHandler;
  private _preloadView: string;
  private _slots: CreatedView[] = [];
  private _viewModel: string;
  private _subscriptions: Subscription[] = [];
  private _userProcessFn: (item: any) => Promise<any>;

  constructor(
    private aureliaUtilService: AureliaUtilService,
    private ea: EventAggregator,
    private extensionUtility: ExtensionUtility,
    private sharedService: SharedService,
  ) {
    this._eventHandler = new Slick.EventHandler();
  }

  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }

  /** Dispose of the RowDetailView Extension */
  dispose() {
    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();

    if (this._addon && this._addon.destroy) {
      this._addon.destroy();
    }
    disposeAllSubscriptions(this._subscriptions);
    this.disposeAllViewSlot();
  }

  /** Dispose of all the opened Row Detail Panels Aurelia View Slots */
  disposeAllViewSlot() {
    if (Array.isArray(this._slots)) {
      this._slots.forEach((slot) => this.disposeViewSlot(slot));
    }
    this._slots = [];
  }

  /**
   * Create the plugin before the Grid creation, else it will behave oddly.
   * Mostly because the column definitions might change after the grid creation
   */
  create(columnDefinitions: Column[], gridOptions: GridOption) {
    if (columnDefinitions && gridOptions) {
      // dynamically import the SlickGrid plugin (addon) with RequireJS
      this.extensionUtility.loadExtensionDynamically(ExtensionName.rowDetailView);

      if (!gridOptions.rowDetailView) {
        throw new Error('The Row Detail View requires options to be passed via the "rowDetailView" property of the Grid Options');
      }

      if (gridOptions && gridOptions.rowDetailView) {
        if (!this._addon) {
          if (typeof gridOptions.rowDetailView.process === 'function') {
            // we need to keep the user "process" method and replace it with our own execution method
            // we do this because when we get the item detail, we need to call "onAsyncResponse.notify" for the plugin to work
            this._userProcessFn = gridOptions.rowDetailView.process;                // keep user's process method
            gridOptions.rowDetailView.process = (item) => this.onProcessing(item);  // replace process method & run our internal one
          } else {
            throw new Error('You need to provide a "process" function for the Row Detail Extension to work properly');
          }

          // load the Preload & RowDetail Templates (could be straight HTML or Aurelia View/ViewModel)
          // when those are Aurelia View/ViewModel, we need to create View Slot & provide the html containers to the Plugin (preTemplate/postTemplate methods)
          if (!gridOptions.rowDetailView.preTemplate) {
            this._preloadView = gridOptions && gridOptions.rowDetailView && gridOptions.rowDetailView.preloadView || '';
            gridOptions.rowDetailView.preTemplate = () => DOMPurify.sanitize(`<div class="${PRELOAD_CONTAINER_PREFIX}"></div>`);
          }
          if (!gridOptions.rowDetailView.postTemplate) {
            this._viewModel = gridOptions && gridOptions.rowDetailView && gridOptions.rowDetailView.viewModel || '';
            gridOptions.rowDetailView.postTemplate = (itemDetail: any) => DOMPurify.sanitize(`<div class="${ROW_DETAIL_CONTAINER_PREFIX}${itemDetail.id}"></div>`);
          }

          // finally register the Row Detail View Plugin
          this._addon = new Slick.Plugins.RowDetailView(gridOptions.rowDetailView);
        }
        const selectionColumn: Column = this._addon.getColumnDefinition();
        if (typeof selectionColumn === 'object') {
          selectionColumn.excludeFromExport = true;
          selectionColumn.excludeFromColumnPicker = true;
          selectionColumn.excludeFromGridMenu = true;
          selectionColumn.excludeFromQuery = true;
          selectionColumn.excludeFromHeaderMenu = true;
          columnDefinitions.unshift(selectionColumn);
        }
      }
      return this._addon;
    }
    return null;
  }

  /** Get the instance of the SlickGrid addon (control or plugin). */
  getAddonInstance() {
    return this._addon;
  }

  register(rowSelectionPlugin?: any) {
    if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
      // the plugin has to be created BEFORE the grid (else it behaves oddly), but we can only watch grid events AFTER the grid is created
      this.sharedService.grid.registerPlugin(this._addon);

      // this also requires the Row Selection Model to be registered as well
      if (!rowSelectionPlugin || !this.sharedService.grid.getSelectionModel()) {
        this.extensionUtility.loadExtensionDynamically(ExtensionName.rowSelection);
        rowSelectionPlugin = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || { selectActiveRow: true });
        this.sharedService.grid.setSelectionModel(rowSelectionPlugin);
      }

      // this._extension = this.create(this.sharedService.allColumns, this.sharedService.gridOptions);
      this.sharedService.grid.registerPlugin(this._addon);

      // hook all events
      if (this.sharedService.grid && this.sharedService.gridOptions.rowDetailView) {
        if (this.sharedService.gridOptions.rowDetailView.onExtensionRegistered) {
          this.sharedService.gridOptions.rowDetailView.onExtensionRegistered(this._addon);
        }
        this._eventHandler.subscribe(this._addon.onAsyncResponse, (e: any, args: { item: any; detailView: any }) => {
          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onAsyncResponse === 'function') {
            this.sharedService.gridOptions.rowDetailView.onAsyncResponse(e, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onAsyncEndUpdate, (e: any, args: { grid: any; item: any; }) => {
          // triggers after backend called "onAsyncResponse.notify()"
          this.renderViewModel(args && args.item);

          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onAsyncEndUpdate === 'function') {
            this.sharedService.gridOptions.rowDetailView.onAsyncEndUpdate(e, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onAfterRowDetailToggle, (e: any, args: { grid: any; item: any; expandedRows: any[]; }) => {
          // display preload template & re-render all the other Detail Views after toggling
          // the preload View will eventually go away once the data gets loaded after the "onAsyncEndUpdate" event
          this.renderPreloadView();
          this.renderAllViewModels();

          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onAfterRowDetailToggle === 'function') {
            this.sharedService.gridOptions.rowDetailView.onAfterRowDetailToggle(e, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onBeforeRowDetailToggle, (e: any, args: { grid: any; item: any; }) => {
          // before toggling row detail, we need to create View Slot if it doesn't exist
          this.onBeforeRowDetailToggle(e, args);

          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onBeforeRowDetailToggle === 'function') {
            this.sharedService.gridOptions.rowDetailView.onBeforeRowDetailToggle(e, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onRowBackToViewportRange, (e: any, args: { grid: any; item: any; rowId: number; rowIndex: number; expandedRows: any[]; rowIdsOutOfViewport: number[]; }) => {
          // when row is back to viewport range, we will re-render the View Slot(s)
          this.onRowBackToViewportRange(e, args);

          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onRowBackToViewportRange === 'function') {
            this.sharedService.gridOptions.rowDetailView.onRowBackToViewportRange(e, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onRowOutOfViewportRange, (e: any, args: { grid: any; item: any; rowId: number; rowIndex: number; expandedRows: any[]; rowIdsOutOfViewport: number[]; }) => {
          if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onRowOutOfViewportRange === 'function') {
            this.sharedService.gridOptions.rowDetailView.onRowOutOfViewportRange(e, args);
          }
        });

        // --
        // hook some events needed by the Plugin itself

        this._eventHandler.subscribe(this.sharedService.grid.onColumnsReordered, () => this.redrawAllViewSlots());

        // on sort, all row detail are collapsed so we can dispose of all the Views as well
        this._eventHandler.subscribe(this.sharedService.grid.onSort, () => this.disposeAllViewSlot());

        // on filter changed, we need to re-render all Views
        this._subscriptions.push(
          this.ea.subscribe('filterService:filterChanged', () => this.redrawAllViewSlots())
        );
      }
      return this._addon;
    }
    return null;
  }

  // --
  // private functions
  // ------------------

  private disposeViewSlot(expandedView: CreatedView) {
    if (expandedView && expandedView.view && expandedView.viewSlot && expandedView.view.unbind && expandedView.viewSlot.remove) {
      const container = document.getElementsByClassName(`${ROW_DETAIL_CONTAINER_PREFIX}${this._slots[0].id}`);
      if (container && container.length > 0) {
        expandedView.viewSlot.remove(expandedView.view);
        expandedView.view.unbind();
        container[0].innerHTML = '';
        return expandedView;
      }
    }
    return null;
  }

  /**
   * notify the onAsyncResponse with the "args.item" (required property)
   * the plugin will then use item to populate the row detail panel with the "postTemplate"
   * @param item
   */
  private notifyTemplate(item: any) {
    if (this._addon) {
      this._addon.onAsyncResponse.notify({ item }, new Slick.EventData(), this);
    }
  }

  /**
   * On Processing, we will notify the plugin with the new item detail once backend server call completes
   * @param item
   */
  private async onProcessing(item: any) {
    if (item && typeof this._userProcessFn === 'function') {
      let awaitedItemDetail: any;
      const userProcessFn = this._userProcessFn(item);

      // wait for the "userProcessFn", once resolved we will save it into the "collection"
      const response: any | any[] = await userProcessFn;

      if (response.hasOwnProperty('id')) {
        awaitedItemDetail = response; // from Promise
      } else if (response instanceof Response && typeof response['json'] === 'function') {
        awaitedItemDetail = await response['json'](); // from Fetch
      } else if (response && response['content']) {
        awaitedItemDetail = response['content']; // from aurelia-http-client
      }

      if (!awaitedItemDetail || !awaitedItemDetail.hasOwnProperty('id')) {
        throw new Error(`[Aurelia-Slickgrid] could not process the Row Detail, you must make sure that your "process" callback
          (a Promise or an HttpClient call returning an Observable) returns an item object that has an "id" property`);
      }

      // notify the plugin with the new item details
      this.notifyTemplate(awaitedItemDetail || {});
    }
  }

  /**
   * Just before the row get expanded or collapsed we will do the following
   * First determine if the row is expanding or collapsing,
   * if it's expanding we will add it to our View Slots reference array if we don't already have it
   * or if it's collapsing we will remove it from our View Slots reference array
   */
  private onBeforeRowDetailToggle(e: Event, args: { grid: any; item: any; }) {
    // expanding
    if (args && args.item && args.item.__collapsed) {
      // expanding row detail
      if (args && args.item) {
        const viewInfo: CreatedView = {
          id: args.item.id,
          dataContext: args.item
        };
        addToArrayWhenNotExists(this._slots, viewInfo);
      }
    } else {
      // collapsing, so dispose of the View/ViewSlot
      const foundSlotIndex = this._slots.findIndex((slot: CreatedView) => slot.id === args.item.id);
      if (foundSlotIndex >= 0) {
        if (this.disposeViewSlot(this._slots[foundSlotIndex])) {
          this._slots.splice(foundSlotIndex, 1);
        }
      }
    }
  }

  /** When Row comes back to Viewport Range, we need to redraw the View */
  private onRowBackToViewportRange(e: Event, args: { grid: any; item: any; rowId: number; rowIndex: number; expandedRows: any[]; rowIdsOutOfViewport: number[]; }) {
    if (args && args.item) {
      this._slots.forEach((slot) => {
        if (slot.id === args.item.id) {
          this.redrawViewSlot(slot);
        }
      });
    }
  }

  /** Redraw (re-render) all the expanded row detail View Slots */
  private redrawAllViewSlots() {
    this._slots.forEach((slot) => {
      this.redrawViewSlot(slot);
    });
  }

  /** Render all the expanded row detail View Slots */
  private renderAllViewModels() {
    this._slots.forEach((slot) => {
      if (slot && slot.dataContext) {
        this.renderViewModel(slot.dataContext);
      }
    });
  }

  /** Redraw the necessary View Slot */
  private redrawViewSlot(slot: CreatedView) {
    const containerElement = document.getElementsByClassName(`${ROW_DETAIL_CONTAINER_PREFIX}${slot.id}`);
    if (containerElement && containerElement.length) {
      this.renderViewModel(slot.dataContext);
    }
  }

  /** Render (or rerender) the View Slot (Row Detail) */
  private renderPreloadView() {
    const containerElements = document.getElementsByClassName(`${PRELOAD_CONTAINER_PREFIX}`);
    if (containerElements && containerElements.length) {
      this.aureliaUtilService.createAureliaViewAddToSlot(this._preloadView, containerElements[0], true);
    }
  }

  /** Render (or rerender) the View Slot (Row Detail) */
  private renderViewModel(item: any) {
    const containerElements = document.getElementsByClassName(`${ROW_DETAIL_CONTAINER_PREFIX}${item.id}`);
    if (containerElements && containerElements.length) {
      const aureliaComp = this.aureliaUtilService.createAureliaViewModelAddToSlot(this._viewModel, item, containerElements[0], true);

      const slotObj = this._slots.find((obj) => obj.id === item.id);

      if (slotObj && aureliaComp) {
        slotObj.view = aureliaComp.view;
        slotObj.viewSlot = aureliaComp.viewSlot;
      }
    }
  }
}
