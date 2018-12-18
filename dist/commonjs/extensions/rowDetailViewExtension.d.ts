import { Container, View, ViewCompiler, ViewResources, ViewSlot } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Column, Extension, GridOption } from '../models/index';
import { ExtensionUtility } from './extensionUtility';
import { SharedService } from '../services/shared.service';
export interface CreatedView {
    id: string | number;
    dataContext: any;
    view?: View;
    viewSlot?: ViewSlot;
}
export declare class RowDetailViewExtension implements Extension {
    private container;
    private ea;
    private extensionUtility;
    private sharedService;
    private viewCompiler;
    private viewResources;
    private _eventHandler;
    private _extension;
    private _preloadView;
    private _slotPreload;
    private _slots;
    private _viewModel;
    private _subscriptions;
    private _userProcessFn;
    constructor(container: Container, ea: EventAggregator, extensionUtility: ExtensionUtility, sharedService: SharedService, viewCompiler: ViewCompiler, viewResources: ViewResources);
    dispose(): void;
    /**
     * Create the plugin before the Grid creation, else it will behave oddly.
     * Mostly because the column definitions might change after the grid creation
     */
    create(columnDefinitions: Column[], gridOptions: GridOption): any;
    register(rowSelectionPlugin?: any): any;
    private addToArrayWhenNotFound;
    private disposeAllViewSlot;
    private disposeViewSlot;
    /**
     * notify the onAsyncResponse with the "args.item" (required property)
     * the plugin will then use item to populate the row detail panel with the "postTemplate"
     * @param item
     */
    private notifyTemplate;
    /**
     * On Processing, we will notify the plugin with the new item detail once backend server call completes
     * @param item
     */
    private onProcessing;
    /** Redraw (re-render) all the expanded row detail View Slots */
    private redrawAllViewSlots;
    /** Render all the expanded row detail View Slots */
    private renderAllViewModels;
    /**
     * Just before the row get expanded or collapsed we will do the following
     * First determine if the row is expanding or collapsing,
     * if it's expanding we will add it to our View Slots reference array if we don't already have it
     * or if it's collapsing we will remove it from our View Slots reference array
     */
    private onBeforeRowDetailToggle;
    /** When Row comes back to Viewport Range, we need to redraw the View */
    private onRowBackToViewportRange;
    /** Redraw the necessary View Slot */
    private redrawViewSlot;
    /** Render (or rerender) the View Slot (Row Detail) */
    private renderPreloadView;
    /** Render (or rerender) the View Slot (Row Detail) */
    private renderViewModel;
}
