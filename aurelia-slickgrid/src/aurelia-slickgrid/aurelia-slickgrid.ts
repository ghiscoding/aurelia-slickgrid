// import 3rd party vendor libs
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
import 'slickgrid/plugins/slick.cellcopymanager';
import 'slickgrid/plugins/slick.cellexternalcopymanager';
import 'slickgrid/plugins/slick.cellrangedecorator';
import 'slickgrid/plugins/slick.cellrangeselector';
import 'slickgrid/plugins/slick.cellselectionmodel';
import 'slickgrid/plugins/slick.checkboxselectcolumn';
import 'slickgrid/plugins/slick.headerbuttons';
import 'slickgrid/plugins/slick.headermenu';
import 'slickgrid/plugins/slick.rowmovemanager';
import 'slickgrid/plugins/slick.rowselectionmodel';

import { Container, Factory, bindable, bindingMode, inject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { GlobalGridOptions } from './global-grid-options';
import {
  BackendServiceOption,
  CellArgs,
  Column,
  FormElementType,
  GraphqlResult,
  GridOption,
  GridStateChange,
  GridStateType,
  Pagination,
} from './models/index';
import {
  ControlAndPluginService,
  ExportService,
  FilterService,
  GraphqlService,
  GridEventService,
  GridExtraService,
  GridStateService,
  ResizerService,
  SortService,
  toKebabCase
} from './services/index';
import * as $ from 'jquery';

// using external non-typed js libraries
declare var Slick: any;

const aureliaEventPrefix = 'asg';
const eventPrefix = 'sg';

// Aurelia doesn't support well TypeScript @autoinject in a Plugin so we'll do it the old fashion way
@inject(ControlAndPluginService, ExportService, Element, EventAggregator, FilterService, GraphqlService, GridEventService, GridExtraService, GridStateService, I18N, ResizerService, SortService, Container)
export class AureliaSlickgridCustomElement {
  private _dataset: any[];
  private _eventHandler: any = new Slick.EventHandler();
  gridStateSubscriber: Subscription;
  groupItemMetadataProvider: any;
  localeChangedSubscriber: Subscription;
  showPagination = false;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) element: Element;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dataset: any[];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) gridPaginationOptions: GridOption;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dataview: any;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) grid: any;
  @bindable() gridId: string;
  @bindable() columnDefinitions: Column[];
  @bindable() gridOptions: GridOption;
  @bindable() gridHeight: number;
  @bindable() gridWidth: number;
  @bindable() pickerOptions: any;

  constructor(
    private controlAndPluginService: ControlAndPluginService,
    private exportService: ExportService,
    private elm: Element,
    private ea: EventAggregator,
    private filterService: FilterService,
    private graphqlService: GraphqlService,
    private gridEventService: GridEventService,
    private gridExtraService: GridExtraService,
    private gridStateService: GridStateService,
    private i18n: I18N,
    private resizer: ResizerService,
    private sortService: SortService,
    private container: Container
  ) { }

  attached() {
    this.elm.dispatchEvent(new CustomEvent(`${eventPrefix}-on-before-grid-create`, {
      bubbles: true,
    }));
    this.ea.publish('onBeforeGridCreate', true);

    // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
    this._dataset = this._dataset || this.dataset || [];
    this.gridOptions = this.mergeGridOptions(this.gridOptions);
    this.createBackendApiInternalPostProcessCallback(this.gridOptions);

    if (this.gridOptions.enableGrouping) {
      this.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
      this.dataview = new Slick.Data.DataView({
        groupItemMetadataProvider: this.groupItemMetadataProvider,
        inlineFilters: true
      });
    } else {
      this.dataview = new Slick.Data.DataView();
    }
    this.controlAndPluginService.createPluginBeforeGridCreation(this.columnDefinitions, this.gridOptions);
    this.grid = new Slick.Grid(`#${this.gridId}`, this.dataview, this.columnDefinitions, this.gridOptions);
    this.controlAndPluginService.attachDifferentControlOrPlugins(this.grid, this.columnDefinitions, this.gridOptions, this.dataview, this.groupItemMetadataProvider);

    this.attachDifferentHooks(this.grid, this.gridOptions, this.dataview);

    this.grid.init();
    this.dataview.beginUpdate();
    this.dataview.setItems(this._dataset, this.gridOptions.datasetIdPropertyName);
    this.dataview.endUpdate();

    // publish certain events
    this.elm.dispatchEvent(new CustomEvent(`${eventPrefix}-on-grid-created`, {
      bubbles: true,
      detail: this.grid
    }));
    this.ea.publish('onGridCreated', this.grid);
    this.elm.dispatchEvent(new CustomEvent(`${eventPrefix}-on-dataview-created`, {
      bubbles: true,
      detail: this.dataview
    }));
    this.ea.publish('onDataviewCreated', this.dataview);

    // attach resize ONLY after the dataView is ready
    this.attachResizeHook(this.grid, this.gridOptions);

    // attach grid extra service
    this.gridExtraService.init(this.grid, this.columnDefinitions, this.gridOptions, this.dataview);

    // when user enables translation, we need to translate Headers on first pass & subsequently in the attachDifferentHooks
    if (this.gridOptions.enableTranslate) {
      this.controlAndPluginService.translateHeaders();
    }

    // if Export is enabled, initialize the service with the necessary grid and other objects
    if (this.gridOptions.enableExport) {
      this.exportService.init(this.grid, this.gridOptions, this.dataview);
    }

    // attach the Backend Service API callback functions only after the grid is initialized
    // because the preProcess() and onInit() might get triggered
    if (this.gridOptions && (this.gridOptions.backendServiceApi || this.gridOptions.onBackendEventApi)) {
      this.attachBackendCallbackFunctions(this.gridOptions);
    }

    this.gridStateService.init(this.grid, this.filterService, this.sortService);
  }

  detached() {
    this.ea.publish('onBeforeGridDestroy', this.grid);
    this.elm.dispatchEvent(new CustomEvent(`${eventPrefix}-on-before-grid-destroy`, {
      bubbles: true,
      detail: this.grid
    }));
    this.dataview = [];
    this._eventHandler.unsubscribeAll();
    this.controlAndPluginService.dispose();
    this.filterService.dispose();
    this.gridEventService.dispose();
    this.gridStateService.dispose();
    this.resizer.dispose();
    this.sortService.dispose();
    this.grid.destroy();
    this.gridStateSubscriber.dispose();
    this.localeChangedSubscriber.dispose();
    this.ea.publish('onAfterGridDestroyed', true);
    this.elm.dispatchEvent(new CustomEvent(`${eventPrefix}-on-after-grid-destroyed`, {
      bubbles: true,
      detail: this.grid
    }));
  }

  /**
   * Keep original value(s) that could be passed by the user ViewModel.
   * If nothing was passed, it will default to first option of select
   */
  bind(binding: any, contexts: any) {
    // get the grid options (priority is Global Options first, then user option which could overwrite the Global options)
    this.gridOptions = { ...GlobalGridOptions, ...binding.gridOptions };

    // Wrap each editor class in the Factory resolver so consumers of this library can use
    // dependency injection. Aurelia will resolve all dependencies when we pass the container
    // and allow slickgrid to pass its arguments to the editors constructor last
    // when slickgrid creates the editor
    // https://github.com/aurelia/dependency-injection/blob/master/src/resolvers.js
    for (const c of this.columnDefinitions) {
      if (c.editor) {
        c.editor = Factory.of(c.editor).get(this.container);
      }
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
   * Define what our internal Post Process callback, it will execute internally after we get back result from the Process backend call
   * For now, this is GraphQL Service only feautre and it will basically refresh the Dataset & Pagination without having the user to create his own PostProcess every time
   */
  createBackendApiInternalPostProcessCallback(gridOptions: GridOption) {
    if (gridOptions && (gridOptions.backendServiceApi || gridOptions.onBackendEventApi)) {
      const backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;

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
    this.localeChangedSubscriber = this.ea.subscribe('i18n:locale:changed', (payload: any) => {
      if (gridOptions.enableTranslate) {
        this.controlAndPluginService.translateHeaders();
        this.controlAndPluginService.translateColumnPicker();
        this.controlAndPluginService.translateGridMenu();
      }
    });

    // attach external sorting (backend) when available or default onSort (dataView)
    if (gridOptions.enableSorting) {
      (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) ? this.sortService.attachBackendOnSort(grid, dataView) : this.sortService.attachLocalOnSort(grid, dataView);
    }

    // attach external filter (backend) when available or default onFilter (dataView)
    if (gridOptions.enableFiltering) {
      this.filterService.init(grid, gridOptions, this.columnDefinitions);

      // if user entered some "presets", we need to reflect them all in the DOM
      if (gridOptions.presets && gridOptions.presets.filters) {
        this.filterService.populateColumnFilterSearchTerms(gridOptions, this.columnDefinitions);
      }
      (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) ? this.filterService.attachBackendOnFilter(grid, gridOptions) : this.filterService.attachLocalOnFilter(grid, gridOptions, this.dataview);
    }

    // if user set an onInit Backend, we'll run it right away (and if so, we also need to run preProcess, internalPostProcess & postProcess)
    if (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) {
      const backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
      if (gridOptions.onBackendEventApi) {
        console.warn(`"onBackendEventApi" has been DEPRECATED, please consider using "backendServiceApi" in the short term since "onBackendEventApi" will be removed in future versions. You can take look at the Aurelia-Slickgrid Wikis for OData/GraphQL Services implementation`);
      }

      if (backendApi && backendApi.service && backendApi.service.init) {
        backendApi.service.init(backendApi.options, gridOptions.pagination, this.grid);
      }
    }

    // expose all Slick Grid Events through dispatch
    for (const prop in grid) {
      if (grid.hasOwnProperty(prop) && prop.startsWith('on')) {
        this._eventHandler.subscribe(grid[prop], (e: any, args: any) => {
          this.elm.dispatchEvent(new CustomEvent(`${eventPrefix}-${toKebabCase(prop)}`, {
            bubbles: true,
            detail: {
              eventData: e,
              args
            }
          }));
        });
      }
    }

    // expose all Slick DataView Events through dispatch
    for (const prop in dataView) {
      if (dataView.hasOwnProperty(prop) && prop.startsWith('on')) {
        this._eventHandler.subscribe(dataView[prop], (e: any, args: any) => {
          this.elm.dispatchEvent(new CustomEvent(`${eventPrefix}-${toKebabCase(prop)}`, {
            bubbles: true,
            detail: {
              eventData: e,
              args
            }
          }));
        });
      }
    }

    // expose GridState Service changes event through dispatch
    this.gridStateSubscriber = this.ea.subscribe('gridStateService:changed', (gridStateChange: GridStateChange) => {
      this.elm.dispatchEvent(new CustomEvent(`${aureliaEventPrefix}-on-grid-state-service-changed`, {
        bubbles: true,
        detail: gridStateChange
      }));
    });

    // on cell click, mainly used with the columnDef.action callback
    this.gridEventService.attachOnCellChange(grid, this.gridOptions, dataView);
    this.gridEventService.attachOnClick(grid, this.gridOptions, dataView);

    this._eventHandler.subscribe(dataView.onRowCountChanged, (e: any, args: any) => {
      grid.updateRowCount();
      grid.render();
    });
    this._eventHandler.subscribe(dataView.onRowsChanged, (e: any, args: any) => {
      grid.invalidateRows(args.rows);
      grid.render();
    });
  }

  attachBackendCallbackFunctions(gridOptions: GridOption) {
    const backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
    const serviceOptions: BackendServiceOption = (backendApi && backendApi.service && backendApi.service.options) ? backendApi.service.options : {};
    const isExecuteCommandOnInit = (!serviceOptions) ? false : ((serviceOptions && serviceOptions.hasOwnProperty('executeProcessCommandOnInit')) ? serviceOptions['executeProcessCommandOnInit'] : true);

    // update backend filters (if need be) before the query runs
    if (backendApi) {
      const backendService = backendApi.service;
      if (gridOptions && gridOptions.presets) {
        if (backendService && backendService.updateFilters && gridOptions.presets.filters) {
          backendService.updateFilters(gridOptions.presets.filters, true);
        }
        if (backendService && backendService.updateSorters && gridOptions.presets.sorters) {
          backendService.updateSorters(undefined, gridOptions.presets.sorters);
        }
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
        if (backendApi.preProcess) {
          backendApi.preProcess();
        }

        // await for the Promise to resolve the data
        const processResult = await onInitPromise;

        // define what our internal Post Process callback, only available for GraphQL Service for now
        // it will basically refresh the Dataset & Pagination without having the user to create his own PostProcess every time
        if (processResult && backendApi && backendApi.service instanceof GraphqlService && backendApi.internalPostProcess) {
          backendApi.internalPostProcess(processResult);
        }

        // send the response process to the postProcess callback
        if (backendApi.postProcess) {
          backendApi.postProcess(processResult);
        }
      });
    }
  }

  attachResizeHook(grid: any, options: GridOption) {
    // expand/autofit columns on first page load
    if (grid && options.autoFitColumnsOnFirstLoad && typeof grid.autosizeColumns === 'function') {
      this.grid.autosizeColumns();
    }

    // auto-resize grid on browser resize
    this.resizer.init(grid, options);
    if (grid && options.enableAutoResize) {
      this.resizer.attachAutoResizeDataGrid();
      if (options.autoFitColumnsOnFirstLoad && typeof grid.autosizeColumns === 'function') {
        grid.autosizeColumns();
      }
    }
  }

  mergeGridOptions(gridOptions: GridOption): GridOption {
    gridOptions.gridId = this.gridId;
    gridOptions.gridContainerId = `slickGridContainer-${this.gridId}`;
    if (gridOptions.enableFiltering) {
      gridOptions.showHeaderRow = true;
    }
    // use jquery extend to deep merge and avoid immutable properties changed in GlobalGridOptions after route change
    return $.extend(true, {}, GlobalGridOptions, gridOptions);
  }

  paginationChanged(pagination: Pagination) {
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
    if (dataset && this.grid && this.dataview && typeof this.dataview.setItems === 'function') {
      this.dataview.setItems(dataset, this.gridOptions.datasetIdPropertyName);

      // this.grid.setData(dataset);
      this.grid.invalidate();
      this.grid.render();

      if (this.gridOptions.enablePagination || this.gridOptions.backendServiceApi) {
        // do we want to show pagination?
        // if we have a backendServiceApi and the enablePagination is undefined, we'll assume that we do want to see it, else get that defined value
        this.showPagination = ((this.gridOptions.backendServiceApi && this.gridOptions.enablePagination === undefined) ? true : this.gridOptions.enablePagination) || false;

        // before merging the grid options, make sure that it has the totalItems count
        // once we have that, we can merge and pass all these options to the pagination component
        if (!this.gridOptions.pagination) {
          this.gridOptions.pagination = (this.gridOptions.pagination) ? this.gridOptions.pagination : undefined;
        }
        if (this.gridOptions.pagination && totalCount) {
          this.gridOptions.pagination.totalItems = totalCount;
        }
        if (this.gridOptions.presets && this.gridOptions.presets.pagination && this.gridOptions.pagination) {
          this.gridOptions.pagination.pageSize = this.gridOptions.presets.pagination.pageSize;
          this.gridOptions.pagination.pageNumber = this.gridOptions.presets.pagination.pageNumber;
        }
        this.gridPaginationOptions = this.mergeGridOptions(this.gridOptions);
      }
      if (this.grid && this.gridOptions.enableAutoResize) {
        // resize the grid inside a slight timeout, in case other DOM element changed prior to the resize (like a filter/pagination changed)
        this.resizer.resizeGrid(1);
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
}
