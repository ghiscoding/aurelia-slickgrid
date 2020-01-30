import { bootstrap } from 'aurelia-bootstrapper';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';
import { ComponentTester, StageComponent } from 'aurelia-testing';
import { I18N } from 'aurelia-i18n';
import { PLATFORM, DOM } from 'aurelia-pal';

import { PaginationService } from '../../services';
import { SlickPaginationCustomElement } from '../slick-pagination';

function removeExtraSpaces(textS: string) {
  return `${textS}`.replace(/\s{2,}/g, '');
}

const paginationServiceStub = {
  dataFrom: 5,
  dataTo: 10,
  pageNumber: 2,
  pageCount: 1,
  itemsPerPage: 5,
  pageSize: 10,
  totalItems: 100,
  availablePageSizes: [5, 10, 15, 20],
  pageInfoTotalItems: jest.fn(),
  goToFirstPage: jest.fn(),
  goToLastPage: jest.fn(),
  goToNextPage: jest.fn(),
  goToPreviousPage: jest.fn(),
  goToPageNumber: jest.fn(),
  changeItemPerPage: jest.fn(),
  dispose: jest.fn(),
  init: jest.fn(),
} as unknown as PaginationService;

describe('Slick-Pagination Component', () => {
  let customElement: any;
  let ea: EventAggregator;
  let i18n: I18N;

  const view = `<slick-pagination id="slickPagingContainer-grid1"
  enable-translate.bind="enableTranslate"
  pagination-service.bind="paginationService">
</slick-pagination>`;

  beforeEach(async () => {
    ea = new EventAggregator();
    i18n = new I18N(new EventAggregator(), new BindingSignaler());

    i18n.setup({
      resources: {
        en: {
          translation: {
            ITEMS: 'items',
            ITEMS_PER_PAGE: 'items per page',
            OF: 'of',
            PAGE: 'Page',
            PAGE_X_OF_Y: 'page {{x}} of {{y}}',
          }
        },
        fr: {
          translation: {
            ITEMS: 'éléments',
            ITEMS_PER_PAGE: 'éléments par page',
            OF: 'de',
            PAGE: 'Page',
            PAGE_X_OF_Y: 'page {{x}} de {{y}}',
          }
        }
      },
      lng: 'en',
      fallbackLng: 'en',
      debug: false
    });
    i18n.setLocale('fr');

    customElement = StageComponent
      .withResources([
        PLATFORM.moduleName('../slick-pagination'),
        PLATFORM.moduleName('../../value-converters/asgNumber')
      ])
      .inView(view)
      .boundTo({
        enableTranslate: true,
        paginationService: paginationServiceStub,
      });

    customElement.bootstrap((aurelia: any) => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(EventAggregator, ea);
      aurelia.container.registerInstance(I18N, i18n);
      aurelia.container.registerInstance(PaginationService, paginationServiceStub);
      return aurelia;
    });

    await customElement.create(bootstrap);
  });

  describe('Integration Tests', () => {
    afterEach(() => {
      // clear all the spyOn mocks to not influence next test
      jest.clearAllMocks();
      customElement.dispose();
    });

    it('should make sure Slick-Pagination is defined', () => {
      expect(customElement).toBeTruthy();
      expect(customElement.constructor).toBeDefined();
    });

    it('should create a the Slick-Pagination component in the DOM', async () => {
      const pageInfoFromTo = await customElement.waitForElement('.page-info-from-to');
      const pageInfoTotalItems = await customElement.waitForElement('.page-info-total-items');

      expect(removeExtraSpaces(pageInfoFromTo.innerHTML)).toBe('<span data-test="item-from">5</span>-<span data-test="item-to">10</span>de');
      expect(removeExtraSpaces(pageInfoTotalItems.innerHTML)).toBe('<span data-test="total-items">100</span> éléments');
    });

    it('should call changeToFirstPage() from the View and expect the pagination service to be called with correct method', async () => {
      const spy = jest.spyOn(paginationServiceStub, 'goToFirstPage');

      // const input = fixture.debugElement.nativeElement.querySelector('input.form-control');
      const button = await customElement.waitForElement('.icon-seek-first.fa-angle-double-left');
      button.click();

      expect(spy).toHaveBeenCalled();
      // expect(input.value).toBe('1');
    });

    it('should call changeToPreviousPage() from the View and expect the pagination service to be called with correct method', async () => {
      const spy = jest.spyOn(paginationServiceStub, 'goToPreviousPage');

      const button = await customElement.waitForElement('.icon-seek-prev.fa-angle-left');
      button.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should call changeToNextPage() from the View and expect the pagination service to be called with correct method', async () => {
      const spy = jest.spyOn(paginationServiceStub, 'goToNextPage');

      const button = await customElement.waitForElement('.icon-seek-next.fa-angle-right');
      button.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should call changeToLastPage() from the View and expect the pagination service to be called with correct method', async () => {
      const spy = jest.spyOn(paginationServiceStub, 'goToLastPage');

      const button = await customElement.waitForElement('.icon-seek-end.fa-angle-double-right');
      button.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should change the page number and expect the pagination service to go to that page', async () => {
      const spy = jest.spyOn(paginationServiceStub, 'goToPageNumber');

      const newPageNumber = 3;
      const input = await customElement.waitForElement('input.form-control');
      input.value = newPageNumber;
      const mockEvent = DOM.createCustomEvent('change', { bubbles: true, detail: { target: { value: newPageNumber } } });
      input.dispatchEvent(mockEvent);

      expect(spy).toHaveBeenCalledWith(newPageNumber, mockEvent);
    });

    it('should change the changeItemPerPage select dropdown and expect the pagination service call a change', async () => {
      const spy = jest.spyOn(paginationServiceStub, 'changeItemPerPage');

      const newItemsPerPage = 10;
      const select = await customElement.waitForElement('select');
      select.value = newItemsPerPage;
      const mockEvent = DOM.createCustomEvent('change', { bubbles: true, detail: { target: { value: newItemsPerPage } } });
      select.dispatchEvent(mockEvent);

      expect(spy).toHaveBeenCalledWith(newItemsPerPage);
    });

    it('should create a the Slick-Pagination component in the DOM and expect different locale when changed', async (done) => {
      i18n.setLocale('en');
      ea.publish('i18n:locale:changed', 'en');
      expect(i18n.getLocale()).toBe('en');

      setTimeout(async () => {
        const pageInfoFromTo = await customElement.waitForElement('.page-info-from-to');
        const pageInfoTotalItems = await customElement.waitForElement('.page-info-total-items');
        expect(removeExtraSpaces(pageInfoFromTo.innerHTML)).toBe(`<span data-test="item-from">5</span>-<span data-test="item-to">10</span>of`);
        expect(removeExtraSpaces(pageInfoTotalItems.innerHTML)).toBe(`<span data-test="total-items">100</span> items`);
        done();
      }, 50);
    });
  });
});
