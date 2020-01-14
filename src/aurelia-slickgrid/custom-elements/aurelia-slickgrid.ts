// import 3rd party vendor libs
// only import the necessary core lib, each will be imported on demand when enabled (via require)
import * as $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';

import { bindable, BindingEngine, bindingMode, Container, Factory, inject } from 'aurelia-framework';
import { DOM } from 'aurelia-pal';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

import { Constants } from '../constants';
import { GlobalGridOptions } from '../global-grid-options';
import {
  AureliaGridInstance,
  BackendServiceApi,
  BackendServiceOption,
  Column,
  ExtensionName,
  GraphqlResult,
  GraphqlPaginatedResult,
  GridOption,
  GridStateChange,
  GridStateType,
  Locale,
  Pagination,
  SlickEventHandler,
} from '../models/index';
import {
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
} from '../services/index';
import { executeBackendProcessesCallback, onBackendError } from '../services/backend-utilities';
import { ExtensionUtility } from '../extensions/extensionUtility';
import { SharedService } from '../services/shared.service';

// using external non-typed js libraries
declare var Slick: any;

const DEFAULT_AURELIA_EVENT_PREFIX = 'asg';
const DEFAULT_SLICKGRID_EVENT_PREFIX = 'sg';

// Aurelia doesn't support well TypeScript @autoinject in a Plugin so we'll do it the old fashion way
@inject(
  BindingEngine,
  Container,
  Element,
  EventAggregator,
  ExcelExportService,
  ExportService,
  ExtensionService,
  ExtensionUtility,
  FilterService,
  GridEventService,
  GridService,
  GridStateService,
  GroupingAndColspanService,
  PaginationService,
  ResizerService,
  SharedService,
  SortService,
)
export class AureliaSlickgridCustomElement {
  private _columnDefinitions: Column[] = [];
  private _dataset: any[];
  private _eventHandler: SlickEventHandler = new Slick.EventHandler();
  private _fixedHeight: number | null;
  private _fixedWidth: number | null;
  private _hideHeaderRowAfterPageLoad = false;
  groupItemMetadataProvider: any;
  backendServiceApi: BackendServiceApi | undefined;
  locales: Locale;
  isGridInitialized = false;
  showPagination = false;
  serviceList: any[] = [];
  subscriptions: Subscription[] = [];

