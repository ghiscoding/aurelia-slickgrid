import type { ICollectionObserver, ICollectionSubscriber } from '@aurelia/runtime';
import { bindable, BindingMode, customElement, IContainer, IEventAggregator, type IDisposable, IObserverLocator, resolve } from 'aurelia';
import { dequal } from 'dequal/lite';
import type {
  BackendService,
  BasePaginationComponent,
  AutocompleterEditor,
  BackendServiceApi,
  BackendServiceOption,
  Column,
  DataViewOption,
  EventSubscription,
  ExtensionList,
  ExternalResource,
  Locale,
  Metrics,
  Pagination,
  PaginationMetadata,
  SelectEditor,
} from '@slickgrid-universal/common';
import {
  autoAddEditorFormatterToColumnsWithEditor,
  BackendUtilityService,
  CollectionService,
  emptyElement,
  EventNamingStyle,
  ExtensionName,
  ExtensionService,
  ExtensionUtility,
  FilterFactory,
  FilterService,
  GridEventService,
  GridService,
  GridStateService,
  GridStateType,
  HeaderGroupingService,
  isColumnDateType,
  type Observable,
  PaginationService,
  ResizerService,
  type RxJsFacade,
  SharedService,
  SlickDataView,
  SlickEventHandler,
  SlickGrid,
  SlickgridConfig,
  SlickGroupItemMetadataProvider,
  SortService,
  TreeDataService,
} from '@slickgrid-universal/common';
import { EventPubSubService } from '@slickgrid-universal/event-pub-sub';
import { SlickFooterComponent } from '@slickgrid-universal/custom-footer-component';
import { SlickEmptyWarningComponent } from '@slickgrid-universal/empty-warning-component';
import { SlickPaginationComponent } from '@slickgrid-universal/pagination-component';
import { extend } from '@slickgrid-universal/utils';

import { Constants } from '../constants';
import { GlobalGridOptions } from '../global-grid-options';
import type { AureliaGridInstance, GridOption } from '../models/index';
import { AureliaUtilService, ContainerService, disposeAllSubscriptions, TranslaterService } from '../services/index';
import { SlickRowDetailView } from '../extensions/slickRowDetailView';

const WARN_NO_PREPARSE_DATE_SIZE = 10000; // data size to warn user when pre-parse isn't enabled

@customElement({
  name: 'aurelia-slickgrid',
  template: `
<div id="slickGridContainer-$\{gridId}" class="grid-pane">
  <!-- Header slot if you need to create a complex custom header -->
  <au-slot name="slickgrid-header"></au-slot>

  <div id.bind="gridId" class="slickgrid-container"
    ref="gridContainer">
  </div>

  <!-- Footer slot if you need to create a complex custom footer -->
  <au-slot name="slickgrid-footer"></au-slot>
</div>
` })
export class AureliaSlickgridCustomElement {
  protected _columnDefinitions: Column[] = [];
  protected _columnDefinitionObserver?: ICollectionObserver<'array'>;
  protected _columnDefinitionsSubscriber: ICollectionSubscriber = {
    handleCollectionChange: this.columnDefinitionsHandler.bind(this)
  };
  protected _currentDatasetLength = 0;
  protected _darkMode = false;
  protected _dataset: any[] | null = null;
  protected _eventHandler!: SlickEventHandler;
  protected _eventPubSubService!: EventPubSubService;
  protected _hideHeaderRowAfterPageLoad = false;
  protected _isAutosizeColsCalled = false;
  protected _isGridInitialized = false;
  protected _isDatasetInitialized = false;
  protected _isDatasetHierarchicalInitialized = false;
  protected _isPaginationInitialized = false;
  protected _isLocalGrid = true;
  protected _paginationOptions: Pagination | undefined;
  protected _registeredResources: ExternalResource[] = [];
  protected _scrollEndCalled = false;

  backendServiceApi: BackendServiceApi | undefined;
  locales!: Locale;
  groupItemMetadataProvider?: SlickGroupItemMetadataProvider;
  metrics?: Metrics;
  paginationData?: {
    gridOptions: GridOption;
    paginationService: PaginationService;
  };
  serviceList: any[] = [];
  showPagination = false;
  subscriptions: Array<EventSubscription | IDisposable> = [];

  // components / plugins
  slickEmptyWarning: SlickEmptyWarningComponent | undefined;
  slickFooter: SlickFooterComponent | undefined;
  paginationComponent: BasePaginationComponent | undefined;
  slickPagination: BasePaginationComponent | undefined;
  slickRowDetailView?: SlickRowDetailView;

  // services
  backendUtilityService!: BackendUtilityService;
  collectionService: CollectionService;
  extensionService: ExtensionService;
  extensionUtility: ExtensionUtility;
  filterFactory!: FilterFactory;
  filterService: FilterService;
  gridContainer!: HTMLDivElement;
  gridEventService: GridEventService;
  gridService: GridService;
  gridStateService: GridStateService;
  headerGroupingService: HeaderGroupingService;
  paginationService: PaginationService;
  resizerService!: ResizerService;
  rxjs?: RxJsFacade;
  sharedService: SharedService;
  sortService: SortService;
  treeDataService: TreeDataService;

  @bindable({ mode: BindingMode.twoWay }) columnDefinitions: Column[] = [];
  @bindable({ mode: BindingMode.twoWay }) element!: Element;
  @bindable({ mode: BindingMode.twoWay }) dataview!: SlickDataView;
  @bindable({ mode: BindingMode.twoWay }) grid!: SlickGrid;
  @bindable({ mode: BindingMode.twoWay }) paginationOptions: Pagination | undefined;
  @bindable({ mode: BindingMode.twoWay }) totalItems = 0;
  @bindable({ mode: BindingMode.fromView }) extensions!: ExtensionList<any>;
  @bindable({ mode: BindingMode.fromView }) instances: AureliaGridInstance | null = null;
  @bindable() customDataView?: SlickDataView;
  @bindable() dataset: any[] = [];
  @bindable() datasetHierarchical?: any[] | null;
  @bindable() gridId = '';
  @bindable() gridOptions: GridOption = {};

