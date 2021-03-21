import 'slickgrid/plugins/slick.rowdetailview';
import 'slickgrid/plugins/slick.rowselectionmodel';

import {
  addToArrayWhenNotExists,
  Column,
  ExtensionUtility,
  GetSlickEventType,
  RowDetailViewExtension as UniversalRowDetailViewExtension,
  SharedService,
  SlickEventHandler,
  SlickNamespace,
  SlickRowDetailView,
  SlickRowSelectionModel,
} from '@slickgrid-universal/common';
import { inject, singleton } from 'aurelia-framework';
import { Subscription } from 'aurelia-event-aggregator';
import * as DOMPurify from 'dompurify';

import { AureliaViewOutput, GridOption, RowDetailView, SlickGrid, ViewModelBindableInputData } from '../models/index';
import { AureliaUtilService } from '../services/aureliaUtil.service';
import { disposeAllSubscriptions } from '../services/utilities';
import { PubSubService } from '../services';

// using external non-typed js libraries
declare const Slick: SlickNamespace;

const ROW_DETAIL_CONTAINER_PREFIX = 'container_';
const PRELOAD_CONTAINER_PREFIX = 'container_loading';

export interface CreatedView extends AureliaViewOutput {
  id: string | number;
  dataContext: any;
}

@singleton(true)
@inject(
  AureliaUtilService,
  PubSubService,
  ExtensionUtility,
  SharedService,
)
export class RowDetailViewExtension implements UniversalRowDetailViewExtension {
  private _addon: SlickRowDetailView | null;
  private _eventHandler: SlickEventHandler;
  private _preloadView: string;
  private _slots: CreatedView[] = [];
  private _viewModel: string;
  private _subscriptions: Subscription[] = [];
  private _userProcessFn: (item: any) => Promise<any>;

  constructor(
    private readonly aureliaUtilService: AureliaUtilService,
    private readonly pubSubService: PubSubService,
    private readonly sharedService: SharedService,
  ) {
    this._eventHandler = new Slick.EventHandler();
  }

