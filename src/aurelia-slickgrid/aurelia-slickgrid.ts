// import 3rd party vendor libs
// only import the necessary core lib, each will be imported on demand when enabled (via require)
import 'jquery-ui-dist/jquery-ui';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';

import { bindable, BindingEngine, bindingMode, Container, Factory, inject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { GlobalGridOptions } from './global-grid-options';
import {
  AureliaGridInstance,
  BackendServiceOption,
  Column,
  GraphqlResult,
  GridOption,
  GridStateChange,
  GridStateType,
  Pagination,
  ExtensionName,
} from './models/index';
import {
  disposeAllSubscriptions,
  ExportService,
  ExtensionService,
  FilterService,
  GraphqlService,
  GridEventService,
  GridService,
  GridStateService,
  GroupingAndColspanService,
  ResizerService,
  SortService,
  toKebabCase,
} from './services/index';
import { ExtensionUtility } from './extensions/extensionUtility';
import { SharedService } from './services/shared.service';
import * as $ from 'jquery';

// using external non-typed js libraries
declare var Slick: any;

const DEFAULT_AURELIA_EVENT_PREFIX = 'asg';
const DEFAULT_SLICKGRID_EVENT_PREFIX = 'sg';

// Aurelia doesn't support well TypeScript @autoinject in a Plugin so we'll do it the old fashion way
@inject(
  BindingEngine,
  ExportService,
  Element,
  EventAggregator,
  ExtensionService,
  ExtensionUtility,
  FilterService,
  GridEventService,
  GridService,
  GridStateService,
  GroupingAndColspanService,
  ResizerService,
  SharedService,
  SortService,
  Container
)
export class AureliaSlickgridCustomElement {
  private _columnDefinitions: Column[] = [];
  private _dataset: any[];
  private _eventHandler: any = new Slick.EventHandler();
  private _fixedHeight: number | null;
  private _fixedWidth: number | null;
  private _hideHeaderRowAfterPageLoad = false;
  groupItemMetadataProvider: any;
  isGridInitialized = false;
  showPagination = false;
  serviceList: any[] = [];
  subscriptions: Subscription[] = [];

  @bindable({ defaultBindingMode: bindingMode.twoWay }) columnDefinitions: Column[] = [];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) element: Element;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) gridPaginationOptions: GridOption;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dataview: any;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) grid: any;
  @bindable() customDataView: any;
  @bindable() dataset: any[];
  @bindable() gridId: string;
  @bindable() gridOptions: GridOption;
  @bindable() gridHeight: number;
  @bindable() gridWidth: number;
  @bindable() pickerOptions: any;

  constructor(
    private bindingEngine: BindingEngine,
    private exportService: ExportService,
    private elm: Element,
    private ea: EventAggregator,
    private extensionService: ExtensionService,
    private extensionUtility: ExtensionUtility,
    private filterService: FilterService,
    private gridEventService: GridEventService,
    private gridService: GridService,
    private gridStateService: GridStateService,
    private groupingAndColspanService: GroupingAndColspanService,
    private resizerService: ResizerService,
    private sharedService: SharedService,
    private sortService: SortService,
    private container: Container
  ) {
    this.serviceList = [
      exportService,
      extensionService,
      filterService,
      gridEventService,
      gridService,
      gridStateService,
      groupingAndColspanService,
      resizerService,
      sortService
    ];
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
    }

    // for convenience, we provide the property "editor" as an Aurelia-Slickgrid editor complex object
    // however "editor" is used internally by SlickGrid for it's own Editor Factory
    // so in our lib we will swap "editor" and copy it into a new property called "internalColumnEditor"
    // then take back "editor.model" and make it the new "editor" so that SlickGrid Editor Factory still works
    // Wrap each editor class in the Factory resolver so consumers of this library can use
    // dependency injection. Aurelia will resolve all dependencies when we pass the container
    // and allow slickgrid to pass its arguments to the editors constructor last
    // when slickgrid creates the editor
    // https://github.com/aurelia/dependency-injection/blob/master/src/resolvers.js
    this._columnDefinitions = this.columnDefinitions.map((column: Column | any) => {
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

    // save reference for all columns before they optionally become hidden/visible
    this.sharedService.allColumns = this._columnDefinitions;
    this.sharedService.visibleColumns = this._columnDefinitions;
    this.extensionService.createExtensionsBeforeGridCreation(this._columnDefinitions, this.gridOptions);

    // build SlickGrid Grid, also user might optionally pass a custom dataview (e.g. remote model)
    this.grid = new Slick.Grid(`#${this.gridId}`, this.customDataView || this.dataview, this._columnDefinitions, this.gridOptions);

    this.sharedService.dataView = this.dataview;
    this.sharedService.grid = this.grid;
    this.extensionService.attachDifferentExtensions();

    this.attachDifferentHooks(this.grid, this.gridOptions, this.dataview);

    this.grid.init();

    if (!this.customDataView && (this.dataview && this.dataview.beginUpdate && this.dataview.setItems && this.dataview.endUpdate)) {
      this.dataview.beginUpdate();
      this.dataview.setItems(this._dataset, this.gridOptions.datasetIdPropertyName);
      this.dataview.endUpdate();

      // if you don't want the items that are not visible (due to being filtered out
      // or being on a different page) to stay selected, pass 'false' to the second arg
      if (this.gridOptions && this.gridOptions.dataView && this.gridOptions.dataView.hasOwnProperty('syncGridSelection')) {
        this.dataview.syncGridSelection(this.grid, this.gridOptions.dataView.syncGridSelection);
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
      this.ea.publish('onDataviewCreated', this.dataview);
      this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-dataview-created`, this.dataview);
    }

    // attach resize ONLY after the dataView is ready
    this.attachResizeHook(this.grid, this.gridOptions);

    // attach grouping and header grouping colspan service
    if (this.gridOptions.createPreHeaderPanel && !this.gridOptions.enableDraggableGrouping) {
      this.groupingAndColspanService.init(this.grid, this.dataview);
    }

    // initialize grid service
    this.gridService.init(this.grid, this.dataview);

    // when user enables translation, we need to translate Headers on first pass & subsequently in the attachDifferentHooks
    if (this.gridOptions.enableTranslate) {
      this.extensionService.translateColumnHeaders();
    }

    // if Export is enabled, initialize the service with the necessary grid and other objects
    if (this.gridOptions.enableExport) {
      this.exportService.init(this.grid, this.dataview);
    }

    // attach the Backend Service API callback functions only after the grid is initialized
    // because the preProcess() and onInit() might get triggered
    if (this.gridOptions && this.gridOptions.backendServiceApi) {
      this.attachBackendCallbackFunctions(this.gridOptions);
    }

    this.gridStateService.init(this.grid, this.extensionService, this.filterService, this.sortService);

    // create the Aurelia Grid Instance with reference to all Services
    const aureliaElementInstance: AureliaGridInstance = {
      // Slick Grid & DataView objects
      dataView: this.dataview,
      slickGrid: this.grid,

      // public methods
      dispose: this.dispose.bind(this),

      // return all available Services (non-singleton)
      backendService: this.gridOptions && this.gridOptions.backendServiceApi && this.gridOptions.backendServiceApi.service,
      exportService: this.exportService,
      filterService: this.filterService,
      gridEventService: this.gridEventService,
      gridStateService: this.gridStateService,
      gridService: this.gridService,
      groupingService: this.groupingAndColspanService,
      extensionService: this.extensionService,

      /** @deprecated please use "extensionService" instead */
      pluginService: this.extensionService,
      resizerService: this.resizerService,
      sortService: this.sortService,
    };
    this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-aurelia-grid-created`, aureliaElementInstance);
  }

  detached(emptyDomElementContainer = false) {
    this.ea.publish('onBeforeGridDestroy', this.grid);
    this.dispatchCustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-before-grid-destroy`, this.grid);
    this.dataview = [];
    this._eventHandler.unsubscribeAll();
    this.grid.destroy();
    if (emptyDomElementContainer && this.gridId) {
      const containerId = this.gridOptions && this.gridOptions.gridContainerId || `slickGridContainer-${this.gridId}`;
      $(containerId).empty();
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

  dispose(emptyDomElementContainer = false) {
    this.detached(emptyDomElementContainer);
  }

  bind() {
    this._fixedHeight = this.gridHeight ? +this.gridHeight : null;
    this._fixedWidth = this.gridWidth ? +this.gridWidth : null;

    // get the grid options (priority is Global Options first, then user option which could overwrite the Global options)
    this.gridOptions = { ...GlobalGridOptions, ...this.gridOptions };
    this._columnDefinitions = this.columnDefinitions;

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
    if (!oldValue || oldValue.length < 1) {
      if (this.gridOptions.autoFitColumnsOnFirstLoad) {
        this.grid.autosizeColumns();
      }
    }
  }

  /**
   * Define our internal Post Process callback, it will execute internally after we get back result from the Process backend call
   * For now, this is GraphQL Service ONLY feature and it will basically
   * refresh the Dataset & Pagination without having the user to create his own PostProcess every time
   */
  createBackendApiInternalPostProcessCallback(gridOptions: GridOption) {
    if (gridOptions && gridOptions.backendServiceApi) {
      const backendApi = gridOptions.backendServiceApi;

      // internalPostProcess only works with a GraphQL Service, so make sure it is that type
      if (backendApi && backendApi.service && backendApi.service instanceof GraphqlService) {
        backendApi.internalPostProcess = (processResult: any) => {
          const datasetName = (backendApi && backendApi.service && typeof backendApi.service.getDatasetName === 'function') ? backendApi.service.getDatasetName() : '';
          if (processResult && processResult.data && processResult.data[datasetName]) {
            this._dataset = processResult.data[datasetName].nodes;
            this.refreshGridData(this._dataset, processResult.data[datasetName].totalCount);
          } else {
            this._dataset = [];
          }
        };
      }
    }
  }

  attachDifferentHooks(grid: any, gridOptions: GridOption, dataView: any) {
    // on locale change, we have to manually translate the Headers, GridMenu
    this.subscriptions.push(
      this.ea.subscribe('i18n:locale:changed', (payload: any) => {
        if (gridOptions.enableTranslate) {
          this.extensionService.translateColumnHeaders();
          this.extensionService.translateColumnPicker();
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

    // attach external sorting (backend) when available or default onSort (dataView)
    if (gridOptions.enableSorting && !this.customDataView) {
      gridOptions.backendServiceApi ? this.sortService.attachBackendOnSort(grid, dataView) : this.sortService.attachLocalOnSort(grid, dataView);
    }

    // attach external filter (backend) when available or default onFilter (dataView)
    if (gridOptions.enableFiltering && !this.customDataView) {
      this.filterService.init(grid);

      // if user entered some Filter "presets", we need to reflect them all in the DOM
      if (gridOptions.presets && Array.isArray(gridOptions.presets.filters) && gridOptions.presets.filters.length > 0) {
        this.filterService.populateColumnFilterSearchTerms();
      }
      gridOptions.backendServiceApi ? this.filterService.attachBackendOnFilter(grid, this.dataview) : this.filterService.attachLocalOnFilter(grid, this.dataview);
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
        this._eventHandler.subscribe(grid[prop], (e: any, args: any) => {
          return this.dispatchCustomEvent(`${DEFAULT_SLICKGRID_EVENT_PREFIX}-${toKebabCase(prop)}`, { eventData: e, args });
        });
      }
    }

    // expose all Slick DataView Events through dispatch
    for (const prop in dataView) {
      if (dataView.hasOwnProperty(prop) && prop.startsWith('on')) {
        this._eventHandler.subscribe(dataView[prop], (e: any, args: any) => {
          return this.dispatchCustomEvent(`${DEFAULT_SLICKGRID_EVENT_PREFIX}-${toKebabCase(prop)}`, { eventData: e, args });
        });
      }
    }

    // expose GridState Service changes event through dispatch
    this.subscriptions.push(
      this.ea.subscribe('gridStateService:changed', (gridStateChange: GridStateChange) => {
        this.elm.dispatchEvent(new CustomEvent(`${DEFAULT_AURELIA_EVENT_PREFIX}-on-grid-state-changed`, {
          bubbles: true,
          detail: gridStateChange
        }));
      })
    );

    // on cell click, mainly used with the columnDef.action callback
    this.gridEventService.attachOnCellChange(grid, dataView);
    this.gridEventService.attachOnClick(grid, dataView);

    if (dataView && grid) {
      this._eventHandler.subscribe(dataView.onRowCountChanged, (e: any, args: any) => {
        grid.invalidate();
      });

      // without this, filtering data with local dataset will not always show correctly
      // also don't use "invalidateRows" since it destroys the entire row and as bad user experience when updating a row
      // see commit: https://github.com/ghiscoding/Angular-Slickgrid/commit/bb62c0aa2314a5d61188ff005ccb564577f08805
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
    if (gridOptions.colspanCallback) {
      dataView.getItemMetadata = (rowNumber: number) => {
        const item = dataView.getItem(rowNumber);
        if (gridOptions && gridOptions.colspanCallback) {
          return gridOptions.colspanCallback(item);
        }
        return null;
      };
    }
  }

  attachBackendCallbackFunctions(gridOptions: GridOption) {
    const backendApi = gridOptions.backendServiceApi;
    const serviceOptions: BackendServiceOption = (backendApi && backendApi.service && backendApi.service.options) ? backendApi.service.options : {};
    const isExecuteCommandOnInit = (!serviceOptions) ? false : ((serviceOptions && serviceOptions.hasOwnProperty('executeProcessCommandOnInit')) ? serviceOptions['executeProcessCommandOnInit'] : true);

    // update backend filters (if need be) before the query runs
    if (backendApi) {
      const backendService = backendApi.service;

      // if user entered some any "presets", we need to reflect them all in the grid
      if (gridOptions && gridOptions.presets) {
        // Filters "presets"
        if (backendService && backendService.updateFilters && Array.isArray(gridOptions.presets.filters) && gridOptions.presets.filters.length > 0) {
          backendService.updateFilters(gridOptions.presets.filters, true);
        }
        // Sorters "presets"
        if (backendService && backendService.updateSorters && Array.isArray(gridOptions.presets.sorters) && gridOptions.presets.sorters.length > 0) {
          backendService.updateSorters(undefined, gridOptions.presets.sorters);
        }
        // Pagination "presets"
        if (backendService && backendService.updatePagination && gridOptions.presets.pagination) {
          backendService.updatePagination(gridOptions.presets.pagination.pageNumber, gridOptions.presets.pagination.pageSize);
        }
      } else {
        const columnFilters = this.filterService.getColumnFilters();
        if (columnFilters && backendService && backendService.updateFilters) {
          backendService.updateFilters(columnFilters, false);
        }
      }
    }

    if (backendApi && backendApi.service && (backendApi.onInit || isExecuteCommandOnInit)) {
      const query = (typeof backendApi.service.buildQuery === 'function') ? backendApi.service.buildQuery() : '';
      const onInitPromise = (isExecuteCommandOnInit) ? (backendApi && backendApi.process) ? backendApi.process(query) : undefined : (backendApi && backendApi.onInit) ? backendApi.onInit(query) : null;

      // wrap this inside a setTimeout to avoid timing issue since the gridOptions needs to be ready before running this onInit
      setTimeout(async () => {
        // keep start time & end timestamps & return it after process execution
        const startTime = new Date();

        if (backendApi.preProcess) {
          backendApi.preProcess();
        }

        try {
          // await for the Promise to resolve the data
          const processResult: GraphqlResult | any = await onInitPromise;
          const endTime = new Date();

          // define what our internal Post Process callback, only available for GraphQL Service for now
          // it will basically refresh the Dataset & Pagination without having the user to create his own PostProcess every time
          if (processResult && backendApi && backendApi.service instanceof GraphqlService && backendApi.internalPostProcess) {
            backendApi.internalPostProcess(processResult);
          }

          // send the response process to the postProcess callback
          if (backendApi.postProcess) {
            processResult.statistics = {
              startTime,
              endTime,
              executionTime: endTime.valueOf() - startTime.valueOf(),
              totalItemCount: this.gridOptions && this.gridOptions.pagination && this.gridOptions.pagination.totalItems
            };
            backendApi.postProcess(processResult);
          }
        } catch (e) {
          if (backendApi && backendApi.onError) {
            backendApi.onError(e);
          } else {
            throw e;
          }
        }
      });
    }
  }

  attachResizeHook(grid: any, options: GridOption) {
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
      this.resizerService.attachAutoResizeDataGrid();
      if (options.autoFitColumnsOnFirstLoad && options.enableAutoSizeColumns && typeof grid.autosizeColumns === 'function') {
        grid.autosizeColumns();
      }
    }
  }

  executeAfterDataviewCreated(grid: any, gridOptions: GridOption, dataView: any) {
    // if user entered some Sort "presets", we need to reflect them all in the DOM
    if (gridOptions.enableSorting) {
      if (gridOptions.presets && Array.isArray(gridOptions.presets.sorters) && gridOptions.presets.sorters.length > 0) {
        this.sortService.loadLocalPresets(grid, dataView);
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
    if (gridOptions && gridOptions.backendServiceApi) {
      if (gridOptions.pagination && Array.isArray(gridOptions.pagination.pageSizes) && gridOptions.pagination.pageSizes.length > 0) {
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

      if (this.gridOptions.backendServiceApi) {
        // do we want to show pagination?
        // if we have a backendServiceApi and the enablePagination is undefined, we'll assume that we do want to see it, else get that defined value
        this.showPagination = ((this.gridOptions.backendServiceApi && this.gridOptions.enablePagination === undefined) ? true : this.gridOptions.enablePagination) || false;

        // before merging the grid options, make sure that it has the totalItems count
        // once we have that, we can merge and pass all these options to the pagination component
        if (!this.gridOptions.pagination) {
          this.gridOptions.pagination = (this.gridOptions.pagination) ? this.gridOptions.pagination : undefined;
        }
        if (this.gridOptions.pagination && totalCount !== undefined) {
          this.gridOptions.pagination.totalItems = totalCount;
        }
        if (this.gridOptions.presets && this.gridOptions.presets.pagination && this.gridOptions.pagination) {
          this.gridOptions.pagination.pageSize = this.gridOptions.presets.pagination.pageSize;
          this.gridOptions.pagination.pageNumber = this.gridOptions.presets.pagination.pageNumber;
        }
        this.gridPaginationOptions = this.mergeGridOptions(this.gridOptions);
      }

      // resize the grid inside a slight timeout, in case other DOM element changed prior to the resize (like a filter/pagination changed)
      if (this.gridOptions && this.gridOptions.enableAutoResize) {
        const delay = this.gridOptions.autoResize && this.gridOptions.autoResize.delay || 10;
        this.resizerService.resizeGrid(delay);
      }
    }
  }

  /**
   * Toggle the filter row displayed on first row
   * @param isShowing
   */
  showHeaderRow(isShowing: boolean) {
    this.grid.setHeaderRowVisibility(isShowing);
    return isShowing;
  }

  /** Toggle the filter row displayed on first row */
  toggleHeaderRow() {
    const isShowing = !this.grid.getOptions().showHeaderRow;
    this.grid.setHeaderRowVisibility(isShowing);
    return isShowing;
  }

  /**
   * Dynamically change or update the column definitions list.
   * We will re-render the grid so that the new header and data shows up correctly.
   * If using i18n, we also need to trigger a re-translate of the column headers
   */
  updateColumnDefinitionsList(newColumnDefinitions?: Column[]) {
    if (this.gridOptions.enableTranslate) {
      this.extensionService.translateColumnHeaders(false, newColumnDefinitions);
    } else {
      this.extensionService.renderColumnHeaders(newColumnDefinitions);
    }

    if (this.gridOptions && this.gridOptions.enableAutoSizeColumns) {
      this.grid.autosizeColumns();
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
    return this.elm.dispatchEvent(new CustomEvent(eventName, eventInit));
  }

  /** Load the Editor Collection asynchronously and replace the "collection" property when Promise resolves */
  private loadEditorCollectionAsync(column: Column): any[] {
    const collectionAsync = column && column.editor && column.editor.collectionAsync;
    if (collectionAsync) {
      // wait for the "collectionAsync", once resolved we will save it into the "collection"
      // the collectionAsync can be of 3 types HttpClient, HttpFetch or a Promise
      //
      collectionAsync.then((response: any | any[]) => {
        if (Array.isArray(response)) {
          this.updateEditorCollection(column, response); // from Promise
        } else if (response instanceof Response && typeof response.json === 'function') {
          if (response.bodyUsed) {
            throw new Error('[Aurelia-SlickGrid] The response body passed to collectionAsync was ' +
              'already read. Either pass the dataset from the Response ' +
              'or clone the response first using response.clone()');
          }
          // from Fetch
          (response as Response).json().then(data => this.updateEditorCollection(column, data));
        } else if (response && response['content']) {
          this.updateEditorCollection(column, response['content']); // from aurelia-http-client
        }
      });
    }
    return [];
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
