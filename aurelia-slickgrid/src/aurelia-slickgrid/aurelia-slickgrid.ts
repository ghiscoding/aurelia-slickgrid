// import 3rd party vendor libs
import 'slickgrid/lib/jquery-ui-1.11.3';
import 'slickgrid/lib/jquery.event.drag-2.3.0';

import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';
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

import { bindable, bindingMode, inject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { GlobalGridOptions } from './global-grid-options';
import { BackendServiceOption, CellArgs, Column, FormElementType, GraphqlResult, GridOption } from './models/index';
import { ControlAndPluginService, FilterService, GraphqlService, GridEventService, GridExtraService, ResizerService, SortService } from './services/index';
import * as $ from 'jquery';

// using external js modules in Aurelia
declare var Slick: any;

@inject(ControlAndPluginService, Element, EventAggregator, FilterService, GraphqlService, GridEventService, GridExtraService, I18N, ResizerService, SortService)
export class AureliaSlickgridCustomElement {
  private _dataset: any[];
  private _gridOptions: GridOption;
  gridHeightString: string;
  gridWidthString: string;
  showPagination = false;
  style: any;

  @bindable({ defaultBindingMode: bindingMode.twoWay }) element: Element;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dataset: any[];
  @bindable({ defaultBindingMode: bindingMode.twoWay }) paginationOptions: GridOption;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) gridPaginationOptions: GridOption;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) dataview: any;
  @bindable({ defaultBindingMode: bindingMode.twoWay }) grid: any;
  @bindable() gridId: string;
  @bindable() columnDefinitions: Column[];
  @bindable() gridOptions: GridOption;
  @bindable() gridHeight = 100;
  @bindable() gridWidth = 600;
  @bindable() pickerOptions: any;

  constructor(
    private controlAndPluginService: ControlAndPluginService,
    private elm: Element,
    private ea: EventAggregator,
    private filterService: FilterService,
    private graphqlService: GraphqlService,
    private gridEventService: GridEventService,
    private gridExtraService: GridExtraService,
    private i18n: I18N,
    private resizer: ResizerService,
    private sortService: SortService) {

    // Aurelia doesn't support well TypeScript @autoinject so we'll do it the old fashion way
    this.controlAndPluginService = controlAndPluginService;
    this.elm = elm;
    this.ea = ea;
    this.filterService = filterService;
    this.graphqlService = graphqlService;
    this.gridEventService = gridEventService;
    this.gridExtraService = gridExtraService;
    this.i18n = i18n;
    this.resizer = resizer;
    this.sortService = sortService;
  }

  attached() {
    this.ea.publish('onBeforeGridCreate', true);

    // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
    this._dataset = this._dataset || [];
    this._gridOptions = this.mergeGridOptions();
    this.createBackendApiInternalPostProcessCallback(this._gridOptions);

    this.dataview = new Slick.Data.DataView();
    this.controlAndPluginService.createPluginBeforeGridCreation(this.columnDefinitions, this._gridOptions);
    this.grid = new Slick.Grid(`#${this.gridId}`, this.dataview, this.columnDefinitions, this._gridOptions);
    this.controlAndPluginService.attachDifferentControlOrPlugins(this.grid, this.columnDefinitions, this._gridOptions, this.dataview);

    this.attachDifferentHooks(this.grid, this._gridOptions, this.dataview);

    this.grid.init();
    this.dataview.beginUpdate();
    this.dataview.setItems(this._dataset);
    this.dataview.endUpdate();

    // publish certain events
    this.ea.publish('onGridCreated', this.grid);
    this.ea.publish('onDataviewCreated', this.dataview);

    // attach resize ONLY after the dataView is ready
    this.attachResizeHook(this.grid, this._gridOptions);

    // attach grid extra service
    const gridExtraService = this.gridExtraService.init(this.grid, this.columnDefinitions, this._gridOptions, this.dataview);

    // when user enables translation, we need to translate Headers on first pass & subsequently in the attachDifferentHooks
    if (this._gridOptions.enableTranslate) {
      this.controlAndPluginService.translateHeaders();
    }
  }

  detached() {
    this.ea.publish('onBeforeGridDestroy', this.grid);
    this.dataview = [];
    this.controlAndPluginService.destroy();
    this.filterService.destroy();
    this.resizer.destroy();
    this.sortService.destroy();
    this.grid.destroy();
    this.ea.publish('onAfterGridDestroyed', true);
  }

  /**
   * Keep original value(s) that could be passed by the user ViewModel.
   * If nothing was passed, it will default to first option of select
   */
  bind(binding: any, contexts: any) {
    // get the grid options (priority is Global Options first, then user option which could overwrite the Global options)
    this.gridOptions = { ...GlobalGridOptions, ...binding.gridOptions };

    this.style = {
      height: `${binding.gridHeight}px`,
      width: `${binding.gridWidth}px`
    };
  }

  unbind(binding: any, scope: any) {
    this.resizer.destroy();
  }

  datasetChanged(newValue: any[], oldValue: any[]) {
    this._dataset = newValue;
    this.refreshGridData(newValue);

    // expand/autofit columns on first page load
    // we can assume that if the oldValue was empty then we are on first load
    if (!oldValue || oldValue.length < 1) {
      if (this._gridOptions.autoFitColumnsOnFirstLoad) {
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
          if (!processResult || !processResult.data || !processResult.data[datasetName]) {
            throw new Error(`Your GraphQL result is invalid and/or does not follow the required result structure. Please check the result and/or review structure to use in Angular-Slickgrid Wiki in the GraphQL section.`);
          }
          this._dataset = processResult.data[datasetName].nodes;
          this.refreshGridData(this._dataset, processResult.data[datasetName].totalCount);
        };
      }
    }
  }

  attachDifferentHooks(grid: any, gridOptions: GridOption, dataView: any) {
    // on locale change, we have to manually translate the Headers, GridMenu
    this.ea.subscribe('i18n:locale:changed', (payload: any) => {
      if (gridOptions.enableTranslate) {
        this.controlAndPluginService.translateHeaders();
        this.controlAndPluginService.translateColumnPicker();
        this.controlAndPluginService.translateGridMenu();
      }
    });

    // attach external sorting (backend) when available or default onSort (dataView)
    if (gridOptions.enableSorting) {
      (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) ? this.sortService.attachBackendOnSort(grid, gridOptions) : this.sortService.attachLocalOnSort(grid, gridOptions, this.dataview);
    }

    // attach external filter (backend) when available or default onFilter (dataView)
    if (gridOptions.enableFiltering) {
      this.filterService.init(grid, gridOptions, this.columnDefinitions);
      (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) ? this.filterService.attachBackendOnFilter(grid, gridOptions) : this.filterService.attachLocalOnFilter(grid, gridOptions, this.dataview);
    }

    // if user set an onInit Backend, we'll run it right away (and if so, we also need to run preProcess, internalPostProcess & postProcess)
    if (gridOptions.backendServiceApi || gridOptions.onBackendEventApi) {
      if (gridOptions.onBackendEventApi) {
        console.warn(`"onBackendEventApi" has been DEPRECATED, please consider using "backendServiceApi" in the short term since "onBackendEventApi" will be removed in future versions. You can take look at the Angular-Slickgrid Wikis for OData/GraphQL Services implementation`);
      }

      if (gridOptions.backendServiceApi && gridOptions.backendServiceApi.service) {
        gridOptions.backendServiceApi.service.initOptions(gridOptions.backendServiceApi.options || {}, gridOptions.pagination);
      }

      const backendApi = gridOptions.backendServiceApi || gridOptions.onBackendEventApi;
      const serviceOptions: BackendServiceOption = (backendApi && backendApi.service && backendApi.service.options) ? backendApi.service.options : {};
      const isExecuteCommandOnInit = (!serviceOptions) ? false : ((serviceOptions && serviceOptions.hasOwnProperty('executeProcessCommandOnInit')) ? serviceOptions['executeProcessCommandOnInit'] : true);

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

    // on cell click, mainly used with the columnDef.action callback
    this.gridEventService.attachOnCellChange(grid, this._gridOptions, dataView);
    this.gridEventService.attachOnClick(grid, this._gridOptions, dataView);

    dataView.onRowCountChanged.subscribe((e: any, args: any) => {
      grid.updateRowCount();
      grid.render();
    });
    dataView.onRowsChanged.subscribe((e: any, args: any) => {
      grid.invalidateRows(args.rows);
      grid.render();
    });
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
    } else {
      this.resizer.resizeGrid(0, { height: this.gridHeight, width: this.gridWidth });
    }
  }

  mergeGridOptions(): GridOption {
    this.gridOptions.gridId = this.gridId;
    this.gridOptions.gridContainerId = `slickGridContainer-${this.gridId}`;
    if (this.gridOptions.enableFiltering) {
      this.gridOptions.showHeaderRow = true;
    }
    // use jquery extend to deep merge and avoid immutable properties changed in GlobalGridOptions after route change
    return $.extend(true, {}, GlobalGridOptions, this.gridOptions);
  }

  /**
   * When dataset changes, we need to refresh the entire grid UI & possibly resize it as well
   * @param {object} dataset
   */
  refreshGridData(dataset: any[], totalCount?: number) {
    if (dataset && this.grid) {
      this.dataview.setItems(dataset);

      // this.grid.setData(dataset);
      this.grid.invalidate();
      this.grid.render();

      if (this._gridOptions.enablePagination || this._gridOptions.backendServiceApi) {
        // do we want to show pagination?
        // if we have a backendServiceApi and the enablePagination is undefined, we'll assume that we do want to see it, else get that defined value
        this.showPagination = ((this._gridOptions.backendServiceApi && this._gridOptions.enablePagination === undefined) ? true : this._gridOptions.enablePagination) || false;

        // before merging the grid options, make sure that it has the totalItems count
        // once we have that, we can merge and pass all these options to the pagination component
        if (!this.gridOptions.pagination) {
          this.gridOptions.pagination = (this._gridOptions.pagination) ? this._gridOptions.pagination : undefined;
        }
        if (this.gridOptions.pagination && totalCount) {
          this.gridOptions.pagination.totalItems = totalCount;
        }
        this.gridPaginationOptions = this.mergeGridOptions();
      }
      if (this.grid && this._gridOptions.enableAutoResize) {
        // resize the grid inside a slight timeout, in case other DOM element changed prior to the resize (like a filter/pagination changed)
        this.resizer.resizeGrid(10);
        // this.grid.autosizeColumns();
      }
    }
  }

  /** Toggle the filter row displayed on first row */
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
