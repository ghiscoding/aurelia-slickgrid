import { bindable, inject, Optional } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { I18N } from 'aurelia-i18n';

import { GridOption, Locale } from '../models/index';
import { PaginationService } from '../services/pagination.service';
import { disposeAllSubscriptions } from '../services/utilities';
import { Constants } from '../constants';

@inject(EventAggregator, Optional.of(I18N))
export class SlickPaginationCustomElement {
  // we need to pass this service as a binding because it's transient and it must be created (then passed through the binding) in the Aurelia-Slickgrid custom element
  @bindable() paginationService: PaginationService;
  @bindable() gridOptions: GridOption;

  private _enableTranslate = false;
  private _locales: Locale;
  private _gridOptions: GridOption;
  private _subscriptions: Subscription[] = [];

  // text translations (handled by i18n or by custom locale)
  textItemsPerPage = 'items per page';
  textItems = 'items';
  textOf = 'of';
  textPage = 'Page';

  constructor(private globalEa: EventAggregator, private i18n: I18N) { }

  get availablePageSizes(): number[] {
    return this.paginationService.availablePageSizes;
  }

  get dataFrom(): number {
    return this.paginationService.dataFrom;
  }

  get dataTo(): number {
    return this.paginationService.dataTo;
  }

  get itemsPerPage(): number {
    return this.paginationService.itemsPerPage;
  }
  set itemsPerPage(count: number) {
    this.paginationService.changeItemPerPage(count);
  }

  get pageCount(): number {
    return this.paginationService.pageCount;
  }

  get pageNumber(): number {
    return this.paginationService.pageNumber;
  }
  set pageNumber(page: number) {
    // the setter has to be declared but we won't use it, instead we will use the "changeToCurrentPage()" to only update the value after ENTER keydown event
  }

  get totalItems() {
    return this.paginationService.totalItems;
  }

  bind(bindings: { gridOptions: GridOption; paginationService: PaginationService; }) {
    this._gridOptions = this.gridOptions || bindings && bindings.gridOptions || {};
    this._enableTranslate = this._gridOptions && this._gridOptions.enableTranslate || false;
    this._locales = this._gridOptions && this._gridOptions.locales || Constants.locales;

    if (this._enableTranslate && (!this.i18n || !this.i18n.tr)) {
      throw new Error('[Aurelia-Slickgrid] requires "I18N" to be installed and configured when the grid option "enableTranslate" is enabled.');
    }
    this.translatePaginationTexts(this._locales);

    if (this._enableTranslate && this.globalEa && this.globalEa.subscribe) {
      this._subscriptions.push(
        this.globalEa.subscribe('i18n:locale:changed', () => this.translatePaginationTexts(this._locales))
      );
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

  dispose() {
    this.paginationService.dispose();

    // also dispose of all Subscriptions
    this._subscriptions = disposeAllSubscriptions(this._subscriptions);
  }

  /** Translate all the texts shown in the UI, use I18N service when available or custom locales when service is null */
  private translatePaginationTexts(locales: Locale) {
    if (this._enableTranslate && this.i18n && this.i18n.tr && this.i18n.getLocale && this.i18n.getLocale()) {
      const i18nNamespacePrefix = (this._gridOptions && this._gridOptions.translationNamespace) ? (this._gridOptions.translationNamespace + this._gridOptions.translationNamespaceSeparator) : '';
      this.textItemsPerPage = this.i18n.tr(`${i18nNamespacePrefix}ITEMS_PER_PAGE`);
      this.textItems = this.i18n.tr(`${i18nNamespacePrefix}ITEMS`);
      this.textOf = this.i18n.tr(`${i18nNamespacePrefix}OF`);
      this.textPage = this.i18n.tr(`${i18nNamespacePrefix}PAGE`);
    } else if (locales) {
      this.textItemsPerPage = locales.TEXT_ITEMS_PER_PAGE || 'TEXT_ITEMS_PER_PAGE';
      this.textItems = locales.TEXT_ITEMS || 'TEXT_ITEMS';
      this.textOf = locales.TEXT_OF || 'TEXT_OF';
      this.textPage = locales.TEXT_PAGE || 'TEXT_PAGE';
    }
  }
}
