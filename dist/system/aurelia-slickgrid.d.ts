import 'jquery-ui-dist/jquery-ui';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';
import { BindingEngine, Container } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Column, GridOption, Pagination } from './models/index';
import { ExportService, ExtensionService, FilterService, GridEventService, GridService, GridStateService, GroupingAndColspanService, ResizerService, SortService } from './services/index';
import { ExtensionUtility } from './extensions/extensionUtility';
import { SharedService } from './services/shared.service';
export declare class AureliaSlickgridCustomElement {
    private bindingEngine;
    private exportService;
    private elm;
    private ea;
    private extensionService;
    private extensionUtility;
    private filterService;
    private gridEventService;
    private gridService;
    private gridStateService;
    private groupingAndColspanService;
    private resizerService;
    private sharedService;
    private sortService;
    private container;
    private _columnDefinitions;
    private _dataset;
    private _eventHandler;
    private _fixedHeight;
    private _fixedWidth;
    private _hideHeaderRowAfterPageLoad;
    groupItemMetadataProvider: any;
    isGridInitialized: boolean;
    showPagination: boolean;
    serviceList: any[];
    subscriptions: Subscription[];
    columnDefinitions: Column[];
    element: Element;
    gridPaginationOptions: GridOption;
    dataview: any;
    grid: any;
    dataset: any[];
    gridId: string;
    gridOptions: GridOption;
    gridHeight: number;
    gridWidth: number;
    pickerOptions: any;
    constructor(bindingEngine: BindingEngine, exportService: ExportService, elm: Element, ea: EventAggregator, extensionService: ExtensionService, extensionUtility: ExtensionUtility, filterService: FilterService, gridEventService: GridEventService, gridService: GridService, gridStateService: GridStateService, groupingAndColspanService: GroupingAndColspanService, resizerService: ResizerService, sharedService: SharedService, sortService: SortService, container: Container);
    attached(): void;
    initialization(): void;
    detached(emptyDomElementContainer?: boolean): void;
    dispose(emptyDomElementContainer?: boolean): void;
    bind(): void;
    columnDefinitionsChanged(): void;
    /**
     * Commits the current edit to the grid
     */
    commitEdit(target: Element): void;
    datasetChanged(newValue: any[], oldValue: any[]): void;
    /**
     * Define what our internal Post Process callback, it will execute internally after we get back result from the Process backend call
     * For now, this is GraphQL Service only feature and it will basically
     * refresh the Dataset & Pagination without having the user to create his own PostProcess every time
     */
    createBackendApiInternalPostProcessCallback(gridOptions: GridOption): void;
    attachDifferentHooks(grid: any, gridOptions: GridOption, dataView: any): void;
    attachBackendCallbackFunctions(gridOptions: GridOption): void;
    attachResizeHook(grid: any, options: GridOption): void;
    executeAfterDataviewCreated(grid: any, gridOptions: GridOption, dataView: any): void;
    mergeGridOptions(gridOptions: GridOption): GridOption;
    /**
     * On a Pagination changed, we will trigger a Grid State changed with the new pagination info
     * Also if we use Row Selection or the Checkbox Selector, we need to reset any selection
     */
    paginationChanged(pagination: Pagination): void;
    /**
     * When dataset changes, we need to refresh the entire grid UI & possibly resize it as well
     * @param dataset
     */
    refreshGridData(dataset: any[], totalCount?: number): void;
    /**
     * Toggle the filter row displayed on first row
     * @param isShowing
     */
    showHeaderRow(isShowing: boolean): boolean;
    /** Toggle the filter row displayed on first row */
    toggleHeaderRow(): boolean;
    /**
     * Dynamically change or update the column definitions list.
     * We will re-render the grid so that the new header and data shows up correctly.
     * If using i18n, we also need to trigger a re-translate of the column headers
     */
    updateColumnDefinitionsList(newColumnDefinitions?: Column[]): void;
    /** Dispatch of Custom Event, which by default will bubble & is cancelable */
    private dispatchCustomEvent(eventName, data?, isBubbling?, isCancelable?);
    /** Load the Editor Collection asynchronously and replace the "collection" property when Promise resolves */
    private loadEditorCollectionAsync(column);
    /**
     * Update the "internalColumnEditor.collection" property.
     * Since this is called after the async call resolves, the pointer will not be the same as the "column" argument passed.
     * Once we found the new pointer, we will reassign the "editor" and "collection" to the "internalColumnEditor" so it has newest collection
     */
    private updateEditorCollection(column, newCollection);
}
