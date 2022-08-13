// import 3rd party vendor libs
// also only import jQueryUI necessary widget (note autocomplete & slider are imported in their respective editors/filters)
import * as $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/sortable';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/lib/jquery.mousewheel';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';

import {
  // interfaces/types
  AutoCompleteEditor,
  BackendServiceApi,
  BackendServiceOption,
  Column,
  ColumnEditor,
  DataViewOption,
  EventSubscription,
  ExtensionList,
  ExternalResource,
  GridStateType,
  Locale,
  Metrics,
  Pagination,
  SelectEditor,
  ServicePagination,
  SlickDataView,
  SlickEventHandler,
  SlickGrid,
  SlickNamespace,

  // services
  BackendUtilityService,
  CollectionService,
  EventNamingStyle,
  ExtensionService,
  ExtensionUtility,
  FilterFactory,
  FilterService,
  GridEventService,
  GridService,
  GridStateService,
  GroupingAndColspanService,
  Observable,
  PaginationService,
  ResizerService,
  RxJsFacade,
  SharedService,
  SlickGroupItemMetadataProvider,
  SlickgridConfig,
  SortService,
  TreeDataService,

  // utilities
  autoAddEditorFormatterToColumnsWithEditor,
  emptyElement,
  ExtensionName,
} from '@slickgrid-universal/common';
import { EventPubSubService } from '@slickgrid-universal/event-pub-sub';
import { SlickFooterComponent } from '@slickgrid-universal/custom-footer-component';
import { SlickEmptyWarningComponent } from '@slickgrid-universal/empty-warning-component';
import { SlickPaginationComponent } from '@slickgrid-universal/pagination-component';

import { bindable, BindingEngine, bindingMode, Container, Factory, inject, useView, PLATFORM } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { dequal } from 'dequal/lite';

import { Constants } from '../constants';
import { GlobalGridOptions } from '../global-grid-options';
import { AureliaGridInstance, GridOption, } from '../models/index';
import {
  AureliaUtilService,
  ContainerService,
  disposeAllSubscriptions,
  TranslaterService,
} from '../services/index';
import { SlickRowDetailView } from '../extensions/slickRowDetailView';

// using external non-typed js libraries
declare const Slick: SlickNamespace;

// Aurelia doesn't support well TypeScript @autoinject in a Plugin so we'll do it the manual way
@inject(
  AureliaUtilService,
  BindingEngine,
  Container,
  Element,
  EventAggregator,
  ContainerService,
  TranslaterService,
)
@useView(PLATFORM.moduleName('./aurelia-slickgrid.html'))
export class AureliaSlickgridCustomElement {
  private _columnDefinitions: Column[] = [];
  private _currentDatasetLength = 0;
  private _dataset: any[] | null = null;
  private _eventHandler!: SlickEventHandler;
  private _eventPubSubService!: EventPubSubService;
  private _hideHeaderRowAfterPageLoad = false;
  private _isGridInitialized = false;
  private _isDatasetInitialized = false;
  private _isDatasetHierarchicalInitialized = false;
  private _isPaginationInitialized = false;
  private _isLocalGrid = true;
  private _paginationOptions: Pagination | undefined;
  private _registeredResources: ExternalResource[] = [];
  groupItemMetadataProvider?: SlickGroupItemMetadataProvider;
  backendServiceApi: BackendServiceApi | undefined;
  locales!: Locale;
  metrics?: Metrics;
  showPagination = false;
  serviceList: any[] = [];
  subscriptions: Array<EventSubscription | Subscription> = [];
  paginationData?: {
    gridOptions: GridOption;
    paginationService: PaginationService;
  };

  // components / plugins
  slickEmptyWarning: SlickEmptyWarningComponent | undefined;
  slickFooter: SlickFooterComponent | undefined;
  slickPagination: SlickPaginationComponent | undefined;
  slickRowDetailView?: SlickRowDetailView;

