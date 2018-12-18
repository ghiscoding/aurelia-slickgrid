var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createOverrideContext, Container, inject, singleton, ViewCompiler, ViewResources, ViewSlot } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ExtensionName } from '../models/index';
import { ExtensionUtility } from './extensionUtility';
import { SharedService } from '../services/shared.service';
import { disposeAllSubscriptions } from '../services/utilities';
import * as DOMPurify from 'dompurify';
import * as $ from 'jquery';
const ROW_DETAIL_CONTAINER_PREFIX = 'container_';
const PRELOAD_CONTAINER_PREFIX = 'container_loading';
let RowDetailViewExtension = class RowDetailViewExtension {
    constructor(container, ea, extensionUtility, sharedService, viewCompiler, viewResources) {
        this.container = container;
        this.ea = ea;
        this.extensionUtility = extensionUtility;
        this.sharedService = sharedService;
        this.viewCompiler = viewCompiler;
        this.viewResources = viewResources;
        this._eventHandler = new Slick.EventHandler();
        this._slots = [];
        this._subscriptions = [];
    }
    dispose() {
        // unsubscribe all SlickGrid events
        this._eventHandler.unsubscribeAll();
        if (this._extension && this._extension.destroy) {
            this._extension.destroy();
        }
        disposeAllSubscriptions(this._subscriptions);
    }
    /**
     * Create the plugin before the Grid creation, else it will behave oddly.
     * Mostly because the column definitions might change after the grid creation
     */
    create(columnDefinitions, gridOptions) {
        if (columnDefinitions && gridOptions) {
            // dynamically import the SlickGrid plugin with requireJS
            this.extensionUtility.loadExtensionDynamically(ExtensionName.rowDetailView);
            if (!gridOptions.rowDetailView) {
                throw new Error('The Row Detail View requires options to be passed via the "rowDetailView" property of the Grid Options');
            }
            if (gridOptions && gridOptions.rowDetailView) {
                if (!this._extension) {
                    if (typeof gridOptions.rowDetailView.process === 'function') {
                        // we need to keep the user "process" method and replace it with our own execution method
                        // we do this because when we get the item detail, we need to call "onAsyncResponse.notify" for the plugin to work
                        this._userProcessFn = gridOptions.rowDetailView.process; // keep user's process method
                        gridOptions.rowDetailView.process = (item) => this.onProcessing(item); // replace process method & run our internal one
                    }
                    else {
                        throw new Error('You need to provide a "process" function for the Row Detail Extension to work properly');
                    }
                    // load the Preload & RowDetail Templates (could be straight HTML or Aurelia View/ViewModel)
                    // when those are Aurelia View/ViewModel, we need to create View Slot & provide the html containers to the Plugin (preTemplate/postTemplate methods)
                    if (!gridOptions.rowDetailView.preTemplate) {
                        this._preloadView = gridOptions && gridOptions.rowDetailView && gridOptions.rowDetailView.preloadView || '';
                        gridOptions.rowDetailView.preTemplate = () => DOMPurify.sanitize(`<div class="${PRELOAD_CONTAINER_PREFIX} au-target"></div>`);
                    }
                    if (!gridOptions.rowDetailView.postTemplate) {
                        this._viewModel = gridOptions && gridOptions.rowDetailView && gridOptions.rowDetailView.viewModel || '';
                        gridOptions.rowDetailView.postTemplate = (itemDetail) => DOMPurify.sanitize(`<div class="${ROW_DETAIL_CONTAINER_PREFIX}${itemDetail.id} au-target"></div>`);
                    }
                    // finally register the Row Detail View Plugin
                    this._extension = new Slick.Plugins.RowDetailView(gridOptions.rowDetailView);
                }
                const selectionColumn = this._extension.getColumnDefinition();
                selectionColumn.excludeFromExport = true;
                selectionColumn.excludeFromQuery = true;
                selectionColumn.excludeFromHeaderMenu = true;
                columnDefinitions.unshift(selectionColumn);
            }
            return this._extension;
        }
        return null;
    }
    register(rowSelectionPlugin) {
        if (this.sharedService && this.sharedService.grid && this.sharedService.gridOptions) {
            // the plugin has to be created BEFORE the grid (else it behaves oddly), but we can only watch grid events AFTER the grid is created
            this.sharedService.grid.registerPlugin(this._extension);
            // this also requires the Row Selection Model to be registered as well
            if (!rowSelectionPlugin || !this.sharedService.grid.getSelectionModel()) {
                this.extensionUtility.loadExtensionDynamically(ExtensionName.rowSelection);
                rowSelectionPlugin = new Slick.RowSelectionModel(this.sharedService.gridOptions.rowSelectionOptions || { selectActiveRow: true });
                this.sharedService.grid.setSelectionModel(rowSelectionPlugin);
            }
            // this._extension = this.create(this.sharedService.allColumns, this.sharedService.gridOptions);
            this.sharedService.grid.registerPlugin(this._extension);
            // hook all events
            if (this.sharedService.grid && this.sharedService.gridOptions.rowDetailView) {
                if (this.sharedService.gridOptions.rowDetailView.onExtensionRegistered) {
                    this.sharedService.gridOptions.rowDetailView.onExtensionRegistered(this._extension);
                }
                this._eventHandler.subscribe(this._extension.onAsyncResponse, (e, args) => {
                    if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onAsyncResponse === 'function') {
                        this.sharedService.gridOptions.rowDetailView.onAsyncResponse(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onAsyncEndUpdate, (e, args) => {
                    // triggers after backend called "onAsyncResponse.notify()"
                    this.renderViewModel(args && args.item);
                    if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onAsyncEndUpdate === 'function') {
                        this.sharedService.gridOptions.rowDetailView.onAsyncEndUpdate(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onAfterRowDetailToggle, (e, args) => {
                    // display preload template & re-render all the other Detail Views after toggling
                    // the preload View will eventually go away once the data gets loaded after the "onAsyncEndUpdate" event
                    this.renderPreloadView();
                    this.renderAllViewModels();
                    if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onAfterRowDetailToggle === 'function') {
                        this.sharedService.gridOptions.rowDetailView.onAfterRowDetailToggle(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onBeforeRowDetailToggle, (e, args) => {
                    // before toggling row detail, we need to create View Slot if it doesn't exist
                    this.onBeforeRowDetailToggle(e, args);
                    if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onBeforeRowDetailToggle === 'function') {
                        this.sharedService.gridOptions.rowDetailView.onBeforeRowDetailToggle(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onRowBackToViewportRange, (e, args) => {
                    // when row is back to viewport range, we will re-render the View Slot(s)
                    this.onRowBackToViewportRange(e, args);
                    if (this.sharedService.gridOptions.rowDetailView && typeof this.sharedService.gridOptions.rowDetailView.onRowBackToViewportRange === 'function') {
                        this.sharedService.gridOptions.rowDetailView.onRowBackToViewportRange(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onRowOutOfViewportRange, (e, args) => {
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
                this._subscriptions.push(this.ea.subscribe('filterService:filterChanged', () => this.redrawAllViewSlots()));
            }
            return this._extension;
        }
        return null;
    }
    // --
    // private functions
    // ------------------
    addToArrayWhenNotFound(inputArray, inputObj) {
        const arrayRowIndex = inputArray.findIndex((obj) => obj.id === inputObj.id);
        if (arrayRowIndex < 0) {
            inputArray.push(inputObj);
        }
    }
    disposeAllViewSlot() {
        this._slots.forEach((slot) => this.disposeViewSlot(slot));
        this._slots = [];
    }
    disposeViewSlot(expandedView) {
        if (expandedView && expandedView.view && expandedView.viewSlot && expandedView.view.unbind && expandedView.viewSlot.remove) {
            const container = $(`.${ROW_DETAIL_CONTAINER_PREFIX}${this._slots[0].id}`);
            if (container && container.length > 0) {
                expandedView.viewSlot.remove(expandedView.view);
                expandedView.view.unbind();
                container.empty();
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
    notifyTemplate(item) {
        if (this._extension) {
            this._extension.onAsyncResponse.notify({ item }, undefined, this);
        }
    }
    /**
     * On Processing, we will notify the plugin with the new item detail once backend server call completes
     * @param item
     */
    onProcessing(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (item && typeof this._userProcessFn === 'function') {
                const userProcessFn = this._userProcessFn(item);
                // wait for the "userProcessFn", once resolved we will save it into the "collection"
                const response = yield userProcessFn;
                let awaitedItemDetail;
                if (response.hasOwnProperty('id')) {
                    awaitedItemDetail = response; // from Promise
                }
                else if (response instanceof Response && typeof response['json'] === 'function') {
                    awaitedItemDetail = yield response['json'](); // from Fetch
                }
                else if (response && response['content']) {
                    awaitedItemDetail = response['content']; // from aurelia-http-client
                }
                // notify the plugin with the new item details
                this.notifyTemplate(awaitedItemDetail || {});
            }
        });
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
    /**
     * Just before the row get expanded or collapsed we will do the following
     * First determine if the row is expanding or collapsing,
     * if it's expanding we will add it to our View Slots reference array if we don't already have it
     * or if it's collapsing we will remove it from our View Slots reference array
     */
    onBeforeRowDetailToggle(e, args) {
        // expanding
        if (args && args.item && args.item.__collapsed) {
            // expanding row detail
            if (args && args.item) {
                const viewInfo = {
                    id: args.item.id,
                    dataContext: args.item
                };
                this.addToArrayWhenNotFound(this._slots, viewInfo);
            }
        }
        else {
            // collapsing, so dispose of the View/ViewSlot
            const foundSlotIndex = this._slots.findIndex((slot) => slot.id === args.item.id);
            if (foundSlotIndex >= 0) {
                if (this.disposeViewSlot(this._slots[foundSlotIndex])) {
                    this._slots.splice(foundSlotIndex, 1);
                }
            }
        }
    }
    /** When Row comes back to Viewport Range, we need to redraw the View */
    onRowBackToViewportRange(e, args) {
        if (args && args.item) {
            this._slots.forEach((slot) => {
                if (slot.id === args.item.id) {
                    this.redrawViewSlot(slot);
                }
            });
        }
    }
    /** Redraw the necessary View Slot */
    redrawViewSlot(slot) {
        const containerElement = $(`.${ROW_DETAIL_CONTAINER_PREFIX}${slot.id}`);
        if (containerElement && containerElement.length) {
            this.renderViewModel(slot.dataContext);
        }
    }
    /** Render (or rerender) the View Slot (Row Detail) */
    renderPreloadView() {
        const containerElement = $(`.${PRELOAD_CONTAINER_PREFIX}`);
        const viewFactory = this.viewCompiler.compile('<template><compose view.bind="template"></compose><template>', this.viewResources);
        if (containerElement.length) {
            // Creates a view
            containerElement.empty();
            const view = viewFactory.create(this.container);
            const viewModel = { template: this._preloadView || '' };
            view.bind(viewModel, createOverrideContext(viewModel));
            // Add the view to the slot
            this._slotPreload = new ViewSlot(containerElement[0], true);
            this._slotPreload.add(view);
        }
    }
    /** Render (or rerender) the View Slot (Row Detail) */
    renderViewModel(item) {
        const containerElement = $(`.${ROW_DETAIL_CONTAINER_PREFIX}${item.id}`);
        const viewFactory = this.viewCompiler.compile('<template><compose view-model.bind="template"></compose><template>', this.viewResources);
        if (containerElement.length) {
            // Creates a view
            containerElement.empty();
            const view = viewFactory.create(this.container);
            const viewModel = { template: this._viewModel || '', model: item };
            view.bind(viewModel, createOverrideContext(viewModel));
            // Add the view to the slot
            const viewSlot = new ViewSlot(containerElement[0], true);
            viewSlot.add(view);
            const slotObj = this._slots.find((obj) => obj.id === item.id);
            if (slotObj) {
                slotObj.view = view;
                slotObj.viewSlot = viewSlot;
            }
        }
    }
};
RowDetailViewExtension = __decorate([
    singleton(true),
    inject(Container, EventAggregator, ExtensionUtility, SharedService, ViewCompiler, ViewResources)
], RowDetailViewExtension);
export { RowDetailViewExtension };
//# sourceMappingURL=rowDetailViewExtension.js.map