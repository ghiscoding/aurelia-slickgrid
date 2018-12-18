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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { createOverrideContext, Container, inject, singleton, ViewCompiler, ViewResources, ViewSlot } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { ExtensionName } from '../models/index';
import { ExtensionUtility } from './extensionUtility';
import { SharedService } from '../services/shared.service';
import { disposeAllSubscriptions } from '../services/utilities';
import * as DOMPurify from 'dompurify';
import * as $ from 'jquery';
var ROW_DETAIL_CONTAINER_PREFIX = 'container_';
var PRELOAD_CONTAINER_PREFIX = 'container_loading';
var RowDetailViewExtension = /** @class */ (function () {
    function RowDetailViewExtension(container, ea, extensionUtility, sharedService, viewCompiler, viewResources) {
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
    RowDetailViewExtension.prototype.dispose = function () {
        // unsubscribe all SlickGrid events
        this._eventHandler.unsubscribeAll();
        if (this._extension && this._extension.destroy) {
            this._extension.destroy();
        }
        disposeAllSubscriptions(this._subscriptions);
    };
    /**
     * Create the plugin before the Grid creation, else it will behave oddly.
     * Mostly because the column definitions might change after the grid creation
     */
    RowDetailViewExtension.prototype.create = function (columnDefinitions, gridOptions) {
        var _this = this;
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
                        gridOptions.rowDetailView.process = function (item) { return _this.onProcessing(item); }; // replace process method & run our internal one
                    }
                    else {
                        throw new Error('You need to provide a "process" function for the Row Detail Extension to work properly');
                    }
                    // load the Preload & RowDetail Templates (could be straight HTML or Aurelia View/ViewModel)
                    // when those are Aurelia View/ViewModel, we need to create View Slot & provide the html containers to the Plugin (preTemplate/postTemplate methods)
                    if (!gridOptions.rowDetailView.preTemplate) {
                        this._preloadView = gridOptions && gridOptions.rowDetailView && gridOptions.rowDetailView.preloadView || '';
                        gridOptions.rowDetailView.preTemplate = function () { return DOMPurify.sanitize("<div class=\"" + PRELOAD_CONTAINER_PREFIX + " au-target\"></div>"); };
                    }
                    if (!gridOptions.rowDetailView.postTemplate) {
                        this._viewModel = gridOptions && gridOptions.rowDetailView && gridOptions.rowDetailView.viewModel || '';
                        gridOptions.rowDetailView.postTemplate = function (itemDetail) { return DOMPurify.sanitize("<div class=\"" + ROW_DETAIL_CONTAINER_PREFIX + itemDetail.id + " au-target\"></div>"); };
                    }
                    // finally register the Row Detail View Plugin
                    this._extension = new Slick.Plugins.RowDetailView(gridOptions.rowDetailView);
                }
                var selectionColumn = this._extension.getColumnDefinition();
                selectionColumn.excludeFromExport = true;
                selectionColumn.excludeFromQuery = true;
                selectionColumn.excludeFromHeaderMenu = true;
                columnDefinitions.unshift(selectionColumn);
            }
            return this._extension;
        }
        return null;
    };
    RowDetailViewExtension.prototype.register = function (rowSelectionPlugin) {
        var _this = this;
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
                this._eventHandler.subscribe(this._extension.onAsyncResponse, function (e, args) {
                    if (_this.sharedService.gridOptions.rowDetailView && typeof _this.sharedService.gridOptions.rowDetailView.onAsyncResponse === 'function') {
                        _this.sharedService.gridOptions.rowDetailView.onAsyncResponse(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onAsyncEndUpdate, function (e, args) {
                    // triggers after backend called "onAsyncResponse.notify()"
                    _this.renderViewModel(args && args.item);
                    if (_this.sharedService.gridOptions.rowDetailView && typeof _this.sharedService.gridOptions.rowDetailView.onAsyncEndUpdate === 'function') {
                        _this.sharedService.gridOptions.rowDetailView.onAsyncEndUpdate(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onAfterRowDetailToggle, function (e, args) {
                    // display preload template & re-render all the other Detail Views after toggling
                    // the preload View will eventually go away once the data gets loaded after the "onAsyncEndUpdate" event
                    _this.renderPreloadView();
                    _this.renderAllViewModels();
                    if (_this.sharedService.gridOptions.rowDetailView && typeof _this.sharedService.gridOptions.rowDetailView.onAfterRowDetailToggle === 'function') {
                        _this.sharedService.gridOptions.rowDetailView.onAfterRowDetailToggle(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onBeforeRowDetailToggle, function (e, args) {
                    // before toggling row detail, we need to create View Slot if it doesn't exist
                    _this.onBeforeRowDetailToggle(e, args);
                    if (_this.sharedService.gridOptions.rowDetailView && typeof _this.sharedService.gridOptions.rowDetailView.onBeforeRowDetailToggle === 'function') {
                        _this.sharedService.gridOptions.rowDetailView.onBeforeRowDetailToggle(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onRowBackToViewportRange, function (e, args) {
                    // when row is back to viewport range, we will re-render the View Slot(s)
                    _this.onRowBackToViewportRange(e, args);
                    if (_this.sharedService.gridOptions.rowDetailView && typeof _this.sharedService.gridOptions.rowDetailView.onRowBackToViewportRange === 'function') {
                        _this.sharedService.gridOptions.rowDetailView.onRowBackToViewportRange(e, args);
                    }
                });
                this._eventHandler.subscribe(this._extension.onRowOutOfViewportRange, function (e, args) {
                    if (_this.sharedService.gridOptions.rowDetailView && typeof _this.sharedService.gridOptions.rowDetailView.onRowOutOfViewportRange === 'function') {
                        _this.sharedService.gridOptions.rowDetailView.onRowOutOfViewportRange(e, args);
                    }
                });
                // --
                // hook some events needed by the Plugin itself
                this._eventHandler.subscribe(this.sharedService.grid.onColumnsReordered, function () { return _this.redrawAllViewSlots(); });
                // on sort, all row detail are collapsed so we can dispose of all the Views as well
                this._eventHandler.subscribe(this.sharedService.grid.onSort, function () { return _this.disposeAllViewSlot(); });
                // on filter changed, we need to re-render all Views
                this._subscriptions.push(this.ea.subscribe('filterService:filterChanged', function () { return _this.redrawAllViewSlots(); }));
            }
            return this._extension;
        }
        return null;
    };
    // --
    // private functions
    // ------------------
    RowDetailViewExtension.prototype.addToArrayWhenNotFound = function (inputArray, inputObj) {
        var arrayRowIndex = inputArray.findIndex(function (obj) { return obj.id === inputObj.id; });
        if (arrayRowIndex < 0) {
            inputArray.push(inputObj);
        }
    };
    RowDetailViewExtension.prototype.disposeAllViewSlot = function () {
        var _this = this;
        this._slots.forEach(function (slot) { return _this.disposeViewSlot(slot); });
        this._slots = [];
    };
    RowDetailViewExtension.prototype.disposeViewSlot = function (expandedView) {
        if (expandedView && expandedView.view && expandedView.viewSlot && expandedView.view.unbind && expandedView.viewSlot.remove) {
            var container = $("." + ROW_DETAIL_CONTAINER_PREFIX + this._slots[0].id);
            if (container && container.length > 0) {
                expandedView.viewSlot.remove(expandedView.view);
                expandedView.view.unbind();
                container.empty();
                return expandedView;
            }
        }
        return null;
    };
    /**
     * notify the onAsyncResponse with the "args.item" (required property)
     * the plugin will then use item to populate the row detail panel with the "postTemplate"
     * @param item
     */
    RowDetailViewExtension.prototype.notifyTemplate = function (item) {
        if (this._extension) {
            this._extension.onAsyncResponse.notify({ item: item }, undefined, this);
        }
    };
    /**
     * On Processing, we will notify the plugin with the new item detail once backend server call completes
     * @param item
     */
    RowDetailViewExtension.prototype.onProcessing = function (item) {
        return __awaiter(this, void 0, void 0, function () {
            var userProcessFn, response, awaitedItemDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(item && typeof this._userProcessFn === 'function')) return [3 /*break*/, 6];
                        userProcessFn = this._userProcessFn(item);
                        return [4 /*yield*/, userProcessFn];
                    case 1:
                        response = _a.sent();
                        awaitedItemDetail = void 0;
                        if (!response.hasOwnProperty('id')) return [3 /*break*/, 2];
                        awaitedItemDetail = response; // from Promise
                        return [3 /*break*/, 5];
                    case 2:
                        if (!(response instanceof Response && typeof response['json'] === 'function')) return [3 /*break*/, 4];
                        return [4 /*yield*/, response['json']()];
                    case 3:
                        awaitedItemDetail = _a.sent(); // from Fetch
                        return [3 /*break*/, 5];
                    case 4:
                        if (response && response['content']) {
                            awaitedItemDetail = response['content']; // from aurelia-http-client
                        }
                        _a.label = 5;
                    case 5:
                        // notify the plugin with the new item details
                        this.notifyTemplate(awaitedItemDetail || {});
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /** Redraw (re-render) all the expanded row detail View Slots */
    RowDetailViewExtension.prototype.redrawAllViewSlots = function () {
        var _this = this;
        this._slots.forEach(function (slot) {
            _this.redrawViewSlot(slot);
        });
    };
    /** Render all the expanded row detail View Slots */
    RowDetailViewExtension.prototype.renderAllViewModels = function () {
        var _this = this;
        this._slots.forEach(function (slot) {
            if (slot && slot.dataContext) {
                _this.renderViewModel(slot.dataContext);
            }
        });
    };
    /**
     * Just before the row get expanded or collapsed we will do the following
     * First determine if the row is expanding or collapsing,
     * if it's expanding we will add it to our View Slots reference array if we don't already have it
     * or if it's collapsing we will remove it from our View Slots reference array
     */
    RowDetailViewExtension.prototype.onBeforeRowDetailToggle = function (e, args) {
        // expanding
        if (args && args.item && args.item.__collapsed) {
            // expanding row detail
            if (args && args.item) {
                var viewInfo = {
                    id: args.item.id,
                    dataContext: args.item
                };
                this.addToArrayWhenNotFound(this._slots, viewInfo);
            }
        }
        else {
            // collapsing, so dispose of the View/ViewSlot
            var foundSlotIndex = this._slots.findIndex(function (slot) { return slot.id === args.item.id; });
            if (foundSlotIndex >= 0) {
                if (this.disposeViewSlot(this._slots[foundSlotIndex])) {
                    this._slots.splice(foundSlotIndex, 1);
                }
            }
        }
    };
    /** When Row comes back to Viewport Range, we need to redraw the View */
    RowDetailViewExtension.prototype.onRowBackToViewportRange = function (e, args) {
        var _this = this;
        if (args && args.item) {
            this._slots.forEach(function (slot) {
                if (slot.id === args.item.id) {
                    _this.redrawViewSlot(slot);
                }
            });
        }
    };
    /** Redraw the necessary View Slot */
    RowDetailViewExtension.prototype.redrawViewSlot = function (slot) {
        var containerElement = $("." + ROW_DETAIL_CONTAINER_PREFIX + slot.id);
        if (containerElement && containerElement.length) {
            this.renderViewModel(slot.dataContext);
        }
    };
    /** Render (or rerender) the View Slot (Row Detail) */
    RowDetailViewExtension.prototype.renderPreloadView = function () {
        var containerElement = $("." + PRELOAD_CONTAINER_PREFIX);
        var viewFactory = this.viewCompiler.compile('<template><compose view.bind="template"></compose><template>', this.viewResources);
        if (containerElement.length) {
            // Creates a view
            containerElement.empty();
            var view = viewFactory.create(this.container);
            var viewModel = { template: this._preloadView || '' };
            view.bind(viewModel, createOverrideContext(viewModel));
            // Add the view to the slot
            this._slotPreload = new ViewSlot(containerElement[0], true);
            this._slotPreload.add(view);
        }
    };
    /** Render (or rerender) the View Slot (Row Detail) */
    RowDetailViewExtension.prototype.renderViewModel = function (item) {
        var containerElement = $("." + ROW_DETAIL_CONTAINER_PREFIX + item.id);
        var viewFactory = this.viewCompiler.compile('<template><compose view-model.bind="template"></compose><template>', this.viewResources);
        if (containerElement.length) {
            // Creates a view
            containerElement.empty();
            var view = viewFactory.create(this.container);
            var viewModel = { template: this._viewModel || '', model: item };
            view.bind(viewModel, createOverrideContext(viewModel));
            // Add the view to the slot
            var viewSlot = new ViewSlot(containerElement[0], true);
            viewSlot.add(view);
            var slotObj = this._slots.find(function (obj) { return obj.id === item.id; });
            if (slotObj) {
                slotObj.view = view;
                slotObj.viewSlot = viewSlot;
            }
        }
    };
    RowDetailViewExtension = __decorate([
        singleton(true),
        inject(Container, EventAggregator, ExtensionUtility, SharedService, ViewCompiler, ViewResources)
    ], RowDetailViewExtension);
    return RowDetailViewExtension;
}());
export { RowDetailViewExtension };
//# sourceMappingURL=rowDetailViewExtension.js.map