  @bindable({ defaultBindingMode: bindingMode.twoWay }) columnDefinitions: Column[] = [];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) element: Element;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dataview: any;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) grid: any;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) paginationOptions: Pagination | undefined;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) totalItems: number;
  @bindable() customDataView: any;
  @bindable() dataset: any[];
  @bindable() gridId: string;
  @bindable() gridOptions: GridOption;
  @bindable() gridHeight: number;
  @bindable() gridWidth: number;
  @bindable() pickerOptions: any;

  constructor(
    private bindingEngine: BindingEngine,
    private container: Container,
    private elm: Element,
    private ea: EventAggregator,
    private excelExportService: ExcelExportService,
    private exportService: ExportService,
    private extensionService: ExtensionService,
    private extensionUtility: ExtensionUtility,
    private filterService: FilterService,
    private gridEventService: GridEventService,
    private gridService: GridService,
    private gridStateService: GridStateService,
    private groupingAndColspanService: GroupingAndColspanService,
    private paginationService: PaginationService,
    private resizerService: ResizerService,
    private sharedService: SharedService,
    private sortService: SortService,
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
      sortService
    ];
  }

  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }

  attached() {
    this.initialization();
    this.isGridInitialized = true;
  }

  initialization() {
    this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-before-grid-create`);
    this.ea.publish('onBeforeGridCreate', true);

    // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
    this._dataset = this._dataset || this.dataset || [];
    this.gridOptions = this.mergeGridOptions(this.gridOptions);
    this.paginationOptions = this.gridOptions && this.gridOptions.pagination;
    this.locales = this.gridOptions && this.gridOptions.locales || Constants.locales;
    this.backendServiceApi = this.gridOptions && this.gridOptions.backendServiceApi;

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
      this.ea.publish('onDataviewCreated', this.dataview);
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
      if (this.gridOptions && this.gridOptions.dataView && this.gridOptions.dataView.hasOwnProperty('syncGridSelection')) {
        const syncGridSelection = this.gridOptions.dataView.syncGridSelection;
        if (typeof syncGridSelection === 'boolean') {
          this.dataview.syncGridSelection(this.grid, this.gridOptions.dataView.syncGridSelection);
        } else if (typeof syncGridSelection === 'object') {
          this.dataview.syncGridSelection(this.grid, syncGridSelection.preserveHidden, syncGridSelection.preserveHiddenOnSelectionChange);
        }
      }
    }

    // user might want to hide the header row on page load but still have `enableFiltering: true`
    // if that is the case, we need to hide the headerRow ONLY AFTER all filters got created & dataView exist
    if (this._hideHeaderRowAfterPageLoad) {
      this.showHeaderRow(false);
    }

    // publish & dispatch certain events
    this.ea.publish('onGridCreated', this.grid);
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

    // bind the Backend Service API callback functions only after the grid is initialized
    // because the preProcess() and onInit() might get triggered
    if (this.gridOptions && this.gridOptions.backendServiceApi) {
      this.bindBackendCallbackFunctions(this.gridOptions);
    }

    this.gridStateService.init(this.grid);

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
    };
    this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-aurelia-grid-created`, aureliaElementInstance);
  }

  detached(shouldEmptyDomElementContainer = false) {
    this.ea.publish('onBeforeGridDestroy', this.grid);
    this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-before-grid-destroy`, this.grid);
    this.dataview = undefined;
    this._eventHandler.unsubscribeAll();
    this.grid.destroy();

    // we could optionally also empty the content of the grid container DOM element
    if (shouldEmptyDomElementContainer) {
      this.destroyGridContainerElm();
    }

    this.ea.publish('onAfterGridDestroyed', true);
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
    if (this.isGridInitialized) {
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

  datasetChanged(newValue: any[], oldValue: any[]) {
    this._dataset = newValue;
    this.refreshGridData(newValue);

    // expand/autofit columns on first page load
    // we can assume that if the oldValue was empty then we are on first load
    if (this.gridOptions.autoFitColumnsOnFirstLoad && (!oldValue || oldValue.length < 1)) {
      this.grid.autosizeColumns();
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

  bindDifferentHooks(grid: any, gridOptions: GridOption, dataView: any) {
    // on locale change, we have to manually translate the Headers, GridMenu
    this.subscriptions.push(
      this.ea.subscribe('i18n:locale:changed', () => {
        if (gridOptions.enableTranslate) {
          this.extensionService.translateCellMenu();
          this.extensionService.translateColumnHeaders();
          this.extensionService.translateColumnPicker();
          this.extensionService.translateContextMenu();
          this.extensionService.translateGridMenu();
          this.extensionService.translateHeaderMenu();
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

    // expose GridState Service changes event through dispatch
    this.subscriptions.push(
      this.ea.subscribe('gridStateService:changed', (gridStateChange: GridStateChange) => {
        this.elm.dispatchEvent(DOM.createCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-grid-state-changed`, {
          bubbles: true,
          detail: gridStateChange
        }));
      })
    );

    // on cell click, mainly used with the columnDef.action callback
    this.gridEventService.bindOnCellChange(grid, dataView);
    this.gridEventService.bindOnClick(grid, dataView);

    if (dataView && grid) {
      this._eventHandler.subscribe(dataView.onRowCountChanged, () => grid.invalidate());

      // without this, filtering data with local dataset will not always show correctly
      // also don't use "invalidateRows" since it destroys the entire row and as bad user experience when updating a row
      // see commit: https://github.com/ghiscoding/aurelia-slickgrid/commit/8c503a4d45fba11cbd8d8cc467fae8d177cc4f60
      if (gridOptions && gridOptions.enableFiltering && !gridOptions.enableRowDetailView) {
        this._eventHandler.subscribe(dataView.onRowsChanged, (e: any, args: any) => {
          if (args && args.rows && Array.isArray(args.rows)) {
            args.rows.forEach((row: any) => grid.updateRow(row));
            grid.render();
          }
        });
      }
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

  bindResizeHook(grid: any, options: GridOption) {
    // expand/autofit columns on first page load
    if (grid && options.autoFitColumnsOnFirstLoad && options.enableAutoSizeColumns && typeof grid.autosizeColumns === 'function') {
      this.grid.autosizeColumns();

      // compensate anytime SlickGrid measureScrollbar is incorrect (only seems to happen in Chrome 1/5 computers)
      this.resizerService.compensateHorizontalScroll(this.grid, this.gridOptions);
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

  executeAfterDataviewCreated(grid: any, gridOptions: GridOption, dataView: any) {
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

    // use jquery extend to deep merge & copy to avoid immutable properties being changed in GlobalGridOptions after a route change
    const options = $.extend(true, {}, GlobalGridOptions, gridOptions);

    // using jQuery extend to do a deep clone has an unwanted side on objects and pageSizes but ES6 spread has other worst side effects
    // so we will just overwrite the pageSizes when needed, this is the only one causing issues so far.
    // jQuery wrote this on their docs:: On a deep extend, Object and Array are extended, but object wrappers on primitive types such as String, Boolean, and Number are not.
    if (options && gridOptions && gridOptions.backendServiceApi) {
      if (options.pagination && gridOptions.pagination && Array.isArray(gridOptions.pagination.pageSizes) && gridOptions.pagination.pageSizes.length > 0) {
        options.pagination.pageSizes = gridOptions.pagination.pageSizes;
      }
    }

    // also make sure to show the header row if user have enabled filtering
    this._hideHeaderRowAfterPageLoad = (options.showHeaderRow === false);
    if (options.enableFiltering && !options.showHeaderRow) {
      options.showHeaderRow = options.enableFiltering;
    }

    return options;
  }

  /**
   * On a Pagination changed, we will trigger a Grid State changed with the new pagination info
   * Also if we use Row Selection or the Checkbox Selector, we need to reset any selection
   */
  paginationChanged(pagination: Pagination) {
    if (this.gridOptions.enableRowSelection || this.gridOptions.enableCheckboxSelector) {
      this.grid.setSelectedRows([]);
    }

    this.ea.publish('gridStateService:changed', {
      change: { newValues: pagination, type: GridStateType.pagination },
      gridState: this.gridStateService.getCurrentGridState()
    });
  }

  /**
   * When dataset changes, we need to refresh the entire grid UI & possibly resize it as well
   * @param dataset
   */
  refreshGridData(dataset: any[], totalCount?: number) {
    if (Array.isArray(dataset) && this.grid && this.dataview && typeof this.dataview.setItems === 'function') {
      this.dataview.setItems(dataset, this.gridOptions.datasetIdPropertyName);
      if (!this.gridOptions.backendServiceApi) {
        this.dataview.reSort();
      }

      if (dataset) {
        this.grid.invalidate();
        this.grid.render();
      }
      if (this.gridOptions && this.gridOptions.backendServiceApi && this.gridOptions.pagination) {
        // do we want to show pagination?
        // if we have a backendServiceApi and the enablePagination is undefined, we'll assume that we do want to see it, else get that defined value
        this.showPagination = ((this.gridOptions.backendServiceApi && this.gridOptions.enablePagination === undefined) ? true : this.gridOptions.enablePagination) || false;

        if (this.gridOptions.presets && this.gridOptions.presets.pagination && this.gridOptions.pagination && this.paginationOptions) {
          this.paginationOptions.pageSize = this.gridOptions.presets.pagination.pageSize;
          this.paginationOptions.pageNumber = this.gridOptions.presets.pagination.pageNumber;
        }

        // when we have a totalCount use it, else we'll take it from the pagination object
        // only update the total items if it's different to avoid refreshing the UI
        const totalRecords = (totalCount !== undefined) ? totalCount : (this.gridOptions && this.gridOptions.pagination && this.gridOptions.pagination.totalItems);
        if (totalRecords !== undefined && totalRecords !== this.totalItems) {
          this.totalItems = +totalRecords;
        }
      } else {
        // without backend service, we'll assume the total of items is the dataset size
        this.totalItems = dataset.length;
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
    this.grid.setHeaderRowVisibility(showing);
    return showing;
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
        this.extensionService.renderColumnHeaders(newColumnDefinitions);
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
