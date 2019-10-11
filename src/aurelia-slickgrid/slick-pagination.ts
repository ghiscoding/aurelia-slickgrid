import { bindable, inject, Optional } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';

import { BackendServiceApi, Locale, Pager, Pagination } from './models/index';
import { PaginationService } from './services/pagination.service';
import { disposeAllSubscriptions } from './services/utilities';

const DEFAULT_AURELIA_EVENT_PREFIX = 'asg';

@inject(Element, EventAggregator, PaginationService, Optional.of(I18N))
export class SlickPaginationCustomElement {
  @bindable() dataview: any;
  @bindable() grid: any;
  @bindable() backendServiceApi: BackendServiceApi;
  @bindable() enableTranslate: boolean;
  @bindable() options: Pagination;
  @bindable() locales: Locale;
  @bindable() totalItems: number;

  private _aureliaEventPrefix = DEFAULT_AURELIA_EVENT_PREFIX;
  private _isFirstRender = true;
  private _pager: Pager;
  private _subscriptions: Subscription[] = [];

  // text translations (handled by i18n or by custom locale)
  textItemsPerPage: string;
  textItems: string;
  textOf: string;
  textPage: string;

  constructor(private elm: Element, private ea: EventAggregator, private paginationService: PaginationService, private i18n: I18N) {
    // when using I18N, we'll translate necessary texts in the UI
    this._subscriptions.push(
      this.ea.subscribe('i18n:locale:changed', () => this.translateAllUiTexts(this.locales))
    );

    // translate all the text using I18N or custom locales
    this._subscriptions.push(
      this.ea.subscribe(`paginationService:on-pagination-refreshed`, () => this.translateAllUiTexts(this.locales))
    );

    this._subscriptions.push(
      this.ea.subscribe(`paginationService:on-pagination-changed`, (pager: Pager) => {
        this._pager = pager;

        // emit the changes to the parent component with only necessary properties
        if (!this._isFirstRender) {
          // dispatch the changes to the parent component
          this.elm.dispatchEvent(new CustomEvent(`${this._aureliaEventPrefix}-on-pagination-changed`, {
            bubbles: true,
            detail: {
              pageNumber: this.pager.pageNumber,
              pageSizes: this.pager.availablePageSizes,
              pageSize: this.pager.itemsPerPage,
              totalItems: this.pager.totalItems,
            }
          }));
        }
      })
    );
  }

  get pager(): Pager {
    return this._pager || this.paginationService.pager;
  }

  bind(binding: any, contexts: any) {
    if (this.enableTranslate && (!this.i18n || !this.i18n.tr)) {
      throw new Error('[Aurelia-Slickgrid] requires "I18N" to be installed and configured when the grid option "enableTranslate" is enabled.');
    }

    if (this.paginationService) {
      this.paginationService.totalItems = binding.totalItems;
    }

    this.paginationService.init(this.grid, this.dataview, this.options, this.backendServiceApi);
    this._isFirstRender = false;
  }

  totalItemsChanged(newTotal: number) {
    this._isFirstRender = false;
    if (this.paginationService) {
      this.paginationService.totalItems = newTotal;
    }
  }

  detached() {
    this.dispose();
  }

  changeToFirstPage(event: any) {
    this.paginationService.goToFirstPage(event);
  }

  changeToLastPage(event: any) {
    this.paginationService.goToLastPage(event);
  }

  changeToNextPage(event: any) {
    this.paginationService.goToNextPage(event);
  }

  changeToPreviousPage(event: any) {
    this.paginationService.goToPreviousPage(event);
  }

  changeToCurrentPage(event: any) {
    let pageNumber = 1;
    if (event && event.target && event.target.value) {
      pageNumber = +(event.target.value);
    }
    this.paginationService.goToPageNumber(pageNumber, event);
  }

  changeItemPerPage(event: any) {
    let itemsPerPage = 1;
    if (event && event.target && event.target.value) {
      itemsPerPage = +(event.target.value);
    }
    this.paginationService.changeItemPerPage(itemsPerPage, event);
  }

  dispose() {
    this.paginationService.dispose();

    // also dispose of all Subscriptions
    this._subscriptions = disposeAllSubscriptions(this._subscriptions);
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
}
