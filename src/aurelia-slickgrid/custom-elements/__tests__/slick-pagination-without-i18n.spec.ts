import { Locale, PaginationService } from '@slickgrid-universal/common';
import { bootstrap } from 'aurelia-bootstrapper';
import { EventAggregator } from 'aurelia-event-aggregator';
import { StageComponent } from 'aurelia-testing';

import { GridOption } from '../../models';

function removeExtraSpaces(text: string) {
  return `${text}`.replace(/\s{2,}/g, '');
}

const mockLocales = {
  TEXT_ITEMS_PER_PAGE: 'items per page',
  TEXT_ITEMS: 'items',
  TEXT_OF: 'of',
  TEXT_PAGE: 'page'
} as Locale;

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

describe('Slick-Pagination Component without I18N', () => {
  let customElement: any;
  let ea: EventAggregator;

  const view = `<slick-pagination id="slickPagingContainer-grid1"
  enable-translate.bind="enableTranslate"
  locales.bind="locales"
  pagination-service.bind="paginationService">
</slick-pagination>`;

  beforeEach(() => {
    ea = new EventAggregator();

    customElement = StageComponent
      .withResources([
        '../slick-pagination',
        '../../value-converters/asgNumber'
      ])
      .inView(view)
      .boundTo({
        gridOptions: { enableTranslate: true },
        paginationService: paginationServiceStub,
      });

    customElement.bootstrap((aurelia) => {
      aurelia.use.standardConfiguration();
      aurelia.container.registerInstance(EventAggregator, ea);
      aurelia.container.registerInstance(PaginationService, paginationServiceStub);
    });
  });

  describe('Integration Tests', () => {
    afterEach(() => {
      // clear all the spyOn mocks to not influence next test
      jest.clearAllMocks();
    });

    it('should throw an error when "enableTranslate" is set and I18N Service is not provided', async (done) => {
      try {
        await customElement.manuallyHandleLifecycle().create(bootstrap);
        await customElement.bind({ gridOptions: { enableTranslate: true } as GridOption, paginationService: paginationServiceStub });
        await customElement.attached();
        await customElement.detached();
      } catch (e) {
        expect(e.toString()).toContain('[Aurelia-Slickgrid] requires "I18N" to be installed and configured when the grid option "enableTranslate" is enabled.');
        customElement.dispose();
        done();
      }
    });

    it('should have defined locale and expect new text in the UI', async (done) => {
      const bindings = {
        enableTranslate: false,
        paginationService: paginationServiceStub,
        locales: mockLocales
      };

      customElement.enableTranslate = false;
      customElement.locales = mockLocales;
      await customElement.manuallyHandleLifecycle().create(bootstrap);
      await customElement.bind(bindings);
      await customElement.attached();
      await customElement.unbind();
      await customElement.bind(bindings);
      await customElement.attached();

      setTimeout(async () => {
        const pageInfoFromTo = await customElement.waitForElement('.page-info-from-to');
        const pageInfoTotalItems = await customElement.waitForElement('.page-info-total-items');
        expect(removeExtraSpaces(pageInfoFromTo.innerHTML)).toBe('<span data-test="item-from">5</span>-<span data-test="item-to">10</span>of');
        expect(removeExtraSpaces(pageInfoTotalItems.innerHTML)).toBe('<span data-test="total-items">100</span> items');

        customElement.dispose();
        done();
      }, 50);
    });
  });
});
