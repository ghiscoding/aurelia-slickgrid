import {
  AureliaUtilService,
  Column,
  ColumnFilter,
  Filter,
  FilterArguments,
  FilterCallback,
  GridOption,
  OperatorType,
  OperatorString,
  SearchTerm,
} from '../../aurelia-slickgrid';
import * as $ from 'jquery';

import { CreatedView } from '../../aurelia-slickgrid/extensions';

export class CustomAureliaViewModelFilter implements Filter {
  private _clearFilterTriggered = false;
  private _shouldTriggerQuery = true;
  private $filterElm: any;
  container;
  grid: any;
  searchTerms: SearchTerm[];
  columnDef: Column;
  callback: FilterCallback;
  operator: OperatorType | OperatorString = OperatorType.equal;

  /** Aurelia ViewModel Reference */
  aureliaViewModel: any;
  aureliaCustomElementInstance: any;

  constructor() { }

  /** Angular Util Service (could be inside the Grid Options Params or the Filter Params ) */
  get aureliaUtilService(): AureliaUtilService {
    let aureliaUtilService = this.gridOptions && this.gridOptions.params && this.gridOptions.params.aureliaUtilService;
    if (!aureliaUtilService || !(aureliaUtilService instanceof AureliaUtilService)) {
      aureliaUtilService = this.columnFilter && this.columnFilter.params && this.columnFilter.params.aureliaUtilService;
    }
    return aureliaUtilService;
  }

  /** Get the Collection */
  get collection(): any[] {
    return this.columnFilter && this.columnFilter.collection || [];
  }

  /** Getter for the Column Filter */
  get columnFilter(): ColumnFilter {
    return this.columnDef && this.columnDef.filter || {};
  }

  /** Getter for the Grid Options pulled through the Grid Object */
  get gridOptions(): GridOption {
    return (this.grid && this.grid.getOptions) ? this.grid.getOptions() : {};
  }

  /**
   * Initialize the Filter
   */
  init(args: FilterArguments) {
    this.grid = args.grid;
    this.callback = args.callback;
    this.columnDef = args.columnDef;
    this.searchTerms = (args.hasOwnProperty('searchTerms') ? args.searchTerms : []) || [];

    if (!this.columnFilter || !this.columnFilter.params || !this.columnFilter.params.templateUrl) {
      throw new Error(`[Aurelia-Slickgrid] For the Filters.aureliaComponent to work properly, you need to fill in the "templateUrl" property of your Custom Element Filter.
      Example: this.columnDefs = [{ id: 'title', field: 'title', filter: { templateUrl: PLATFORM.moduleName('my-viewmodel'), collection: [...] },`);
    }

    if (this.columnFilter && this.columnFilter.params && this.columnFilter.params.templateUrl) {
      // use a delay to make sure AngAurelia ran at least a full cycle and it finished rendering the Component before hooking onto it
      // else we get the infamous error "ExpressionChangedAfterItHasBeenCheckedError"
      setTimeout(() => {
        this.container = this.grid.getHeaderRowColumn(this.columnDef.id);
        $(this.container).empty();

        // here we override the collection object of the Aurelia Custom Element
        // but technically you can pass any values you wish as bindings
        this.aureliaViewModel = (this.columnFilter.params.aureliaUtilService as AureliaUtilService).createAureliaViewModelAddToSlot(this.columnFilter.params.templateUrl, { collection: this.collection }, this.container, true);

        setTimeout(() => {
          this.aureliaCustomElementInstance = this.aureliaViewModel.view.children[0].children[0].container.viewModel;
          this.aureliaViewModel.view.children[0].children[0].container.viewModel.selectedItemChanged = ((item) => {
            this.callback(undefined, { columnDef: this.columnDef, operator: this.operator, searchTerms: [item.id], shouldTriggerQuery: this._shouldTriggerQuery });
            // reset flag for next use
            this._shouldTriggerQuery = true;
          });
        });
      });
    }
  }

  /**
   * Clear the filter value
   */
  clear(shouldTriggerQuery = true) {
    this._shouldTriggerQuery = shouldTriggerQuery;
    if (this.aureliaCustomElementInstance && this.aureliaCustomElementInstance.hasOwnProperty('selectedId')) {
      this.aureliaCustomElementInstance.selectedId = 0;
    }
  }

  /** destroy the Angular Component & Subscription */
  destroy() {
    if (this.aureliaViewModel && this.aureliaViewModel.dispose) {
      this.aureliaViewModel.dispose();
      this.disposeViewSlot(this.aureliaViewModel.viewSlot);
    }
  }

  /** Set value(s) on the DOM element */
  setValues(values) {
    if (this.aureliaCustomElementInstance && this.aureliaCustomElementInstance.hasOwnProperty('selectedId')) {
      this.aureliaCustomElementInstance.selectedId = values;
    }
  }

  disposeViewSlot(createdView: CreatedView) {
    if (createdView && createdView.view && createdView.viewSlot && createdView.view.unbind && createdView.viewSlot.remove) {
      if (this.container && this.container.length > 0) {
        createdView.viewSlot.remove(createdView.view);
        createdView.view.unbind();
        this.container[0].innerHTML = '';
        return createdView;
      }
    }
    return null;
  }
}