  // services
  backendUtilityService!: BackendUtilityService;
  collectionService: CollectionService;
  extensionService: ExtensionService;
  extensionUtility: ExtensionUtility;
  filterFactory!: FilterFactory;
  filterService: FilterService;
  gridEventService: GridEventService;
  gridService: GridService;
  gridStateService: GridStateService;
  groupingService: GroupingAndColspanService;
  paginationService: PaginationService;
  resizerService!: ResizerService;
  rxjs?: RxJsFacade;
  sharedService: SharedService;
  sortService: SortService;
  treeDataService: TreeDataService;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) columnDefinitions: Column[] = [];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) element!: Element;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dataview!: SlickDataView;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) grid!: SlickGrid;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) paginationOptions: Pagination | undefined;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) totalItems = 0;
  @bindable({ defaultBindingMode: bindingMode.fromView }) extensions!: ExtensionList<any>;
  @bindable({ defaultBindingMode: bindingMode.fromView }) instances: AureliaGridInstance | null = null;
  @bindable() customDataView?: SlickDataView;
  @bindable() dataset: any[] = [];
  @bindable() datasetHierarchical?: any[] | null;
  @bindable() gridId = '';
  @bindable() gridOptions!: GridOption;

  constructor(
    private readonly aureliaUtilService: AureliaUtilService,
    private readonly bindingEngine: BindingEngine,
    private readonly container: Container,
    private readonly elm: HTMLDivElement,
    private readonly globalEa: EventAggregator,
    private readonly containerService: ContainerService,
    private readonly translaterService: TranslaterService,
    externalServices: {
      backendUtilityService?: BackendUtilityService,
      collectionService?: CollectionService,
      eventPubSubService: EventPubSubService,
      extensionService?: ExtensionService,
      extensionUtility?: ExtensionUtility,
      filterService?: FilterService,
      gridEventService?: GridEventService,
      gridService?: GridService,
      gridStateService?: GridStateService,
      groupingAndColspanService?: GroupingAndColspanService,
      paginationService?: PaginationService,
      resizerService?: ResizerService,
      rxjs?: RxJsFacade,
      sharedService?: SharedService,
      sortService?: SortService,
      treeDataService?: TreeDataService,
    }
  ) {
    const slickgridConfig = new SlickgridConfig();

    // initialize and assign all Service Dependencies
    this._eventPubSubService = externalServices?.eventPubSubService ?? new EventPubSubService(this.elm);
    this._eventPubSubService.eventNamingStyle = EventNamingStyle.camelCase;

    this.backendUtilityService = externalServices?.backendUtilityService ?? new BackendUtilityService();
    this.gridEventService = externalServices?.gridEventService ?? new GridEventService();
    this.sharedService = externalServices?.sharedService ?? new SharedService();
    this.collectionService = externalServices?.collectionService ?? new CollectionService(this.translaterService);
    this.extensionUtility = externalServices?.extensionUtility ?? new ExtensionUtility(this.sharedService, this.backendUtilityService, this.translaterService);
    this.filterFactory = new FilterFactory(slickgridConfig, this.translaterService, this.collectionService);
    this.filterService = externalServices?.filterService ?? new FilterService(this.filterFactory as any, this._eventPubSubService, this.sharedService, this.backendUtilityService);
    this.resizerService = externalServices?.resizerService ?? new ResizerService(this._eventPubSubService);
    this.sortService = externalServices?.sortService ?? new SortService(this.sharedService, this._eventPubSubService, this.backendUtilityService);
    this.treeDataService = externalServices?.treeDataService ?? new TreeDataService(this._eventPubSubService, this.sharedService, this.sortService);
    this.paginationService = externalServices?.paginationService ?? new PaginationService(this._eventPubSubService, this.sharedService, this.backendUtilityService);

    this.extensionService = externalServices?.extensionService ?? new ExtensionService(
      this.extensionUtility,
      this.filterService,
      this._eventPubSubService,
      this.sharedService,
      this.sortService,
      this.treeDataService,
      this.translaterService,
    );

    this.gridStateService = externalServices?.gridStateService ?? new GridStateService(this.extensionService, this.filterService, this._eventPubSubService, this.sharedService, this.sortService, this.treeDataService);
    this.gridService = externalServices?.gridService ?? new GridService(this.gridStateService, this.filterService, this._eventPubSubService, this.paginationService, this.sharedService, this.sortService, this.treeDataService);
    this.groupingService = externalServices?.groupingAndColspanService ?? new GroupingAndColspanService(this.extensionUtility, this._eventPubSubService);

    this.serviceList = [
      this.extensionService,
      this.filterService,
      this.gridEventService,
      this.gridService,
      this.gridStateService,
      this.groupingService,
      this.paginationService,
      this.resizerService,
      this.sortService,
      this.treeDataService,
    ];

    // register all Service instances in the container
    this.containerService.registerInstance('ExtensionUtility', this.extensionUtility);
    this.containerService.registerInstance('FilterService', this.filterService);
    this.containerService.registerInstance('CollectionService', this.collectionService);
    this.containerService.registerInstance('ExtensionService', this.extensionService);
    this.containerService.registerInstance('GridEventService', this.gridEventService);
    this.containerService.registerInstance('GridService', this.gridService);
    this.containerService.registerInstance('GridStateService', this.gridStateService);
    this.containerService.registerInstance('GroupingAndColspanService', this.groupingService);
    this.containerService.registerInstance('PaginationService', this.paginationService);
    this.containerService.registerInstance('ResizerService', this.resizerService);
    this.containerService.registerInstance('SharedService', this.sharedService);
    this.containerService.registerInstance('SortService', this.sortService);
    this.containerService.registerInstance('EventPubSubService', this._eventPubSubService);
    this.containerService.registerInstance('PubSubService', this._eventPubSubService);
    this.containerService.registerInstance('TranslaterService', this.translaterService);
    this.containerService.registerInstance('TreeDataService', this.treeDataService);
  }

  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }

  get isDatasetInitialized(): boolean {
    return this._isDatasetInitialized;
  }
  set isDatasetInitialized(isInitialized: boolean) {
    this._isDatasetInitialized = isInitialized;
  }
  set isDatasetHierarchicalInitialized(isInitialized: boolean) {
    this._isDatasetHierarchicalInitialized = isInitialized;
  }

  get registeredResources(): ExternalResource[] {
    return this._registeredResources;
  }

  attached() {
    this._eventHandler = new Slick.EventHandler();
    this.initialization(this._eventHandler);
    this._isGridInitialized = true;

    // recheck the empty warning message after grid is shown so that it works in every use case
    if (this.gridOptions?.enableEmptyDataWarningMessage) {
      const dataset = this.dataset || [];
      if (Array.isArray(dataset)) {
        const finalTotalCount = dataset.length;
        this.displayEmptyDataWarning(finalTotalCount < 1);
      }
    }
  }

  initialization(eventHandler: SlickEventHandler) {
    if (!this.gridOptions || !this.columnDefinitions) {
      throw new Error('Using `<aurelia-slickgrid>` requires `column-definitions.bind="columnDefinitions"` and `grid-options.bind="gridOptions"`, it seems that you might have forgot to provide them since at least of them is undefined.');
    }

    this.gridOptions.translater = this.translaterService;
    this._eventHandler = eventHandler;

    // when detecting a frozen grid, we'll automatically enable the mousewheel scroll handler so that we can scroll from both left/right frozen containers
    if (this.gridOptions && ((this.gridOptions.frozenRow !== undefined && this.gridOptions.frozenRow >= 0) || this.gridOptions.frozenColumn !== undefined && this.gridOptions.frozenColumn >= 0) && this.gridOptions.enableMouseWheelScrollHandler === undefined) {
      this.gridOptions.enableMouseWheelScrollHandler = true;
    }

    const aureliaEventPrefix = this.gridOptions?.defaultAureliaEventPrefix ?? '';
    this._eventPubSubService.eventNamingStyle = this.gridOptions?.eventNamingStyle ?? EventNamingStyle.camelCase;
    this._eventPubSubService.publish(`${aureliaEventPrefix}onBeforeGridCreate`, true);

    // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
    this._dataset = this._dataset || this.dataset || [];
    this._currentDatasetLength = this._dataset.length;
    this.gridOptions = this.mergeGridOptions(this.gridOptions);
    this._paginationOptions = this.gridOptions?.pagination;
    this.locales = this.gridOptions?.locales ?? Constants.locales;
    this.backendServiceApi = this.gridOptions?.backendServiceApi;
    this._isLocalGrid = !this.backendServiceApi; // considered a local grid if it doesn't have a backend service set

    this.createBackendApiInternalPostProcessCallback(this.gridOptions);

    if (!this.customDataView) {
      const dataviewInlineFilters = this.gridOptions.dataView && this.gridOptions.dataView.inlineFilters || false;
      let dataViewOptions: DataViewOption = { inlineFilters: dataviewInlineFilters };

      if (this.gridOptions.draggableGrouping || this.gridOptions.enableGrouping) {
        this.groupItemMetadataProvider = new SlickGroupItemMetadataProvider();
        this.sharedService.groupItemMetadataProvider = this.groupItemMetadataProvider;
        dataViewOptions = { ...dataViewOptions, groupItemMetadataProvider: this.groupItemMetadataProvider };
      }
      this.dataview = new Slick.Data.DataView(dataViewOptions);
      this._eventPubSubService.publish(`${aureliaEventPrefix}onDataviewCreated`, this.dataview);
    }

    // get any possible Services that user want to register which don't require SlickGrid to be instantiated
    // RxJS Resource is in this lot because it has to be registered before anything else and doesn't require SlickGrid to be initialized
    this.preRegisterResources();

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

    // if the user wants to automatically add a Custom Editor Formatter, we need to call the auto add function again
    if (this.gridOptions.autoAddCustomEditorFormatter) {
      autoAddEditorFormatterToColumnsWithEditor(this._columnDefinitions, this.gridOptions.autoAddCustomEditorFormatter);
    }

    // save reference for all columns before they optionally become hidden/visible
    this.sharedService.allColumns = this._columnDefinitions;
    this.sharedService.visibleColumns = this._columnDefinitions;
    this.extensionService.createExtensionsBeforeGridCreation(this._columnDefinitions, this.gridOptions);

    // if user entered some Pinning/Frozen "presets", we need to apply them in the grid options
    if (this.gridOptions.presets?.pinning) {
      this.gridOptions = { ...this.gridOptions, ...this.gridOptions.presets.pinning };
    }

    // build SlickGrid Grid, also user might optionally pass a custom dataview (e.g. remote model)
    this.grid = new Slick.Grid(`#${this.gridId}`, this.customDataView || this.dataview, this._columnDefinitions, this.gridOptions);
    this.sharedService.dataView = this.dataview;
    this.sharedService.slickGrid = this.grid;
    this.sharedService.gridContainerElement = this.elm as HTMLDivElement;

    this.extensionService.bindDifferentExtensions();
    this.bindDifferentHooks(this.grid, this.gridOptions, this.dataview);

    // when it's a frozen grid, we need to keep the frozen column id for reference if we ever show/hide column from ColumnPicker/GridMenu afterward
    const frozenColumnIndex = this.gridOptions?.frozenColumn ?? -1;
    if (frozenColumnIndex >= 0 && frozenColumnIndex <= this._columnDefinitions.length && this._columnDefinitions.length > 0) {
      this.sharedService.frozenVisibleColumnId = this._columnDefinitions[frozenColumnIndex]?.id ?? '';
    }

    // get any possible Services that user want to register
    this.registerResources();

    // initialize the SlickGrid grid
    this.grid.init();

    // initialized the resizer service only after SlickGrid is initialized
    // if we don't we end up binding our resize to a grid element that doesn't yet exist in the DOM and the resizer service will fail silently (because it has a try/catch that unbinds the resize without throwing back)
    const gridContainerElm = this.elm.querySelector('div');
    if (gridContainerElm) {
      this.resizerService.init(this.grid, gridContainerElm);
    }

    // user could show a custom footer with the data metrics (dataset length and last updated timestamp)
    if (!this.gridOptions.enablePagination && this.gridOptions.showCustomFooter && this.gridOptions.customFooterOptions && gridContainerElm) {
      this.slickFooter = new SlickFooterComponent(this.grid, this.gridOptions.customFooterOptions, this._eventPubSubService, this.translaterService);
      this.slickFooter.renderFooter(gridContainerElm as HTMLDivElement);
    }

    if (!this.customDataView && this.dataview) {
      // load the data in the DataView (unless it's a hierarchical dataset, if so it will be loaded after the initial tree sort)
      const initialDataset = this.gridOptions?.enableTreeData ? this.sortTreeDataset(this.dataset) : this.dataset;
      if (Array.isArray(initialDataset)) {
        this.dataview.setItems(initialDataset, this.gridOptions.datasetIdPropertyName ?? 'id');
      }

      // if you don't want the items that are not visible (due to being filtered out or being on a different page)
      // to stay selected, pass 'false' to the second arg
      if (this.grid?.getSelectionModel() && this.gridOptions?.dataView && this.gridOptions.dataView.hasOwnProperty('syncGridSelection')) {
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
        this.loadFilterPresetsWhenDatasetInitialized();
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
    this._eventPubSubService.publish(`${aureliaEventPrefix}onGridCreated`, this.grid);

    // after the DataView is created & updated execute some processes & dispatch some events
    if (!this.customDataView) {
      this.executeAfterDataviewCreated(this.grid, this.gridOptions);
    }

    // bind resize ONLY after the dataView is ready
    this.bindResizeHook(this.grid, this.gridOptions);

    // bind the Backend Service API callback functions only after the grid is initialized
    // because the preProcess() and onInit() might get triggered
    if (this.gridOptions?.backendServiceApi) {
      this.bindBackendCallbackFunctions(this.gridOptions);
    }

    // create the Aurelia Grid Instance with reference to all Services
    const aureliaElementInstance: AureliaGridInstance = {
      // Slick Grid & DataView objects
      dataView: this.dataview,
      slickGrid: this.grid,

      // public methods
      dispose: this.dispose.bind(this),

      // return all available Services (non-singleton)
      backendService: this.gridOptions?.backendServiceApi?.service,
      filterService: this.filterService,
      gridEventService: this.gridEventService,
      gridStateService: this.gridStateService,
      gridService: this.gridService,
      groupingService: this.groupingService,
      extensionService: this.extensionService,
      paginationService: this.paginationService,
      resizerService: this.resizerService,
      sortService: this.sortService,
      treeDataService: this.treeDataService,
    };

    // addons (SlickGrid extra plugins/controls)
    this.extensions = this.extensionService?.extensionList;

    // all instances (SlickGrid, DataView & all Services)
    this.instances = aureliaElementInstance;
    this._eventPubSubService.publish(`${aureliaEventPrefix}onAureliaGridCreated`, aureliaElementInstance);
  }

  detached(shouldEmptyDomElementContainer = false) {
    const aureliaEventPrefix = this.gridOptions?.defaultAureliaEventPrefix ?? '';
    this._eventPubSubService.publish(`${aureliaEventPrefix}onBeforeGridDestroy`, this.grid);
    this._eventHandler?.unsubscribeAll();

    // we could optionally also empty the content of the grid container DOM element
    if (shouldEmptyDomElementContainer) {
      this.emptyGridContainerElm();
    }

    this._eventPubSubService.publish(`${aureliaEventPrefix}onAfterGridDestroyed`, true);

    // dispose of all Services
    this.serviceList.forEach((service: any) => {
      if (service?.dispose) {
        service.dispose();
      }
    });
    this.serviceList = [];

    // dispose all registered external resources
    if (Array.isArray(this._registeredResources)) {
      while (this._registeredResources.length > 0) {
        const resource = this._registeredResources.pop();
        if (resource?.dispose) {
          resource.dispose();
        }
      }
      this._registeredResources = [];
    }

    // dispose the Components
    this.slickEmptyWarning?.dispose();
    this.slickFooter?.dispose();
    this.slickPagination?.dispose();

    if (this.dataview) {
      if (this.dataview.setItems) {
        this.dataview.setItems([]);
      }
      if (this.dataview.destroy) {
        this.dataview.destroy();
      }
    }
    if (this.grid?.destroy) {
      this.grid.destroy(shouldEmptyDomElementContainer);
    }

    // also dispose of all Subscriptions
    this.subscriptions = disposeAllSubscriptions(this.subscriptions);

    if (this.backendServiceApi) {
      for (const prop of Object.keys(this.backendServiceApi)) {
        (this.backendServiceApi as any)[prop] = null;
      }
      this.backendServiceApi = undefined;
    }
    for (const prop of Object.keys(this.columnDefinitions)) {
      (this.columnDefinitions as any)[prop] = null;
    }
    for (const prop of Object.keys(this.sharedService)) {
      (this.sharedService as any)[prop] = null;
    }
    this._dataset = null;
    this.datasetHierarchical = null;
    this._columnDefinitions = [];
  }

  emptyGridContainerElm() {
    const gridContainerId = this.gridOptions?.gridContainerId ?? 'grid1';
    const gridContainerElm = document.querySelector(`#${gridContainerId}`) as HTMLDivElement;
    emptyElement(gridContainerElm);
  }

  dispose(shouldEmptyDomElementContainer = false) {
    this.detached(shouldEmptyDomElementContainer);
  }

  bind() {
    // get the grid options (order of precedence is Global Options first, then user option which could overwrite the Global options)
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
    if (this._isGridInitialized) {
      this.updateColumnDefinitionsList(this.columnDefinitions);
    }
    if (this._columnDefinitions.length > 0) {
      this.copyColumnWidthsReference(this._columnDefinitions);
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
        if (activeNode?.contains(target) && this.grid.getEditorLock().isActive() && !target?.classList?.contains('autocomplete')) {
          this.grid.getEditorLock().commitCurrentEdit();
        }
      });
    }
  }

  datasetChanged(newDataset: any[], oldValue: any[]) {
    const prevDatasetLn = this._currentDatasetLength;
    const isDatasetEqual = dequal(newDataset, this._dataset || []);
    let data = newDataset;

    // when Tree Data is enabled and we don't yet have the hierarchical dataset filled, we can force a convert+sort of the array
    if (this.grid && this.gridOptions?.enableTreeData && Array.isArray(newDataset) && (newDataset.length > 0 || newDataset.length !== prevDatasetLn || !isDatasetEqual)) {
      this._isDatasetHierarchicalInitialized = false;
      data = this.sortTreeDataset(newDataset, !isDatasetEqual); // if dataset changed, then force a refresh anyway
    }

    this._dataset = data;
    this.refreshGridData(data || []);
    this._currentDatasetLength = (newDataset || []).length;

    // expand/autofit columns on first page load
    // we can assume that if the oldValue was empty then we are on first load
    if (this.gridOptions.autoFitColumnsOnFirstLoad && (!oldValue || oldValue.length < 1)) {
      this.grid.autosizeColumns();
    }
  }

  datasetHierarchicalChanged(newHierarchicalDataset: any[] | undefined) {
    const isDatasetEqual = dequal(newHierarchicalDataset, this.sharedService?.hierarchicalDataset ?? []);
    const prevFlatDatasetLn = this._currentDatasetLength;
    this.sharedService.hierarchicalDataset = newHierarchicalDataset;

    if (newHierarchicalDataset && this.columnDefinitions && this.filterService?.clearFilters) {
      this.filterService.clearFilters();
    }

    // when a hierarchical dataset is set afterward, we can reset the flat dataset and call a tree data sort that will overwrite the flat dataset
    if (newHierarchicalDataset && this.grid && this.sortService?.processTreeDataInitialSort) {
      this.dataview.setItems([], this.gridOptions.datasetIdPropertyName ?? 'id');
      this.sortService.processTreeDataInitialSort();

      // we also need to reset/refresh the Tree Data filters because if we inserted new item(s) then it might not show up without doing this refresh
      // however we need 1 cpu cycle before having the DataView refreshed, so we need to wrap this check in a setTimeout
      setTimeout(() => {
        const flatDatasetLn = this.dataview.getItemCount();
        if (flatDatasetLn > 0 && (flatDatasetLn !== prevFlatDatasetLn || !isDatasetEqual)) {
          this.filterService.refreshTreeDataFilters();
        }
      });
      this._isDatasetHierarchicalInitialized = true;
    }
  }

  /**
   * Define our internal Post Process callback, it will execute internally after we get back result from the Process backend call
   * For now, this is GraphQL Service ONLY feature and it will basically
   * refresh the Dataset & Pagination without having the user to create his own PostProcess every time
   */
  createBackendApiInternalPostProcessCallback(gridOptions: GridOption) {
    const backendApi = gridOptions?.backendServiceApi;
    if (backendApi?.service) {
      const backendApiService = backendApi.service;

      // internalPostProcess only works (for now) with a GraphQL Service, so make sure it is of that type
      if (typeof backendApiService.getDatasetName === 'function') {
        backendApi.internalPostProcess = (processResult: any) => {
          const datasetName = (backendApi && backendApiService && typeof backendApiService.getDatasetName === 'function') ? backendApiService.getDatasetName() : '';
          if (processResult?.data[datasetName]) {
            const data = processResult.data[datasetName].hasOwnProperty('nodes') ? (processResult as any).data[datasetName].nodes : (processResult as any).data[datasetName];
            const totalCount = processResult.data[datasetName].hasOwnProperty('totalCount') ? (processResult as any).data[datasetName].totalCount : (processResult as any).data[datasetName].length;
            this.refreshGridData(data, totalCount || 0);
          }
        };
      }
    }
  }

  bindDifferentHooks(grid: SlickGrid, gridOptions: GridOption, dataView: SlickDataView) {
    // translate some of them on first load, then on each language change
    if (gridOptions.enableTranslate) {
      this.extensionService.translateAllExtensions();
      this.translateColumnHeaderTitleKeys();
      this.translateColumnGroupKeys();
    }

    // on locale change, we have to manually translate the Headers, GridMenu
    this.subscriptions.push(
      this.globalEa.subscribe('i18n:locale:changed', () => {
        // publish event of the same name that Slickgrid-Universal uses on a language change event
        this._eventPubSubService.publish('onLanguageChange');

        if (gridOptions.enableTranslate) {
          this.extensionService.translateAllExtensions();
          this.translateColumnHeaderTitleKeys();
          this.translateColumnGroupKeys();
          if (gridOptions.createPreHeaderPanel && !gridOptions.enableDraggableGrouping) {
            this.groupingService.translateGroupingAndColSpan();
          }
        }
      })
    );

    // if user set an onInit Backend, we'll run it right away (and if so, we also need to run preProcess, internalPostProcess & postProcess)
    if (gridOptions.backendServiceApi) {
      const backendApi = gridOptions.backendServiceApi;

      if (backendApi?.service?.init) {
        backendApi.service.init(backendApi.options, gridOptions.pagination, this.grid, this.sharedService);
      }
    }

    if (dataView && grid) {
      const slickgridEventPrefix = this.gridOptions?.defaultSlickgridEventPrefix ?? '';

      // expose all Slick Grid Events through dispatch
      for (const prop in grid) {
        if (grid.hasOwnProperty(prop) && prop.startsWith('on')) {
          const gridEventName = this._eventPubSubService.getEventNameByNamingConvention(prop, slickgridEventPrefix);
          this._eventHandler.subscribe((grid as any)[prop], (event, args) => {
            return this._eventPubSubService.dispatchCustomEvent(gridEventName, { eventData: event, args });
          });
        }
      }

      // expose all Slick DataView Events through dispatch
      for (const prop in dataView) {
        if (dataView.hasOwnProperty(prop) && prop.startsWith('on')) {
          this._eventHandler.subscribe((dataView as any)[prop], (event, args) => {
            const dataViewEventName = this._eventPubSubService.getEventNameByNamingConvention(prop, slickgridEventPrefix);
            return this._eventPubSubService.dispatchCustomEvent(dataViewEventName, { eventData: event, args });
          });
        }
      }

      // on cell click, mainly used with the columnDef.action callback
      this.gridEventService.bindOnBeforeEditCell(grid);
      this.gridEventService.bindOnCellChange(grid);
      this.gridEventService.bindOnClick(grid);

      if (dataView && grid) {
        // bind external sorting (backend) when available or default onSort (dataView)
        if (gridOptions.enableSorting) {
          // bind external sorting (backend) unless specified to use the local one
          if (gridOptions.backendServiceApi && !gridOptions.backendServiceApi.useLocalSorting) {
            this.sortService.bindBackendOnSort(grid);
          } else {
            this.sortService.bindLocalOnSort(grid);
          }
        }

        // bind external filter (backend) when available or default onFilter (dataView)
        if (gridOptions.enableFiltering) {
          this.filterService.init(grid);

          // bind external filter (backend) unless specified to use the local one
          if (gridOptions.backendServiceApi && !gridOptions.backendServiceApi.useLocalFiltering) {
            this.filterService.bindBackendOnFilter(grid);
          } else {
            this.filterService.bindLocalOnFilter(grid);
          }
        }

        // load any presets if any (after dataset is initialized)
        this.loadColumnPresetsWhenDatasetInitialized();
        this.loadFilterPresetsWhenDatasetInitialized();

        // When data changes in the DataView, we need to refresh the metrics and/or display a warning if the dataset is empty
        this._eventHandler.subscribe(dataView.onRowCountChanged, () => {
          grid.invalidate();
          this.handleOnItemCountChanged(dataView.getFilteredItemCount() || 0, dataView.getItemCount() || 0);
        });
        this._eventHandler.subscribe(dataView.onSetItemsCalled, (_e, args) => {
          this.handleOnItemCountChanged(dataView.getFilteredItemCount() || 0, args.itemCount);

          // when user has resize by content enabled, we'll force a full width calculation since we change our entire dataset
          if (args.itemCount > 0 && (this.gridOptions.autosizeColumnsByCellContentOnFirstLoad || this.gridOptions.enableAutoResizeColumnsByCellContent)) {
            this.resizerService.resizeColumnsByCellContent(!this.gridOptions?.resizeByContentOnlyOnFirstLoad);
          }
        });

        if (gridOptions?.enableFiltering && !gridOptions.enableRowDetailView) {
          this._eventHandler.subscribe(dataView.onRowsChanged, (_e, args) => {
            // filtering data with local dataset will not always show correctly unless we call this updateRow/render
            // also don't use "invalidateRows" since it destroys the entire row and as bad user experience when updating a row
            // see commit: https://github.com/ghiscoding/aurelia-slickgrid/commit/8c503a4d45fba11cbd8d8cc467fae8d177cc4f60
            if (args?.rows && Array.isArray(args.rows)) {
              args.rows.forEach((row: number) => grid.updateRow(row));
              grid.render();
            }
          });
        }
      }
    }

    // did the user add a colspan callback? If so, hook it into the DataView getItemMetadata
    if (gridOptions?.colspanCallback && dataView?.getItem && dataView?.getItemMetadata) {
      dataView.getItemMetadata = (rowNumber: number) => {
        let callbackResult = null;
        if (gridOptions.colspanCallback) {
          callbackResult = gridOptions.colspanCallback(dataView.getItem(rowNumber));
        }
        return callbackResult;
      };
    }
  }

  bindBackendCallbackFunctions(gridOptions: GridOption) {
    const backendApi = gridOptions.backendServiceApi;
    const backendApiService = backendApi?.service;
    const serviceOptions: BackendServiceOption = backendApiService?.options || {};
    const isExecuteCommandOnInit = (!serviceOptions) ? false : ((serviceOptions && serviceOptions.hasOwnProperty('executeProcessCommandOnInit')) ? serviceOptions['executeProcessCommandOnInit'] : true);

    if (backendApiService) {
      // update backend filters (if need be) BEFORE the query runs (via the onInit command a few lines below)
      // if user entered some any "presets", we need to reflect them all in the grid
      if (gridOptions?.presets) {
        // Filters "presets"
        if (backendApiService.updateFilters && Array.isArray(gridOptions.presets.filters) && gridOptions.presets.filters.length > 0) {
          backendApiService.updateFilters(gridOptions.presets.filters, true);
        }
        // Sorters "presets"
        if (backendApiService.updateSorters && Array.isArray(gridOptions.presets.sorters) && gridOptions.presets.sorters.length > 0) {
          // when using multi-column sort, we can have multiple but on single sort then only grab the first sort provided
          const sortColumns = this.gridOptions.multiColumnSort ? gridOptions.presets.sorters : gridOptions.presets.sorters.slice(0, 1);
          backendApiService.updateSorters(undefined, sortColumns);
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
        const process = isExecuteCommandOnInit ? (backendApi.process?.(query) ?? null) : (backendApi.onInit?.(query) ?? null);

        // wrap this inside a setTimeout to avoid timing issue since the gridOptions needs to be ready before running this onInit
        setTimeout(() => {
          const backendUtilityService = this.backendUtilityService as BackendUtilityService;

          // keep start time & end timestamps & return it after process execution
          const startTime = new Date();

          // run any pre-process, if defined, for example a spinner
          if (backendApi.preProcess) {
            backendApi.preProcess();
          }

          // the processes can be a Promise (like Http)
          const totalItems = this.gridOptions?.pagination?.totalItems ?? 0;
          if (process instanceof Promise) {
            process
              .then((processResult: any) => backendUtilityService.executeBackendProcessesCallback(startTime, processResult, backendApi, totalItems))
              .catch((error) => backendUtilityService.onBackendError(error, backendApi));
          } else if (process && this.rxjs?.isObservable(process)) {
            this.subscriptions.push(
              (process as Observable<any>).subscribe(
                (processResult: any) => backendUtilityService.executeBackendProcessesCallback(startTime, processResult, backendApi, totalItems),
                (error: any) => backendUtilityService.onBackendError(error, backendApi)
              )
            );
          }
        });
      }
    }
  }

  bindResizeHook(grid: SlickGrid, options: GridOption) {
    if ((options.autoFitColumnsOnFirstLoad && options.autosizeColumnsByCellContentOnFirstLoad) || (options.enableAutoSizeColumns && options.enableAutoResizeColumnsByCellContent)) {
      throw new Error(`[Aurelia-Slickgrid] You cannot enable both autosize/fit viewport & resize by content, you must choose which resize technique to use. You can enable these 2 options ("autoFitColumnsOnFirstLoad" and "enableAutoSizeColumns") OR these other 2 options ("autosizeColumnsByCellContentOnFirstLoad" and "enableAutoResizeColumnsByCellContent").`);
    }

    // expand/autofit columns on first page load
    if (grid && options.autoFitColumnsOnFirstLoad && options.enableAutoSizeColumns && typeof grid.autosizeColumns === 'function') {
      this.grid.autosizeColumns();
    }

    // auto-resize grid on browser resize
    if (options.gridHeight || options.gridWidth) {
      this.resizerService.resizeGrid(0, { height: options.gridHeight, width: options.gridWidth });
    } else {
      this.resizerService.resizeGrid();
    }

    if (grid && options?.enableAutoResize) {
      if (options.autoFitColumnsOnFirstLoad && options.enableAutoSizeColumns && typeof grid.autosizeColumns === 'function') {
        grid.autosizeColumns();
      }
    }
  }

  executeAfterDataviewCreated(_grid: SlickGrid, gridOptions: GridOption) {
    // if user entered some Sort "presets", we need to reflect them all in the DOM
    if (gridOptions.enableSorting) {
      if (gridOptions.presets && Array.isArray(gridOptions.presets.sorters)) {
        // when using multi-column sort, we can have multiple but on single sort then only grab the first sort provided
        const sortColumns = this.gridOptions.multiColumnSort ? gridOptions.presets.sorters : gridOptions.presets.sorters.slice(0, 1);
        this.sortService.loadGridSorters(sortColumns);
      }
    }
  }

  /**
   * On a Pagination changed, we will trigger a Grid State changed with the new pagination info
   * Also if we use Row Selection or the Checkbox Selector, we need to reset any selection
   */
  paginationChanged(pagination: ServicePagination) {
    const isSyncGridSelectionEnabled = this.gridStateService?.needToPreserveRowSelection() ?? false;
    if (!isSyncGridSelectionEnabled && (this.gridOptions.enableRowSelection || this.gridOptions.enableCheckboxSelector)) {
      this.grid.setSelectedRows([]);
    }
    const { pageNumber, pageSize } = pagination;
    if (this.sharedService) {
      if (pageSize !== undefined && pageNumber !== undefined) {
        this.sharedService.currentPagination = { pageNumber, pageSize };
      }
    }
    this._eventPubSubService.publish('onGridStateChanged', {
      change: { newValues: { pageNumber, pageSize }, type: GridStateType.pagination },
      gridState: this.gridStateService.getCurrentGridState()
    });
  }

  paginationOptionsChanged(newPaginationOptions: Pagination) {
    if (newPaginationOptions && this._paginationOptions) {
      this._paginationOptions = { ...this._paginationOptions, ...newPaginationOptions };
    } else {
      this._paginationOptions = newPaginationOptions;
    }
    this.gridOptions.pagination = this._paginationOptions;
    this.paginationService.updateTotalItems(newPaginationOptions?.totalItems ?? 0, true);
  }

  /**
   * When dataset changes, we need to refresh the entire grid UI & possibly resize it as well
   * @param dataset
   */
  refreshGridData(dataset: any[], totalCount?: number) {
    // local grid, check if we need to show the Pagination
    // if so then also check if there's any presets and finally initialize the PaginationService
    // a local grid with Pagination presets will potentially have a different total of items, we'll need to get it from the DataView and update our total
    if (this.gridOptions?.enablePagination && this._isLocalGrid) {
      this.showPagination = true;
      this.loadLocalGridPagination(dataset);
    }

    if (this.gridOptions?.enableEmptyDataWarningMessage && Array.isArray(dataset)) {
      const finalTotalCount = totalCount || dataset.length;
      this.displayEmptyDataWarning(finalTotalCount < 1);
    }

    if (Array.isArray(dataset) && this.grid && this.dataview?.setItems) {
      this.dataview.setItems(dataset, this.gridOptions.datasetIdPropertyName ?? 'id');
      if (!this.gridOptions.backendServiceApi && !this.gridOptions.enableTreeData) {
        this.dataview.reSort();
      }

      if (dataset.length > 0) {
        if (!this._isDatasetInitialized) {
          this.loadFilterPresetsWhenDatasetInitialized();

          if (this.gridOptions.enableCheckboxSelector) {
            this.loadRowSelectionPresetWhenExists();
          }
        }
        this._isDatasetInitialized = true;
      }

      if (dataset) {
        this.grid.invalidate();
      }

      // display the Pagination component only after calling this refresh data first, we call it here so that if we preset pagination page number it will be shown correctly
      this.showPagination = (this.gridOptions && (this.gridOptions.enablePagination || (this.gridOptions.backendServiceApi && this.gridOptions.enablePagination === undefined))) ? true : false;

      if (this._paginationOptions && this.gridOptions?.pagination && this.gridOptions?.backendServiceApi) {
        const paginationOptions = this.setPaginationOptionsWhenPresetDefined(this.gridOptions, this._paginationOptions);

        // when we have a totalCount use it, else we'll take it from the pagination object
        // only update the total items if it's different to avoid refreshing the UI
        const totalRecords = (totalCount !== undefined) ? totalCount : (this.gridOptions?.pagination?.totalItems);
        if (totalRecords !== undefined && totalRecords !== this.totalItems) {
          this.totalItems = +totalRecords;
        }
        // initialize the Pagination Service with new pagination options (which might have presets)
        if (!this._isPaginationInitialized) {
          this.initializePaginationService(paginationOptions);
        } else {
          // update the pagination service with the new total
          this.paginationService.updateTotalItems(this.totalItems);
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
    if (showing === true && this._isGridInitialized) {
      this.grid.setColumns(this.columnDefinitions);
    }
    return showing;
  }

  /**
   * Check if there's any Pagination Presets defined in the Grid Options,
   * if there are then load them in the paginationOptions object
   */
  setPaginationOptionsWhenPresetDefined(gridOptions: GridOption, paginationOptions: Pagination): Pagination {
    if (gridOptions.presets?.pagination && gridOptions.pagination) {
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

      // if the user wants to automatically add a Custom Editor Formatter, we need to call the auto add function again
      if (this.gridOptions.autoAddCustomEditorFormatter) {
        autoAddEditorFormatterToColumnsWithEditor(newColumnDefinitions, this.gridOptions.autoAddCustomEditorFormatter);
      }

      if (this.gridOptions.enableTranslate) {
        this.extensionService.translateColumnHeaders(false, newColumnDefinitions);
      } else {
        this.extensionService.renderColumnHeaders(newColumnDefinitions, true);
      }

      if (this.gridOptions?.enableAutoSizeColumns) {
        this.grid.autosizeColumns();
      } else if (this.gridOptions?.enableAutoResizeColumnsByCellContent && this.resizerService?.resizeColumnsByCellContent) {
        this.resizerService.resizeColumnsByCellContent();
      }
    }
  }

  //
  // private functions
  // ------------------

  /**
   * Loop through all column definitions and copy the original optional `width` properties optionally provided by the user.
   * We will use this when doing a resize by cell content, if user provided a `width` it won't override it.
   */
  private copyColumnWidthsReference(columnDefinitions: Column[]) {
    columnDefinitions.forEach(col => col.originalWidth = col.width);
  }

  private displayEmptyDataWarning(showWarning = true) {
    this.slickEmptyWarning?.showEmptyDataMessage(showWarning);
  }

  /** When data changes in the DataView, we'll refresh the metrics and/or display a warning if the dataset is empty */
  private handleOnItemCountChanged(currentPageRowItemCount: number, totalItemCount: number) {
    this._currentDatasetLength = totalItemCount;
    this.metrics = {
      startTime: new Date(),
      endTime: new Date(),
      itemCount: currentPageRowItemCount,
      totalItemCount
    };
    // if custom footer is enabled, then we'll update its metrics
    if (this.slickFooter) {
      this.slickFooter.metrics = this.metrics;
    }

    // when using local (in-memory) dataset, we'll display a warning message when filtered data is empty
    if (this._isLocalGrid && this.gridOptions?.enableEmptyDataWarningMessage) {
      this.displayEmptyDataWarning(currentPageRowItemCount === 0);
    }
  }

  /** Initialize the Pagination Service once */
  private initializePaginationService(paginationOptions: Pagination) {
    if (this.gridOptions) {
      this.paginationData = {
        gridOptions: this.gridOptions,
        paginationService: this.paginationService,
      };
      this.paginationService.totalItems = this.totalItems;
      this.paginationService.init(this.grid, paginationOptions, this.backendServiceApi);
      this.subscriptions.push(
        this._eventPubSubService.subscribe('onPaginationChanged', (paginationChanges: ServicePagination) => this.paginationChanged(paginationChanges)),
        this._eventPubSubService.subscribe('onPaginationVisibilityChanged', (visibility: { visible: boolean }) => {
          this.showPagination = visibility?.visible ?? false;
          if (this.gridOptions?.backendServiceApi) {
            this.backendUtilityService?.refreshBackendDataset(this.gridOptions);
          }
          this.renderPagination(this.showPagination);
        })
      );

      // also initialize (render) the pagination component
      this.renderPagination();
      this._isPaginationInitialized = true;
    }
  }

  /** Load the Editor Collection asynchronously and replace the "collection" property when Promise resolves */
  private loadEditorCollectionAsync(column: Column) {
    const collectionAsync = (column?.editor as ColumnEditor).collectionAsync;
    (column?.editor as ColumnEditor).disabled = true; // disable the Editor DOM element, we'll re-enable it after receiving the collection with "updateEditorCollection()"

    if (collectionAsync instanceof Promise) {
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
          this.updateEditorCollection(column, response['content']); // from http-client
        }
      });
    } else if (this.rxjs?.isObservable(collectionAsync)) {
      // wrap this inside a setTimeout to avoid timing issue since updateEditorCollection requires to call SlickGrid getColumns() method
      setTimeout(() => {
        this.subscriptions.push(
          (collectionAsync as Observable<any>).subscribe((resolvedCollection) => this.updateEditorCollection(column, resolvedCollection))
        );
      });
    }
  }

  /** Load any possible Columns Grid Presets */
  private loadColumnPresetsWhenDatasetInitialized() {
    // if user entered some Columns "presets", we need to reflect them all in the grid
    if (this.gridOptions.presets && Array.isArray(this.gridOptions.presets.columns) && this.gridOptions.presets.columns.length > 0) {
      const gridColumns: Column[] = this.gridStateService.getAssociatedGridColumns(this.grid, this.gridOptions.presets.columns);
      if (gridColumns && Array.isArray(gridColumns) && gridColumns.length > 0) {
        // make sure that the checkbox selector is also visible if it is enabled
        if (this.gridOptions.enableCheckboxSelector) {
          const checkboxColumn = (Array.isArray(this._columnDefinitions) && this._columnDefinitions.length > 0) ? this._columnDefinitions[0] : null;
          if (checkboxColumn && checkboxColumn.id === '_checkbox_selector' && gridColumns[0].id !== '_checkbox_selector') {
            gridColumns.unshift(checkboxColumn);
          }
        }

        // keep copy the original optional `width` properties optionally provided by the user.
        // We will use this when doing a resize by cell content, if user provided a `width` it won't override it.
        gridColumns.forEach(col => col.originalWidth = col.width);

        // finally set the new presets columns (including checkbox selector if need be)
        this.grid.setColumns(gridColumns);
        this.sharedService.visibleColumns = gridColumns;
      }
    }
  }

  /** Load any possible Filters Grid Presets */
  private loadFilterPresetsWhenDatasetInitialized() {
    if (this.gridOptions && !this.customDataView) {
      // if user entered some Filter "presets", we need to reflect them all in the DOM
      // also note that a presets of Tree Data Toggling will also call this method because Tree Data toggling does work with data filtering
      // (collapsing a parent will basically use Filter for hidding (aka collapsing) away the child underneat it)
      if (this.gridOptions.presets && (Array.isArray(this.gridOptions.presets.filters) || Array.isArray(this.gridOptions.presets?.treeData?.toggledItems))) {
        this.filterService.populateColumnFilterSearchTermPresets(this.gridOptions.presets?.filters || []);
      }
    }
  }

  /**
   * local grid, check if we need to show the Pagination
   * if so then also check if there's any presets and finally initialize the PaginationService
   * a local grid with Pagination presets will potentially have a different total of items, we'll need to get it from the DataView and update our total
   */
  private loadLocalGridPagination(dataset?: any[]) {
    if (this.gridOptions && this._paginationOptions) {
      this.totalItems = Array.isArray(dataset) ? dataset.length : 0;
      if (this._paginationOptions && this.dataview?.getPagingInfo) {
        const slickPagingInfo = this.dataview.getPagingInfo();
        if (slickPagingInfo?.hasOwnProperty('totalRows') && this._paginationOptions.totalItems !== slickPagingInfo.totalRows) {
          this.totalItems = slickPagingInfo.totalRows || 0;
        }
      }
      this._paginationOptions.totalItems = this.totalItems;
      const paginationOptions = this.setPaginationOptionsWhenPresetDefined(this.gridOptions, this._paginationOptions);
      this.initializePaginationService(paginationOptions);
    }
  }

  /** Load any Row Selections into the DataView that were presets by the user */
  private loadRowSelectionPresetWhenExists() {
    // if user entered some Row Selections "presets"
    const presets = this.gridOptions?.presets;
    const enableRowSelection = this.gridOptions && (this.gridOptions.enableCheckboxSelector || this.gridOptions.enableRowSelection);
    if (enableRowSelection && this.grid?.getSelectionModel() && presets?.rowSelection && (Array.isArray(presets.rowSelection.gridRowIndexes) || Array.isArray(presets.rowSelection.dataContextIds))) {
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
        setTimeout(() => {
          if (this.grid && Array.isArray(gridRowIndexes)) {
            this.grid.setSelectedRows(gridRowIndexes);
          }
        });
      }
    }
  }

  private mergeGridOptions(gridOptions: GridOption): GridOption {
    gridOptions.gridId = this.gridId;
    gridOptions.gridContainerId = `slickGridContainer-${this.gridId}`;

    // if we have a backendServiceApi and the enablePagination is undefined, we'll assume that we do want to see it, else get that defined value
    gridOptions.enablePagination = ((gridOptions.backendServiceApi && gridOptions.enablePagination === undefined) ? true : gridOptions.enablePagination) || false;

    // use jquery extend to deep merge & copy to avoid immutable properties being changed in GlobalGridOptions after a route change
    const options = $.extend(true, {}, GlobalGridOptions, gridOptions) as GridOption;

    // using jQuery extend to do a deep clone has an unwanted side on objects and pageSizes but ES6 spread has other worst side effects
    // so we will just overwrite the pageSizes when needed, this is the only one causing issues so far.
    // jQuery wrote this on their docs:: On a deep extend, Object and Array are extended, but object wrappers on primitive types such as String, Boolean, and Number are not.
    if (options?.pagination && (gridOptions.enablePagination || gridOptions.backendServiceApi) && gridOptions.pagination && Array.isArray(gridOptions.pagination.pageSizes)) {
      options.pagination.pageSizes = gridOptions.pagination.pageSizes;
    }

    // also make sure to show the header row if user have enabled filtering
    this._hideHeaderRowAfterPageLoad = (options.showHeaderRow === false);
    if (options.enableFiltering && !options.showHeaderRow) {
      options.showHeaderRow = options.enableFiltering;
    }

    // when we use Pagination on Local Grid, it doesn't seem to work without enableFiltering
    // so we'll enable the filtering but we'll keep the header row hidden
    if (options && !options.enableFiltering && options.enablePagination && this._isLocalGrid) {
      options.enableFiltering = true;
      options.showHeaderRow = false;
      this._hideHeaderRowAfterPageLoad = true;
      if (this.sharedService) {
        this.sharedService.hideHeaderRowAfterPageLoad = true;
      }
    }

    return options;
  }

  /** Pre-Register any Resource that don't require SlickGrid to be instantiated (for example RxJS Resource & RowDetail) */
  private preRegisterResources() {
    this._registeredResources = this.gridOptions.registerExternalResources || [];

    // bind & initialize all Components/Services that were tagged as enabled
    // register all services by executing their init method and providing them with the Grid object
    if (Array.isArray(this._registeredResources)) {
      for (const resource of this._registeredResources) {
        if (resource?.className === 'RxJsResource') {
          this.registerRxJsResource(resource as RxJsFacade);
        }
      }
    }

    if (this.gridOptions.enableRowDetailView) {
      this.slickRowDetailView = new SlickRowDetailView(this.aureliaUtilService, this._eventPubSubService, this.elm);
      this.slickRowDetailView.create(this.columnDefinitions, this.gridOptions);
      this._registeredResources.push(this.slickRowDetailView);
      this.extensionService.addExtensionToList(ExtensionName.rowDetailView, { name: ExtensionName.rowDetailView, instance: this.slickRowDetailView });
    }
  }

  private registerResources() {
    // at this point, we consider all the registered services as external services, anything else registered afterward aren't external
    if (Array.isArray(this._registeredResources)) {
      this.sharedService.externalRegisteredResources = this._registeredResources;
    }

    // push all other Services that we want to be registered
    this._registeredResources.push(this.gridService, this.gridStateService);

    // when using Grouping/DraggableGrouping/Colspan register its Service
    if (this.gridOptions.createPreHeaderPanel && !this.gridOptions.enableDraggableGrouping) {
      this._registeredResources.push(this.groupingService);
    }

    // when using Tree Data View, register its Service
    if (this.gridOptions.enableTreeData) {
      this._registeredResources.push(this.treeDataService);
    }

    // when user enables translation, we need to translate Headers on first pass & subsequently in the bindDifferentHooks
    if (this.gridOptions.enableTranslate) {
      this.extensionService.translateColumnHeaders();
    }

    // also initialize (render) the empty warning component
    this.slickEmptyWarning = new SlickEmptyWarningComponent();
    this._registeredResources.push(this.slickEmptyWarning);

    // bind & initialize all Components/Services that were tagged as enabled
    // register all services by executing their init method and providing them with the Grid object
    if (Array.isArray(this._registeredResources)) {
      for (const resource of this._registeredResources) {
        if (typeof resource.init === 'function') {
          resource.init(this.grid, this.containerService);
        }
      }
    }
  }

  /** Register the RxJS Resource in all necessary services which uses */
  private registerRxJsResource(resource: RxJsFacade) {
    this.rxjs = resource;
    this.backendUtilityService.addRxJsResource(this.rxjs);
    this.filterFactory.addRxJsResource(this.rxjs);
    this.filterService.addRxJsResource(this.rxjs);
    this.sortService.addRxJsResource(this.rxjs);
    this.paginationService.addRxJsResource(this.rxjs);
    this.containerService.registerInstance('RxJsResource', this.rxjs);
  }

  /**
   * Render (or dispose) the Pagination Component, user can optionally provide False (to not show it) which will in term dispose of the Pagination,
   * also while disposing we can choose to omit the disposable of the Pagination Service (if we are simply toggling the Pagination, we want to keep the Service alive)
   * @param {Boolean} showPagination - show (new render) or not (dispose) the Pagination
   * @param {Boolean} shouldDisposePaginationService - when disposing the Pagination, do we also want to dispose of the Pagination Service? (defaults to True)
   */
  private renderPagination(showPagination = true) {
    if (this.gridOptions?.enablePagination && !this._isPaginationInitialized && showPagination) {
      this.slickPagination = new SlickPaginationComponent(this.paginationService, this._eventPubSubService, this.sharedService, this.translaterService);
      this.slickPagination.renderPagination(this.elm.querySelector('div') as HTMLDivElement);
      this._isPaginationInitialized = true;
    } else if (!showPagination) {
      if (this.slickPagination) {
        this.slickPagination.dispose();
      }
      this._isPaginationInitialized = false;
    }
  }

  /**
   * Takes a flat dataset with parent/child relationship, sort it (via its tree structure) and return the sorted flat array
   * @param {Array<Object>} flatDatasetInput - flat dataset input
   * @param {Boolean} forceGridRefresh - optionally force a full grid refresh
   * @returns {Array<Object>} sort flat parent/child dataset
   */
  private sortTreeDataset<T>(flatDatasetInput: T[], forceGridRefresh = false): T[] {
    const prevDatasetLn = this._currentDatasetLength;
    let sortedDatasetResult;
    let flatDatasetOutput: any[] = [];

    // if the hierarchical dataset was already initialized then no need to re-convert it, we can use it directly from the shared service ref
    if (this._isDatasetHierarchicalInitialized && this.datasetHierarchical) {
      sortedDatasetResult = this.treeDataService.sortHierarchicalDataset(this.datasetHierarchical);
      flatDatasetOutput = sortedDatasetResult.flat;
    } else if (Array.isArray(flatDatasetInput) && flatDatasetInput.length > 0) {
      if (this.gridOptions?.treeDataOptions?.initialSort) {
        // else we need to first convert the flat dataset to a hierarchical dataset and then sort
        sortedDatasetResult = this.treeDataService.convertFlatParentChildToTreeDatasetAndSort(flatDatasetInput, this._columnDefinitions, this.gridOptions);
        this.sharedService.hierarchicalDataset = sortedDatasetResult.hierarchical;
        flatDatasetOutput = sortedDatasetResult.flat;
      } else {
        // else we assume that the user provided an array that is already sorted (user's responsability)
        // and so we can simply convert the array to a tree structure and we're done, no need to sort
        this.sharedService.hierarchicalDataset = this.treeDataService.convertFlatParentChildToTreeDataset(flatDatasetInput, this.gridOptions);
        flatDatasetOutput = flatDatasetInput || [];
      }
    }

    // if we add/remove item(s) from the dataset, we need to also refresh our tree data filters
    if (flatDatasetInput.length > 0 && (forceGridRefresh || flatDatasetInput.length !== prevDatasetLn)) {
      this.filterService.refreshTreeDataFilters(flatDatasetOutput);
    }

    return flatDatasetOutput;
  }

  /**
   * For convenience to the user, we provide the property "editor" as an Aurelia-Slickgrid editor complex object
   * however "editor" is used internally by SlickGrid for it's own Editor Factory
   * so in our lib we will swap "editor" and copy it into a new property called "internalColumnEditor"
   * then take back "editor.model" and make it the new "editor" so that SlickGrid Editor Factory still works
   */
  private swapInternalEditorToSlickGridFactoryEditor(columnDefinitions: Column[]) {
    if (columnDefinitions.some(col => `${col.id}`.includes('.'))) {
      console.error('[Aurelia-Slickgrid] Make sure that none of your Column Definition "id" property includes a dot in its name because that will cause some problems with the Editors. For example if your column definition "field" property is "user.firstName" then use "firstName" as the column "id".');
    }

    return columnDefinitions.map((column: Column | any) => {
      // on every Editor which have a "collection" or a "collectionAsync"
      if (column.editor?.collectionAsync) {
        this.loadEditorCollectionAsync(column);
      }

      return {
        ...column,
        editor: column.editor && Factory.of(column.editor.model).get(this.container),
        internalColumnEditor: { ...column.editor }
      };
    });
  }

  /** translate all columns (including hidden columns) */
  private translateColumnHeaderTitleKeys() {
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
  private updateEditorCollection<T = any>(column: Column<T>, newCollection: T[]) {
    (column.editor as ColumnEditor).collection = newCollection;
    (column.editor as ColumnEditor).disabled = false;

    // find the new column reference pointer & re-assign the new editor to the internalColumnEditor
    if (Array.isArray(this.columnDefinitions)) {
      const columnRef = this.columnDefinitions.find((col: Column) => col.id === column.id);
      if (columnRef) {
        columnRef.internalColumnEditor = column.editor as ColumnEditor;
      }
    }

    // get current Editor, remove it from the DOM then re-enable it and re-render it with the new collection.
    const currentEditor = this.grid.getCellEditor() as AutoCompleteEditor | SelectEditor;
    if (currentEditor?.disable && currentEditor?.renderDomElement) {
      currentEditor.destroy();
      currentEditor.disable(false);
      currentEditor.renderDomElement(newCollection);
    }
  }
}
