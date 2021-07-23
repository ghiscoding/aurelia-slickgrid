import { bindable, inject, Optional, useView } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { EventSubscription, getTranslationPrefix, Locale, PaginationService } from '@slickgrid-universal/common';

import { GridOption } from '../models/index';
import { disposeAllSubscriptions } from '../services/utilities';
import { Constants } from '../constants';
import { TranslaterService } from '../services/translater.service';

@inject(EventAggregator, Optional.of(TranslaterService))
@useView(PLATFORM.moduleName('./slick-pagination.html'))
export class SlickPaginationCustomElement {
  // we need to pass this service as a binding because it's transient and it must be created (then passed through the binding) in the Aurelia-Slickgrid custom element
  @bindable() paginationService!: PaginationService;
  @bindable() gridOptions!: GridOption;

  private _enableTranslate = false;
  private _locales!: Locale;
  private _gridOptions!: GridOption;
  private _subscriptions: Array<EventSubscription | Subscription> = [];

  // text translations (handled by i18n or by custom locale)
  textItemsPerPage = 'items per page';
  textItems = 'items';
  textOf = 'of';
  textPage = 'Page';

  constructor(private readonly globalEa: EventAggregator, private readonly translateService?: TranslaterService) { }

  get availablePageSizes(): number[] {
    return this.paginationService.availablePageSizes;
  }

  get dataFrom(): number {
    return this.paginationService.dataFrom;
  }

  get dataTo(): number {
    return this.paginationService.dataTo;
  }

  /** is the left side pagination disabled? */
  get isLeftPaginationDisabled(): boolean {
    return this.pageNumber === 1 || this.totalItems === 0;
  }

  /** is the right side pagination disabled? */
  get isRightPaginationDisabled(): boolean {
    return this.pageNumber === this.pageCount || this.totalItems === 0;
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
  set pageNumber(_page: number) {
    // the setter has to be declared but we won't use it, instead we will use the "changeToCurrentPage()" to only update the value after ENTER keydown event
  }

  get totalItems() {
    return this.paginationService.totalItems;
  }

  bind(bindings: { gridOptions: GridOption; paginationService: PaginationService; }) {
    this._gridOptions = this.gridOptions || bindings && bindings.gridOptions || {};
    this._enableTranslate = this._gridOptions && this._gridOptions.enableTranslate || false;
    this._locales = this._gridOptions && this._gridOptions.locales || Constants.locales;

    if (this._enableTranslate && (!this.translateService || !this.translateService.translate)) {
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

  changeToFirstPage(event: MouseEvent) {
    if (!this.isLeftPaginationDisabled) {
      this.paginationService.goToFirstPage(event);
    }
  }

  changeToLastPage(event: MouseEvent) {
    if (!this.isRightPaginationDisabled) {
      this.paginationService.goToLastPage(event);
    }
  }

  changeToNextPage(event: MouseEvent) {
    if (!this.isRightPaginationDisabled) {
      this.paginationService.goToNextPage(event);
    }
  }

  changeToPreviousPage(event: MouseEvent) {
    if (!this.isLeftPaginationDisabled) {
      this.paginationService.goToPreviousPage(event);
    }
  }

  changeToCurrentPage(event: any) {
    let pageNumber = 1;
    if (event && event.target && event.target.value) {
      pageNumber = +(event.target.value);
    }
    this.paginationService.goToPageNumber(pageNumber, event);
  }

  dispose() {
    // also dispose of all Subscriptions
    this._subscriptions = disposeAllSubscriptions(this._subscriptions);
  }

  /** Translate all the texts shown in the UI, use I18N service when available or custom locales when service is null */
  private translatePaginationTexts(locales: Locale) {
    if (this._enableTranslate && this.translateService?.translate) {
      const translationPrefix = getTranslationPrefix(this._gridOptions);
      this.textItemsPerPage = this.translateService.translate(`${translationPrefix}ITEMS_PER_PAGE`);
      this.textItems = this.translateService.translate(`${translationPrefix}ITEMS`);
      this.textOf = this.translateService.translate(`${translationPrefix}OF`);
      this.textPage = this.translateService.translate(`${translationPrefix}PAGE`);
    } else if (locales) {
      this.textItemsPerPage = locales.TEXT_ITEMS_PER_PAGE || 'TEXT_ITEMS_PER_PAGE';
      this.textItems = locales.TEXT_ITEMS || 'TEXT_ITEMS';
      this.textOf = locales.TEXT_OF || 'TEXT_OF';
      this.textPage = locales.TEXT_PAGE || 'TEXT_PAGE';
    }
  }
}