  constructor(
    protected readonly aureliaUtilService: AureliaUtilService = resolve(AureliaUtilService),
    protected readonly observerLocator: IObserverLocator = resolve(IObserverLocator),
    protected readonly container: IContainer = resolve(IContainer),
    protected readonly elm: HTMLElement = resolve(HTMLElement),
    protected readonly globalEa: IEventAggregator = resolve(IEventAggregator),
    protected readonly containerService: ContainerService = resolve(ContainerService),
    protected readonly translaterService: TranslaterService = resolve(TranslaterService)
  ) {
    const slickgridConfig = new SlickgridConfig();

    // initialize and assign all Service Dependencies
    this._eventPubSubService = new EventPubSubService(this.elm);
    this._eventPubSubService.eventNamingStyle = EventNamingStyle.camelCase;

    this.backendUtilityService = new BackendUtilityService();
    this.gridEventService = new GridEventService();
    this.sharedService = new SharedService();
    this.collectionService = new CollectionService(this.translaterService);
    this.extensionUtility = new ExtensionUtility(this.sharedService, this.backendUtilityService, this.translaterService);
    this.filterFactory = new FilterFactory(slickgridConfig, this.translaterService, this.collectionService);
    this.filterService = new FilterService(this.filterFactory as any, this._eventPubSubService, this.sharedService, this.backendUtilityService);
    this.resizerService = new ResizerService(this._eventPubSubService);
    this.sortService = new SortService(this.collectionService, this.sharedService, this._eventPubSubService, this.backendUtilityService);
    this.treeDataService = new TreeDataService(this._eventPubSubService, this.sharedService, this.sortService);
    this.paginationService = new PaginationService(this._eventPubSubService, this.sharedService, this.backendUtilityService);

    this.extensionService = new ExtensionService(
      this.extensionUtility,
      this.filterService,
      this._eventPubSubService,
      this.sharedService,
      this.sortService,
      this.treeDataService,
      this.translaterService,
      () => this.gridService
    );

    this.gridStateService = new GridStateService(this.extensionService, this.filterService, this._eventPubSubService, this.sharedService, this.sortService, this.treeDataService);
    this.gridService = new GridService(this.gridStateService, this.filterService, this._eventPubSubService, this.paginationService, this.sharedService, this.sortService, this.treeDataService);
    this.headerGroupingService = new HeaderGroupingService(this.extensionUtility);

    this.serviceList = [
      this.extensionService,
      this.filterService,
      this.gridEventService,
      this.gridService,
      this.gridStateService,
      this.headerGroupingService,
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
    this.containerService.registerInstance('HeaderGroupingService', this.headerGroupingService);
    this.containerService.registerInstance('PaginationService', this.paginationService);
    this.containerService.registerInstance('ResizerService', this.resizerService);
    this.containerService.registerInstance('SharedService', this.sharedService);
    this.containerService.registerInstance('SortService', this.sortService);
    this.containerService.registerInstance('EventPubSubService', this._eventPubSubService);
    this.containerService.registerInstance('PubSubService', this._eventPubSubService);
    this.containerService.registerInstance('TranslaterService', this.translaterService);
    this.containerService.registerInstance('TreeDataService', this.treeDataService);
  }

  get backendService(): BackendService | undefined {
    return this.gridOptions.backendServiceApi?.service;
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
    if (!this.columnDefinitions) {
      throw new Error('Using `<aurelia-slickgrid>` requires `column-definitions.bind`, it seems that you might have forgot to provide the missing bindable model.');
    }

    this._eventHandler = new SlickEventHandler();
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

    // add dark mode CSS class when enabled
    if (this.gridOptions.darkMode) {
      this.setDarkMode(true);
    }

    this.suggestDateParsingWhenHelpful();
  }

  initialization(eventHandler: SlickEventHandler) {
    if (!this.gridOptions || !this.columnDefinitions) {
      throw new Error('Using `<aurelia-slickgrid>` requires `column-definitions.bind="columnDefinitions"` and `grid-options.bind="gridOptions"`, it seems that you might have forgot to provide them since at least of them is undefined.');
    }

    this.gridOptions.translater = this.translaterService;
    this._eventHandler = eventHandler;
    this._isAutosizeColsCalled = false;

    // when detecting a frozen grid, we'll automatically enable the mousewheel scroll handler so that we can scroll from both left/right frozen containers
    if (this.gridOptions && ((this.gridOptions.frozenRow !== undefined && this.gridOptions.frozenRow >= 0) || this.gridOptions.frozenColumn !== undefined && this.gridOptions.frozenColumn >= 0) && this.gridOptions.enableMouseWheelScrollHandler === undefined) {
      this.gridOptions.enableMouseWheelScrollHandler = true;
    }

    this._eventPubSubService.eventNamingStyle = this.gridOptions?.eventNamingStyle ?? EventNamingStyle.camelCase;
    this._eventPubSubService.publish('onBeforeGridCreate', true);

    // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
    this._dataset ||= [];
    this._currentDatasetLength = this._dataset.length;
    this.gridOptions = this.mergeGridOptions(this.gridOptions);
    this._paginationOptions = this.gridOptions?.pagination;
    this.locales = this.gridOptions?.locales ?? Constants.locales;
    this.backendServiceApi = this.gridOptions?.backendServiceApi;
    this._isLocalGrid = !this.backendServiceApi; // considered a local grid if it doesn't have a backend service set

    // unless specified, we'll create an internal postProcess callback (currently only available for GraphQL)
    if (this.gridOptions.backendServiceApi && !this.gridOptions.backendServiceApi?.disableInternalPostProcess) {
      this.createBackendApiInternalPostProcessCallback(this.gridOptions);
    }

    if (!this.customDataView) {
      const dataviewInlineFilters = this.gridOptions.dataView && this.gridOptions.dataView.inlineFilters || false;
      let dataViewOptions: Partial<DataViewOption> = { ...this.gridOptions.dataView, inlineFilters: dataviewInlineFilters };

      if (this.gridOptions.draggableGrouping || this.gridOptions.enableGrouping) {
        this.groupItemMetadataProvider = new SlickGroupItemMetadataProvider();
        this.sharedService.groupItemMetadataProvider = this.groupItemMetadataProvider;
        dataViewOptions = { ...dataViewOptions, groupItemMetadataProvider: this.groupItemMetadataProvider };
      }
      this.dataview = new SlickDataView(dataViewOptions, this._eventPubSubService);
      this._eventPubSubService.publish('onDataviewCreated', this.dataview);
    }

    // get any possible Services that user want to register which don't require SlickGrid to be instantiated
    // RxJS Resource is in this lot because it has to be registered before anything else and doesn't require SlickGrid to be initialized
    this.preRegisterResources();

    // prepare and load all SlickGrid editors, if an async editor is found then we'll also execute it.
    // Wrap each editor class in the Factory resolver so consumers of this library can use
    // dependency injection. Aurelia will resolve all dependencies when we pass the container
    // and allow slickgrid to pass its arguments to the editors constructor last
    // when slickgrid creates the editor
    // https://github.com/aurelia/dependency-injection/blob/master/src/resolvers.js
    this._columnDefinitions = this.loadSlickGridEditors(this._columnDefinitions);

    // if the user wants to automatically add a Custom Editor Formatter, we need to call the auto add function again
    if (this.gridOptions.autoAddCustomEditorFormatter) {
      autoAddEditorFormatterToColumnsWithEditor(this._columnDefinitions, this.gridOptions.autoAddCustomEditorFormatter);
    }

    // save reference for all columns before they optionally become hidden/visible
    this.sharedService.allColumns = this._columnDefinitions;
    this.sharedService.visibleColumns = this._columnDefinitions;

    // TODO: revisit later, this conflicts with Grid State (Example 15)
    // before certain extentions/plugins potentially adds extra columns not created by the user itself (RowMove, RowDetail, RowSelections)
    // we'll subscribe to the event and push back the change to the user so they always use full column defs array including extra cols
    // this.subscriptions.push(
    //   this._eventPubSubService.subscribe<{ columns: Column[]; grid: SlickGrid }>('onPluginColumnsChanged', data => {
    //     this.columnDefinitions = data.columns;
    //     this.columnDefinitionsChanged();
    //   })
    // );

    // after subscribing to potential columns changed, we are ready to create these optional extensions
    // when we did find some to create (RowMove, RowDetail, RowSelections), it will automatically modify column definitions (by previous subscribe)
    this.extensionService.createExtensionsBeforeGridCreation(this._columnDefinitions, this.gridOptions);

    // if user entered some Pinning/Frozen "presets", we need to apply them in the grid options
    if (this.gridOptions.presets?.pinning) {
      this.gridOptions = { ...this.gridOptions, ...this.gridOptions.presets.pinning };
    }

    // build SlickGrid Grid, also user might optionally pass a custom dataview (e.g. remote model)
    this.grid = new SlickGrid(this.gridContainer, this.customDataView || this.dataview, this._columnDefinitions, this.gridOptions, this._eventPubSubService); this.sharedService.dataView = this.dataview;
    this.sharedService.slickGrid = this.grid;
    this.sharedService.gridContainerElement = this.elm as HTMLDivElement;
    if (this.groupItemMetadataProvider) {
      this.grid.registerPlugin(this.groupItemMetadataProvider); // register GroupItemMetadataProvider when Grouping is enabled
    }

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
    this._eventPubSubService.publish('onGridCreated', this.grid);

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
      dispose: this.disposeInstance.bind(this),

      // return all available Services (non-singleton)
      backendService: this.backendService,
      eventPubSubService: this._eventPubSubService,
      filterService: this.filterService,
      gridEventService: this.gridEventService,
      gridStateService: this.gridStateService,
      gridService: this.gridService,
      groupingService: this.headerGroupingService,
      headerGroupingService: this.headerGroupingService,
      extensionService: this.extensionService,
      paginationComponent: this.slickPagination,
      paginationService: this.paginationService,
      resizerService: this.resizerService,
      sortService: this.sortService,
      treeDataService: this.treeDataService,
    };

    // addons (SlickGrid extra plugins/controls)
    this.extensions = this.extensionService?.extensionList;

    // all instances (SlickGrid, DataView & all Services)
    this.instances = aureliaElementInstance;
    this._eventPubSubService.publish('onAureliaGridCreated', aureliaElementInstance);
  }

