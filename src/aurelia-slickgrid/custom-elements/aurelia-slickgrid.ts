// import 3rd party vendor libs
// only import the necessary core lib, each will be imported on demand when enabled (via require)
import * as $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/lib/jquery.mousewheel';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';

import { bindable, BindingEngine, bindingMode, Container, Factory, inject, NewInstance } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { DOM } from 'aurelia-pal';
import { I18N } from 'aurelia-i18n';

import { Constants } from '../constants';
import { GlobalGridOptions } from '../global-grid-options';
import {
  AureliaGridInstance,
  BackendServiceApi,
  BackendServiceOption,
  Column,
  CustomFooterOption,
  SlickDataView,
  ExtensionName,
  GraphqlResult,
  GraphqlPaginatedResult,
  GridOption,
  GridStateType,
  Locale,
  Metrics,
  Pagination,
  ServicePagination,
  SlickEventHandler,
  SlickGrid,
  TreeDataOption,
} from '../models/index';
import {
  convertParentChildArrayToHierarchicalView,
  disposeAllSubscriptions,
  ExcelExportService,
  ExportService,
  ExtensionService,
  FilterService,
  GraphqlService,
  GridEventService,
  GridService,
  GridStateService,
  GroupingAndColspanService,
  PaginationService,
  ResizerService,
  SortService,
  toKebabCase,
  TreeDataService,
} from '../services/index';
import { executeBackendProcessesCallback, onBackendError, refreshBackendDataset } from '../services/backend-utilities';
import { ExtensionUtility } from '../extensions/extensionUtility';
import { SharedService } from '../services/shared.service';
import { SlickgridEventAggregator } from './slickgridEventAggregator';

// using external non-typed js libraries
declare const Slick: any;

const DEFAULT_AURELIA_EVENT_PREFIX = 'asg';
const DEFAULT_SLICKGRID_EVENT_PREFIX = 'sg';

// Aurelia doesn't support well TypeScript @autoinject in a Plugin so we'll do it the manual way
@inject(
  BindingEngine,
  Container,
  Element,
  EventAggregator,
  NewInstance.of(EventAggregator).as(SlickgridEventAggregator),
  ExcelExportService,
  ExportService,
  ExtensionService,
  ExtensionUtility,
  FilterService,
  GridEventService,
  GridService,
  GridStateService,
  GroupingAndColspanService,
  I18N,
  PaginationService,
  ResizerService,
  SharedService,
  SortService,
  TreeDataService,
)
export class AureliaSlickgridCustomElement {
  private _columnDefinitions: Column[] = [];
  private _dataset: any[];
  private _eventHandler: SlickEventHandler = new Slick.EventHandler();
  private _fixedHeight: number | null;
  private _fixedWidth: number | null;
  private _hideHeaderRowAfterPageLoad = false;
  private _isGridInitialized = false;
  private _isGridHavingFilters = false;
  private _isDatasetInitialized = false;
  private _isPaginationInitialized = false;
  private _isLocalGrid = true;
  groupItemMetadataProvider: any;
  backendServiceApi: BackendServiceApi | undefined;
  customFooterOptions: CustomFooterOption;
  locales: Locale;
  metrics: Metrics;
  showCustomFooter = false;
  showPagination = false;
  serviceList: any[] = [];
  subscriptions: Subscription[] = [];
  paginationData: {
    gridOptions: GridOption;
    paginationService: PaginationService;
  };

