import 'jquery-ui-dist/jquery-ui';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';
import 'slickgrid/slick.groupitemmetadataprovider';
import 'slickgrid/controls/slick.columnpicker';
import 'slickgrid/controls/slick.gridmenu';
import 'slickgrid/controls/slick.pager';
import 'slickgrid/plugins/slick.autotooltips';
import 'slickgrid/plugins/slick.cellexternalcopymanager';
import 'slickgrid/plugins/slick.cellrangedecorator';
import 'slickgrid/plugins/slick.cellrangeselector';
import 'slickgrid/plugins/slick.cellselectionmodel';
import 'slickgrid/plugins/slick.checkboxselectcolumn';
import 'slickgrid/plugins/slick.headerbuttons';
import 'slickgrid/plugins/slick.headermenu';
import 'slickgrid/plugins/slick.rowmovemanager';
import 'slickgrid/plugins/slick.rowselectionmodel';
import { BindingEngine, Container } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { Column, GridOption, Pagination } from './models/index';
import { ControlAndPluginService, ExportService, FilterService, GridEventService, GridService, GridStateService, GroupingAndColspanService, ResizerService, SortService } from './services/index';
export declare class AureliaSlickgridCustomElement {
    private bindingEngine;
    private controlAndPluginService;
    private exportService;
    private elm;
    private ea;
    private filterService;
    private gridEventService;
    private gridService;
    private gridStateService;
    private groupingAndColspanService;
    private resizerService;
    private sortService;
    private container;
    private _columnDefinitions;
    private _dataset;
    private _eventHandler;
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
    constructor(bindingEngine: BindingEngine, controlAndPluginService: ControlAndPluginService, exportService: ExportService, elm: Element, ea: EventAggregator, filterService: FilterService, gridEventService: GridEventService, gridService: GridService, gridStateService: GridStateService, groupingAndColspanService: GroupingAndColspanService, resizerService: ResizerService, sortService: SortService, container: Container);
    attached(): void;
    initialization(): void;
    detached(): void;
    bind(): void;
    columnDefinitionsChanged(): void;
    datasetChanged(newValue: any[], oldValue: any[]): void;
    /**
     * Define what our internal Post Process callback, it will execute internally after we get back result from the Process backend call
     * For now, this is GraphQL Service only feautre and it will basically refresh the Dataset & Pagination without having the user to create his own PostProcess every time
     */
    createBackendApiInternalPostProcessCallback(gridOptions: GridOption): void;
    attachDifferentHooks(grid: any, gridOptions: GridOption, dataView: any): void;
    attachBackendCallbackFunctions(gridOptions: GridOption): void;
    attachResizeHook(grid: any, options: GridOption): void;
    executeAfterDataviewCreated(grid: any, gridOptions: GridOption, dataView: any): void;
    mergeGridOptions(gridOptions: GridOption): GridOption;
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
    private dispatchCustomEvent(eventName, data?, isBubbling?);
}