  /** Do not confuse with the Aurelia hook - it's been renamed */
  detaching(shouldEmptyDomElementContainer = false) {
    this._eventPubSubService.publish('onBeforeGridDestroy', this.grid);
    this._eventHandler?.unsubscribeAll();

    // we could optionally also empty the content of the grid container DOM element
    if (shouldEmptyDomElementContainer) {
      this.emptyGridContainerElm();
    }

    this._eventPubSubService.publish('onAfterGridDestroyed', true);

    // dispose of all Services
    this.serviceList.forEach((service: any) => {
      if (service?.dispose) {
        service.dispose();
      }
    });
    this.serviceList = [];

    // dispose backend service when defined and a dispose method exists
    this.backendService?.dispose?.();

    // dispose all registered external resources
    this.disposeExternalResources();

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
    this._columnDefinitionObserver?.unsubscribe(this._columnDefinitionsSubscriber);

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
    const gridContainerId = this.gridOptions?.gridContainerId || 'grid1';
    const gridContainerElm = document.querySelector(`#${gridContainerId}`) as HTMLDivElement;
    emptyElement(gridContainerElm);
  }

  /** Do not rename to `dispose` as it's an Aurelia hook */
  disposeInstance(shouldEmptyDomElementContainer = false) {
    this.detaching(shouldEmptyDomElementContainer);
  }