  @bindable({ defaultBindingMode: bindingMode.twoWay }) columnDefinitions: Column[] = [];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) element: Element;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dataview: SlickDataView;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) grid: SlickGrid;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) paginationOptions: Pagination | undefined;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) totalItems: number;
  @bindable() customDataView: any;
  @bindable() dataset: any[];
  @bindable() datasetHierarchical: any[];
  @bindable() gridId: string;
  @bindable() gridOptions: GridOption;
  @bindable() gridHeight: number;
  @bindable() gridWidth: number;
  @bindable() pickerOptions: any;

  constructor(
    private bindingEngine: BindingEngine,
    private container: Container,
    private elm: Element,
    private globalEa: EventAggregator,
    private pluginEa: SlickgridEventAggregator,
    private excelExportService: ExcelExportService,
    private exportService: ExportService,
    private extensionService: ExtensionService,
    private extensionUtility: ExtensionUtility,
    private filterService: FilterService,
    private gridEventService: GridEventService,
    private gridService: GridService,
    private gridStateService: GridStateService,
    private groupingAndColspanService: GroupingAndColspanService,
    private i18n: I18N,
    private paginationService: PaginationService,
    private resizerService: ResizerService,
    private sharedService: SharedService,
    private sortService: SortService,
    private treeDataService: TreeDataService,
  ) {
    this.serviceList = [
      exportService,
      extensionService,
      filterService,
      gridEventService,
      gridService,
      gridStateService,
      groupingAndColspanService,
      paginationService,
      resizerService,
      sortService,
      treeDataService,
    ];
  }

  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }

  attached() {
    this.initialization();
    if (this.columnDefinitions.findIndex((col) => col.filterable) > -1) {
      this._isGridHavingFilters = true;
    }
    this._isGridInitialized = true;
  }

  initialization() {
    this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-before-grid-create`);
    this.globalEa.publish('onBeforeGridCreate', true);

    // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
    this._dataset = this._dataset || this.dataset || [];
    this.gridOptions = this.mergeGridOptions(this.gridOptions);
    this.paginationOptions = this.gridOptions && this.gridOptions.pagination;
    this.locales = this.gridOptions && this.gridOptions.locales || Constants.locales;
    this.backendServiceApi = this.gridOptions && this.gridOptions.backendServiceApi;
    this._isLocalGrid = !this.backendServiceApi; // considered a local grid if it doesn't have a backend service set

    this.createBackendApiInternalPostProcessCallback(this.gridOptions);

    if (!this.customDataView) {
      if (this.gridOptions.draggableGrouping || this.gridOptions.enableGrouping) {
        this.extensionUtility.loadExtensionDynamically(ExtensionName.groupItemMetaProvider);
        this.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
        this.sharedService.groupItemMetadataProvider = this.groupItemMetadataProvider;
        this.dataview = new Slick.Data.DataView({ groupItemMetadataProvider: this.groupItemMetadataProvider });
      } else {
        this.dataview = new Slick.Data.DataView();
      }
      this.globalEa.publish('onDataviewCreated', this.dataview);
      this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-dataview-created`, this.dataview);
    }

    // for convenience to the user, we provide the property "editor" as an Aurelia-Slickgrid editor complex object
    // however "editor" is used internally by SlickGrid for it's own Editor Factory
    // so in our lib we will swap "editor" and copy it into a new property called "internalColumnEditor"
    // then take back "editor.model" and make it the new "editor" so that SlickGrid Editor Factory still works
    // Wrap each editor class in the Factory resolver so consumers of this library can use
    // dependency injection. Aurelia will resolve all dependencies when we pass the container
    // and allow slickgrid to pass its arguments to the editors constructor last
    // when slickgrid creates the editor
    // https://github.com/aurelia/dependency-injection/blob/master/src/resolvers.js
    this._columnDefinitions = this.swapInternalEditorToSlickGridFactoryEditor(this._columnDefinitions);

    // save reference for all columns before they optionally become hidden/visible
    this.sharedService.allColumns = this._columnDefinitions;
    this.sharedService.visibleColumns = this._columnDefinitions;
    this.extensionService.createExtensionsBeforeGridCreation(this._columnDefinitions, this.gridOptions);

    // build SlickGrid Grid, also user might optionally pass a custom dataview (e.g. remote model)
    this.grid = new Slick.Grid(`#${this.gridId}`, this.customDataView || this.dataview, this._columnDefinitions, this.gridOptions);

    this.sharedService.dataView = this.dataview;
    this.sharedService.grid = this.grid;
    this.extensionService.bindDifferentExtensions();

    this.bindDifferentHooks(this.grid, this.gridOptions, this.dataview);

    this.grid.init();

    if (!this.customDataView && (this.dataview && this.dataview.beginUpdate && this.dataview.setItems && this.dataview.endUpdate)) {
      this.dataview.beginUpdate();
      this.dataview.setItems(this._dataset, this.gridOptions.datasetIdPropertyName);
      this.dataview.endUpdate();

      // if you don't want the items that are not visible (due to being filtered out or being on a different page)
      // to stay selected, pass 'false' to the second arg
      const selectionModel = this.grid && this.grid.getSelectionModel();
      if (selectionModel && this.gridOptions && this.gridOptions.dataView && this.gridOptions.dataView.hasOwnProperty('syncGridSelection')) {
        // if we are using a Backend Service, we will do an extra flag check, the reason is because it might have some unintended behaviors
        // with the BackendServiceApi because technically the data in the page changes the DataView on every page change.
        let preservedRowSelectionWithBackend = false;
        if (this.gridOptions.backendServiceApi && this.gridOptions.dataView.hasOwnProperty('syncGridSelectionWithBackendService')) {
          preservedRowSelectionWithBackend = this.gridOptions.dataView.syncGridSelectionWithBackendService as boolean;
        }

        const syncGridSelection = this.gridOptions.dataView.syncGridSelection;
        if (typeof syncGridSelection === 'boolean') {
          let preservedRowSelection = syncGridSelection;
          if (!this._isLocalGrid) {
            // when using BackendServiceApi, we'll be using the "syncGridSelectionWithBackendService" flag BUT "syncGridSelection" must also be set to True
            preservedRowSelection = syncGridSelection && preservedRowSelectionWithBackend;
          }
          this.dataview.syncGridSelection(this.grid, preservedRowSelection);
        } else if (typeof syncGridSelection === 'object') {
          this.dataview.syncGridSelection(this.grid, syncGridSelection.preserveHidden, syncGridSelection.preserveHiddenOnSelectionChange);
        }
      }

      if (this._dataset.length > 0) {
        if (!this._isDatasetInitialized && (this.gridOptions.enableCheckboxSelector || this.gridOptions.enableRowSelection)) {
          this.loadRowSelectionPresetWhenExists();
        }
        this._isDatasetInitialized = true;
      }
    }

    // user might want to hide the header row on page load but still have `enableFiltering: true`
    // if that is the case, we need to hide the headerRow ONLY AFTER all filters got created & dataView exist
    if (this._hideHeaderRowAfterPageLoad) {
      this.showHeaderRow(false);
      this.sharedService.hideHeaderRowAfterPageLoad = this._hideHeaderRowAfterPageLoad;
    }

    // publish & dispatch certain events
    this.globalEa.publish('onGridCreated', this.grid);
    this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-grid-created`, this.grid);

    // after the DataView is created & updated execute some processes & dispatch some events
    if (!this.customDataView) {
      this.executeAfterDataviewCreated(this.grid, this.gridOptions, this.dataview);
    }

    // bind resize ONLY after the dataView is ready
    this.bindResizeHook(this.grid, this.gridOptions);

    // bind grouping and header grouping colspan service
    if (this.gridOptions.createPreHeaderPanel && !this.gridOptions.enableDraggableGrouping) {
      this.groupingAndColspanService.init(this.grid, this.dataview);
    }

    // initialize grid service
    this.gridService.init(this.grid, this.dataview);

    // when user enables translation, we need to translate Headers on first pass & subsequently in the bindDifferentHooks
    if (this.gridOptions.enableTranslate) {
      this.extensionService.translateColumnHeaders();
    }

    // if Export is enabled, initialize the service with the necessary grid and other objects
    if (this.gridOptions.enableExport) {
      this.exportService.init(this.grid, this.dataview);
    }

    // if Excel Export is enabled, initialize the service with the necessary grid and other objects
    if (this.gridOptions.enableExcelExport) {
      this.excelExportService.init(this.grid, this.dataview);
    }

    // when using Tree Data View
    if (this.gridOptions.enableTreeData) {
      this.treeDataService.init(this.grid);
    }

    // bind the Backend Service API callback functions only after the grid is initialized
    // because the preProcess() and onInit() might get triggered
    if (this.gridOptions && this.gridOptions.backendServiceApi) {
      this.bindBackendCallbackFunctions(this.gridOptions);
    }

    this.gridStateService.init(this.grid, this.dataview);

    // create the Aurelia Grid Instance with reference to all Services
    const aureliaElementInstance: AureliaGridInstance = {
      // Slick Grid & DataView objects
      dataView: this.dataview,
      slickGrid: this.grid,

      // public methods
      dispose: this.dispose.bind(this),

      // return all available Services (non-singleton)
      backendService: this.gridOptions && this.gridOptions.backendServiceApi && this.gridOptions.backendServiceApi.service,
      excelExportService: this.excelExportService,
      exportService: this.exportService,
      filterService: this.filterService,
      gridEventService: this.gridEventService,
      gridStateService: this.gridStateService,
      gridService: this.gridService,
      groupingService: this.groupingAndColspanService,
      extensionService: this.extensionService,
      paginationService: this.paginationService,

      /** @deprecated please use "extensionService" instead */
      pluginService: this.extensionService,
      resizerService: this.resizerService,
      sortService: this.sortService,
      treeDataService: this.treeDataService,
    };

    // expose all necessary Plugin Events through dispatch event to the custom element
    // for example, expose the event "gridStateService:changed" with dispatch as kebab "asg-on-grid-state-changed"
    for (const event of Constants.exposedEvents) {
      if (event && event.name && event.alias) {
        this.subscriptions.push(
          this.pluginEa.subscribe(event.name, (data: any) => {
            return this.dispatchCustomEvent(event.alias, data);
          })
        );
      }
    }

    // user could show a custom footer with the data metrics (dataset length and last updated timestamp)
    this.optionallyShowCustomFooterWithMetrics();

    this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-aurelia-grid-created`, aureliaElementInstance);
  }

  detached(shouldEmptyDomElementContainer = false) {
    this.globalEa.publish('onBeforeGridDestroy', this.grid);
    this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-before-grid-destroy`, this.grid);
    this.dataview = undefined;
    this._eventHandler.unsubscribeAll();
    this.grid.destroy();

    // we could optionally also empty the content of the grid container DOM element
    if (shouldEmptyDomElementContainer) {
      this.destroyGridContainerElm();
    }

    this.globalEa.publish('onAfterGridDestroyed', true);
    this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-after-grid-destroyed`, this.grid);

    // dispose of all Services
    this.serviceList.forEach((service: any) => {
      if (service && service.dispose) {
        service.dispose();
      }
    });
    this.serviceList = [];

    // also dispose of all Subscriptions
    this.subscriptions = disposeAllSubscriptions(this.subscriptions);
  }

  destroyGridContainerElm() {
    const gridContainerId = this.gridOptions && this.gridOptions.gridContainerId || 'grid1';
    $(gridContainerId).empty();
  }

  dispose(shouldEmptyDomElementContainer = false) {
    this.detached(shouldEmptyDomElementContainer);
  }

  bind() {
    this._fixedHeight = this.gridHeight ? +this.gridHeight : null;
    this._fixedWidth = this.gridWidth ? +this.gridWidth : null;

    // get the grid options (order of precedence is Global Options first, then user option which could overwrite the Global options)
    this.gridOptions = { ...GlobalGridOptions, ...this.gridOptions };
    this._columnDefinitions = this.columnDefinitions;

    // user must provide a "gridHeight" or use "autoResize: true" in the grid options
    if (!this._fixedHeight && !this.gridOptions.enableAutoResize) {
      throw new Error(
        `[Aurelia-Slickgrid] requires a "grid-height" or the "enableAutoResize" grid option to be enabled.`
        + `Without that the grid will seem empty while in fact it just does not have any height define.`
      );
    }

    // subscribe to column definitions assignment changes with BindingEngine
    // assignment changes are not triggering a "changed" event https://stackoverflow.com/a/30286225/1212166
    // also binding docs https://github.com/aurelia/binding/blob/master/doc/article/en-US/binding-observables.md#observing-collections
    this.subscriptions.push(
      this.bindingEngine.collectionObserver(this.columnDefinitions)
        .subscribe(this.columnDefinitionsChanged.bind(this))
    );
  }

  columnDefinitionsChanged() {
    this._columnDefinitions = this.columnDefinitions;
    if (this._isGridInitialized) {
      this.updateColumnDefinitionsList(this.columnDefinitions);
    }
  }

  /**
   * Commits the current edit to the grid
   */
  commitEdit(target: Element) {
    if (this.grid.getOptions().autoCommitEdit) {
      const activeNode = this.grid.getActiveCellNode();

      // a timeout must be set or this could come into conflict when slickgrid
      // tries to commit the edit when going from one editor to another on the grid
      // through the click event. If the timeout was not here it would
      // try to commit/destroy the twice, which would throw a jquery
      // error about the element not being in the DOM
      setTimeout(() => {
        // make sure the target is the active editor so we do not
        // commit prematurely
        if (activeNode && activeNode.contains(target) && this.grid.getEditorLock().isActive()) {
          this.grid.getEditorLock().commitCurrentEdit();
        }
      });
    }
  }

  datasetChanged(newDataset: any[], oldValue: any[]) {
    this._dataset = newDataset;
    this.refreshGridData(newDataset);

    // expand/autofit columns on first page load
    // we can assume that if the oldValue was empty then we are on first load
    if (this.gridOptions.autoFitColumnsOnFirstLoad && (!oldValue || oldValue.length < 1)) {
      this.grid.autosizeColumns();
    }
  }

  datasetHierarchicalChanged(newHierarchicalDataset: any[]) {
    this.sharedService.hierarchicalDataset = newHierarchicalDataset;

    if (this.filterService && this.filterService.clearFilters) {
      this.filterService.clearFilters();
    }

    // when a hierarchical dataset is set afterward, we can reset the flat dataset and call a tree data sort that will overwrite the flat dataset
    if (this.sortService && this.sortService.processTreeDataInitialSort && this.gridOptions && this.gridOptions.enableTreeData) {
      this.dataview.setItems([], this.gridOptions.datasetIdPropertyName);
      this.sortService.processTreeDataInitialSort();
    }
  }

  /**
   * Define our internal Post Process callback, it will execute internally after we get back result from the Process backend call
   * For now, this is GraphQL Service ONLY feature and it will basically
   * refresh the Dataset & Pagination without having the user to create his own PostProcess every time
   */
  createBackendApiInternalPostProcessCallback(gridOptions: GridOption) {
    const backendApi = gridOptions && gridOptions.backendServiceApi;

    if (backendApi && backendApi.service) {
      const backendApiService = backendApi.service;
      // internalPostProcess only works (for now) with a GraphQL Service, so make sure it is of that type
      if (backendApiService instanceof GraphqlService || typeof backendApiService.getDatasetName === 'function') {
        backendApi.internalPostProcess = (processResult: GraphqlResult | GraphqlPaginatedResult) => {
          this._dataset = [];
          const datasetName = (backendApi && backendApiService && typeof backendApiService.getDatasetName === 'function') ? backendApiService.getDatasetName() : '';
          if (processResult && processResult.data && processResult.data[datasetName]) {
            this._dataset = processResult.data[datasetName].hasOwnProperty('nodes') ? (processResult as GraphqlPaginatedResult).data[datasetName].nodes : (processResult as GraphqlResult).data[datasetName];
            const totalCount = processResult.data[datasetName].hasOwnProperty('totalCount') ? (processResult as GraphqlPaginatedResult).data[datasetName].totalCount : (processResult as GraphqlResult).data[datasetName].length;
            this.refreshGridData(this._dataset, totalCount || 0);
          }
        };
      }
    }
  }

  bindDifferentHooks(grid: SlickGrid, gridOptions: GridOption, dataView: SlickDataView) {
    // translate some of them on first load, then on each language change
    if (gridOptions.enableTranslate) {
      this.translateColumnHeaderTitleKeys();
      this.translateColumnGroupKeys();
      this.translateCustomFooterTexts();
    }

    // on locale change, we have to manually translate the Headers, GridMenu
    this.subscriptions.push(
      this.globalEa.subscribe('i18n:locale:changed', () => {
        if (gridOptions.enableTranslate) {
          if (!this._hideHeaderRowAfterPageLoad && this._isGridHavingFilters) {
            // before translating, make sure the filter row is visible to avoid having other problems,
            // because if it's not shown prior to translating then the filters won't be recreated after translating
            this.grid.setHeaderRowVisibility(true);
          }
          this.extensionService.translateCellMenu();
          this.extensionService.translateColumnHeaders();
          this.extensionService.translateColumnPicker();
          this.extensionService.translateContextMenu();
          this.extensionService.translateGridMenu();
          this.extensionService.translateHeaderMenu();
          this.translateCustomFooterTexts();
          this.translateColumnHeaderTitleKeys();
          this.translateColumnGroupKeys();
          if (gridOptions.createPreHeaderPanel && !gridOptions.enableDraggableGrouping) {
            this.groupingAndColspanService.translateGroupingAndColSpan();
          }
        }
      })
    );

    // if user entered some Columns "presets", we need to reflect them all in the grid
    if (gridOptions.presets && Array.isArray(gridOptions.presets.columns) && gridOptions.presets.columns.length > 0) {
      const gridColumns: Column[] = this.gridStateService.getAssociatedGridColumns(grid, gridOptions.presets.columns);
      if (gridColumns && Array.isArray(gridColumns) && gridColumns.length > 0) {
        // make sure that the checkbox selector is also visible if it is enabled
        if (gridOptions.enableCheckboxSelector) {
          const checkboxColumn = (Array.isArray(this._columnDefinitions) && this._columnDefinitions.length > 0) ? this._columnDefinitions[0] : null;
          if (checkboxColumn && checkboxColumn.id === '_checkbox_selector' && gridColumns[0].id !== '_checkbox_selector') {
            gridColumns.unshift(checkboxColumn);
          }
        }

        // finally set the new presets columns (including checkbox selector if need be)
        grid.setColumns(gridColumns);
      }
    }

    // bind external sorting (backend) when available or default onSort (dataView)
    if (gridOptions.enableSorting && !this.customDataView) {
      // bind external sorting (backend) unless specified to use the local one
      if (gridOptions.backendServiceApi && !gridOptions.backendServiceApi.useLocalSorting) {
        this.sortService.bindBackendOnSort(grid, dataView);
      } else {
        this.sortService.bindLocalOnSort(grid, dataView);
      }
    }

    // bind external filter (backend) when available or default onFilter (dataView)
    if (gridOptions.enableFiltering && !this.customDataView) {
      this.filterService.init(grid);

      // if user entered some Filter "presets", we need to reflect them all in the DOM
      if (gridOptions.presets && Array.isArray(gridOptions.presets.filters) && gridOptions.presets.filters.length > 0) {
        this.filterService.populateColumnFilterSearchTermPresets(gridOptions.presets.filters);
      }
      // bind external filter (backend) unless specified to use the local one
      if (gridOptions.backendServiceApi && !gridOptions.backendServiceApi.useLocalFiltering) {
        this.filterService.bindBackendOnFilter(grid, dataView);
      } else {
        this.filterService.bindLocalOnFilter(grid, dataView);
      }
    }

    // if user set an onInit Backend, we'll run it right away (and if so, we also need to run preProcess, internalPostProcess & postProcess)
    if (gridOptions.backendServiceApi) {
      const backendApi = gridOptions.backendServiceApi;

      if (backendApi && backendApi.service && backendApi.service.init) {
        backendApi.service.init(backendApi.options, gridOptions.pagination, this.grid);
      }
    }

    // expose all Slick Grid Events through dispatch
    for (const prop in grid) {
      if (grid.hasOwnProperty(prop) && prop.startsWith('on')) {
        this._eventHandler.subscribe(grid[prop], (event: Event, args: any) => {
          return this.dispatchCustomEvent(`${DEFAULT_SLICKGRID_EVENT_PREFIX}-${toKebabCase(prop)}`, { eventData: event, args });
        });
      }
    }

    // expose all Slick DataView Events through dispatch
    for (const prop in dataView) {
      if (dataView.hasOwnProperty(prop) && prop.startsWith('on')) {
        this._eventHandler.subscribe(dataView[prop], (event: Event, args: any) => {
          return this.dispatchCustomEvent(`${DEFAULT_SLICKGRID_EVENT_PREFIX}-${toKebabCase(prop)}`, { eventData: event, args });
        });
      }
    }

    // on cell click, mainly used with the columnDef.action callback
    this.gridEventService.bindOnCellChange(grid, dataView);
    this.gridEventService.bindOnClick(grid, dataView);

    if (dataView && grid) {
      this._eventHandler.subscribe(dataView.onRowCountChanged, (e: Event, args: any) => {
        grid.invalidate();

        this.metrics = {
          startTime: new Date(),
          endTime: new Date(),
          itemCount: args && args.current || 0,
          totalItemCount: Array.isArray(this._dataset) ? this._dataset.length : 0
        };
      });

      // when dealing with Tree Data View, make sure we have necessary tree data options
      if (this.gridOptions && this.gridOptions.enableTreeData && (!this.gridOptions.treeDataOptions || !this.gridOptions.treeDataOptions.columnId)) {
        throw new Error('[Aurelia-Slickgrid] When enabling tree data, you must also provide the "treeDataOption" property in your Grid Options with "childrenPropName" or "parentPropName" (depending if your array is hierarchical or flat) for the Tree Data to work properly');
      }

      this._eventHandler.subscribe(dataView.onRowsChanged, (e: any, args: any) => {
        // when dealing with Tree Data, anytime the flat dataset changes, we need to update our hierarchical dataset
        // this could be triggered by a DataView setItems or updateItem
        if (this.gridOptions && this.gridOptions.enableTreeData) {
          const items = this.dataview.getItems();
          if (Array.isArray(items) && items.length > 0 && !this._isDatasetInitialized) {
            this.sharedService.hierarchicalDataset = this.treeDataSortComparer(items);
          }
        }

        // filtering data with local dataset will not always show correctly unless we call this updateRow/render
        // also don't use "invalidateRows" since it destroys the entire row and as bad user experience when updating a row
        // see commit: https://github.com/ghiscoding/aurelia-slickgrid/commit/8c503a4d45fba11cbd8d8cc467fae8d177cc4f60
        if (gridOptions && gridOptions.enableFiltering && !gridOptions.enableRowDetailView) {
          if (args && args.rows && Array.isArray(args.rows)) {
            args.rows.forEach((row: any) => grid.updateRow(row));
            grid.render();
          }
        }
      });
    }

    // does the user have a colspan callback?
    if (gridOptions && gridOptions.colspanCallback && dataView && dataView.getItem && dataView.getItemMetadata) {
      dataView.getItemMetadata = (rowNumber: number) => {
        let callbackResult = null;
        if (gridOptions.colspanCallback && gridOptions.colspanCallback) {
          callbackResult = gridOptions.colspanCallback(dataView.getItem(rowNumber));
        }
        return callbackResult;
      };
    }
  }

  bindBackendCallbackFunctions(gridOptions: GridOption) {
    const backendApi = gridOptions.backendServiceApi;
    const backendApiService = backendApi && backendApi.service;
    const serviceOptions: BackendServiceOption = backendApiService && backendApiService.options || {};
    const isExecuteCommandOnInit = (!serviceOptions) ? false : ((serviceOptions && serviceOptions.hasOwnProperty('executeProcessCommandOnInit')) ? serviceOptions['executeProcessCommandOnInit'] : true);

    if (backendApiService) {
      // update backend filters (if need be) BEFORE the query runs (via the onInit command a few lines below)
      // if user entered some any "presets", we need to reflect them all in the grid
      if (gridOptions && gridOptions.presets) {
        // Filters "presets"
        if (backendApiService.updateFilters && Array.isArray(gridOptions.presets.filters) && gridOptions.presets.filters.length > 0) {
          backendApiService.updateFilters(gridOptions.presets.filters, true);
        }
        // Sorters "presets"
        if (backendApiService.updateSorters && Array.isArray(gridOptions.presets.sorters) && gridOptions.presets.sorters.length > 0) {
          backendApiService.updateSorters(undefined, gridOptions.presets.sorters);
        }
        // Pagination "presets"
        if (backendApiService.updatePagination && gridOptions.presets.pagination) {
          const { pageNumber, pageSize } = gridOptions.presets.pagination;
          backendApiService.updatePagination(pageNumber, pageSize);
        }
      } else {
        const columnFilters = this.filterService.getColumnFilters();
        if (columnFilters && backendApiService.updateFilters) {
          backendApiService.updateFilters(columnFilters, false);
        }
      }

      // execute onInit command when necessary
      if (backendApi && backendApiService && (backendApi.onInit || isExecuteCommandOnInit)) {
        const query = (typeof backendApiService.buildQuery === 'function') ? backendApiService.buildQuery() : '';
        const process = (isExecuteCommandOnInit) ? (backendApi.process && backendApi.process(query) || null) : (backendApi.onInit && backendApi.onInit(query) || null);

        // wrap this inside a setTimeout to avoid timing issue since the gridOptions needs to be ready before running this onInit
        setTimeout(() => {
          // keep start time & end timestamps & return it after process execution
          const startTime = new Date();

          // run any pre-process, if defined, for example a spinner
          if (backendApi.preProcess) {
            backendApi.preProcess();
          }

          // the processes can be a Promise (like Http)
          if (process instanceof Promise && process.then) {
            const totalItems = this.gridOptions && this.gridOptions.pagination && this.gridOptions.pagination.totalItems || 0;
            process.then((processResult: GraphqlResult | GraphqlPaginatedResult | any) => executeBackendProcessesCallback(startTime, processResult, backendApi, totalItems))
              .catch((error) => onBackendError(error, backendApi));
          }
        });
      }
    }
  }

  bindResizeHook(grid: SlickGrid, options: GridOption) {
    // expand/autofit columns on first page load
    if (grid && options.autoFitColumnsOnFirstLoad && options.enableAutoSizeColumns && typeof grid.autosizeColumns === 'function') {
      this.grid.autosizeColumns();
    }

    // auto-resize grid on browser resize
    if (this._fixedHeight || this._fixedWidth) {
      this.resizerService.init(grid, { height: this._fixedHeight, width: this._fixedWidth });
    } else {
      this.resizerService.init(grid);
    }
    if (grid && options && options.enableAutoResize) {
      this.resizerService.bindAutoResizeDataGrid();
      if (options.autoFitColumnsOnFirstLoad && options.enableAutoSizeColumns && typeof grid.autosizeColumns === 'function') {
        grid.autosizeColumns();
      }
    }
  }

  executeAfterDataviewCreated(grid: SlickGrid, gridOptions: GridOption, dataView: SlickDataView) {
    // if user entered some Sort "presets", we need to reflect them all in the DOM
    if (gridOptions.enableSorting) {
      if (gridOptions.presets && Array.isArray(gridOptions.presets.sorters) && gridOptions.presets.sorters.length > 0) {
        this.sortService.loadGridSorters(gridOptions.presets.sorters);
      }
    }
  }

  mergeGridOptions(gridOptions: GridOption): GridOption {
    gridOptions.gridId = this.gridId;
    gridOptions.gridContainerId = `slickGridContainer-${this.gridId}`;

    // if we have a backendServiceApi and the enablePagination is undefined, we'll assume that we do want to see it, else get that defined value
    // @deprecated TODO remove this check in the future, user should explicitely enable the Pagination since this feature is now optional (you can now call OData/GraphQL without Pagination which is a new feature)
    gridOptions.enablePagination = ((gridOptions.backendServiceApi && gridOptions.enablePagination === undefined) ? true : gridOptions.enablePagination) || false;

    // use jquery extend to deep merge & copy to avoid immutable properties being changed in GlobalGridOptions after a route change
    const options = $.extend(true, {}, GlobalGridOptions, gridOptions) as GridOption;

    // using jQuery extend to do a deep clone has an unwanted side on objects and pageSizes but ES6 spread has other worst side effects
    // so we will just overwrite the pageSizes when needed, this is the only one causing issues so far.
    // jQuery wrote this on their docs:: On a deep extend, Object and Array are extended, but object wrappers on primitive types such as String, Boolean, and Number are not.
    if (options && options.pagination && gridOptions.enablePagination && gridOptions.pagination && Array.isArray(gridOptions.pagination.pageSizes)) {
      options.pagination.pageSizes = gridOptions.pagination.pageSizes;
    }

    // also make sure to show the header row if user have enabled filtering
    this._hideHeaderRowAfterPageLoad = (options.showHeaderRow === false);
    if (options.enableFiltering && !options.showHeaderRow) {
      options.showHeaderRow = options.enableFiltering;
    }

    // when we use Pagination on Local Grid, it doesn't seem to work without enableFiltering
    // so we'll enable the filtering but we'll keep the header row hidden
    if (!options.enableFiltering && options.enablePagination && this._isLocalGrid) {
      options.enableFiltering = true;
      options.showHeaderRow = false;
      this._hideHeaderRowAfterPageLoad = true;
      this.sharedService.hideHeaderRowAfterPageLoad = true;
    }

    return options;
  }

  /**
   * On a Pagination changed, we will trigger a Grid State changed with the new pagination info
   * Also if we use Row Selection or the Checkbox Selector, we need to reset any selection
   */
  paginationChanged(pagination: ServicePagination) {
    const isSyncGridSelectionEnabled = this.gridStateService && this.gridStateService.needToPreserveRowSelection() || false;
    if (!isSyncGridSelectionEnabled && (this.gridOptions.enableRowSelection || this.gridOptions.enableCheckboxSelector)) {
      this.grid.setSelectedRows([]);
    }
    const { pageNumber, pageSize } = pagination;
    if (this.sharedService) {
      if (pageSize !== undefined && pageNumber !== undefined) {
        this.sharedService.currentPagination = { pageNumber, pageSize };
      }
    }
    this.pluginEa.publish('gridStateService:changed', {
      change: { newValues: { pageNumber, pageSize }, type: GridStateType.pagination },
      gridState: this.gridStateService.getCurrentGridState()
    });
  }

  /**
   * When dataset changes, we need to refresh the entire grid UI & possibly resize it as well
   * @param dataset
   */
  refreshGridData(dataset: any[], totalCount?: number) {
    // local grid, check if we need to show the Pagination
    // if so then also check if there's any presets and finally initialize the PaginationService
    // a local grid with Pagination presets will potentially have a different total of items, we'll need to get it from the DataView and update our total
    if (this.gridOptions && this.gridOptions.enablePagination && this._isLocalGrid) {
      this.showPagination = true;
      this.loadLocalGridPagination(dataset);
    }

    if (Array.isArray(dataset) && this.grid && this.dataview && typeof this.dataview.setItems === 'function') {
      this.dataview.setItems(dataset, this.gridOptions.datasetIdPropertyName);
      if (!this.gridOptions.backendServiceApi) {
        this.dataview.reSort();
      }

      if (dataset.length > 0) {
        if (!this._isDatasetInitialized && this.gridOptions.enableCheckboxSelector) {
          this.loadRowSelectionPresetWhenExists();
        }
        this._isDatasetInitialized = true;

        // also update the hierarchical dataset
        if (dataset.length > 0 && this.gridOptions.treeDataOptions) {
          this.sharedService.hierarchicalDataset = this.treeDataSortComparer(dataset);
        }
      }

      if (dataset) {
        this.grid.invalidate();
        this.grid.render();
      }

      // display the Pagination component only after calling this refresh data first, we call it here so that if we preset pagination page number it will be shown correctly
      this.showPagination = (this.gridOptions && (this.gridOptions.enablePagination || (this.gridOptions.backendServiceApi && this.gridOptions.enablePagination === undefined))) ? true : false;

      if (this.gridOptions && this.gridOptions.backendServiceApi && this.gridOptions.pagination && this.paginationOptions) {
        const paginationOptions = this.setPaginationOptionsWhenPresetDefined(this.gridOptions, this.paginationOptions);

        // when we have a totalCount use it, else we'll take it from the pagination object
        // only update the total items if it's different to avoid refreshing the UI
        const totalRecords = (totalCount !== undefined) ? totalCount : (this.gridOptions && this.gridOptions.pagination && this.gridOptions.pagination.totalItems);
        if (totalRecords !== undefined && totalRecords !== this.totalItems) {
          this.totalItems = +totalRecords;
        }
        // initialize the Pagination Service with new pagination options (which might have presets)
        if (!this._isPaginationInitialized) {
          this.initializePaginationService(paginationOptions);
        } else {
          // update the pagination service with the new total
          this.paginationService.totalItems = this.totalItems;
        }
      }

      // resize the grid inside a slight timeout, in case other DOM element changed prior to the resize (like a filter/pagination changed)
      if (this.grid && this.gridOptions.enableAutoResize) {
        const delay = this.gridOptions.autoResize && this.gridOptions.autoResize.delay;
        this.resizerService.resizeGrid(delay || 10);
      }
    }
  }

  /**
   * Show the filter row displayed on first row, we can optionally pass false to hide it.
   * @param showing
   */
  showHeaderRow(showing = true) {
    this.grid.setHeaderRowVisibility(showing, false);
    return showing;
  }

  /**
   * Check if there's any Pagination Presets defined in the Grid Options,
   * if there are then load them in the paginationOptions object
   */
  setPaginationOptionsWhenPresetDefined(gridOptions: GridOption, paginationOptions: Pagination): Pagination {
    if (gridOptions.presets && gridOptions.presets.pagination && gridOptions.pagination) {
      paginationOptions.pageSize = gridOptions.presets.pagination.pageSize;
      paginationOptions.pageNumber = gridOptions.presets.pagination.pageNumber;
    }
    return paginationOptions;
  }

  /**
   * Dynamically change or update the column definitions list.
   * We will re-render the grid so that the new header and data shows up correctly.
   * If using i18n, we also need to trigger a re-translate of the column headers
   */
  updateColumnDefinitionsList(newColumnDefinitions: Column[]) {
    if (newColumnDefinitions) {
      // map/swap the internal library Editor to the SlickGrid Editor factory
      newColumnDefinitions = this.swapInternalEditorToSlickGridFactoryEditor(newColumnDefinitions);

      if (this.gridOptions.enableTranslate) {
        this.extensionService.translateColumnHeaders(false, newColumnDefinitions);
      } else {
        this.extensionService.renderColumnHeaders(newColumnDefinitions, true);
      }

      if (this.gridOptions && this.gridOptions.enableAutoSizeColumns) {
        this.grid.autosizeColumns();
      }
    }
  }

  //
  // private functions
  // ------------------

  /** Dispatch of Custom Event, which by default will bubble & is cancelable */
  private dispatchCustomEvent(eventName: string, data?: any, isBubbling: boolean = true, isCancelable = true): boolean {
    const eventInit: CustomEventInit = { bubbles: isBubbling, cancelable: isCancelable };
    if (data) {
      eventInit.detail = data;
    }
    return this.elm.dispatchEvent(DOM.createCustomEvent(eventName, eventInit));
  }

  /** Initialize the Pagination Service once */
  private initializePaginationService(paginationOptions: Pagination) {
    if (this.gridOptions) {
      this.paginationData = {
        gridOptions: this.gridOptions,
        paginationService: this.paginationService,
      };
      this.paginationService.totalItems = this.totalItems;
      this.paginationService.init(this.grid, this.dataview, paginationOptions, this.backendServiceApi);
      this.subscriptions.push(
        this.pluginEa.subscribe('paginationService:onPaginationChanged', (paginationChanges: ServicePagination) => this.paginationChanged(paginationChanges)),
        this.pluginEa.subscribe('paginationService:onPaginationVisibilityChanged', (visibility: { visible: boolean }) => {
          this.showPagination = visibility && visibility.visible || false;
          if (this.gridOptions && this.gridOptions.backendServiceApi) {
            refreshBackendDataset();
          }
        })
      );
      this._isPaginationInitialized = true;
    }
  }

  /** Load the Editor Collection asynchronously and replace the "collection" property when Promise resolves */
  private loadEditorCollectionAsync(column: Column) {
    const collectionAsync = column && column.editor && column.editor.collectionAsync;
    if (collectionAsync) {
      // wait for the "collectionAsync", once resolved we will save it into the "collection"
      // the collectionAsync can be of 3 types HttpClient, HttpFetch or a Promise
      collectionAsync.then((response: any | any[]) => {
        if (Array.isArray(response)) {
          this.updateEditorCollection(column, response); // from Promise
        } else if (response instanceof Response && typeof response.json === 'function') {
          if (response.bodyUsed) {
            console.warn(`[Aurelia-SlickGrid] The response body passed to collectionAsync was already read.`
              + `Either pass the dataset from the Response or clone the response first using response.clone()`);
          } else {
            // from Fetch
            (response as Response).json().then(data => this.updateEditorCollection(column, data));
          }
        } else if (response && response['content']) {
          this.updateEditorCollection(column, response['content']); // from aurelia-http-client
        }
      });
    }
  }

  /**
   * local grid, check if we need to show the Pagination
   * if so then also check if there's any presets and finally initialize the PaginationService
   * a local grid with Pagination presets will potentially have a different total of items, we'll need to get it from the DataView and update our total
   */
  private loadLocalGridPagination(dataset?: any[]) {
    if (this.gridOptions && this.paginationOptions) {
      this.totalItems = Array.isArray(dataset) ? dataset.length : 0;
      if (this.paginationOptions && this.dataview && this.dataview.getPagingInfo) {
        const slickPagingInfo = this.dataview.getPagingInfo();
        const pagingTotalRows = slickPagingInfo && slickPagingInfo.totalRows;
        if (slickPagingInfo && slickPagingInfo.hasOwnProperty('totalRows') && this.paginationOptions.totalItems !== pagingTotalRows) {
          this.totalItems = pagingTotalRows;
        }
      }
      this.paginationOptions.totalItems = this.totalItems;
      const paginationOptions = this.setPaginationOptionsWhenPresetDefined(this.gridOptions, this.paginationOptions);
      this.initializePaginationService(paginationOptions);
    }
  }

  /** Load any Row Selections into the DataView that were presets by the user */
  private loadRowSelectionPresetWhenExists() {
    // if user entered some Row Selections "presets"
    const presets = this.gridOptions && this.gridOptions.presets;
    const selectionModel = this.grid && this.grid.getSelectionModel();
    const enableRowSelection = this.gridOptions && (this.gridOptions.enableCheckboxSelector || this.gridOptions.enableRowSelection);
    if (enableRowSelection && selectionModel && presets && presets.rowSelection && (Array.isArray(presets.rowSelection.gridRowIndexes) || Array.isArray(presets.rowSelection.dataContextIds))) {
      let dataContextIds = presets.rowSelection.dataContextIds;
      let gridRowIndexes = presets.rowSelection.gridRowIndexes;

      // maps the IDs to the Grid Rows and vice versa, the "dataContextIds" has precedence over the other
      if (Array.isArray(dataContextIds) && dataContextIds.length > 0) {
        gridRowIndexes = this.dataview.mapIdsToRows(dataContextIds) || [];
      } else if (Array.isArray(gridRowIndexes) && gridRowIndexes.length > 0) {
        dataContextIds = this.dataview.mapRowsToIds(gridRowIndexes) || [];
      }
      this.gridStateService.selectedRowDataContextIds = dataContextIds;

      // change the selected rows except UNLESS it's a Local Grid with Pagination
      // local Pagination uses the DataView and that also trigger a change/refresh
      // and we don't want to trigger 2 Grid State changes just 1
      if ((this._isLocalGrid && !this.gridOptions.enablePagination) || !this._isLocalGrid) {
        setTimeout(() => this.grid.setSelectedRows(gridRowIndexes));
      }
    }
  }

  /**
   * We could optionally display a custom footer below the grid to show some metrics (last update, item count with/without filters)
   * It's an opt-in, user has to enable "showCustomFooter" and it cannot be used when there's already a Pagination since they display the same kind of info
   */
  private optionallyShowCustomFooterWithMetrics() {
    if (this.gridOptions) {
      if (this.gridOptions.enableTranslate) {
        this.translateCustomFooterTexts();
      } else if (this.gridOptions.customFooterOptions) {
        const customFooterOptions = this.gridOptions.customFooterOptions;
        customFooterOptions.metricTexts = customFooterOptions.metricTexts || {};
        customFooterOptions.metricTexts.lastUpdate = customFooterOptions.metricTexts.lastUpdate || this.locales && this.locales.TEXT_LAST_UPDATE || 'TEXT_LAST_UPDATE';
        customFooterOptions.metricTexts.items = customFooterOptions.metricTexts.items || this.locales && this.locales.TEXT_ITEMS || 'TEXT_ITEMS';
        customFooterOptions.metricTexts.of = customFooterOptions.metricTexts.of || this.locales && this.locales.TEXT_OF || 'TEXT_OF';
      }

      // we will display the custom footer only when there's no Pagination
      if (!this.gridOptions.enablePagination) {
        this.showCustomFooter = this.gridOptions.hasOwnProperty('showCustomFooter') ? (this.gridOptions.showCustomFooter as boolean) : false;
        this.customFooterOptions = this.gridOptions.customFooterOptions || {};
      }
    }
  }

  private treeDataSortComparer(flatDataset: any[]): any[] {
    const dataViewIdIdentifier = this.gridOptions && this.gridOptions.datasetIdPropertyName || 'id';
    const treeDataOpt: TreeDataOption = this.gridOptions && this.gridOptions.treeDataOptions || { columnId: '' };
    const treeDataOptions = { ...treeDataOpt, identifierPropName: treeDataOpt.identifierPropName || dataViewIdIdentifier };
    return convertParentChildArrayToHierarchicalView(flatDataset, treeDataOptions);
  }

  /**
   * For convenience to the user, we provide the property "editor" as an Aurelia-Slickgrid editor complex object
   * however "editor" is used internally by SlickGrid for it's own Editor Factory
   * so in our lib we will swap "editor" and copy it into a new property called "internalColumnEditor"
   * then take back "editor.model" and make it the new "editor" so that SlickGrid Editor Factory still works
   */
  private swapInternalEditorToSlickGridFactoryEditor(columnDefinitions: Column[]) {
    return columnDefinitions.map((column: Column | any) => {
      // on every Editor which have a "collection" or a "collectionAsync"
      if (column.editor && column.editor.collectionAsync) {
        this.loadEditorCollectionAsync(column);
      }

      return {
        ...column,
        editor: column.editor && Factory.of(column.editor.model).get(this.container),
        internalColumnEditor: { ...column.editor }
      };
    });
  }

  /** Translate all Custom Footer Texts (footer with metrics) */
  private translateCustomFooterTexts() {
    if (this.i18n && this.i18n.tr && this.i18n.getLocale && this.i18n.getLocale()) {
      const customFooterOptions = this.gridOptions && this.gridOptions.customFooterOptions || {};
      customFooterOptions.metricTexts = customFooterOptions.metricTexts || {};
      for (const propName of Object.keys(customFooterOptions.metricTexts)) {
        if (propName.lastIndexOf('Key') > 0) {
          const propNameWithoutKey = propName.substring(0, propName.lastIndexOf('Key'));
          customFooterOptions.metricTexts[propNameWithoutKey] = this.i18n.tr(customFooterOptions.metricTexts[propName] || ' ');
        }
      }
    }
  }

  /** translate all columns (including hidden columns) */
  private translateColumnHeaderTitleKeys() {
    // eventually deprecate the "headerKey" and use only the "nameKey"
    this.extensionUtility.translateItems(this.sharedService.allColumns, 'headerKey', 'name');
    this.extensionUtility.translateItems(this.sharedService.allColumns, 'nameKey', 'name');
  }

  /** translate all column groups (including hidden columns) */
  private translateColumnGroupKeys() {
    this.extensionUtility.translateItems(this.sharedService.allColumns, 'columnGroupKey', 'columnGroup');
  }

  /**
   * Update the "internalColumnEditor.collection" property.
   * Since this is called after the async call resolves, the pointer will not be the same as the "column" argument passed.
   * Once we found the new pointer, we will reassign the "editor" and "collection" to the "internalColumnEditor" so it has newest collection
   */
  private updateEditorCollection(column: Column, newCollection: any[]) {
    column.editor.collection = newCollection;

    // find the new column reference pointer & reassign the new editor to the internalColumnEditor
    const columns = this.grid.getColumns();
    if (Array.isArray(columns)) {
      const columnRef: Column = columns.find((col: Column) => col.id === column.id);
      columnRef.internalColumnEditor = column.editor;
    }
  }
}
