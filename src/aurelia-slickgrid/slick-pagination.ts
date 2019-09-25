import { bindable, inject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';
import { Constants } from './constants';
import { GridOption, Locale } from './models/index';
import { disposeAllSubscriptions } from './services/utilities';

const DEFAULT_AURELIA_EVENT_PREFIX = 'asg';

// using external non-typed js libraries
declare var Slick: any;

@inject(Element, EventAggregator, I18N)
export class SlickPaginationCustomElement {
  @bindable() dataview: any;
  @bindable() gridPaginationOptions: GridOption;
  private _aureliaEventPrefix = DEFAULT_AURELIA_EVENT_PREFIX;
  private _eventHandler = new Slick.EventHandler();
  private _gridPaginationOptions: GridOption;
  private _isFirstRender = true;
  private _locales: Locale;

  dataFrom = 1;
  dataTo = 1;
  itemsPerPage: number;
  pageCount = 0;
  pageNumber = 1;
  totalItems = 0;
  paginationCallback: () => void;
  paginationPageSizes = [25, 75, 100];
  subscriptions: Subscription[] = [];

  // text translations (handled by i18n or by custom locale)
  textItemsPerPage: string;
  textItems: string;
  textOf: string;
  textPage: string;

  constructor(private elm: Element, private ea: EventAggregator, private i18n: I18N) {
    // when using I18N, we'll translate necessary texts in the UI
    this.subscriptions.push(
      this.ea.subscribe('i18n:locale:changed', () => this.translateAllUiTexts(this._locales))
    );
  }

  bind(binding: any, contexts: any) {
    this._gridPaginationOptions = binding.gridPaginationOptions;
    if (this._gridPaginationOptions && this._gridPaginationOptions.enableTranslate && (!this.i18n || !this.i18n.tr)) {
      throw new Error('[Aurelia-Slickgrid] requires "I18N" to be installed and configured when the grid option "enableTranslate" is enabled.');
    }
    this._aureliaEventPrefix = (this._gridPaginationOptions && this._gridPaginationOptions.defaultAureliaEventPrefix) ? this._gridPaginationOptions.defaultAureliaEventPrefix : DEFAULT_AURELIA_EVENT_PREFIX;

    if (!binding.gridPaginationOptions || (binding.gridPaginationOptions.pagination && binding.gridPaginationOptions.pagination.totalItems !== this.totalItems)) {
      this.refreshPagination();
    } else if (binding.gridPaginationOptions.pagination.totalItems === 0) {
      this.recalculateFromToIndexes();
    }

    // Subscribe to Filter Clear & Changed and go back to page 1 when that happen
    this.subscriptions.push(this.ea.subscribe('filterService:filterChanged', () => this.refreshPagination(true)));
    this.subscriptions.push(this.ea.subscribe('filterService:filterCleared', () => this.refreshPagination(true)));

    // Subscribe to any dataview row count changed so that when Adding/Deleting item(s) through the DataView
    // that would trigger a refresh of the pagination numbers
    this.subscriptions.push(this.ea.subscribe(`${this._aureliaEventPrefix}:on-item-added`, (items: any | any[]) => this.onItemAddedOrRemoved(items, true)));
    this.subscriptions.push(this.ea.subscribe(`${this._aureliaEventPrefix}:on-item-deleted`, (items: any | any[]) => this.onItemAddedOrRemoved(items, false)));
  }

  gridPaginationOptionsChanged(newGridOptions: GridOption) {
    this._gridPaginationOptions = newGridOptions;
    if (newGridOptions) {
      this.refreshPagination();
      this._isFirstRender = false;
    }
  }

  detached() {
    this.dispose();
  }

  ceil(number: number) {
    return Math.ceil(number);
  }

  changeToFirstPage(event: any) {
    this.pageNumber = 1;
    this.onPageChanged(event, this.pageNumber);
  }

  changeToLastPage(event: any) {
    this.pageNumber = this.pageCount;
    this.onPageChanged(event, this.pageNumber);
  }

  changeToNextPage(event: any) {
    if (this.pageNumber < this.pageCount) {
      this.pageNumber++;
      this.onPageChanged(event, this.pageNumber);
    }
  }

  changeToPreviousPage(event: any) {
    if (this.pageNumber > 0) {
      this.pageNumber--;
      this.onPageChanged(event, this.pageNumber);
    }
  }

  changeToCurrentPage(event: any) {
    this.pageNumber = +((event && event.target && event.target.value) ? event.target.value : 1);
    if (this.pageNumber < 1) {
      this.pageNumber = 1;
    } else if (this.pageNumber > this.pageCount) {
      this.pageNumber = this.pageCount;
    }
    this.onPageChanged(event, this.pageNumber);
  }

  dispose() {
    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();

    // also dispose of all Subscriptions
    this.subscriptions = disposeAllSubscriptions(this.subscriptions);
  }

  onChangeItemPerPage(event: any) {
    const itemsPerPage = +event.target.value;
    this.pageCount = Math.ceil(this.totalItems / itemsPerPage);
    this.pageNumber = (this.totalItems > 0) ? 1 : 0;
    this.itemsPerPage = itemsPerPage;
    this.onPageChanged(event, this.pageNumber);
  }

  refreshPagination(isPageNumberReset: boolean = false) {
    const backendApi = this._gridPaginationOptions.backendServiceApi;
    if (!backendApi || !backendApi.service || !backendApi.process) {
      throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
    }

    // get locales provided by user in forRoot or else use default English locales via the Constants
    this._locales = this._gridPaginationOptions && this._gridPaginationOptions.locales || Constants.locales;

    // translate all the text using i18n or custom locales
    this.translateAllUiTexts(this._locales);

    if (this._gridPaginationOptions && this._gridPaginationOptions.pagination) {
      const pagination = this._gridPaginationOptions.pagination;
      // set the number of items per page if not already set
      if (!this.itemsPerPage) {
        this.itemsPerPage = +((backendApi && backendApi.options && backendApi.options.paginationOptions && backendApi.options.paginationOptions.first) ? backendApi.options.paginationOptions.first : this._gridPaginationOptions.pagination.pageSize);
      }

      // if totalItems changed, we should always go back to the first page and recalculation the From-To indexes
      if (isPageNumberReset || this.totalItems !== pagination.totalItems) {
        if (!isPageNumberReset && this._isFirstRender && pagination.pageNumber && pagination.pageNumber > 1) {
          this.pageNumber = pagination.pageNumber || 1;
          this._isFirstRender = false;
        } else {
          this.pageNumber = 1;
        }

        // when page number is set to 1 then also reset the "offset" of backend service
        if (this.pageNumber === 1) {
          backendApi.service.resetPaginationOptions();
        }
      }

      // calculate and refresh the multiple properties of the pagination UI
      this.paginationPageSizes = this._gridPaginationOptions.pagination.pageSizes;
      this.totalItems = this._gridPaginationOptions.pagination.totalItems;
      this.recalculateFromToIndexes();
    }
    this.pageCount = Math.ceil(this.totalItems / this.itemsPerPage);
  }

  async onPageChanged(event: Event | undefined, pageNumber: number) {
    this.recalculateFromToIndexes();

    const backendApi = this._gridPaginationOptions.backendServiceApi;
    if (!backendApi || !backendApi.service || !backendApi.process) {
      throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
    }

    if (this.dataTo > this.totalItems) {
      this.dataTo = this.totalItems;
    } else if (this.totalItems < this.itemsPerPage) {
      this.dataTo = this.totalItems;
    }

    if (backendApi) {
      try {
        const itemsPerPage = +this.itemsPerPage;

        // keep start time & end timestamps & return it after process execution
        const startTime = new Date();

        if (backendApi.preProcess) {
          backendApi.preProcess();
        }

        const query = backendApi.service.processOnPaginationChanged(event, { newPage: pageNumber, pageSize: itemsPerPage });

        // await for the Promise to resolve the data
        const processResult = await backendApi.process(query);
        const endTime = new Date();

        // from the result, call our internal post process to update the Dataset and Pagination info
        if (processResult && backendApi.internalPostProcess) {
          backendApi.internalPostProcess(processResult);
        }

        // send the response process to the postProcess callback
        if (backendApi.postProcess) {
          if (processResult instanceof Object) {
            processResult.metrics = {
              startTime,
              endTime,
              executionTime: endTime.valueOf() - startTime.valueOf(),
              itemCount: this.totalItems,
              totalItemCount: this.totalItems
            };
          }
          backendApi.postProcess(processResult);
        }
      } catch (e) {
        if (backendApi && backendApi.onError) {
          backendApi.onError(e);
        } else {
          throw e;
        }
      }
    } else {
      throw new Error('Pagination with a backend service requires "BackendServiceApi" to be defined in your grid options');
    }

    // dispatch the changes to the parent component
    this.elm.dispatchEvent(new CustomEvent(`${this._aureliaEventPrefix}-on-pagination-changed`, {
      bubbles: true,
      detail: {
        pageNumber: this.pageNumber,
        pageSizes: this.paginationPageSizes,
        pageSize: this.itemsPerPage,
        totalItems: this.totalItems
      }
    }));
  }

  recalculateFromToIndexes() {
    if (this.totalItems === 0) {
      this.dataFrom = 0;
      this.dataTo = 0;
      this.pageNumber = 0;
    } else {
      this.dataFrom = (this.pageNumber * this.itemsPerPage) - this.itemsPerPage + 1;
      this.dataTo = (this.totalItems < this.itemsPerPage) ? this.totalItems : (this.pageNumber * this.itemsPerPage);
    }
  }

  // --
  // private functions
  // --------------------

  /** Translate all the texts shown in the UI, use I18N service when available or custom locales when service is null */
  private translateAllUiTexts(locales: Locale) {
    if (this.i18n && this.i18n.tr) {
      this.textItemsPerPage = this.i18n.tr('ITEMS_PER_PAGE');
      this.textItems = this.i18n.tr('ITEMS');
      this.textOf = this.i18n.tr('OF');
      this.textPage = this.i18n.tr('PAGE');
    } else if (locales) {
      this.textItemsPerPage = locales.TEXT_ITEMS_PER_PAGE || 'TEXT_ITEMS_PER_PAGE';
      this.textItems = locales.TEXT_ITEMS || 'TEXT_ITEMS';
      this.textOf = locales.TEXT_OF || 'TEXT_OF';
      this.textPage = locales.TEXT_PAGE || 'TEXT_PAGE';
    }
  }

  /**
   * When item is added or removed, we will refresh the numbers on the pagination however we won't trigger a backend change
   * This will have a side effect though, which is that the "To" count won't be matching the "items per page" count,
   * that is a necessary side effect to avoid triggering a backend query just to refresh the paging,
   * basically we assume that this offset is fine for the time being,
   * until user does an action which will refresh the data hence the pagination which will then become normal again
   */
  private onItemAddedOrRemoved(items: any | any[], isItemAdded = true) {
    if (items !== null) {
      const previousDataTo = this.dataTo;
      const itemCount = Array.isArray(items) ? items.length : 1;
      const itemCountWithDirection = isItemAdded ? +itemCount : -itemCount;
      // refresh the total count in the pagination and in the UI
      this.totalItems += itemCountWithDirection;
      this.recalculateFromToIndexes();

      // finally refresh the "To" count and we know it might be different than the "items per page" count
      // but this is necessary since we don't want an actual backend refresh
      this.dataTo = previousDataTo + itemCountWithDirection;
    }
  }
}
