import { bootstrap } from 'aurelia-bootstrapper';
import { EventAggregator } from 'aurelia-event-aggregator';
import { BindingSignaler } from 'aurelia-templating-resources';
import { StageComponent } from 'aurelia-testing';
import { I18N } from 'aurelia-i18n';
import { PLATFORM, DOM } from 'aurelia-pal';

import { PaginationService } from '../../services';

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
  let component;
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

    component = StageComponent
      .withResources([
        PLATFORM.moduleName('../slick-pagination'),
        PLATFORM.moduleName('../../value-converters/asgNumber')
      ])
      .inView(view)
      .boundTo({
        enableTranslate: true,
        paginationService: paginationServiceStub,
      });

    component.bootstrap((aurelia) => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(EventAggregator, ea);
      aurelia.container.registerInstance(I18N, i18n);
      aurelia.container.registerInstance(PaginationService, paginationServiceStub);
    });
  });

  describe('Integration Tests', () => {
    afterEach(() => {
      // clear all the spyOn mocks to not influence next test
      jest.clearAllMocks();
      component.dispose();
    });

    it('should make sure Slick-Pagination is defined', async () => {
      await component.create(bootstrap);
      ea.publish(`paginationService:on-pagination-refreshed`, true);
      expect(component).toBeTruthy();
      expect(component.constructor).toBeDefined();
    });

    it('should create a the Slick-Pagination component in the DOM', async () => {
      await component.create(bootstrap);
      ea.publish(`paginationService:on-pagination-refreshed`, true);
      const pageInfoFromTo = await component.waitForElement('.page-info-from-to');
      const pageInfoTotalItems = await component.waitForElement('.page-info-total-items');

      expect(removeExtraSpaces(pageInfoFromTo.innerHTML)).toBe('<span data-test="item-from">5</span>-<span data-test="item-to">10</span>de');
      expect(removeExtraSpaces(pageInfoTotalItems.innerHTML)).toBe('<span data-test="total-items">100</span> éléments');
    });

    it('should call changeToFirstPage() from the View and expect the pagination service to be called with correct method', async () => {
      await component.create(bootstrap);
      ea.publish(`paginationService:on-pagination-refreshed`, true);
      const spy = jest.spyOn(paginationServiceStub, 'goToFirstPage');

      // const input = fixture.debugElement.nativeElement.querySelector('input.form-control');
      const button = await component.waitForElement('.icon-seek-first.fa-angle-double-left');
      button.click();

      expect(spy).toHaveBeenCalled();
      // expect(input.value).toBe('1');
    });

    it('should call changeToPreviousPage() from the View and expect the pagination service to be called with correct method', async () => {
      await component.create(bootstrap);
      const spy = jest.spyOn(paginationServiceStub, 'goToPreviousPage');

      const button = await component.waitForElement('.icon-seek-prev.fa-angle-left');
      button.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should call changeToNextPage() from the View and expect the pagination service to be called with correct method', async () => {
      await component.create(bootstrap);
      const spy = jest.spyOn(paginationServiceStub, 'goToNextPage');

      const button = await component.waitForElement('.icon-seek-next.fa-angle-right');
      button.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should call changeToLastPage() from the View and expect the pagination service to be called with correct method', async () => {
      await component.create(bootstrap);
      const spy = jest.spyOn(paginationServiceStub, 'goToLastPage');

      const button = await component.waitForElement('.icon-seek-end.fa-angle-double-right');
      button.click();

      expect(spy).toHaveBeenCalled();
    });

    it('should change the page number and expect the pagination service to go to that page', async () => {
      await component.create(bootstrap);
      const spy = jest.spyOn(paginationServiceStub, 'goToPageNumber');

      const newPageNumber = 3;
      const input = await component.waitForElement('input.form-control');
      input.value = newPageNumber;
      const mockEvent = DOM.createCustomEvent('change', { bubbles: true, detail: { target: { value: newPageNumber } } });
      input.dispatchEvent(mockEvent);

      expect(spy).toHaveBeenCalledWith(newPageNumber, mockEvent);
    });

    xit('should change the changeItemPerPage select dropdown and expect the pagination service call a change', async () => {
      const spy = jest.spyOn(paginationServiceStub, 'changeItemPerPage');

      const newItemsPerPage = 10;
      const select = await component.waitForElement('select');
      select.value = newItemsPerPage;
      const mockEvent = DOM.createCustomEvent('change', { bubbles: true, detail: { target: { value: newItemsPerPage } } });
      select.dispatchEvent(mockEvent);

      expect(spy).toHaveBeenCalledWith(newItemsPerPage, mockEvent);
    });

    xit('should create a the Slick-Pagination component in the DOM and expect different locale when changed', async (done) => {
      await component.create(bootstrap);
      i18n.setLocale('en');
      ea.publish('i18n:locale:changed', 'en');
      expect(i18n.getLocale()).toBe('en');

      setTimeout(async () => {
        const pageInfoFromTo = await component.waitForElement('.page-info-from-to');
        const pageInfoTotalItems = await component.waitForElement('.page-info-total-items');
        expect(removeExtraSpaces(pageInfoFromTo.innerHTML)).toBe(`<span data-test="item-from">5</span>-<span data-test="item-to">10</span>of`);
        expect(removeExtraSpaces(pageInfoTotalItems.innerHTML)).toBe(`<span data-test="total-items">100</span> items`);
        done();
      }, 50);
    });
  });
});