  disposeExternalResources() {
    if (Array.isArray(this._registeredResources)) {
      while (this._registeredResources.length > 0) {
        const res = this._registeredResources.pop();
        if (res?.dispose) {
          res.dispose();
        }
      }
    }
    this._registeredResources = [];
  }

  bound() {
    // get the grid options (order of precedence is Global Options first, then user option which could overwrite the Global options)
    this.gridOptions = { ...GlobalGridOptions, ...this.gridOptions };

    // in Au2, the xChanged is not fired upon initial component initialization which differs from Au1
    // we do however need this to happen, so we will call it manually
    this.columnDefinitionsChanged();

    // subscribe to column definitions assignment changes
    this.observeColumnDefinitions();
  }

  /** on columnDefinitions assignment and/or .slice() call */
  columnDefinitionsChanged() {
    this.columnDefinitionsHandler();
    this.observeColumnDefinitions();
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
    if (this.grid && this.gridOptions.autoFitColumnsOnFirstLoad && (!oldValue || oldValue.length < 1) && !this._isAutosizeColsCalled) {
      this.grid.autosizeColumns();
      this._isAutosizeColsCalled = true;
    }

    this.suggestDateParsingWhenHelpful();
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
      this.sortService.processTreeDataInitialSort();

      // we also need to reset/refresh the Tree Data filters because if we inserted new item(s) then it might not show up without doing this refresh
      // however we need to queue our process until the flat dataset is ready, so we can queue a microtask to execute the DataView refresh only after everything is ready
      queueMicrotask(() => {
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
   * Currently ONLY available with the GraphQL Backend Service.
   * The behavior is to refresh the Dataset & Pagination without requiring the user to create his own PostProcess every time
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
    }

    // on locale change, we have to manually translate the Headers, GridMenu
    this.subscriptions.push(
      this.globalEa.subscribe('i18n:locale:changed', (args: { oldLocale: string; newLocale: string; }) => {
        // publish event of the same name that Slickgrid-Universal uses on a language change event
        this._eventPubSubService.publish('onLanguageChange');

        if (gridOptions.enableTranslate) {
          this.extensionService.translateAllExtensions(args.newLocale);
          if ((gridOptions.createPreHeaderPanel && gridOptions.createTopHeaderPanel) || (gridOptions.createPreHeaderPanel && !gridOptions.enableDraggableGrouping)) {
            this.headerGroupingService.translateHeaderGrouping();
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

        // when column are reordered, we need to update the visibleColumn array
        this._eventHandler.subscribe(grid.onColumnsReordered, (_e, args) => {
          this.sharedService.hasColumnsReordered = true;
          this.sharedService.visibleColumns = args.impactedColumns;
        });

        this._eventHandler.subscribe(grid.onSetOptions, (_e, args) => {
          // add/remove dark mode CSS class when enabled
          if (args.optionsBefore.darkMode !== args.optionsAfter.darkMode && this.sharedService.gridContainerElement) {
            this.setDarkMode(args.optionsAfter.darkMode);
          }
        });

        // load any presets if any (after dataset is initialized)
        this.loadColumnPresetsWhenDatasetInitialized();
        this.loadFilterPresetsWhenDatasetInitialized();

        // When data changes in the DataView, we need to refresh the metrics and/or display a warning if the dataset is empty
        this._eventHandler.subscribe(dataView.onRowCountChanged, (_e, args) => {
          if (!gridOptions.enableRowDetailView || !Array.isArray(args.changedRows) || args.changedRows.length === args.itemCount) {
            grid.invalidate();
          } else {
            grid.invalidateRows(args.changedRows);
            grid.render();
          }
          this.handleOnItemCountChanged(dataView.getFilteredItemCount() || 0, dataView.getItemCount() || 0);
        });
        this._eventHandler.subscribe(dataView.onSetItemsCalled, (_e, args) => {
          this.sharedService.isItemsDateParsed = false;
          this.handleOnItemCountChanged(dataView.getFilteredItemCount() || 0, args.itemCount);

          // when user has resize by content enabled, we'll force a full width calculation since we change our entire dataset
          if (args.itemCount > 0 && (this.gridOptions.autosizeColumnsByCellContentOnFirstLoad || this.gridOptions.enableAutoResizeColumnsByCellContent)) {
            this.resizerService.resizeColumnsByCellContent(!this.gridOptions?.resizeByContentOnlyOnFirstLoad);
          }
        });

        if (gridOptions?.enableFiltering && !gridOptions.enableRowDetailView) {
          this._eventHandler.subscribe(dataView.onRowsChanged, (_e, { calledOnRowCountChanged, rows }) => {
            // filtering data with local dataset will not always show correctly unless we call this updateRow/render
            // also don't use "invalidateRows" since it destroys the entire row and as bad user experience when updating a row
            // see commit: https://github.com/ghiscoding/aurelia-slickgrid/commit/8c503a4d45fba11cbd8d8cc467fae8d177cc4f60
            if (!calledOnRowCountChanged && Array.isArray(rows)) {
              const ranges = grid.getRenderedRange();
              rows
                .filter(row => row >= ranges.top && row <= ranges.bottom)
                .forEach((row: number) => grid.updateRow(row));
              grid.render();
            }
          });
        }
      }
    }

    // @deprecated @user `dataview.globalItemMetadataProvider.getRowMetadata`
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
        if (backendApiService.updatePagination && gridOptions.presets.pagination && !this.hasBackendInfiniteScroll()) {
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

        // wrap this inside a microtask to be executed at the end of the task and avoid timing issue since the gridOptions needs to be ready before running this onInit
        queueMicrotask(() => {
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

      // when user enables Infinite Scroll
      if (backendApi.service.options?.infiniteScroll) {
        this.addBackendInfiniteScrollCallback();
      }
    }
  }

  protected addBackendInfiniteScrollCallback(): void {
    if (this.grid && this.gridOptions.backendServiceApi && this.hasBackendInfiniteScroll() && !this.gridOptions.backendServiceApi?.onScrollEnd) {
      const onScrollEnd = () => {
        this.backendUtilityService.setInfiniteScrollBottomHit(true);

        // even if we're not showing pagination, we still use pagination service behind the scene
        // to keep track of the scroll position and fetch next set of data (aka next page)
        // we also need a flag to know if we reached the of the dataset or not (no more pages)
        this.paginationService.goToNextPage().then(hasNext => {
          if (!hasNext) {
            this.backendUtilityService.setInfiniteScrollBottomHit(false);
          }
        });
      };
      this.gridOptions.backendServiceApi.onScrollEnd = onScrollEnd;

      // subscribe to SlickGrid onScroll to determine when reaching the end of the scroll bottom position
      // run onScrollEnd() method when that happens
      this._eventHandler.subscribe(this.grid.onScroll, (_e, args) => {
        const viewportElm = args.grid.getViewportNode()!;
        if (
          ['mousewheel', 'scroll'].includes(args.triggeredBy || '')
          && this.paginationService?.totalItems
          && args.scrollTop > 0
          && Math.ceil(viewportElm.offsetHeight + args.scrollTop) >= args.scrollHeight
        ) {
          if (!this._scrollEndCalled) {
            onScrollEnd();
            this._scrollEndCalled = true;
          }
        }
      });

      // use postProcess to identify when scrollEnd process is finished to avoid calling the scrollEnd multiple times
      // we also need to keep a ref of the user's postProcess and call it after our own postProcess
      const orgPostProcess = this.gridOptions.backendServiceApi.postProcess;
      this.gridOptions.backendServiceApi.postProcess = (processResult: any) => {
        this._scrollEndCalled = false;
        if (orgPostProcess) {
          orgPostProcess(processResult);
        }
      };
    }
  }

  bindResizeHook(grid: SlickGrid, options: GridOption) {
    if ((options.autoFitColumnsOnFirstLoad && options.autosizeColumnsByCellContentOnFirstLoad) || (options.enableAutoSizeColumns && options.enableAutoResizeColumnsByCellContent)) {
      throw new Error(`[Aurelia-Slickgrid] You cannot enable both autosize/fit viewport & resize by content, you must choose which resize technique to use. You can enable these 2 options ("autoFitColumnsOnFirstLoad" and "enableAutoSizeColumns") OR these other 2 options ("autosizeColumnsByCellContentOnFirstLoad" and "enableAutoResizeColumnsByCellContent").`);
    }

    // auto-resize grid on browser resize
    if (options.gridHeight || options.gridWidth) {
      this.resizerService.resizeGrid(0, { height: options.gridHeight, width: options.gridWidth });
    } else {
      this.resizerService.resizeGrid();
    }

    // expand/autofit columns on first page load
    if (grid && options?.enableAutoResize && options.autoFitColumnsOnFirstLoad && options.enableAutoSizeColumns && !this._isAutosizeColsCalled) {
      grid.autosizeColumns();
      this._isAutosizeColsCalled = true;
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
   * Also if we use Row Selection or the Checkbox Selector with a Backend Service (Odata, GraphQL), we need to reset any selection
   */
  paginationChanged(pagination: PaginationMetadata) {
    const isSyncGridSelectionEnabled = this.gridStateService?.needToPreserveRowSelection() ?? false;
    if (this.grid && !isSyncGridSelectionEnabled && this.gridOptions?.backendServiceApi && (this.gridOptions.enableRowSelection || this.gridOptions.enableCheckboxSelector)) {
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

      // display the Pagination component only after calling this refresh data first, we call it here so that if we preset pagination page number it will be shown correctly
      this.showPagination = !!(this.gridOptions && (this.gridOptions.enablePagination || (this.gridOptions.backendServiceApi && this.gridOptions.enablePagination === undefined)));

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
    this.grid.setHeaderRowVisibility(showing);
    if (showing === true && this._isGridInitialized) {
      this.grid.setColumns(this.columnDefinitions);
    }
    return showing;
  }

  setData(data: any[], shouldAutosizeColumns = false) {
    if (shouldAutosizeColumns) {
      this._isAutosizeColsCalled = false;
      this._currentDatasetLength = 0;
    }
    this.dataset = data || [];
  }

  /**
   * Check if there's any Pagination Presets defined in the Grid Options,
   * if there are then load them in the paginationOptions object
   */
  protected setPaginationOptionsWhenPresetDefined(gridOptions: GridOption, paginationOptions: Pagination): Pagination {
    if (gridOptions.presets?.pagination && gridOptions.pagination) {
      if (this.hasBackendInfiniteScroll()) {
        console.warn('[Aurelia-Slickgrid] `presets.pagination` is not supported with Infinite Scroll, reverting to first page.');
      } else {
        paginationOptions.pageSize = gridOptions.presets.pagination.pageSize;
        paginationOptions.pageNumber = gridOptions.presets.pagination.pageNumber;
      }
    }
    return paginationOptions;
  }

  setDarkMode(dark = false) {
    if (dark) {
      this.sharedService.gridContainerElement?.classList.add('slick-dark-mode');
    } else {
      this.sharedService.gridContainerElement?.classList.remove('slick-dark-mode');
    }
  }

  /**
   * Dynamically change or update the column definitions list.
   * We will re-render the grid so that the new header and data shows up correctly.
   * If using i18n, we also need to trigger a re-translate of the column headers
   */
  updateColumnDefinitionsList(newColumnDefinitions: Column[]) {
    if (newColumnDefinitions) {
      // map the Editor model to editorClass and load editor collectionAsync
      newColumnDefinitions = this.loadSlickGridEditors(newColumnDefinitions);

      // if the user wants to automatically add a Custom Editor Formatter, we need to call the auto add function again
      if (this.gridOptions.autoAddCustomEditorFormatter) {
        autoAddEditorFormatterToColumnsWithEditor(newColumnDefinitions, this.gridOptions.autoAddCustomEditorFormatter);
      }

      if (this.gridOptions.enableTranslate) {
        this.extensionService.translateColumnHeaders(undefined, newColumnDefinitions);
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
  // protected functions
  // ------------------

  /** handler for when column definitions changes */
  protected columnDefinitionsHandler() {
    this._columnDefinitions = this.columnDefinitions;
    if (this._isGridInitialized) {
      this.updateColumnDefinitionsList(this.columnDefinitions);
    }
    if (this._columnDefinitions.length > 0) {
      this.copyColumnWidthsReference(this._columnDefinitions);
    }
  }

  /**
   * assignment changes are not triggering a "columnDefinitionsChanged" event https://stackoverflow.com/a/30286225/1212166
   * we can use array observer for these other changes done via (push, pop, ...)
   * see docs https://docs.aurelia.io/components/bindable-properties#calling-a-change-function-when-bindable-is-modified
   */
  protected observeColumnDefinitions() {
    this._columnDefinitionObserver?.unsubscribe(this._columnDefinitionsSubscriber);
    this._columnDefinitionObserver = this.observerLocator.getArrayObserver(this.columnDefinitions);
    this._columnDefinitionObserver.subscribe(this._columnDefinitionsSubscriber);
  }

  /**
   * Loop through all column definitions and copy the original optional `width` properties optionally provided by the user.
   * We will use this when doing a resize by cell content, if user provided a `width` it won't override it.
   */
  protected copyColumnWidthsReference(columnDefinitions: Column[]) {
    columnDefinitions.forEach(col => col.originalWidth = col.width);
  }

  protected displayEmptyDataWarning(showWarning = true) {
    this.slickEmptyWarning?.showEmptyDataMessage(showWarning);
  }

  /** When data changes in the DataView, we'll refresh the metrics and/or display a warning if the dataset is empty */
  protected handleOnItemCountChanged(currentPageRowItemCount: number, totalItemCount: number) {
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

    // when autoResize.autoHeight is enabled, we'll want to call a resize
    if (this.gridOptions.enableAutoResize && this.resizerService.isAutoHeightEnabled && currentPageRowItemCount > 0) {
      this.resizerService.resizeGrid();
    }
  }

  /** Initialize the Pagination Service once */
  protected initializePaginationService(paginationOptions: Pagination) {
    if (this.gridOptions) {
      this.paginationData = {
        gridOptions: this.gridOptions,
        paginationService: this.paginationService,
      };
      this.paginationService.totalItems = this.totalItems;
      this.paginationService.init(this.grid, paginationOptions, this.backendServiceApi);
      this.subscriptions.push(
        this._eventPubSubService.subscribe('onPaginationChanged', (paginationChanges: PaginationMetadata) => this.paginationChanged(paginationChanges)),
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
  protected loadEditorCollectionAsync(column: Column) {
    if (column?.editor) {
      const collectionAsync = column.editor.collectionAsync;
      column.editor.disabled = true; // disable the Editor DOM element, we'll re-enable it after receiving the collection with "updateEditorCollection()"

      if (collectionAsync instanceof Promise) {
        // wait for the "collectionAsync", once resolved we will save it into the "collection"
        // the collectionAsync can be of 3 types HttpClient, HttpFetch or a Promise
        collectionAsync.then((response: any | any[]) => {
          if (Array.isArray(response)) {
            this.updateEditorCollection(column, response); // from Promise
          } else if (response instanceof Response && typeof response.json === 'function') {
            if (response.bodyUsed) {
              console.warn(`[Aurelia-SlickGrid] The response body passed to collectionAsync was already read. `
                + `Either pass the dataset from the Response or clone the response first using response.clone()`);
            } else {
              // from Fetch
              (response as Response).json().then(data => this.updateEditorCollection(column, data));
            }
          } else if (response?.content) {
            this.updateEditorCollection(column, response.content); // from http-client
          }
        });
      } else if (this.rxjs?.isObservable(collectionAsync)) {
        // wrap this inside a microtask at the end of the task to avoid timing issue since updateEditorCollection requires to call SlickGrid getColumns() method after columns are available
        queueMicrotask(() => {
          this.subscriptions.push(
            (collectionAsync as Observable<any>).subscribe((resolvedCollection) => this.updateEditorCollection(column, resolvedCollection))
          );
        });
      }
    }
  }

  protected insertDynamicPresetColumns(columnId: string, gridPresetColumns: Column[]) {
    if (this._columnDefinitions) {
      const columnPosition = this._columnDefinitions.findIndex(c => c.id === columnId);
      if (columnPosition >= 0) {
        const dynColumn = this._columnDefinitions[columnPosition];
        if (dynColumn?.id === columnId && !gridPresetColumns.some(c => c.id === columnId)) {
          columnPosition > 0
            ? gridPresetColumns.splice(columnPosition, 0, dynColumn)
            : gridPresetColumns.unshift(dynColumn);
        }
      }
    }
  }

  /** Load any possible Columns Grid Presets */
  protected loadColumnPresetsWhenDatasetInitialized() {
    // if user entered some Columns "presets", we need to reflect them all in the grid
    if (this.gridOptions.presets && Array.isArray(this.gridOptions.presets.columns) && this.gridOptions.presets.columns.length > 0) {
      const gridPresetColumns: Column[] = this.gridStateService.getAssociatedGridColumns(this.grid, this.gridOptions.presets.columns);
      if (gridPresetColumns && Array.isArray(gridPresetColumns) && gridPresetColumns.length > 0 && Array.isArray(this._columnDefinitions)) {
        // make sure that the dynamic columns are included in presets (1.Row Move, 2. Row Selection, 3. Row Detail)
        if (this.gridOptions.enableRowMoveManager) {
          const rmmColId = this.gridOptions?.rowMoveManager?.columnId ?? '_move';
          this.insertDynamicPresetColumns(rmmColId, gridPresetColumns);
        }
        if (this.gridOptions.enableCheckboxSelector) {
          const chkColId = this.gridOptions?.checkboxSelector?.columnId ?? '_checkbox_selector';
          this.insertDynamicPresetColumns(chkColId, gridPresetColumns);
        }
        if (this.gridOptions.enableRowDetailView) {
          const rdvColId = this.gridOptions?.rowDetailView?.columnId ?? '_detail_selector';
          this.insertDynamicPresetColumns(rdvColId, gridPresetColumns);
        }

        // keep copy the original optional `width` properties optionally provided by the user.
        // We will use this when doing a resize by cell content, if user provided a `width` it won't override it.
        gridPresetColumns.forEach(col => col.originalWidth = col.width);

        // finally set the new presets columns (including checkbox selector if need be)
        this.grid.setColumns(gridPresetColumns);
        this.sharedService.visibleColumns = gridPresetColumns;
      }
    }
  }

  /** Load any possible Filters Grid Presets */
  protected loadFilterPresetsWhenDatasetInitialized() {
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
  protected loadLocalGridPagination(dataset?: any[]) {
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
  protected loadRowSelectionPresetWhenExists() {
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

      // apply row selection when defined as grid presets
      if (this.grid && Array.isArray(gridRowIndexes)) {
        this.grid.setSelectedRows(gridRowIndexes);
        this.dataview!.setSelectedIds(dataContextIds || [], {
          isRowBeingAdded: true,
          shouldTriggerEvent: false, // do not trigger when presetting the grid
          applyRowSelectionToGrid: true
        });
      }
    }
  }

  hasBackendInfiniteScroll(gridOptions?: GridOption): boolean {
    return !!(gridOptions || this.gridOptions).backendServiceApi?.service.options?.infiniteScroll;
  }

  protected mergeGridOptions(gridOptions: GridOption): GridOption {
    gridOptions.gridId = this.gridId;
    gridOptions.gridContainerId = `slickGridContainer-${this.gridId}`;

    // use extend to deep merge & copy to avoid immutable properties being changed in GlobalGridOptions after a route change
    const options = extend(true, {}, GlobalGridOptions, gridOptions) as GridOption;

    // if we have a backendServiceApi and the enablePagination is undefined, we'll assume that we do want to see it, else get that defined value
    if (!this.hasBackendInfiniteScroll(gridOptions)) {
      gridOptions.enablePagination = !!((gridOptions.backendServiceApi && gridOptions.enablePagination === undefined) ? true : gridOptions.enablePagination);
    }

    // using copy extend to do a deep clone has an unwanted side on objects and pageSizes but ES6 spread has other worst side effects
    // so we will just overwrite the pageSizes when needed, this is the only one causing issues so far.
    // On a deep extend, Object and Array are extended, but object wrappers on primitive types such as String, Boolean, and Number are not.
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

  /** Add a register of a new external resource, user could also optional dispose all previous resources before pushing any new resources to the resources array list. */
  registerExternalResources(resources: ExternalResource[], disposePreviousResources = false) {
    if (disposePreviousResources) {
      this.disposeExternalResources();
    }
    resources.forEach(res => this._registeredResources.push(res));
    this.initializeExternalResources(resources);
  }

  resetExternalResources() {
    this._registeredResources = [];
  }

  protected initializeExternalResources(resources: ExternalResource[]) {
    if (Array.isArray(resources)) {
      for (const resource of resources) {
        if (this.grid && typeof resource.init === 'function') {
          resource.init(this.grid, this.containerService);
        }
      }
    }
  }

  /** Pre-Register any Resource that don't require SlickGrid to be instantiated (for example RxJS Resource & RowDetail) */
  protected preRegisterResources() {
    this._registeredResources = this.gridOptions?.externalResources || [];

    // bind & initialize all Components/Services that were tagged as enabled
    // register all services by executing their init method and providing them with the Grid object
    if (Array.isArray(this._registeredResources)) {
      for (const resource of this._registeredResources) {
        if (resource?.className === 'RxJsResource') {
          this.registerRxJsResource(resource as RxJsFacade);
        }
      }
    }

    if (this.gridOptions.enableRowDetailView && !this._registeredResources.some(r => r instanceof SlickRowDetailView)) {
      this.slickRowDetailView = new SlickRowDetailView(this.aureliaUtilService, this._eventPubSubService, this.elm as HTMLElement);
      this.slickRowDetailView.create(this.columnDefinitions, this.gridOptions);
      this.extensionService.addExtensionToList(ExtensionName.rowDetailView, { name: ExtensionName.rowDetailView, instance: this.slickRowDetailView });
    }
  }

  protected registerResources() {
    // at this point, we consider all the registered services as external services, anything else registered afterward aren't external
    if (Array.isArray(this._registeredResources)) {
      this.sharedService.externalRegisteredResources = this._registeredResources;
    }

    // push all other Services that we want to be registered
    if (!this._registeredResources.some(r => r instanceof GridService)) {
      this._registeredResources.push(this.gridService);
    }
    if (!this._registeredResources.some(r => r instanceof GridStateService)) {
      this._registeredResources.push(this.gridStateService);
    }

    // when using Grouping/DraggableGrouping/Colspan register its Service
    if (
      ((this.gridOptions.createPreHeaderPanel && this.gridOptions.createTopHeaderPanel) || (this.gridOptions.createPreHeaderPanel && !this.gridOptions.enableDraggableGrouping))
      && !this._registeredResources.some(r => r instanceof HeaderGroupingService)
    ) {
      this._registeredResources.push(this.headerGroupingService);
    }

    // when using Tree Data View, register its Service
    if (this.gridOptions.enableTreeData && !this._registeredResources.some(r => r instanceof TreeDataService)) {
      this._registeredResources.push(this.treeDataService);
    }

    // when user enables translation, we need to translate Headers on first pass & subsequently in the bindDifferentHooks
    if (this.gridOptions.enableTranslate) {
      this.extensionService.translateColumnHeaders();
    }

    // also initialize (render) the empty warning component
    if (!this._registeredResources.some(r => r instanceof SlickEmptyWarningComponent)) {
      this.slickEmptyWarning = new SlickEmptyWarningComponent();
      this._registeredResources.push(this.slickEmptyWarning);
    }

    // bind & initialize all Components/Services that were tagged as enabled
    // register all services by executing their init method and providing them with the Grid object
    this.initializeExternalResources(this._registeredResources);

    // initialize RowDetail separately since we already added it to the ExtensionList via `addExtensionToList()` but not in external resources,
    // because we don't want to dispose the extension/resource more than once (because externalResources/extensionList are both looping through their list to dispose of them)
    if (this.gridOptions.enableRowDetailView && this.slickRowDetailView) {
      this.slickRowDetailView.init(this.grid);
    }
  }

  /** Register the RxJS Resource in all necessary services which uses */
  protected registerRxJsResource(resource: RxJsFacade) {
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
  protected async renderPagination(showPagination = true) {
    if (this.grid && this.gridOptions?.enablePagination && !this._isPaginationInitialized && showPagination) {
      if (this.gridOptions.customPaginationComponent) {
        const paginationContainer = document.createElement('section');
        this.elm.appendChild(paginationContainer);
        const vm = await this.aureliaUtilService.createAureliaViewModelAddToSlot(this.gridOptions.customPaginationComponent!, undefined, paginationContainer);
        const elmBindingContext = vm?.controller?.children?.[0].scope.bindingContext;
        if (elmBindingContext) {
          this.instances!.paginationComponent = elmBindingContext as BasePaginationComponent;
          this.slickPagination = elmBindingContext as BasePaginationComponent;
        }
      } else {
        this.slickPagination = new SlickPaginationComponent();
      }

      if (this.slickPagination) {
        this.slickPagination.init(this.grid, this.paginationService, this._eventPubSubService, this.translaterService);
        this.slickPagination.renderPagination(this.elm.querySelector('div') as HTMLDivElement);
        this._isPaginationInitialized = true;
      }
    } else if (!showPagination) {
      this.slickPagination?.dispose();
      this._isPaginationInitialized = false;
    }
  }

  /**
   * Takes a flat dataset with parent/child relationship, sort it (via its tree structure) and return the sorted flat array
   * @param {Array<Object>} flatDatasetInput - flat dataset input
   * @param {Boolean} forceGridRefresh - optionally force a full grid refresh
   * @returns {Array<Object>} sort flat parent/child dataset
   */
  protected sortTreeDataset<T>(flatDatasetInput: T[], forceGridRefresh = false): T[] {
    const prevDatasetLn = this._currentDatasetLength;
    let sortedDatasetResult;
    let flatDatasetOutput: any[] = [];

    // if the hierarchical dataset was already initialized then no need to re-convert it, we can use it directly from the shared service ref
    if (this._isDatasetHierarchicalInitialized && this.datasetHierarchical) {
      sortedDatasetResult = this.treeDataService.sortHierarchicalDataset(this.datasetHierarchical);
      flatDatasetOutput = sortedDatasetResult.flat;
    } else if (Array.isArray(flatDatasetInput) && flatDatasetInput.length > 0) {
      // we need to first convert the flat dataset to a hierarchical dataset and then sort it
      // we'll also add props, by mutation, required by the TreeDataService on the flat array like `__hasChildren`, `parentId` and anything else to work properly
      sortedDatasetResult = this.treeDataService.convertFlatParentChildToTreeDatasetAndSort(flatDatasetInput, this._columnDefinitions, this.gridOptions);
      this.sharedService.hierarchicalDataset = sortedDatasetResult.hierarchical;
      flatDatasetOutput = sortedDatasetResult.flat;
    }

    // if we add/remove item(s) from the dataset, we need to also refresh our tree data filters
    if (flatDatasetInput.length > 0 && (forceGridRefresh || flatDatasetInput.length !== prevDatasetLn)) {
      this.filterService.refreshTreeDataFilters(flatDatasetOutput);
    }

    return flatDatasetOutput;
  }

  /** Prepare and load all SlickGrid editors, if an async editor is found then we'll also execute it. */
  protected loadSlickGridEditors(columnDefinitions: Column[]): Column[] {
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
        editorClass: column.editor && this.container.getFactory(column.editor.model).Type,
      };
    });
  }

  protected suggestDateParsingWhenHelpful() {
    if (this.dataview?.getItemCount() > WARN_NO_PREPARSE_DATE_SIZE && !this.gridOptions.silenceWarnings && !this.gridOptions.preParseDateColumns && this.grid.getColumns().some(c => isColumnDateType(c.type))) {
      console.warn(
        '[Slickgrid-Universal] For getting better perf, we suggest you enable the `preParseDateColumns` grid option, ' +
        'for more info visit => https://ghiscoding.gitbook.io/aurelia-slickgrid/column-functionalities/sorting#pre-parse-date-columns-for-better-perf'
      );
    }
  }

  /**
   * When the Editor(s) has a "editor.collection" property, we'll load the async collection.
   * Since this is called after the async call resolves, the pointer will not be the same as the "column" argument passed.
   */
  protected updateEditorCollection<T = any>(column: Column<T>, newCollection: T[]) {
    if (this.grid && column.editor) {
      column.editor.collection = newCollection;
      column.editor.disabled = false;

      // get current Editor, remove it from the DOM then re-enable it and re-render it with the new collection.
      const currentEditor = this.grid.getCellEditor() as AutocompleterEditor | SelectEditor;
      if (currentEditor?.disable && currentEditor?.renderDomElement) {
        currentEditor.destroy();
        currentEditor.disable(false);
        currentEditor.renderDomElement(newCollection);
      }
    }
  }
}