  private get datasetIdPropName(): string {
    return this.gridOptions.datasetIdPropertyName || 'id';
  }

  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }

  get gridOptions(): GridOption {
    return this.sharedService?.gridOptions ?? {};
  }

  get rowDetailViewOptions(): RowDetailView | undefined {
    return this.gridOptions.rowDetailView;
  }

  /** Dispose of the RowDetailView Extension */
  dispose() {
    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();

    if (this._addon && this._addon.destroy) {
      this._addon.destroy();
      this._addon = null;
    }
    this.disposeAllViewSlot();
    disposeAllSubscriptions(this._subscriptions);
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
  create(columnDefinitions: Column[], gridOptions: GridOption): SlickRowDetailView | null {
    if (columnDefinitions && gridOptions) {
      if (!gridOptions.rowDetailView) {
        throw new Error('The Row Detail View requires options to be passed via the "rowDetailView" property of the Grid Options');
      }

      if (gridOptions && gridOptions.rowDetailView) {
        if (!this._addon) {
          if (typeof gridOptions.rowDetailView.process === 'function') {
            // we need to keep the user "process" method and replace it with our own execution method
            // we do this because when we get the item detail, we need to call "onAsyncResponse.notify" for the plugin to work
            this._userProcessFn = gridOptions.rowDetailView.process as (item: any) => Promise<any>;                // keep user's process method
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
            gridOptions.rowDetailView.postTemplate = (itemDetail: any) => DOMPurify.sanitize(`<div class="${ROW_DETAIL_CONTAINER_PREFIX}${itemDetail[this.datasetIdPropName]}"></div>`);
          }

          // finally register the Row Detail View Plugin
          this._addon = new Slick.Plugins.RowDetailView(gridOptions.rowDetailView);
        }
        const iconColumn: Column = this._addon.getColumnDefinition();
        if (typeof iconColumn === 'object') {
          iconColumn.excludeFromExport = true;
          iconColumn.excludeFromColumnPicker = true;
          iconColumn.excludeFromGridMenu = true;
          iconColumn.excludeFromQuery = true;
          iconColumn.excludeFromHeaderMenu = true;

          // column index position in the grid
          const columnPosition = gridOptions && gridOptions.rowDetailView && gridOptions.rowDetailView.columnIndexPosition || 0;
          if (columnPosition > 0) {
            columnDefinitions.splice(columnPosition, 0, iconColumn);
          } else {
            columnDefinitions.unshift(iconColumn);
          }
        }
      }
      return this._addon;
    }
    return null;
  }

  /** Get the instance of the SlickGrid addon (control or plugin). */
  getAddonInstance(): SlickRowDetailView | null {
    return this._addon;
  }

  register(rowSelectionPlugin?: SlickRowSelectionModel): SlickRowDetailView | null {
    if (this.sharedService && this.sharedService.slickGrid && this.sharedService.gridOptions) {
      // the plugin has to be created BEFORE the grid (else it behaves oddly), but we can only watch grid events AFTER the grid is created
      this.sharedService.slickGrid.registerPlugin(this._addon);

      // this also requires the Row Selection Model to be registered as well
      if (!rowSelectionPlugin || !this.sharedService.slickGrid.getSelectionModel()) {
        rowSelectionPlugin = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || { selectActiveRow: true });
        this.sharedService.slickGrid.setSelectionModel(rowSelectionPlugin);
      }

      this.sharedService.slickGrid.registerPlugin(this._addon);

      // hook all events
      if (this._addon && this.sharedService.slickGrid && this.rowDetailViewOptions) {
        if (this.rowDetailViewOptions.onExtensionRegistered) {
          this.rowDetailViewOptions.onExtensionRegistered(this._addon);
        }

        const onAsyncResponseHandler = this._addon.onAsyncResponse;
        if (onAsyncResponseHandler) {
          (this._eventHandler as SlickEventHandler<GetSlickEventType<typeof onAsyncResponseHandler>>).subscribe(onAsyncResponseHandler, (event, args) => {
            if (this.rowDetailViewOptions && typeof this.rowDetailViewOptions.onAsyncResponse === 'function') {
              this.rowDetailViewOptions.onAsyncResponse(event, args);
            }
          });
        }

        const onAsyncEndUpdateHandler = this._addon.onAsyncEndUpdate;
        if (onAsyncEndUpdateHandler) {
          (this._eventHandler as SlickEventHandler<GetSlickEventType<typeof onAsyncEndUpdateHandler>>).subscribe(onAsyncEndUpdateHandler, (event, args) => {
            // triggers after backend called "onAsyncResponse.notify()"
            this.renderViewModel(args && args.item);

            if (this.rowDetailViewOptions && typeof this.rowDetailViewOptions.onAsyncEndUpdate === 'function') {
              this.rowDetailViewOptions.onAsyncEndUpdate(event, args);
            }
          });
        }

        const onAfterRowDetailToggleHandler = this._addon.onAfterRowDetailToggle;
        if (onAfterRowDetailToggleHandler) {
          (this._eventHandler as SlickEventHandler<GetSlickEventType<typeof onAfterRowDetailToggleHandler>>).subscribe(onAfterRowDetailToggleHandler, (event, args) => {
            // display preload template & re-render all the other Detail Views after toggling
            // the preload View will eventually go away once the data gets loaded after the "onAsyncEndUpdate" event
            this.renderPreloadView();
            this.renderAllViewModels();

            if (this.rowDetailViewOptions && typeof this.rowDetailViewOptions.onAfterRowDetailToggle === 'function') {
              this.rowDetailViewOptions.onAfterRowDetailToggle(event, args);
            }
          });
        }

        const onBeforeRowDetailToggleHandler = this._addon.onBeforeRowDetailToggle;
        if (onBeforeRowDetailToggleHandler) {
          (this._eventHandler as SlickEventHandler<GetSlickEventType<typeof onBeforeRowDetailToggleHandler>>).subscribe(onBeforeRowDetailToggleHandler, (event, args) => {
            // before toggling row detail, we need to create View Slot if it doesn't exist
            this.onBeforeRowDetailToggle(event, args);

            if (this.rowDetailViewOptions && typeof this.rowDetailViewOptions.onBeforeRowDetailToggle === 'function') {
              this.rowDetailViewOptions.onBeforeRowDetailToggle(event, args);
            }
          });
        }

        const onRowBackToViewportRangeHandler = this._addon.onRowBackToViewportRange;
        if (onRowBackToViewportRangeHandler) {
          (this._eventHandler as SlickEventHandler<GetSlickEventType<typeof onRowBackToViewportRangeHandler>>).subscribe(onRowBackToViewportRangeHandler, (event, args) => {
            // when row is back to viewport range, we will re-render the View Slot(s)
            this.onRowBackToViewportRange(event, args);

            if (this.rowDetailViewOptions && typeof this.rowDetailViewOptions.onRowBackToViewportRange === 'function') {
              this.rowDetailViewOptions.onRowBackToViewportRange(event, args);
            }
          });
        }

        const onRowOutOfViewportRangeHandler = this._addon.onRowOutOfViewportRange;
        if (onRowOutOfViewportRangeHandler) {
          (this._eventHandler as SlickEventHandler<GetSlickEventType<typeof onRowOutOfViewportRangeHandler>>).subscribe(onRowOutOfViewportRangeHandler, (event, args) => {
            if (this.rowDetailViewOptions && typeof this.rowDetailViewOptions.onRowOutOfViewportRange === 'function') {
              this.rowDetailViewOptions.onRowOutOfViewportRange(event, args);
            }
          });
        }

        // --
        // hook some events needed by the Plugin itself

        // we need to redraw the open detail views if we change column position (column reorder)
        this._eventHandler.subscribe(this.sharedService.slickGrid.onColumnsReordered, this.redrawAllViewSlots.bind(this));

        // on row selection changed, we also need to redraw
        if (this.gridOptions.enableRowSelection || this.gridOptions.enableCheckboxSelector) {
          this._eventHandler.subscribe(this.sharedService.slickGrid.onSelectedRowsChanged, this.redrawAllViewSlots.bind(this));
        }

        // on column sort/reorder, all row detail are collapsed so we can dispose of all the Views as well
        this._eventHandler.subscribe(this.sharedService.slickGrid.onSort, this.disposeAllViewSlot.bind(this));

        // on filter changed, we need to re-render all Views
        this._subscriptions.push(
          this.pubSubService.subscribe('onFilterChanged', this.redrawAllViewSlots.bind(this))
        );
      }
      return this._addon;
    }
    return null;
  }

  /** Redraw (re-render) all the expanded row detail View Slots */
  redrawAllViewSlots() {
    this._slots.forEach((slot) => {
      this.redrawViewSlot(slot);
    });
  }

  /** Render all the expanded row detail View Slots */
  renderAllViewModels() {
    this._slots.forEach((slot) => {
      if (slot && slot.dataContext) {
        this.renderViewModel(slot.dataContext);
      }
    });
  }

  /** Redraw the necessary View Slot */
  redrawViewSlot(slot: CreatedView) {
    const containerElement = document.getElementsByClassName(`${ROW_DETAIL_CONTAINER_PREFIX}${slot.id}`);
    if (containerElement && containerElement.length >= 0) {
      this.renderViewModel(slot.dataContext);
    }
  }

  /** Render (or re-render) the View Slot (Row Detail) */
  renderPreloadView() {
    const containerElements = document.getElementsByClassName(`${PRELOAD_CONTAINER_PREFIX}`);
    if (containerElements && containerElements.length >= 0) {
      this.aureliaUtilService.createAureliaViewAddToSlot(this._preloadView, containerElements[containerElements.length - 1], true);
    }
  }

  /** Render (or re-render) the View Slot (Row Detail) */
  renderViewModel(item: any) {
    const containerElements = document.getElementsByClassName(`${ROW_DETAIL_CONTAINER_PREFIX}${item[this.datasetIdPropName]}`);
    if (containerElements && containerElements.length > 0) {
      const bindableData = {
        model: item,
        addon: this._addon,
        grid: this.sharedService.slickGrid,
        dataView: this.sharedService.dataView,
        parent: this.rowDetailViewOptions && this.rowDetailViewOptions.parent,
      } as ViewModelBindableInputData;
      const aureliaComp = this.aureliaUtilService.createAureliaViewModelAddToSlot(this._viewModel, bindableData, containerElements[containerElements.length - 1], true);

      const slotObj = this._slots.find(obj => obj.id === item[this.datasetIdPropName]);

      if (slotObj && aureliaComp) {
        slotObj.view = aureliaComp.view;
        slotObj.viewSlot = aureliaComp.viewSlot;
      }
    }
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
    if (this._addon?.onAsyncResponse) {
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

  /**
   * Just before the row get expanded or collapsed we will do the following
   * First determine if the row is expanding or collapsing,
   * if it's expanding we will add it to our View Slots reference array if we don't already have it
   * or if it's collapsing we will remove it from our View Slots reference array
   */
  private onBeforeRowDetailToggle(_e: Event, args: { grid: SlickGrid; item: any; }) {
    // expanding
    if (args && args.item && args.item.__collapsed) {
      // expanding row detail
      if (args && args.item) {
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
  private onRowBackToViewportRange(_e: Event, args: {
    item: any;
    rowId: string | number;
    rowIndex: number;
    expandedRows: (string | number)[];
    rowIdsOutOfViewport: (string | number)[];
    grid: SlickGrid;
  }) {
    if (args && args.item) {
      this._slots.forEach((slot) => {
        if (slot.id === args.item[this.datasetIdPropName]) {
          this.redrawViewSlot(slot);
        }
      });
    }
  }
}
